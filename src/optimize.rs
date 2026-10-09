//! Rewrites a module into faster code without changing its result.
//!
//! The pass runs only when optimize is enabled. It folds work the program can
//! prove, drops branches that cannot run, removes declarations nothing reads,
//! and replaces expensive forms with the cheaper form the language already
//! defines. A rewrite is kept only when the next parse accepts it. Exported
//! names, `with`, direct `eval`, live imports, and bindings another statement
//! still reads stay in place. An anonymous function expression written inline,
//! not a declaration or a binding initializer, becomes an arrow when that keeps
//! `this`, `arguments`, and the surrounding lexical bindings the same. Each
//! cycle optimizes the previous cycle's output, and processing stops once a
//! cycle leaves the program unchanged.

use std::cell::{Cell, RefCell};
use std::collections::{HashMap, HashSet};
use std::path::Path;

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    BinaryOperator, Expression, LogicalOperator, ObjectPropertyKind, PropertyKind, Statement,
    UnaryOperator, VariableDeclaration, VariableDeclarationKind,
};
use oxc_ast_visit::walk::{self, walk_expression, walk_statement};
use oxc_ast_visit::Visit;
use oxc_parser::{ParseOptions, Parser};
use oxc_semantic::{ScopeFlags, ScopeId, Scoping, SemanticBuilder, SymbolId};
use oxc_span::{GetSpan, Span};
use oxc_syntax::identifier::is_identifier_name;
use oxc_syntax::keyword::is_reserved_keyword;
use oxc_syntax::node::NodeId;
use oxc_syntax::symbol::SymbolFlags;

use crate::js::{is_shorthand_property, js_string};
use crate::transform::{plain_source_type, rewrite_spans, OffsetMap};

/// Cycles that re-optimize the rewritten program. A fold often exposes the next
/// one, so each cycle parses the previous cycle's output. The loop ends early
/// when a cycle makes no change.
const OPTIMIZE_CYCLES: usize = 32;
const MAX_TEXT: usize = 8_192;
const SAFE_INT_MAX: i64 = 9_007_199_254_740_991;

#[derive(Clone, PartialEq)]
enum Value {
    Num(i64),
    Str(String),
    Bool(bool),
    Null,
    Undef,
}

struct ConstFact {
    value: Value,
    init_end: u32,
    decl_span: Span,
    single: bool,
    reads: usize,
    blocked: bool,
}

struct PureFn<'a> {
    params: Vec<SymbolId>,
    /// `None` is a function that returns `undefined`.
    body: Option<&'a Expression<'a>>,
    /// Calls before this position are still in the temporal dead zone.
    ready: u32,
    /// Function declarations can be deleted once every outside call folded.
    decl: Option<(Span, NodeId)>,
}

struct Facts<'a> {
    scoping: &'a Scoping,
    source: &'a str,
    consts: HashMap<SymbolId, ConstFact>,
    fns: HashMap<SymbolId, PureFn<'a>>,
    env: RefCell<Vec<(SymbolId, Value)>>,
    depth: Cell<u32>,
    dead: Vec<Span>,
    export_spans: Vec<Span>,
    exported: Vec<SymbolId>,
    /// Unresolved names that something reads. A write of any other name can go.
    free_reads: HashSet<String>,
    /// Scopes that contain a direct `eval(...)` call. A nested function does not
    /// poison its parents: only that function, and scopes wrapped around the call.
    direct_eval: HashSet<ScopeId>,
}

/// Optimize `source`. The map sends positions in the returned text back to `source`.
pub fn optimize_source(
    allocator: &mut Allocator,
    path: &Path,
    source: &str,
) -> (String, OffsetMap) {
    let mut current = source.to_string();
    let mut map = OffsetMap::identity(source.len() as u32);
    for _ in 0..OPTIMIZE_CYCLES {
        allocator.reset();
        let Some((next, step)) = optimize_once(allocator, path, &current) else {
            break;
        };
        if next == current || !parses(allocator, path, &next) {
            break;
        }
        map = step.and_then(map);
        current = next;
    }
    (current, map)
}

fn parses(allocator: &mut Allocator, path: &Path, source: &str) -> bool {
    allocator.reset();
    let parsed = Parser::new(allocator, source, plain_source_type(path))
        .with_options(ParseOptions {
            parse_regular_expression: false,
            ..ParseOptions::default()
        })
        .parse();
    !parsed.fatal_error && !parsed.diagnostics.has_errors()
}

fn optimize_once(allocator: &Allocator, path: &Path, source: &str) -> Option<(String, OffsetMap)> {
    let parsed = Parser::new(allocator, source, plain_source_type(path))
        .with_options(ParseOptions {
            parse_regular_expression: false,
            ..ParseOptions::default()
        })
        .parse();
    if parsed.fatal_error || parsed.diagnostics.has_errors() {
        return None;
    }
    let semantic = SemanticBuilder::new()
        .with_check_syntax_error(true)
        .build(&parsed.program);
    if semantic.diagnostics.has_errors() {
        return None;
    }
    let scoping = semantic.semantic.into_scoping();
    let facts = collect_facts(source, &parsed.program, &scoping);
    let inline_skip = inline_fn_skip(&parsed.program);
    let mut rewriter = Rewriter {
        source,
        facts: &facts,
        edits: Vec::new(),
        replacements: Vec::new(),
        folded: Vec::new(),
        blocked: HashMap::new(),
        inline_skip: &inline_skip,
    };
    rewriter.visit_program(&parsed.program);
    rewriter.drop_consts();
    rewriter.drop_functions();
    if rewriter.edits.is_empty() {
        return None;
    }
    rewriter
        .edits
        .sort_by(|left, right| left.0.cmp(&right.0).then(right.1.cmp(&left.1)));
    let mut kept = Vec::new();
    let mut cursor = 0u32;
    for edit in rewriter.edits {
        if edit.0 < cursor {
            continue;
        }
        cursor = edit.1;
        kept.push(edit);
    }
    Some(rewrite_spans(source, &kept))
}

fn collect_facts<'a>(
    source: &'a str,
    program: &'a oxc_ast::ast::Program<'a>,
    scoping: &'a Scoping,
) -> Facts<'a> {
    let mut exported = Vec::new();
    let mut export_spans = Vec::new();
    let mut exports = ExportScan {
        scoping,
        symbols: &mut exported,
        spans: &mut export_spans,
    };
    exports.visit_program(program);
    let mut free_reads = HashSet::new();
    FreeReadScan {
        scoping,
        names: &mut free_reads,
    }
    .visit_program(program);
    let mut direct_eval = HashSet::new();
    DirectEvalScan {
        scoping,
        scopes: &mut direct_eval,
    }
    .visit_program(program);
    let mut facts = Facts {
        scoping,
        source,
        consts: HashMap::new(),
        fns: HashMap::new(),
        env: RefCell::new(Vec::new()),
        depth: Cell::new(0),
        dead: Vec::new(),
        export_spans,
        exported,
        free_reads,
        direct_eval,
    };
    facts.collect_fns(&program.body);
    let exported = facts.exported.clone();
    facts.collect_consts(program, &exported);
    facts
}

struct ExportScan<'a> {
    scoping: &'a Scoping,
    symbols: &'a mut Vec<SymbolId>,
    spans: &'a mut Vec<Span>,
}

impl<'a> Visit<'a> for ExportScan<'a> {
    fn visit_export_declaration(&mut self, export: &oxc_ast::ast::ExportDeclaration<'a>) {
        note_bindings(&export.declaration, self.symbols);
    }

    fn visit_export_named_declaration(
        &mut self,
        export: &oxc_ast::ast::ExportNamedDeclaration<'a>,
    ) {
        for specifier in &export.specifiers {
            if let oxc_ast::ast::ModuleExportName::IdentifierReference(ident) = &specifier.local {
                self.spans.push(ident.span);
                if let Some(reference_id) = ident.reference_id.get() {
                    if let Some(symbol_id) = self.scoping.get_reference(reference_id).symbol_id() {
                        self.symbols.push(symbol_id);
                    }
                }
            }
        }
    }
}

struct FreeReadScan<'a> {
    scoping: &'a Scoping,
    names: &'a mut HashSet<String>,
}

impl<'a> Visit<'a> for FreeReadScan<'a> {
    fn visit_identifier_reference(&mut self, ident: &oxc_ast::ast::IdentifierReference<'a>) {
        let Some(reference_id) = ident.reference_id.get() else {
            return;
        };
        let reference = self.scoping.get_reference(reference_id);
        if reference.symbol_id().is_none() && reference.is_read() {
            self.names.insert(ident.name.to_string());
        }
    }
}

struct DirectEvalScan<'a> {
    scoping: &'a Scoping,
    scopes: &'a mut HashSet<ScopeId>,
}

impl<'a> Visit<'a> for DirectEvalScan<'a> {
    fn visit_call_expression(&mut self, expr: &oxc_ast::ast::CallExpression<'a>) {
        if !expr.optional {
            if let Expression::Identifier(ident) = peel(&expr.callee) {
                if ident.name.as_str() == "eval" {
                    if let Some(reference_id) = ident.reference_id.get() {
                        let reference = self.scoping.get_reference(reference_id);
                        if reference.symbol_id().is_none() {
                            self.scopes.insert(reference.scope_id());
                        }
                    }
                }
            }
        }
        walk::walk_call_expression(self, expr);
    }
}

fn note_bindings(declaration: &oxc_ast::ast::Declaration<'_>, symbols: &mut Vec<SymbolId>) {
    let oxc_ast::ast::Declaration::VariableDeclaration(decl) = declaration else {
        return;
    };
    for declarator in &decl.declarations {
        declarator.id.all_binding_identifiers(&mut |id| {
            if let Some(symbol_id) = id.symbol_id.get() {
                symbols.push(symbol_id);
            }
            true
        });
    }
}

impl<'a> Facts<'a> {
    fn collect_consts(&mut self, program: &oxc_ast::ast::Program<'a>, exported: &[SymbolId]) {
        self.walk_statements(&program.body, exported);
    }

    fn collect_fns(&mut self, statements: &'a [Statement<'a>]) {
        for statement in statements {
            self.collect_fn_stmt(statement);
        }
    }

    fn collect_fn_stmt(&mut self, statement: &'a Statement<'a>) {
        match statement {
            Statement::FunctionDeclaration(func) => {
                self.note_function(func, 0, true);
                if let Some(body) = &func.body {
                    self.collect_fns(&body.statements);
                }
            }
            Statement::ExportDeclaration(export) => {
                if let oxc_ast::ast::Declaration::FunctionDeclaration(func) = &export.declaration {
                    self.note_function(func, 0, false);
                    if let Some(body) = &func.body {
                        self.collect_fns(&body.statements);
                    }
                }
                if let oxc_ast::ast::Declaration::VariableDeclaration(decl) = &export.declaration {
                    self.collect_fn_decl(decl);
                }
            }
            Statement::VariableDeclaration(decl) => self.collect_fn_decl(decl),
            Statement::BlockStatement(block) => self.collect_fns(&block.body),
            Statement::IfStatement(stmt) => {
                self.collect_fn_stmt(&stmt.consequent);
                if let Some(alt) = &stmt.alternate {
                    self.collect_fn_stmt(alt);
                }
            }
            Statement::WhileStatement(stmt) => self.collect_fn_stmt(&stmt.body),
            Statement::DoWhileStatement(stmt) => self.collect_fn_stmt(&stmt.body),
            Statement::ForStatement(stmt) => self.collect_fn_stmt(&stmt.body),
            Statement::ForInStatement(stmt) => self.collect_fn_stmt(&stmt.body),
            Statement::ForOfStatement(stmt) => self.collect_fn_stmt(&stmt.body),
            Statement::SwitchStatement(stmt) => {
                for case in &stmt.cases {
                    self.collect_fns(&case.consequent);
                }
            }
            Statement::TryStatement(stmt) => {
                self.collect_fns(&stmt.block.body);
                if let Some(handler) = &stmt.handler {
                    self.collect_fns(&handler.body.body);
                }
                if let Some(finalizer) = &stmt.finalizer {
                    self.collect_fns(&finalizer.body);
                }
            }
            Statement::LabeledStatement(stmt) => self.collect_fn_stmt(&stmt.body),
            _ => {}
        }
    }

    fn collect_fn_decl(&mut self, decl: &'a VariableDeclaration<'a>) {
        if !decl.kind.is_const() || decl.declarations.len() != 1 {
            return;
        }
        let declarator = &decl.declarations[0];
        let Some(id) = declarator.id.get_binding_identifier() else {
            return;
        };
        let Some(symbol_id) = id.symbol_id.get() else {
            return;
        };
        let Some(init) = &declarator.init else {
            return;
        };
        match peel(init) {
            Expression::ArrowFunctionExpression(arrow) => {
                self.note_arrow(symbol_id, arrow, init.span().end)
            }
            Expression::FunctionExpression(func) => {
                self.note_function_expr(symbol_id, func, init.span().end)
            }
            _ => {}
        }
    }

    fn note_function(&mut self, func: &'a oxc_ast::ast::Function<'a>, ready: u32, removable: bool) {
        let Some(id) = &func.id else {
            return;
        };
        let Some(symbol_id) = id.symbol_id.get() else {
            return;
        };
        let decl = if removable && !self.exported.contains(&symbol_id) {
            Some((func.span, func.node_id.get()))
        } else {
            None
        };
        self.insert_fn(
            symbol_id,
            &func.params,
            func.r#async || func.generator,
            func.body.as_deref(),
            ready,
            decl,
        );
    }

    fn note_function_expr(
        &mut self,
        symbol_id: SymbolId,
        func: &'a oxc_ast::ast::Function<'a>,
        ready: u32,
    ) {
        self.insert_fn(
            symbol_id,
            &func.params,
            func.r#async || func.generator,
            func.body.as_deref(),
            ready,
            None,
        );
    }

    fn note_arrow(
        &mut self,
        symbol_id: SymbolId,
        arrow: &'a oxc_ast::ast::ArrowFunctionExpression<'a>,
        ready: u32,
    ) {
        if arrow.r#async {
            return;
        }
        let Some(params) = simple_params(&arrow.params) else {
            return;
        };
        let body = if let Some(expr) = arrow.get_expression() {
            Some(expr)
        } else if let Some(block) = arrow.get_function_body() {
            match simple_return(block) {
                Some(expr) => expr,
                None => return,
            }
        } else {
            return;
        };
        self.fns.insert(
            symbol_id,
            PureFn {
                params,
                body,
                ready,
                decl: None,
            },
        );
    }

    fn insert_fn(
        &mut self,
        symbol_id: SymbolId,
        params: &oxc_ast::ast::FormalParameters<'a>,
        skip: bool,
        body: Option<&'a oxc_ast::ast::FunctionBody<'a>>,
        ready: u32,
        decl: Option<(Span, NodeId)>,
    ) {
        if skip {
            return;
        }
        let Some(params) = simple_params(params) else {
            return;
        };
        let Some(body) = body else {
            return;
        };
        let Some(body) = simple_return(body) else {
            return;
        };
        self.fns.insert(
            symbol_id,
            PureFn {
                params,
                body,
                ready,
                decl,
            },
        );
    }

    fn walk_statements(&mut self, statements: &[Statement<'a>], exported: &[SymbolId]) {
        let mut stopped = false;
        for statement in statements {
            if stopped {
                self.dead.push(statement.span());
                continue;
            }
            self.walk_statement(statement, exported);
            if completes(statement, self) {
                stopped = true;
            }
        }
    }

    fn walk_statement(&mut self, statement: &Statement<'a>, exported: &[SymbolId]) {
        match statement {
            Statement::VariableDeclaration(decl) => self.note_decl(decl, decl.span, exported),
            Statement::ExportDeclaration(export) => {
                if let oxc_ast::ast::Declaration::VariableDeclaration(decl) = &export.declaration {
                    self.note_decl(decl, export.span, exported);
                }
            }
            Statement::BlockStatement(block) => self.walk_statements(&block.body, exported),
            Statement::IfStatement(stmt) => {
                self.walk_statement(&stmt.consequent, exported);
                if let Some(alt) = &stmt.alternate {
                    self.walk_statement(alt, exported);
                }
            }
            Statement::WhileStatement(stmt) => self.walk_statement(&stmt.body, exported),
            Statement::DoWhileStatement(stmt) => self.walk_statement(&stmt.body, exported),
            Statement::ForStatement(stmt) => self.walk_statement(&stmt.body, exported),
            Statement::ForInStatement(stmt) => self.walk_statement(&stmt.body, exported),
            Statement::ForOfStatement(stmt) => self.walk_statement(&stmt.body, exported),
            Statement::SwitchStatement(stmt) => {
                for case in &stmt.cases {
                    self.walk_statements(&case.consequent, exported);
                }
            }
            Statement::TryStatement(stmt) => {
                self.walk_statements(&stmt.block.body, exported);
                if let Some(handler) = &stmt.handler {
                    self.walk_statements(&handler.body.body, exported);
                }
                if let Some(finalizer) = &stmt.finalizer {
                    self.walk_statements(&finalizer.body, exported);
                }
            }
            Statement::LabeledStatement(stmt) => self.walk_statement(&stmt.body, exported),
            Statement::FunctionDeclaration(func) => {
                if let Some(body) = &func.body {
                    self.walk_statements(&body.statements, exported);
                }
            }
            _ => {}
        }
    }

    fn note_decl(
        &mut self,
        decl: &VariableDeclaration<'a>,
        statement_span: Span,
        exported: &[SymbolId],
    ) {
        if !decl.kind.is_const() || decl.declarations.len() != 1 {
            return;
        }
        let declarator = &decl.declarations[0];
        let Some(id) = declarator.id.get_binding_identifier() else {
            return;
        };
        let Some(symbol_id) = id.symbol_id.get() else {
            return;
        };
        if self.eval_reachable(self.scoping.symbol_scope_id(symbol_id)) {
            return;
        }
        let Some(init) = &declarator.init else {
            return;
        };
        let Some(value) = self.eval(init) else {
            return;
        };
        let reads = self
            .scoping
            .get_resolved_references(symbol_id)
            .filter(|reference| reference.is_read() && !reference.is_write())
            .count();
        self.consts.insert(
            symbol_id,
            ConstFact {
                value,
                init_end: init.span().end,
                decl_span: statement_span,
                single: true,
                reads,
                blocked: exported.contains(&symbol_id),
            },
        );
    }

    fn eval(&self, expr: &Expression<'a>) -> Option<Value> {
        eval_pure(self.source, expr, self)
    }

    fn eval_reachable(&self, mut scope: ScopeId) -> bool {
        loop {
            if self.direct_eval.contains(&scope) {
                return true;
            }
            match self.scoping.scope_parent_id(scope) {
                Some(parent) => scope = parent,
                None => return false,
            }
        }
    }

    fn inside_with(&self, mut scope: ScopeId) -> bool {
        loop {
            if self.scoping.scope_flags(scope).contains(ScopeFlags::With) {
                return true;
            }
            match self.scoping.scope_parent_id(scope) {
                Some(parent) => scope = parent,
                None => return false,
            }
        }
    }

    fn globals_ok(&self, scope: ScopeId) -> bool {
        !self.inside_with(scope) && !self.eval_reachable(scope)
    }

    fn unbound(&self, expr: &Expression<'a>, name: &str) -> bool {
        let Expression::Identifier(ident) = peel(expr) else {
            return false;
        };
        if ident.name.as_str() != name {
            return false;
        }
        let Some(reference_id) = ident.reference_id.get() else {
            return false;
        };
        let reference = self.scoping.get_reference(reference_id);
        reference.symbol_id().is_none() && self.globals_ok(reference.scope_id())
    }
}

struct Rewriter<'a> {
    source: &'a str,
    facts: &'a Facts<'a>,
    edits: Vec<(u32, u32, String)>,
    replacements: Vec<(SymbolId, u32, u32)>,
    folded: Vec<SymbolId>,
    blocked: HashMap<SymbolId, bool>,
    /// Function expressions that are declarations' neighbors: binding
    /// initializers, constructors, or function-object reads. Those keep
    /// `function` so their lexical binding does not change.
    inline_skip: &'a HashSet<u32>,
}

impl<'a> Visit<'a> for Rewriter<'a> {
    fn visit_expression(&mut self, expr: &Expression<'a>) {
        walk_expression(self, expr);
        if let Expression::FunctionExpression(func) = expr {
            self.convert_inline_function(func);
        }
        if let Some(text) = fold_expr(self.source, expr, self.facts) {
            if let Some(symbol_id) = user_fn_symbol(self.source, expr, self.facts) {
                self.folded.push(symbol_id);
            }
            self.cover(expr.span(), text);
        }
    }

    fn visit_identifier_reference(&mut self, ident: &oxc_ast::ast::IdentifierReference<'a>) {
        let Some(reference_id) = ident.reference_id.get() else {
            return;
        };
        let reference = self.facts.scoping.get_reference(reference_id);
        let Some(symbol_id) = reference.symbol_id() else {
            return;
        };
        let Some(fact) = self.facts.consts.get(&symbol_id) else {
            return;
        };
        if reference.is_write() || !reference.is_read() {
            return;
        }
        let scope = reference.scope_id();
        let printed = print_value(&fact.value);
        let inline = can_inline(self.facts, symbol_id, scope, ident.span, fact);
        if !inline {
            self.blocked.insert(symbol_id, true);
            return;
        }
        self.replacements
            .push((symbol_id, ident.span.start, ident.span.end));
        self.cover(ident.span, printed);
    }

    fn visit_statement(&mut self, stmt: &Statement<'a>) {
        if self.is_dead(stmt.span()) {
            self.cover_dead(stmt);
            return;
        }
        walk_statement(self, stmt);
        if let Some(text) = fold_stmt(self.source, stmt, self.facts) {
            self.cover(stmt.span(), text);
        } else if let Some(text) = unused_decl(self.source, stmt, self.facts) {
            self.cover_statement(stmt.span(), text);
        } else if let Some(text) = dead_store(self.source, stmt, self.facts) {
            self.cover_statement(stmt.span(), text);
        } else if empty_block(stmt) {
            self.cover_statement(stmt.span(), String::new());
        }
    }
}

impl<'a> Rewriter<'a> {
    fn convert_inline_function(&mut self, func: &oxc_ast::ast::Function<'a>) {
        if !inline_arrow_ok(func, self.facts.scoping, self.inline_skip) {
            return;
        }
        let Some(body) = &func.body else {
            return;
        };
        let start = func.span.start;
        let params = func.params.span;
        if params.start < start || body.span.start < params.end {
            return;
        }
        let wrap = arrow_needs_parens(self.source, start);
        let prefix = match (func.r#async, wrap) {
            (true, true) => "(async ",
            (true, false) => "async ",
            (false, true) => "(",
            (false, false) => "",
        };
        self.splice(start, params.start, prefix.to_string());
        self.splice(params.end, body.span.start, " => ".to_string());
        if wrap {
            // The closer has to sit on the final `}` so a later rewrite of a
            // parent span, such as `typeof`, drops it with the header.
            let end = func.span.end;
            if end > 0 && self.source.as_bytes().get(end as usize - 1) == Some(&b'}') {
                self.splice(end - 1, end, "})".to_string());
            } else {
                self.splice(end, end, ")".to_string());
            }
        }
    }

    fn splice(&mut self, start: u32, end: u32, text: String) {
        if start > end {
            return;
        }
        if start < end && slice(self.source, Span::new(start, end)) == text {
            return;
        }
        if start == end && text.is_empty() {
            return;
        }
        self.edits.push((start, end, text));
    }

    fn cover(&mut self, span: Span, text: String) {
        let original = slice(self.source, span);
        if original == text {
            return;
        }
        self.edits
            .retain(|edit| edit.1 <= span.start || edit.0 >= span.end);
        self.edits.push((span.start, span.end, text));
    }

    fn drop_consts(&mut self) {
        let removals = self
            .facts
            .consts
            .iter()
            .filter_map(|(symbol_id, fact)| {
                if fact.blocked || self.blocked.contains_key(symbol_id) || !fact.single {
                    return None;
                }
                let replaced = self
                    .replacements
                    .iter()
                    .filter(|(id, start, end)| {
                        *id == *symbol_id
                            && self
                                .edits
                                .iter()
                                .any(|edit| edit.0 == *start && edit.1 == *end)
                    })
                    .count();
                if replaced != fact.reads {
                    return None;
                }
                Some(extend_semicolon(self.source, fact.decl_span))
            })
            .collect::<Vec<_>>();
        for span in removals {
            self.cover(span, String::new());
        }
    }

    fn drop_functions(&mut self) {
        let decls = self
            .facts
            .fns
            .iter()
            .filter_map(|(symbol_id, func)| {
                func.decl.map(|(span, node_id)| (*symbol_id, span, node_id))
            })
            .collect::<Vec<_>>();
        let mut gone = Vec::new();
        loop {
            let mut progress = false;
            for (symbol_id, span, node_id) in &decls {
                if gone.iter().any(|(id, _, _)| id == symbol_id) {
                    continue;
                }
                let mut total = 0;
                let mut remaining = 0;
                for reference in self.facts.scoping.get_resolved_references(*symbol_id) {
                    let used = reference.is_value() || !reference.is_type();
                    if !used || reference_inside(self.facts, reference.scope_id(), *node_id) {
                        continue;
                    }
                    total += 1;
                    let covered = gone.iter().any(|(_, _, other)| {
                        reference_inside(self.facts, reference.scope_id(), *other)
                    });
                    if !covered {
                        remaining += 1;
                    }
                }
                let folded = self.folded.iter().filter(|id| *id == symbol_id).count();
                if total > 0 && remaining == folded {
                    gone.push((*symbol_id, *span, *node_id));
                    progress = true;
                }
            }
            if !progress {
                break;
            }
        }
        for (_, span, _) in gone {
            self.cover(extend_semicolon(self.source, span), String::new());
        }
    }

    fn is_dead(&self, span: Span) -> bool {
        self.facts
            .dead
            .iter()
            .any(|dead| dead.start == span.start && dead.end == span.end)
    }

    fn cover_statement(&mut self, span: Span, text: String) {
        let span = extend_semicolon(self.source, span);
        let text = if text.is_empty() || text.ends_with(';') {
            text
        } else {
            format!("{text};")
        };
        self.cover(span, text);
    }

    fn cover_dead(&mut self, stmt: &Statement<'a>) {
        let unused_fn = match stmt {
            Statement::FunctionDeclaration(func) => func.id.as_ref().and_then(|id| {
                let symbol_id = id.symbol_id.get()?;
                let pure = self.facts.fns.get(&symbol_id)?;
                let (span, node_id) = pure.decl?;
                if external_reads(self.facts, symbol_id, node_id) == 0 {
                    Some(span)
                } else {
                    None
                }
            }),
            _ => None,
        };
        if let Some(span) = unused_fn {
            self.cover(extend_semicolon(self.source, span), String::new());
            return;
        }
        if let Some(names) = hoisted_names(stmt, self.facts) {
            self.cover_statement(stmt.span(), var_decl(&names));
        }
    }
}

/// Spans of function expressions that are not inline. A declaration is never
/// visited as an expression. A binding initializer owns a lexical name, and
/// `new` / `.prototype` observe the function object, so those stay `function`.
fn inline_fn_skip(program: &oxc_ast::ast::Program<'_>) -> HashSet<u32> {
    let mut skip = HashSet::new();
    InlineSkip { skip: &mut skip }.visit_program(program);
    skip
}

struct InlineSkip<'a> {
    skip: &'a mut HashSet<u32>,
}

impl<'a> Visit<'a> for InlineSkip<'_> {
    fn visit_variable_declarator(&mut self, decl: &oxc_ast::ast::VariableDeclarator<'a>) {
        if let Some(init) = &decl.init {
            self.note(init);
        }
        walk::walk_variable_declarator(self, decl);
    }

    fn visit_assignment_expression(&mut self, expr: &oxc_ast::ast::AssignmentExpression<'a>) {
        if matches!(
            expr.left,
            oxc_ast::ast::AssignmentTarget::AssignmentTargetIdentifier(_)
        ) {
            self.note(&expr.right);
        }
        walk::walk_assignment_expression(self, expr);
    }

    fn visit_new_expression(&mut self, expr: &oxc_ast::ast::NewExpression<'a>) {
        self.note(&expr.callee);
        walk::walk_new_expression(self, expr);
    }

    fn visit_static_member_expression(&mut self, expr: &oxc_ast::ast::StaticMemberExpression<'a>) {
        self.note(&expr.object);
        walk::walk_static_member_expression(self, expr);
    }

    fn visit_computed_member_expression(
        &mut self,
        expr: &oxc_ast::ast::ComputedMemberExpression<'a>,
    ) {
        self.note(&expr.object);
        walk::walk_computed_member_expression(self, expr);
    }

    fn visit_private_field_expression(&mut self, expr: &oxc_ast::ast::PrivateFieldExpression<'a>) {
        self.note(&expr.object);
        walk::walk_private_field_expression(self, expr);
    }

    fn visit_binary_expression(&mut self, expr: &oxc_ast::ast::BinaryExpression<'a>) {
        if expr.operator == BinaryOperator::Instanceof {
            self.note(&expr.right);
        }
        walk::walk_binary_expression(self, expr);
    }

    fn visit_class(&mut self, class: &oxc_ast::ast::Class<'a>) {
        if let Some(heritage) = &class.heritage {
            self.note(&heritage.expression);
        }
        walk::walk_class(self, class);
    }
}

impl InlineSkip<'_> {
    fn note(&mut self, expr: &Expression<'_>) {
        if let Expression::FunctionExpression(func) = peel(expr) {
            self.skip.insert(func.span.start);
        }
    }
}

fn inline_arrow_ok(
    func: &oxc_ast::ast::Function<'_>,
    scoping: &Scoping,
    skip: &HashSet<u32>,
) -> bool {
    // A name on the expression is a lexical binding inside the function. An
    // arrow has no such binding, so only anonymous inline expressions convert.
    if !func.is_expression() || func.id.is_some() || func.generator || func.declare {
        return false;
    }
    if func.body.is_none()
        || func.type_parameters.is_some()
        || func.this_param.is_some()
        || func.return_type.is_some()
        || skip.contains(&func.span.start)
        || has_use_asm(func)
        || captures_function_env(func, scoping)
    {
        return false;
    }
    let strict = func
        .scope_id
        .get()
        .is_some_and(|scope| scoping.scope_flags(scope).is_strict_mode());
    strict || !sloppy_only(func, scoping)
}

fn has_use_asm(func: &oxc_ast::ast::Function<'_>) -> bool {
    func.body.as_ref().is_some_and(|body| {
        body.directives
            .iter()
            .any(|directive| directive.expression.value.as_str() == "use asm")
    })
}

/// `this`, `arguments`, `super`, `new.target`, direct `eval`, and `with`
/// belong to this function. A nested function has its own, so it is not walked.
fn captures_function_env(func: &oxc_ast::ast::Function<'_>, scoping: &Scoping) -> bool {
    let mut scan = EnvCapture {
        scoping,
        hit: false,
    };
    scan.visit_formal_parameters(&func.params);
    if let Some(body) = &func.body {
        scan.visit_function_body(body);
    }
    scan.hit
}

struct EnvCapture<'a> {
    scoping: &'a Scoping,
    hit: bool,
}

impl<'a> Visit<'a> for EnvCapture<'_> {
    fn visit_function(&mut self, _func: &oxc_ast::ast::Function<'a>, _flags: ScopeFlags) {}

    fn visit_this_expression(&mut self, _expr: &oxc_ast::ast::ThisExpression) {
        self.hit = true;
    }

    fn visit_super(&mut self, _expr: &oxc_ast::ast::Super) {
        self.hit = true;
    }

    fn visit_new_target(&mut self, _expr: &oxc_ast::ast::NewTarget) {
        self.hit = true;
    }

    fn visit_with_statement(&mut self, _stmt: &oxc_ast::ast::WithStatement<'a>) {
        self.hit = true;
    }

    fn visit_identifier_reference(&mut self, ident: &oxc_ast::ast::IdentifierReference<'a>) {
        if ident.name.as_str() == "arguments" {
            self.hit = true;
        }
    }

    fn visit_call_expression(&mut self, expr: &oxc_ast::ast::CallExpression<'a>) {
        if !expr.optional {
            if let Expression::Identifier(ident) = peel(&expr.callee) {
                if ident.name.as_str() == "eval" {
                    if let Some(reference_id) = ident.reference_id.get() {
                        if self
                            .scoping
                            .get_reference(reference_id)
                            .symbol_id()
                            .is_none()
                        {
                            self.hit = true;
                        }
                    }
                }
            }
        }
        walk::walk_call_expression(self, expr);
    }
}

/// An arrow is strict. In a sloppy function that would reject the program or
/// change an implicit global, so the `function` expression stays.
fn sloppy_only(func: &oxc_ast::ast::Function<'_>, scoping: &Scoping) -> bool {
    let mut scan = SloppyOnly {
        scoping,
        hit: false,
    };
    if duplicate_params(&func.params) {
        return true;
    }
    scan.visit_formal_parameters(&func.params);
    if let Some(body) = &func.body {
        scan.visit_function_body(body);
    }
    scan.hit
}

struct SloppyOnly<'a> {
    scoping: &'a Scoping,
    hit: bool,
}

impl<'a> Visit<'a> for SloppyOnly<'_> {
    fn visit_function(&mut self, func: &oxc_ast::ast::Function<'a>, flags: ScopeFlags) {
        if duplicate_params(&func.params) {
            self.hit = true;
        }
        walk::walk_function(self, func, flags);
    }

    fn visit_binding_identifier(&mut self, ident: &oxc_ast::ast::BindingIdentifier<'a>) {
        if matches!(
            ident.name.as_str(),
            "eval"
                | "arguments"
                | "yield"
                | "await"
                | "let"
                | "static"
                | "implements"
                | "interface"
                | "package"
                | "private"
                | "protected"
                | "public"
        ) {
            self.hit = true;
        }
    }

    fn visit_with_statement(&mut self, _stmt: &oxc_ast::ast::WithStatement<'a>) {
        self.hit = true;
    }

    fn visit_assignment_expression(&mut self, expr: &oxc_ast::ast::AssignmentExpression<'a>) {
        if let oxc_ast::ast::AssignmentTarget::AssignmentTargetIdentifier(ident) = &expr.left {
            if unresolved(self.scoping, ident) {
                self.hit = true;
            }
        }
        walk::walk_assignment_expression(self, expr);
    }

    fn visit_update_expression(&mut self, expr: &oxc_ast::ast::UpdateExpression<'a>) {
        if let oxc_ast::ast::SimpleAssignmentTarget::AssignmentTargetIdentifier(ident) =
            &expr.argument
        {
            if unresolved(self.scoping, ident) {
                self.hit = true;
            }
        }
        walk::walk_update_expression(self, expr);
    }

    fn visit_unary_expression(&mut self, expr: &oxc_ast::ast::UnaryExpression<'a>) {
        if expr.operator == UnaryOperator::Delete
            && matches!(peel(&expr.argument), Expression::Identifier(_))
        {
            self.hit = true;
        }
        walk::walk_unary_expression(self, expr);
    }

    fn visit_numeric_literal(&mut self, literal: &oxc_ast::ast::NumericLiteral<'a>) {
        if literal.raw.as_ref().is_some_and(|raw| {
            let bytes = raw.as_str().as_bytes();
            bytes.len() >= 2 && bytes[0] == b'0' && bytes[1].is_ascii_digit()
        }) {
            self.hit = true;
        }
    }
}

fn unresolved(scoping: &Scoping, ident: &oxc_ast::ast::IdentifierReference<'_>) -> bool {
    let Some(reference_id) = ident.reference_id.get() else {
        return true;
    };
    scoping.get_reference(reference_id).symbol_id().is_none()
}

fn duplicate_params(params: &oxc_ast::ast::FormalParameters<'_>) -> bool {
    let mut names = HashSet::new();
    let mut duplicated = false;
    let mut note = |ident: &oxc_ast::ast::BindingIdentifier<'_>| {
        if !names.insert(ident.name.to_string()) {
            duplicated = true;
        }
        true
    };
    for param in &params.items {
        param.pattern.all_binding_identifiers(&mut note);
    }
    if let Some(rest) = &params.rest {
        rest.rest.argument.all_binding_identifiers(&mut note);
    }
    duplicated
}

fn arrow_needs_parens(source: &str, start: u32) -> bool {
    let bytes = source.as_bytes();
    let mut index = start as usize;
    while index > 0 && matches!(bytes[index - 1], b' ' | b'\t' | b'\n' | b'\r') {
        index -= 1;
    }
    if index == 0 {
        return true;
    }
    !matches!(
        bytes[index - 1],
        b'=' | b'(' | b'[' | b',' | b':' | b'?' | b'{' | b';'
    )
}

fn extend_semicolon(source: &str, span: Span) -> Span {
    let mut end = span.end;
    let bytes = source.as_bytes();
    if (end as usize) < bytes.len() && bytes[end as usize] == b';' {
        end += 1;
    }
    Span::new(span.start, end)
}

fn can_inline(
    facts: &Facts<'_>,
    symbol_id: SymbolId,
    scope: ScopeId,
    span: Span,
    fact: &ConstFact,
) -> bool {
    if span.start < fact.init_end || facts.export_spans.contains(&span) {
        return false;
    }
    if is_shorthand_property(facts.source, span) {
        return false;
    }
    !crosses_function(
        facts.scoping,
        scope,
        facts.scoping.symbol_scope_id(symbol_id),
    )
}

fn crosses_function(scoping: &Scoping, mut scope: ScopeId, target: ScopeId) -> bool {
    loop {
        if scope == target {
            return false;
        }
        if scoping.scope_flags(scope).contains(ScopeFlags::Function) {
            return true;
        }
        match scoping.scope_parent_id(scope) {
            Some(parent) => scope = parent,
            None => return true,
        }
    }
}

fn fold_expr(source: &str, expr: &Expression<'_>, facts: &Facts<'_>) -> Option<String> {
    if let Some(value) = eval_pure(source, expr, facts) {
        let printed = print_value(&value);
        if printed != slice(source, expr.span()) && !same_literal(expr, &value) {
            return Some(printed);
        }
    }
    structural(source, expr, facts)
}

fn same_literal(expr: &Expression<'_>, value: &Value) -> bool {
    match (peel(expr), value) {
        (Expression::NumericLiteral(literal), Value::Num(number)) => {
            int_from_f64(literal.value) == Some(*number)
        }
        (Expression::StringLiteral(literal), Value::Str(text)) => literal.value.as_str() == text,
        (Expression::BooleanLiteral(literal), Value::Bool(bit)) => literal.value == *bit,
        (Expression::NullLiteral(_), Value::Null) => true,
        (Expression::Identifier(ident), Value::Undef) => ident.name.as_str() == "undefined",
        _ => false,
    }
}

fn fold_stmt(source: &str, stmt: &Statement<'_>, facts: &Facts<'_>) -> Option<String> {
    match stmt {
        Statement::IfStatement(stmt) => fold_if(source, stmt, facts),
        Statement::WhileStatement(stmt) => fold_never_loop(source, &stmt.test, &stmt.body, facts),
        Statement::DoWhileStatement(stmt) => {
            let (effects, yes) = known_bool(source, &stmt.test, facts)?;
            if yes || has_loop_control(&stmt.body) {
                return None;
            }
            Some(append_effects(
                slice(source, stmt.body.span()).to_string(),
                &effects,
            ))
        }
        Statement::ForStatement(stmt) => fold_for(source, stmt, facts),
        Statement::SwitchStatement(stmt) => fold_switch(source, stmt, facts),
        _ => None,
    }
}

fn fold_never_loop(
    source: &str,
    test: &Expression<'_>,
    body: &Statement<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    let (effects, yes) = known_bool(source, test, facts)?;
    if yes {
        return None;
    }
    Some(prefix_effects(&effects, &var_decl(&scan_vars(body)?)))
}

fn fold_for(
    source: &str,
    stmt: &oxc_ast::ast::ForStatement<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    if stmt.init.is_none() {
        let test = stmt.test.as_ref()?;
        return fold_never_loop(source, test, &stmt.body, facts);
    }
    let stopped = known_bool(source, stmt.test.as_ref()?, facts)
        .or_else(|| simulated_for_test(source, stmt, facts))?;
    let (effects, yes) = stopped;
    if yes {
        return None;
    }
    let hoisted = var_decl(&scan_vars(&stmt.body)?);
    let init = init_after_stop(source, stmt, facts)?;
    Some(prefix_effects(&effects, &join_dead(init, hoisted)))
}

fn simulated_for_test<'a>(
    source: &'a str,
    stmt: &oxc_ast::ast::ForStatement<'a>,
    facts: &Facts<'_>,
) -> Option<(Vec<&'a str>, bool)> {
    let oxc_ast::ast::ForStatementInit::VariableDeclaration(decl) = stmt.init.as_ref()? else {
        return None;
    };
    if decl.declarations.len() != 1 {
        return None;
    }
    let declarator = &decl.declarations[0];
    let id = declarator.id.get_binding_identifier()?;
    let symbol_id = id.symbol_id.get()?;
    let init = declarator.init.as_ref()?;
    let value = eval_pure(source, init, facts)?;
    let test = stmt.test.as_ref()?;
    facts.env.borrow_mut().push((symbol_id, value));
    let result = eval_pure(source, test, facts);
    facts.env.borrow_mut().pop();
    let yes = truthy(&result?)?;
    Some((Vec::new(), yes))
}

fn init_after_stop(
    source: &str,
    stmt: &oxc_ast::ast::ForStatement<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    let oxc_ast::ast::ForStatementInit::VariableDeclaration(decl) = stmt.init.as_ref()? else {
        return None;
    };
    if decl.declarations.len() != 1 {
        return None;
    }
    let declarator = &decl.declarations[0];
    let id = declarator.id.get_binding_identifier()?;
    let name = id.name.as_str();
    let symbol_id = id.symbol_id.get()?;
    let init = declarator.init.as_ref();
    let impure = init.is_some_and(|expr| eval_pure(source, expr, facts).is_none());
    if decl.kind.is_var() && symbol_is_read(facts, symbol_id) {
        if let Some(expr) = init {
            return Some(format!(
                "var {name} = {};",
                slice(source, expr.span()).trim()
            ));
        }
        return Some(format!("var {name};"));
    }
    if impure {
        let expr = init?;
        return Some(format!("{};", slice(source, expr.span()).trim()));
    }
    Some(String::new())
}

fn fold_if(
    source: &str,
    stmt: &oxc_ast::ast::IfStatement<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    if let Some((effects, yes)) = known_bool(source, &stmt.test, facts) {
        return finish_if(source, stmt, facts, &effects, yes);
    }
    if let Some(text) = same_branch(source, stmt, facts) {
        return Some(text);
    }
    if both_empty(stmt) {
        return Some(format!("{};", expr_text(source, stmt.test.span())));
    }
    None
}

fn finish_if(
    source: &str,
    stmt: &oxc_ast::ast::IfStatement<'_>,
    facts: &Facts<'_>,
    effects: &[&str],
    yes: bool,
) -> Option<String> {
    let (live, dead) = if yes {
        (Some(&stmt.consequent), stmt.alternate.as_ref())
    } else {
        (stmt.alternate.as_ref(), Some(&stmt.consequent))
    };
    let vars = match dead {
        Some(dead) => scan_vars(dead)?,
        None => Vec::new(),
    };
    let live = match live {
        Some(live) => {
            fold_stmt(source, live, facts).unwrap_or_else(|| slice(source, live.span()).to_string())
        }
        None => String::new(),
    };
    Some(prefix_effects(effects, &join_dead(var_decl(&vars), live)))
}

fn known_bool<'a>(
    source: &'a str,
    expr: &'a Expression<'a>,
    facts: &Facts<'_>,
) -> Option<(Vec<&'a str>, bool)> {
    let (effects, value_expr) = sequence_tail(source, expr, facts);
    let value = eval_pure(source, value_expr, facts)?;
    Some((effects, truthy(&value)?))
}

fn sequence_tail<'a>(
    source: &'a str,
    expr: &'a Expression<'a>,
    facts: &Facts<'_>,
) -> (Vec<&'a str>, &'a Expression<'a>) {
    let Expression::SequenceExpression(seq) = peel(expr) else {
        return (Vec::new(), expr);
    };
    let Some((last, prefixes)) = seq.expressions.split_last() else {
        return (Vec::new(), expr);
    };
    let mut effects = Vec::new();
    for prefix in prefixes {
        if eval_pure(source, prefix, facts).is_none() {
            effects.push(slice(source, prefix.span()));
        }
    }
    (effects, last)
}

fn prefix_effects(effects: &[&str], body: &str) -> String {
    let mut lines = Vec::new();
    for effect in effects {
        lines.push(format!("{effect};"));
    }
    if !body.is_empty() {
        lines.push(body.to_string());
    }
    lines.join("\n")
}

fn append_effects(body: String, effects: &[&str]) -> String {
    if effects.is_empty() {
        return body;
    }
    let mut text = body;
    for effect in effects {
        if !text.is_empty() && !text.ends_with('\n') {
            text.push('\n');
        }
        text.push_str(effect);
        text.push(';');
    }
    text
}

fn fold_switch(
    source: &str,
    stmt: &oxc_ast::ast::SwitchStatement<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    let mut names = Vec::new();
    for case in &stmt.cases {
        for statement in &case.consequent {
            names.extend(scan_vars(statement)?);
        }
    }
    let discriminant = eval_pure(source, &stmt.discriminant, facts)?;
    let mut index = None;
    let mut default = None;
    for (at, case) in stmt.cases.iter().enumerate() {
        match &case.test {
            None => default = Some(at),
            Some(test) => {
                let value = eval_pure(source, test, facts)?;
                if same_value(&discriminant, &value) {
                    index = Some(at);
                    break;
                }
            }
        }
    }
    let start = index.or(default)?;
    let mut text = String::from("{\n");
    for case in stmt.cases.iter().skip(start) {
        for statement in &case.consequent {
            if matches!(statement, Statement::BreakStatement(_)) {
                text.push('}');
                return Some(join_dead(var_decl(&dedupe(names)), text));
            }
            text.push_str(slice(source, statement.span()));
            text.push('\n');
        }
    }
    text.push('}');
    Some(join_dead(var_decl(&dedupe(names)), text))
}

fn scan_vars(stmt: &Statement<'_>) -> Option<Vec<String>> {
    let mut finder = HoistFinder {
        function: false,
        vars: Vec::new(),
    };
    finder.visit_statement(stmt);
    if finder.function {
        None
    } else {
        Some(dedupe(finder.vars))
    }
}

fn dedupe(names: Vec<String>) -> Vec<String> {
    let mut out = Vec::new();
    for name in names {
        if !out.iter().any(|existing| existing == &name) {
            out.push(name);
        }
    }
    out
}

fn var_decl(names: &[String]) -> String {
    if names.is_empty() {
        String::new()
    } else {
        format!("var {};", names.join(", "))
    }
}

fn unused_decl(source: &str, stmt: &Statement<'_>, facts: &Facts<'_>) -> Option<String> {
    let Statement::VariableDeclaration(decl) = stmt else {
        return None;
    };
    let keyword = match decl.kind {
        VariableDeclarationKind::Var => "var",
        VariableDeclarationKind::Let => "let",
        VariableDeclarationKind::Const => "const",
        VariableDeclarationKind::Using | VariableDeclarationKind::AwaitUsing => return None,
    };
    let mut kept = Vec::new();
    let mut effects = Vec::new();
    let mut changed = false;
    for declarator in &decl.declarations {
        if declarator_unused(declarator, decl.kind, facts) {
            changed = true;
            if let Some(init) = &declarator.init {
                if !pure_data(source, init, facts) {
                    effects.push(expr_text(source, init.span()));
                }
            }
        } else {
            kept.push(slice(source, declarator.span()));
        }
    }
    if !changed {
        return None;
    }
    if kept.is_empty() {
        return Some(effects.join("\n"));
    }
    let mut lines = effects;
    lines.push(format!("{keyword} {}", kept.join(", ")));
    Some(lines.join("\n"))
}

fn pure_data(source: &str, expr: &Expression<'_>, facts: &Facts<'_>) -> bool {
    if eval_pure(source, expr, facts).is_some() {
        return true;
    }
    match peel(expr) {
        Expression::ArrowFunctionExpression(_) | Expression::FunctionExpression(_) => true,
        Expression::ObjectExpression(object) => object.properties.iter().all(|property| {
            let ObjectPropertyKind::ObjectProperty(property) = property else {
                return false;
            };
            property.kind == PropertyKind::Init
                && !property.method
                && !property.computed
                && pure_data(source, &property.value, facts)
        }),
        Expression::ArrayExpression(array) => array.elements.iter().all(|element| {
            !element.is_spread()
                && element
                    .as_expression()
                    .is_none_or(|expr| pure_data(source, expr, facts))
        }),
        Expression::ParenthesizedExpression(inner) => pure_data(source, &inner.expression, facts),
        Expression::Identifier(ident) => settled_const(ident, facts) || pure_fn_ref(ident, facts),
        _ => false,
    }
}

fn pure_fn_ref(ident: &oxc_ast::ast::IdentifierReference<'_>, facts: &Facts<'_>) -> bool {
    let Some(reference_id) = ident.reference_id.get() else {
        return false;
    };
    let reference = facts.scoping.get_reference(reference_id);
    let Some(symbol_id) = reference.symbol_id() else {
        return false;
    };
    facts.fns.contains_key(&symbol_id)
        && !facts.eval_reachable(facts.scoping.symbol_scope_id(symbol_id))
}

fn settled_const(ident: &oxc_ast::ast::IdentifierReference<'_>, facts: &Facts<'_>) -> bool {
    let Some(reference_id) = ident.reference_id.get() else {
        return false;
    };
    let reference = facts.scoping.get_reference(reference_id);
    let Some(symbol_id) = reference.symbol_id() else {
        return false;
    };
    let Some(fact) = facts.consts.get(&symbol_id) else {
        return false;
    };
    ident.span.start >= fact.init_end
        && !facts.eval_reachable(facts.scoping.symbol_scope_id(symbol_id))
}

fn declarator_unused(
    declarator: &oxc_ast::ast::VariableDeclarator<'_>,
    _kind: VariableDeclarationKind,
    facts: &Facts<'_>,
) -> bool {
    let Some(id) = declarator.id.get_binding_identifier() else {
        return false;
    };
    let Some(symbol_id) = id.symbol_id.get() else {
        return false;
    };
    if facts.exported.contains(&symbol_id) {
        return false;
    }
    let scope = facts.scoping.symbol_scope_id(symbol_id);
    if facts.eval_reachable(scope) || facts.inside_with(scope) {
        return false;
    }
    !symbol_is_read(facts, symbol_id)
}

fn dead_store(source: &str, stmt: &Statement<'_>, facts: &Facts<'_>) -> Option<String> {
    let Statement::ExpressionStatement(expr_stmt) = stmt else {
        return None;
    };
    let Expression::AssignmentExpression(assign) = peel(&expr_stmt.expression) else {
        return None;
    };
    if assign.operator != oxc_syntax::operator::AssignmentOperator::Assign {
        return None;
    }
    let oxc_ast::ast::AssignmentTarget::AssignmentTargetIdentifier(ident) = &assign.left else {
        return None;
    };
    if !binding_unread(ident, facts) {
        return None;
    }
    if pure_data(source, &assign.right, facts) {
        Some(String::new())
    } else {
        Some(expr_text(source, assign.right.span()))
    }
}

fn binding_unread(ident: &oxc_ast::ast::IdentifierReference<'_>, facts: &Facts<'_>) -> bool {
    let Some(reference_id) = ident.reference_id.get() else {
        return false;
    };
    let reference = facts.scoping.get_reference(reference_id);
    if !facts.globals_ok(reference.scope_id()) {
        return false;
    }
    let Some(symbol_id) = reference.symbol_id() else {
        return !facts.free_reads.contains(ident.name.as_str());
    };
    if facts.exported.contains(&symbol_id) {
        return false;
    }
    let scope = facts.scoping.symbol_scope_id(symbol_id);
    if facts.eval_reachable(scope) || facts.inside_with(scope) {
        return false;
    }
    !symbol_is_read(facts, symbol_id)
}

fn symbol_is_read(facts: &Facts<'_>, symbol_id: SymbolId) -> bool {
    facts
        .scoping
        .get_resolved_references(symbol_id)
        .any(|reference| reference.is_read())
}

fn empty_block(stmt: &Statement<'_>) -> bool {
    match stmt {
        Statement::EmptyStatement(_) => true,
        Statement::BlockStatement(block) => block.body.is_empty(),
        _ => false,
    }
}

fn hoisted_names(stmt: &Statement<'_>, facts: &Facts<'_>) -> Option<Vec<String>> {
    let mut finder = ReadVarFinder {
        facts,
        function: false,
        names: Vec::new(),
    };
    finder.visit_statement(stmt);
    if finder.function {
        None
    } else {
        Some(dedupe(finder.names))
    }
}

struct ReadVarFinder<'a> {
    facts: &'a Facts<'a>,
    function: bool,
    names: Vec<String>,
}

impl<'a> Visit<'a> for ReadVarFinder<'a> {
    fn visit_statement(&mut self, stmt: &Statement<'a>) {
        match stmt {
            Statement::FunctionDeclaration(_) | Statement::ExportDeclaration(_) => {
                self.function = true;
            }
            _ => walk_statement(self, stmt),
        }
    }

    fn visit_variable_declaration(&mut self, decl: &VariableDeclaration<'a>) {
        if decl.kind.is_var() {
            for declarator in &decl.declarations {
                declarator.id.all_binding_identifiers(&mut |id| {
                    if id
                        .symbol_id
                        .get()
                        .is_some_and(|symbol_id| symbol_is_read(self.facts, symbol_id))
                    {
                        self.names.push(id.name.to_string());
                    }
                    true
                });
            }
        }
        walk::walk_variable_declaration(self, decl);
    }

    fn visit_function(&mut self, _func: &oxc_ast::ast::Function<'a>, _flags: ScopeFlags) {}

    fn visit_arrow_function_expression(
        &mut self,
        _expr: &oxc_ast::ast::ArrowFunctionExpression<'a>,
    ) {
    }
}

fn join_dead(decls: String, live: String) -> String {
    if decls.is_empty() {
        live
    } else if live.is_empty() {
        decls
    } else {
        format!("{decls}\n{live}")
    }
}

fn both_empty(stmt: &oxc_ast::ast::IfStatement<'_>) -> bool {
    branch_empty(&stmt.consequent) && stmt.alternate.as_ref().is_none_or(|alt| branch_empty(alt))
}

fn branch_empty(stmt: &Statement<'_>) -> bool {
    match stmt {
        Statement::EmptyStatement(_) => true,
        Statement::BlockStatement(block) => block.body.is_empty(),
        _ => false,
    }
}

fn same_branch(
    source: &str,
    stmt: &oxc_ast::ast::IfStatement<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    let alt = stmt.alternate.as_ref()?;
    if slice(source, stmt.consequent.span()) != slice(source, alt.span()) {
        return None;
    }
    scan_vars(&stmt.consequent)?;
    if eval_pure(source, &stmt.test, facts).is_some() {
        return None;
    }
    Some(format!(
        "{};\n{}",
        expr_text(source, stmt.test.span()),
        slice(source, stmt.consequent.span())
    ))
}

fn fold_conditional(
    source: &str,
    cond: &oxc_ast::ast::ConditionalExpression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    if let Some(value) = eval_pure(source, &cond.test, facts) {
        if let Some(yes) = truthy(&value) {
            let chosen = if yes {
                &cond.consequent
            } else {
                &cond.alternate
            };
            return Some(expr_text(source, chosen.span()));
        }
    }
    if slice(source, cond.consequent.span()) == slice(source, cond.alternate.span()) {
        if eval_pure(source, &cond.test, facts).is_some() {
            return Some(expr_text(source, cond.consequent.span()));
        }
        return Some(format!(
            "({}, {})",
            expr_text(source, cond.test.span()),
            expr_text(source, cond.consequent.span())
        ));
    }
    if let Some(name) = same_local(&cond.test, &cond.consequent, facts) {
        return Some(format!(
            "{name} || {}",
            expr_text(source, cond.alternate.span())
        ));
    }
    if let Some(name) = same_local(&cond.test, &cond.alternate, facts) {
        return Some(format!(
            "{name} && {}",
            expr_text(source, cond.consequent.span())
        ));
    }
    if bool_lit(&cond.consequent, true) && bool_lit(&cond.alternate, false) {
        return Some(format!("!!{}", expr_text(source, cond.test.span())));
    }
    if bool_lit(&cond.consequent, false) && bool_lit(&cond.alternate, true) {
        return Some(format!("!{}", expr_text(source, cond.test.span())));
    }
    None
}

fn bool_lit(expr: &Expression<'_>, bit: bool) -> bool {
    matches!(peel(expr), Expression::BooleanLiteral(literal) if literal.value == bit)
}

fn simple_params(params: &oxc_ast::ast::FormalParameters<'_>) -> Option<Vec<SymbolId>> {
    if params.rest.is_some() {
        return None;
    }
    let mut out = Vec::new();
    for param in &params.items {
        if param.initializer.is_some() || param.optional || !param.decorators.is_empty() {
            return None;
        }
        let id = param.pattern.get_binding_identifier()?;
        out.push(id.symbol_id.get()?);
    }
    Some(out)
}

fn simple_return<'a>(
    body: &'a oxc_ast::ast::FunctionBody<'a>,
) -> Option<Option<&'a Expression<'a>>> {
    match body.statements.as_slice() {
        [] => Some(None),
        [Statement::ReturnStatement(ret)] => Some(ret.argument.as_ref()),
        _ => None,
    }
}

fn completes(stmt: &Statement<'_>, facts: &Facts<'_>) -> bool {
    match stmt {
        Statement::ReturnStatement(_) | Statement::ThrowStatement(_) => true,
        Statement::BlockStatement(block) => block.body.iter().any(|stmt| completes(stmt, facts)),
        Statement::LabeledStatement(stmt) => completes(&stmt.body, facts),
        Statement::IfStatement(stmt) => {
            if let Some(value) = eval_pure(facts.source, &stmt.test, facts) {
                if let Some(yes) = truthy(&value) {
                    if yes && completes(&stmt.consequent, facts) {
                        return true;
                    }
                    if !yes {
                        if let Some(alt) = &stmt.alternate {
                            if completes(alt, facts) {
                                return true;
                            }
                        }
                    }
                }
            }
            stmt.alternate
                .as_ref()
                .is_some_and(|alt| completes(&stmt.consequent, facts) && completes(alt, facts))
        }
        _ => false,
    }
}

fn eval_user_fn(
    source: &str,
    call: &oxc_ast::ast::CallExpression<'_>,
    facts: &Facts<'_>,
) -> Option<Value> {
    let symbol_id = user_fn_target(call, facts)?;
    let func = facts.fns.get(&symbol_id)?;
    if call.span.start < func.ready {
        return None;
    }
    if facts.depth.get() >= 16 {
        return None;
    }
    let params = func.params.clone();
    let body = func.body;
    let mut bound = Vec::new();
    for (index, symbol) in params.iter().copied().enumerate() {
        let value = match call.arguments.get(index) {
            Some(arg) => eval_pure(source, arg.as_expression()?, facts)?,
            None => Value::Undef,
        };
        bound.push((symbol, value));
    }
    for arg in call.arguments.iter().skip(params.len()) {
        eval_pure(source, arg.as_expression()?, facts)?;
    }
    let previous = facts.env.replace(bound);
    facts.depth.set(facts.depth.get() + 1);
    let value = match body {
        Some(expr) => eval_pure(source, expr, facts),
        None => Some(Value::Undef),
    };
    facts.depth.set(facts.depth.get() - 1);
    facts.env.replace(previous);
    value
}

fn user_fn_symbol(source: &str, expr: &Expression<'_>, facts: &Facts<'_>) -> Option<SymbolId> {
    let Expression::CallExpression(call) = peel(expr) else {
        return None;
    };
    let symbol_id = user_fn_target(call, facts)?;
    eval_user_fn(source, call, facts)?;
    Some(symbol_id)
}

fn user_fn_target(call: &oxc_ast::ast::CallExpression<'_>, facts: &Facts<'_>) -> Option<SymbolId> {
    if call.optional {
        return None;
    }
    let Expression::Identifier(ident) = peel(&call.callee) else {
        return None;
    };
    let reference_id = ident.reference_id.get()?;
    let reference = facts.scoping.get_reference(reference_id);
    let symbol_id = reference.symbol_id()?;
    if !facts.globals_ok(reference.scope_id()) {
        return None;
    }
    let scope = facts.scoping.symbol_scope_id(symbol_id);
    if facts.eval_reachable(scope) || facts.inside_with(scope) {
        return None;
    }
    if facts
        .scoping
        .get_resolved_references(symbol_id)
        .any(|reference| reference.is_write())
    {
        return None;
    }
    Some(symbol_id)
}

fn external_reads(facts: &Facts<'_>, symbol_id: SymbolId, node_id: NodeId) -> usize {
    facts
        .scoping
        .get_resolved_references(symbol_id)
        .filter(|reference| {
            let used = reference.is_value() || !reference.is_type();
            used && !reference_inside(facts, reference.scope_id(), node_id)
        })
        .count()
}

fn reference_inside(facts: &Facts<'_>, scope: ScopeId, node_id: NodeId) -> bool {
    let mut current = Some(scope);
    while let Some(scope) = current {
        if facts.scoping.get_node_id(scope) == node_id {
            return true;
        }
        current = facts.scoping.scope_parent_id(scope);
    }
    false
}

fn abstract_eq(left: &Value, right: &Value) -> Option<bool> {
    match (left, right) {
        (Value::Null, Value::Undef) | (Value::Undef, Value::Null) => Some(true),
        (Value::Null, Value::Null) | (Value::Undef, Value::Undef) => Some(true),
        (Value::Null, _) | (_, Value::Null) | (Value::Undef, _) | (_, Value::Undef) => Some(false),
        (Value::Num(left), Value::Num(right)) => Some(left == right),
        (Value::Str(left), Value::Str(right)) => Some(left == right),
        (Value::Bool(left), Value::Bool(right)) => Some(left == right),
        (Value::Bool(bit), other) | (other, Value::Bool(bit)) => {
            let number = if *bit { 1 } else { 0 };
            abstract_eq(&Value::Num(number), other)
        }
        (Value::Num(number), Value::Str(text)) | (Value::Str(text), Value::Num(number)) => {
            Some(*number == to_js_number(&Value::Str(text.clone()))?)
        }
    }
}

fn has_loop_control(stmt: &Statement<'_>) -> bool {
    let mut finder = ControlFinder { found: false };
    finder.visit_statement(stmt);
    finder.found
}

fn structural(source: &str, expr: &Expression<'_>, facts: &Facts<'_>) -> Option<String> {
    match peel(expr) {
        Expression::ComputedMemberExpression(member) => {
            index_computed(source, member, facts).or_else(|| dot_member(source, member))
        }
        Expression::UnaryExpression(unary) => fold_unary(source, unary, facts),
        Expression::LogicalExpression(logical) => fold_logical(source, logical, facts),
        Expression::ConditionalExpression(cond) => fold_conditional(source, cond, facts),
        Expression::SequenceExpression(seq) => fold_sequence(source, seq, facts),
        Expression::NewExpression(new_expr) => fold_new(source, new_expr, facts),
        Expression::CallExpression(call) => fold_call(source, call, facts),
        Expression::StaticMemberExpression(member) => fold_known_member(source, member, facts),
        Expression::ChainExpression(chain) => match &chain.expression {
            oxc_ast::ast::ChainElement::ComputedMemberExpression(member) => {
                index_computed(source, member, facts).or_else(|| dot_member(source, member))
            }
            _ => None,
        },
        _ => None,
    }
}

fn index_computed(
    source: &str,
    member: &oxc_ast::ast::ComputedMemberExpression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    if let Some(index) = numeric_index(&member.expression) {
        if let Expression::ArrayExpression(array) = peel(&member.object) {
            return read_array(source, array, index, facts);
        }
    }
    let Expression::StringLiteral(literal) = peel(&member.expression) else {
        return None;
    };
    match peel(&member.object) {
        Expression::ObjectExpression(object) => {
            read_object(source, object, literal.value.as_str(), facts)
        }
        Expression::ArrayExpression(array) => {
            let index = literal.value.parse::<usize>().ok()?;
            read_array(source, array, index, facts)
        }
        _ => None,
    }
}

fn numeric_index(expr: &Expression<'_>) -> Option<usize> {
    let Expression::NumericLiteral(literal) = peel(expr) else {
        return None;
    };
    let index = int_from_f64(literal.value)?;
    usize::try_from(index).ok()
}

fn read_array(
    source: &str,
    array: &oxc_ast::ast::ArrayExpression<'_>,
    index: usize,
    facts: &Facts<'_>,
) -> Option<String> {
    if array.elements.iter().any(|element| element.is_spread()) || index >= array.elements.len() {
        return None;
    }
    let later_effect = array
        .elements
        .iter()
        .skip(index + 1)
        .filter_map(|element| element.as_expression())
        .any(|expr| eval_pure(source, expr, facts).is_none());
    let selected = array.elements[index].as_expression();
    if later_effect && selected.is_some_and(|expr| eval_pure(source, expr, facts).is_none()) {
        return None;
    }
    let mut effects = Vec::new();
    for (at, element) in array.elements.iter().enumerate() {
        let Some(expr) = element.as_expression() else {
            continue;
        };
        if at == index || eval_pure(source, expr, facts).is_some() {
            continue;
        }
        effects.push(slice(source, expr.span()));
    }
    let result = match selected {
        Some(expr) => match eval_pure(source, expr, facts) {
            Some(value) => print_value(&value),
            None => expr_text(source, expr.span()),
        },
        None => "void 0".to_string(),
    };
    finish_effects(&effects, &result)
}

fn read_object(
    source: &str,
    object: &oxc_ast::ast::ObjectExpression<'_>,
    name: &str,
    facts: &Facts<'_>,
) -> Option<String> {
    let mut chosen: Option<&Expression<'_>> = None;
    let mut effects = Vec::new();
    let mut seen = false;
    for property in &object.properties {
        let ObjectPropertyKind::ObjectProperty(prop) = property else {
            return None;
        };
        if prop.kind != PropertyKind::Init || prop.method {
            return None;
        }
        let key = match &prop.key {
            oxc_ast::ast::PropertyKey::StaticIdentifier(id) => id.name.to_string(),
            other => {
                let Expression::StringLiteral(literal) = other.as_expression()? else {
                    return None;
                };
                literal.value.to_string()
            }
        };
        if key == "__proto__" {
            return None;
        }
        let hit = key == name;
        if hit {
            if let Some(previous) = chosen {
                if eval_pure(source, previous, facts).is_none() {
                    effects.push(slice(source, previous.span()));
                }
            }
            chosen = Some(&prop.value);
            seen = true;
        } else if seen && eval_pure(source, &prop.value, facts).is_none() {
            if chosen.is_some_and(|expr| eval_pure(source, expr, facts).is_none()) {
                return None;
            }
            effects.push(slice(source, prop.value.span()));
        } else if !seen && eval_pure(source, &prop.value, facts).is_none() {
            effects.push(slice(source, prop.value.span()));
        }
    }
    let expr = chosen?;
    let result = match eval_pure(source, expr, facts) {
        Some(value) => print_value(&value),
        None => expr_text(source, expr.span()),
    };
    finish_effects(&effects, &result)
}

fn dot_member(source: &str, member: &oxc_ast::ast::ComputedMemberExpression<'_>) -> Option<String> {
    let Expression::StringLiteral(literal) = peel(&member.expression) else {
        return None;
    };
    let name = literal.value.as_str();
    if name == "__proto__" || !is_identifier_name(name) || is_reserved_keyword(name) {
        return None;
    }
    if !member_object_ok(&member.object) {
        return None;
    }
    let raw = slice(source, member.object.span());
    let object =
        if matches!(peel(&member.object), Expression::NewExpression(_)) && !raw.starts_with('(') {
            format!("({raw})")
        } else {
            raw.to_string()
        };
    if member.optional {
        Some(format!("{object}?.{name}"))
    } else {
        Some(format!("{object}.{name}"))
    }
}

fn member_object_ok(expr: &Expression<'_>) -> bool {
    matches!(
        peel(expr),
        Expression::Identifier(_)
            | Expression::StaticMemberExpression(_)
            | Expression::CallExpression(_)
            | Expression::NewExpression(_)
            | Expression::ParenthesizedExpression(_)
    )
}

fn fold_unary(
    source: &str,
    unary: &oxc_ast::ast::UnaryExpression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    if unary.operator == UnaryOperator::LogicalNot {
        return fold_nots(source, unary);
    }
    if unary.operator == UnaryOperator::Void {
        if let Expression::UnaryExpression(inner) = peel(&unary.argument) {
            if inner.operator == UnaryOperator::Void {
                return Some(format!("void {}", expr_text(source, inner.argument.span())));
            }
        }
    }
    if unary.operator == UnaryOperator::Typeof {
        return fold_typeof(source, &unary.argument, facts);
    }
    None
}

fn fold_nots(source: &str, unary: &oxc_ast::ast::UnaryExpression<'_>) -> Option<String> {
    let mut count = 1u32;
    let mut inner = &unary.argument;
    while let Expression::UnaryExpression(next) = peel(inner) {
        if next.operator != UnaryOperator::LogicalNot {
            break;
        }
        count += 1;
        inner = &next.argument;
    }
    if let Some(text) = flipped_compare(source, inner, count) {
        return Some(text);
    }
    if count < 2 {
        return None;
    }
    let bangs = if count % 2 == 1 { "!" } else { "!!" };
    Some(format!("{bangs}{}", expr_text(source, inner.span())))
}

fn flipped_compare(source: &str, expr: &Expression<'_>, count: u32) -> Option<String> {
    let Expression::BinaryExpression(binary) = peel(expr) else {
        return None;
    };
    let op = match binary.operator {
        BinaryOperator::StrictEquality => {
            if count % 2 == 1 {
                "!=="
            } else {
                "==="
            }
        }
        BinaryOperator::StrictInequality => {
            if count % 2 == 1 {
                "==="
            } else {
                "!=="
            }
        }
        BinaryOperator::Equality => {
            if count % 2 == 1 {
                "!="
            } else {
                "=="
            }
        }
        BinaryOperator::Inequality => {
            if count % 2 == 1 {
                "=="
            } else {
                "!="
            }
        }
        _ => return None,
    };
    Some(format!(
        "{} {op} {}",
        expr_text(source, binary.left.span()),
        expr_text(source, binary.right.span())
    ))
}

fn fold_typeof(source: &str, expr: &Expression<'_>, facts: &Facts<'_>) -> Option<String> {
    match peel(expr) {
        Expression::FunctionExpression(_) | Expression::ArrowFunctionExpression(_) => {
            Some("\"function\"".to_string())
        }
        Expression::ArrayExpression(array) => {
            if array.elements.iter().any(|element| element.is_spread()) {
                return None;
            }
            let effects = effect_list(
                source,
                array
                    .elements
                    .iter()
                    .filter_map(|element| element.as_expression()),
                facts,
            );
            finish_effects(&effects, "\"object\"")
        }
        Expression::ObjectExpression(object) => {
            let mut effects = Vec::new();
            for property in &object.properties {
                let ObjectPropertyKind::ObjectProperty(prop) = property else {
                    return None;
                };
                if prop.kind != PropertyKind::Init || prop.method || prop.computed {
                    return None;
                }
                if eval_pure(source, &prop.value, facts).is_none() {
                    effects.push(slice(source, prop.value.span()));
                }
            }
            finish_effects(&effects, "\"object\"")
        }
        Expression::UnaryExpression(inner) if inner.operator == UnaryOperator::Void => {
            typeof_effect(source, &inner.argument, facts, "\"undefined\"")
        }
        Expression::UnaryExpression(inner) if inner.operator == UnaryOperator::Typeof => {
            typeof_effect(source, &inner.argument, facts, "\"string\"")
        }
        _ => None,
    }
}

fn typeof_effect(
    source: &str,
    expr: &Expression<'_>,
    facts: &Facts<'_>,
    result: &str,
) -> Option<String> {
    if eval_pure(source, expr, facts).is_some() {
        return Some(result.to_string());
    }
    finish_effects(&[slice(source, expr.span())], result)
}

fn same_local(left: &Expression<'_>, right: &Expression<'_>, facts: &Facts<'_>) -> Option<String> {
    let (name, symbol) = local_symbol(left, facts)?;
    let (right_name, right_symbol) = local_symbol(right, facts)?;
    if name == right_name && symbol == right_symbol {
        Some(name)
    } else {
        None
    }
}

fn local_symbol(expr: &Expression<'_>, facts: &Facts<'_>) -> Option<(String, SymbolId)> {
    let Expression::Identifier(ident) = peel(expr) else {
        return None;
    };
    let reference_id = ident.reference_id.get()?;
    let reference = facts.scoping.get_reference(reference_id);
    let symbol_id = reference.symbol_id()?;
    let flags = facts.scoping.symbol_flags(symbol_id);
    if flags.contains(SymbolFlags::Import) {
        return None;
    }
    let scope = facts.scoping.symbol_scope_id(symbol_id);
    if facts.eval_reachable(scope)
        || facts.inside_with(scope)
        || !facts.globals_ok(reference.scope_id())
    {
        return None;
    }
    Some((ident.name.to_string(), symbol_id))
}

fn fold_logical(
    source: &str,
    logical: &oxc_ast::ast::LogicalExpression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    if let Some(name) = same_local(&logical.left, &logical.right, facts) {
        return Some(name);
    }
    if logical.operator == LogicalOperator::Coalesce
        && same_nullish(&logical.left, &logical.right, facts)
    {
        let Expression::Identifier(ident) = peel(&logical.left) else {
            return None;
        };
        return Some(ident.name.to_string());
    }
    if let Some(value) = eval_pure(source, &logical.left, facts) {
        match logical.operator {
            LogicalOperator::And => {
                if truthy(&value)? {
                    return Some(expr_text(source, logical.right.span()));
                }
                return Some(print_value(&value));
            }
            LogicalOperator::Or => {
                if truthy(&value)? {
                    return Some(print_value(&value));
                }
                return Some(expr_text(source, logical.right.span()));
            }
            LogicalOperator::Coalesce => {
                if matches!(value, Value::Null | Value::Undef) {
                    return Some(expr_text(source, logical.right.span()));
                }
                return Some(print_value(&value));
            }
        }
    }
    match logical.operator {
        LogicalOperator::Or => nullish_pair(&logical.left, &logical.right, facts),
        LogicalOperator::And => not_nullish_pair(&logical.left, &logical.right, facts),
        LogicalOperator::Coalesce => None,
    }
}

fn same_nullish(left: &Expression<'_>, right: &Expression<'_>, facts: &Facts<'_>) -> bool {
    let Expression::Identifier(left) = peel(left) else {
        return false;
    };
    let Expression::Identifier(right) = peel(right) else {
        return false;
    };
    let Some(left_id) = left.reference_id.get() else {
        return false;
    };
    let Some(right_id) = right.reference_id.get() else {
        return false;
    };
    let Some(left_symbol) = facts.scoping.get_reference(left_id).symbol_id() else {
        return false;
    };
    let Some(right_symbol) = facts.scoping.get_reference(right_id).symbol_id() else {
        return false;
    };
    if left_symbol != right_symbol {
        return false;
    }
    let flags = facts.scoping.symbol_flags(left_symbol);
    !flags.contains(SymbolFlags::Import)
        && !facts.eval_reachable(facts.scoping.symbol_scope_id(left_symbol))
}

fn nullish_pair(
    left: &Expression<'_>,
    right: &Expression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    let (name, symbol, left_op, left_value) = nullish_side(left, facts)?;
    let (right_name, right_symbol, right_op, right_value) = nullish_side(right, facts)?;
    if name != right_name
        || symbol != right_symbol
        || left_op != BinaryOperator::StrictEquality
        || right_op != BinaryOperator::StrictEquality
        || !is_null_or_undef(&left_value)
        || !is_null_or_undef(&right_value)
        || left_value == right_value
    {
        return None;
    }
    Some(format!("{name}==null"))
}

fn not_nullish_pair(
    left: &Expression<'_>,
    right: &Expression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    let (name, symbol, left_op, left_value) = nullish_side(left, facts)?;
    let (right_name, right_symbol, right_op, right_value) = nullish_side(right, facts)?;
    if name != right_name
        || symbol != right_symbol
        || left_op != BinaryOperator::StrictInequality
        || right_op != BinaryOperator::StrictInequality
        || !is_null_or_undef(&left_value)
        || !is_null_or_undef(&right_value)
        || left_value == right_value
    {
        return None;
    }
    Some(format!("{name}!=null"))
}

fn nullish_side(
    expr: &Expression<'_>,
    facts: &Facts<'_>,
) -> Option<(String, SymbolId, BinaryOperator, Value)> {
    let Expression::BinaryExpression(binary) = peel(expr) else {
        return None;
    };
    let (ident, value) = if let Some(value) = nullish_literal(&binary.right, facts) {
        (peel(&binary.left), value)
    } else {
        let value = nullish_literal(&binary.left, facts)?;
        (peel(&binary.right), value)
    };
    let Expression::Identifier(ident) = ident else {
        return None;
    };
    let reference_id = ident.reference_id.get()?;
    let symbol_id = facts.scoping.get_reference(reference_id).symbol_id()?;
    let flags = facts.scoping.symbol_flags(symbol_id);
    if flags.contains(SymbolFlags::Import)
        || facts.eval_reachable(facts.scoping.symbol_scope_id(symbol_id))
    {
        return None;
    }
    Some((ident.name.to_string(), symbol_id, binary.operator, value))
}

fn nullish_literal(expr: &Expression<'_>, facts: &Facts<'_>) -> Option<Value> {
    match peel(expr) {
        Expression::NullLiteral(_) => Some(Value::Null),
        Expression::Identifier(ident) if ident.name.as_str() == "undefined" => {
            let reference_id = ident.reference_id.get()?;
            let reference = facts.scoping.get_reference(reference_id);
            if reference.symbol_id().is_none() && facts.globals_ok(reference.scope_id()) {
                Some(Value::Undef)
            } else {
                None
            }
        }
        Expression::UnaryExpression(unary)
            if unary.operator == UnaryOperator::Void
                && eval_pure(facts.source, &unary.argument, facts).is_some() =>
        {
            Some(Value::Undef)
        }
        _ => None,
    }
}

fn is_null_or_undef(value: &Value) -> bool {
    matches!(value, Value::Null | Value::Undef)
}

fn fold_sequence(
    source: &str,
    seq: &oxc_ast::ast::SequenceExpression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    let last_index = seq.expressions.len().checked_sub(1)?;
    let mut parts = Vec::new();
    let mut changed = false;
    for (index, expr) in seq.expressions.iter().enumerate() {
        if index != last_index && eval_pure(source, expr, facts).is_some() {
            changed = true;
            continue;
        }
        parts.push(slice(source, expr.span()).trim());
    }
    if !changed {
        return None;
    }
    if parts.len() == 1 {
        return Some(expr_text(source, seq.expressions[last_index].span()));
    }
    Some(format!("({})", parts.join(", ")))
}

fn fold_new(
    source: &str,
    expr: &oxc_ast::ast::NewExpression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    if expr.type_arguments.is_some() {
        return None;
    }
    if facts.unbound(&expr.callee, "Array") {
        return array_literal(source, &expr.arguments);
    }
    if facts.unbound(&expr.callee, "Object") && object_empty(&expr.arguments, facts) {
        return Some("{}".to_string());
    }
    None
}

fn fold_call(
    source: &str,
    call: &oxc_ast::ast::CallExpression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    if call.optional || call.type_arguments.is_some() {
        return None;
    }
    let Expression::Identifier(ident) = peel(&call.callee) else {
        return fold_method(source, call, facts);
    };
    let args = call_args(&call.arguments)?;
    let scope = ident
        .reference_id
        .get()
        .map(|id| facts.scoping.get_reference(id).scope_id())?;
    if !facts.globals_ok(scope)
        || facts
            .scoping
            .get_reference(ident.reference_id.get()?)
            .symbol_id()
            .is_some()
    {
        return None;
    }
    match ident.name.as_str() {
        "Array" => array_literal(source, &call.arguments),
        "Object" if object_empty(&call.arguments, facts) => Some("{}".to_string()),
        "Number" => fold_number_call(args, facts),
        "String" => fold_string_call(args, facts),
        "Boolean" => fold_boolean_call(args, facts),
        "isNaN" => fold_global_nan(args, facts),
        "isFinite" => fold_global_finite(args, facts),
        "parseInt" => fold_parse_int(args, facts),
        "parseFloat" => fold_parse_int(args, facts),
        "encodeURI" | "encodeURIComponent" => fold_encode(args, facts),
        "decodeURI" | "decodeURIComponent" => fold_decode(args, facts),
        _ => None,
    }
}

fn fold_method(
    source: &str,
    call: &oxc_ast::ast::CallExpression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    let Expression::StaticMemberExpression(member) = peel(&call.callee) else {
        return None;
    };
    if member.optional {
        return None;
    }
    let args = call_args(&call.arguments)?;
    if facts.unbound(&member.object, "Math") {
        return fold_math(member.property.name.as_str(), args, facts);
    }
    if facts.unbound(&member.object, "JSON") {
        return match member.property.name.as_str() {
            "parse" => fold_json(args),
            "stringify" => fold_json_stringify(args, facts),
            _ => None,
        };
    }
    if facts.unbound(&member.object, "Number") {
        return fold_number_static(member.property.name.as_str(), args, facts);
    }
    if facts.unbound(&member.object, "String") && member.property.name.as_str() == "fromCharCode" {
        return fold_from_char_code(args, facts);
    }
    if facts.unbound(&member.object, "Object") && member.property.name.as_str() == "is" {
        return fold_object_is(args, facts);
    }
    if facts.unbound(&member.object, "Array") && member.property.name.as_str() == "of" {
        return array_of(source, args);
    }
    if facts.unbound(&member.object, "Array")
        && member.property.name.as_str() == "isArray"
        && args.len() == 1
    {
        return match peel(args[0]) {
            Expression::ArrayExpression(_) => Some("true".to_string()),
            Expression::ObjectExpression(_)
            | Expression::StringLiteral(_)
            | Expression::NumericLiteral(_)
            | Expression::BooleanLiteral(_)
            | Expression::NullLiteral(_) => Some("false".to_string()),
            _ => None,
        };
    }
    if facts.unbound(&member.object, "Object")
        && member.property.name.as_str() == "keys"
        && args.len() == 1
    {
        return object_keys(args[0]);
    }
    None
}

fn fold_known_member(
    source: &str,
    member: &oxc_ast::ast::StaticMemberExpression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    if member.property.name.as_str() == "length" {
        if let Some(Value::Str(text)) = eval_pure(source, &member.object, facts) {
            return Some(text.chars().count().to_string());
        }
        if let Some(text) = array_length(source, &member.object, facts) {
            return Some(text);
        }
    }
    array_or_object_index(source, member, facts)
}

fn array_literal(source: &str, arguments: &[oxc_ast::ast::Argument<'_>]) -> Option<String> {
    if arguments.len() == 1 {
        return None;
    }
    let mut parts = Vec::new();
    for argument in arguments {
        let expr = argument.as_expression()?;
        parts.push(slice(source, expr.span()));
    }
    Some(format!("[{}]", parts.join(",")))
}

fn object_empty(arguments: &[oxc_ast::ast::Argument<'_>], facts: &Facts<'_>) -> bool {
    if arguments.is_empty() {
        return true;
    }
    if arguments.len() != 1 {
        return false;
    }
    let Some(expr) = arguments[0].as_expression() else {
        return false;
    };
    matches!(
        eval_pure(facts.source, expr, facts),
        Some(Value::Null | Value::Undef)
    )
}

fn call_args<'a>(arguments: &'a [oxc_ast::ast::Argument<'a>]) -> Option<Vec<&'a Expression<'a>>> {
    arguments
        .iter()
        .map(|argument| argument.as_expression())
        .collect()
}

fn fold_number_call(args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if args.len() > 1 {
        return None;
    }
    if args.is_empty() {
        return Some("0".to_string());
    }
    let value = eval_pure(facts.source, args[0], facts)?;
    let number = to_js_number(&value)?;
    Some(number.to_string())
}

fn fold_string_call(args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if args.len() > 1 {
        return None;
    }
    if args.is_empty() {
        return Some("\"\"".to_string());
    }
    let value = eval_pure(facts.source, args[0], facts)?;
    Some(js_string(&to_js_string(&value)?))
}

fn fold_boolean_call(args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if args.len() > 1 {
        return None;
    }
    if args.is_empty() {
        return Some("false".to_string());
    }
    let value = eval_pure(facts.source, args[0], facts)?;
    Some(if truthy(&value)? { "true" } else { "false" }.to_string())
}

fn fold_math(name: &str, args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if matches!(name, "random") {
        return None;
    }
    let nums = args
        .iter()
        .map(|arg| eval_pure(facts.source, arg, facts).and_then(|value| int_of(&value)))
        .collect::<Option<Vec<_>>>()?;
    let value = match name {
        "abs" if nums.len() == 1 => nums[0].checked_abs()?,
        "sign" if nums.len() == 1 => {
            if nums[0] == 0 {
                0
            } else {
                nums[0].signum()
            }
        }
        "min" if !nums.is_empty() => *nums.iter().min()?,
        "max" if !nums.is_empty() => *nums.iter().max()?,
        "imul" if nums.len() == 2 => i64::from(to_int32(nums[0]).wrapping_mul(to_int32(nums[1]))),
        "clz32" if nums.len() == 1 => i64::from(to_uint32(nums[0]).leading_zeros()),
        "floor" | "ceil" | "trunc" | "round" if nums.len() == 1 => nums[0],
        "sqrt" if nums.len() == 1 && nums[0] >= 0 => perfect_sqrt(nums[0])?,
        "pow" if nums.len() == 2 => int_pow(nums[0], nums[1])?,
        "hypot" if (1..=3).contains(&nums.len()) => integer_hypot(&nums)?,
        _ => return None,
    };
    Some(value.to_string())
}

fn integer_hypot(nums: &[i64]) -> Option<i64> {
    let mut sum = 0i128;
    for number in nums {
        let wide = i128::from(*number);
        sum = sum.checked_add(wide.checked_mul(wide)?)?;
    }
    if sum > i128::from(SAFE_INT_MAX) {
        return None;
    }
    let root = (sum as f64).sqrt().round() as i64;
    if root >= 0 && i128::from(root).checked_mul(i128::from(root)) == Some(sum) {
        Some(root)
    } else {
        None
    }
}

fn fold_global_nan(args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if args.len() != 1 {
        return None;
    }
    let value = eval_pure(facts.source, args[0], facts)?;
    let nan = match value {
        Value::Num(_) | Value::Bool(_) | Value::Null => false,
        Value::Undef => true,
        Value::Str(text) => {
            if parse_number(&text).is_some() {
                false
            } else {
                return None;
            }
        }
    };
    Some(if nan { "true" } else { "false" }.to_string())
}

fn fold_global_finite(args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if args.len() != 1 {
        return None;
    }
    let value = eval_pure(facts.source, args[0], facts)?;
    let finite = match value {
        Value::Num(_) | Value::Bool(_) | Value::Null => true,
        Value::Undef => false,
        Value::Str(text) => {
            if parse_number(&text).is_some() {
                true
            } else {
                return None;
            }
        }
    };
    Some(if finite { "true" } else { "false" }.to_string())
}

fn fold_parse_int(args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if args.is_empty() || args.len() > 2 {
        return None;
    }
    let Value::Str(text) = eval_pure(facts.source, args[0], facts)? else {
        return None;
    };
    if args.len() == 2 {
        let radix = int_of(&eval_pure(facts.source, args[1], facts)?)?;
        if radix != 10 {
            return None;
        }
    }
    if !integer_text(&text) {
        return None;
    }
    let number = text.parse::<i64>().ok()?;
    if number == 0 && text.starts_with('-') {
        return None;
    }
    if number.unsigned_abs() > SAFE_INT_MAX as u64 {
        return None;
    }
    Some(number.to_string())
}

fn integer_text(text: &str) -> bool {
    let digits = text
        .strip_prefix('+')
        .or_else(|| text.strip_prefix('-'))
        .unwrap_or(text);
    !digits.is_empty() && digits.bytes().all(|byte| byte.is_ascii_digit())
}

fn fold_encode(args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if args.len() != 1 {
        return None;
    }
    let Value::Str(text) = eval_pure(facts.source, args[0], facts)? else {
        return None;
    };
    if text.bytes().all(uri_unreserved) {
        Some(js_string(&text))
    } else {
        None
    }
}

fn uri_unreserved(byte: u8) -> bool {
    matches!(
        byte,
        b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'!' | b'~' | b'*' | b'\'' | b'('
            | b')'
    )
}

fn fold_decode(args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if args.len() != 1 {
        return None;
    }
    let Value::Str(text) = eval_pure(facts.source, args[0], facts)? else {
        return None;
    };
    if text.bytes().any(|byte| byte == b'%' || !byte.is_ascii()) {
        return None;
    }
    Some(js_string(&text))
}

fn fold_number_static(name: &str, args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    match name {
        "parseInt" | "parseFloat" => fold_parse_int(args, facts),
        "isNaN" | "isFinite" | "isInteger" | "isSafeInteger" => {
            if args.len() != 1 {
                return None;
            }
            let value = eval_pure(facts.source, args[0], facts)?;
            let number = matches!(value, Value::Num(_));
            let answer = if name == "isNaN" { false } else { number };
            Some(if answer { "true" } else { "false" }.to_string())
        }
        _ => None,
    }
}

fn fold_from_char_code(args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if args.is_empty() || args.len() > 16 {
        return None;
    }
    let mut text = String::new();
    for arg in args {
        let number = int_of(&eval_pure(facts.source, arg, facts)?)?;
        if !(0..=0xFFFF).contains(&number) {
            return None;
        }
        let unit = number as u32;
        if (0xD800..=0xDFFF).contains(&unit) {
            return None;
        }
        text.push(char::from_u32(unit)?);
    }
    Some(js_string(&text))
}

fn fold_object_is(args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if args.len() != 2 {
        return None;
    }
    let left = eval_pure(facts.source, args[0], facts)?;
    let right = eval_pure(facts.source, args[1], facts)?;
    Some(
        if same_value(&left, &right) {
            "true"
        } else {
            "false"
        }
        .to_string(),
    )
}

fn array_of(source: &str, args: Vec<&Expression<'_>>) -> Option<String> {
    let mut parts = Vec::new();
    for expr in args {
        parts.push(slice(source, expr.span()).trim());
    }
    Some(format!("[{}]", parts.join(",")))
}

enum JsonData {
    Value(serde_json::Value),
    Undefined,
}

fn fold_json_stringify(args: Vec<&Expression<'_>>, facts: &Facts<'_>) -> Option<String> {
    if args.len() != 1 {
        return None;
    }
    match data_json(facts.source, args[0], facts)? {
        JsonData::Undefined => Some("void 0".to_string()),
        JsonData::Value(value) => {
            let text = serde_json::to_string(&value).ok()?;
            if text.len() > MAX_TEXT {
                return None;
            }
            Some(js_string(&text))
        }
    }
}

fn data_json(source: &str, expr: &Expression<'_>, facts: &Facts<'_>) -> Option<JsonData> {
    if let Some(value) = eval_pure(source, expr, facts) {
        return Some(match value {
            Value::Undef => JsonData::Undefined,
            Value::Num(number) => JsonData::Value(serde_json::Value::Number(number.into())),
            Value::Str(text) => JsonData::Value(serde_json::Value::String(text)),
            Value::Bool(bit) => JsonData::Value(serde_json::Value::Bool(bit)),
            Value::Null => JsonData::Value(serde_json::Value::Null),
        });
    }
    match peel(expr) {
        Expression::ArrayExpression(array) => {
            let mut items = Vec::new();
            for element in &array.elements {
                if element.is_spread() {
                    return None;
                }
                let Some(item) = element.as_expression() else {
                    items.push(serde_json::Value::Null);
                    continue;
                };
                items.push(match data_json(source, item, facts)? {
                    JsonData::Undefined => serde_json::Value::Null,
                    JsonData::Value(value) => value,
                });
            }
            Some(JsonData::Value(serde_json::Value::Array(items)))
        }
        Expression::ObjectExpression(object) => {
            let mut map = serde_json::Map::new();
            for property in &object.properties {
                let ObjectPropertyKind::ObjectProperty(prop) = property else {
                    return None;
                };
                if prop.kind != PropertyKind::Init || prop.method || prop.computed {
                    return None;
                }
                let key = match &prop.key {
                    oxc_ast::ast::PropertyKey::StaticIdentifier(id) => id.name.to_string(),
                    other => {
                        let Expression::StringLiteral(literal) = other.as_expression()? else {
                            return None;
                        };
                        literal.value.to_string()
                    }
                };
                if key == "__proto__" {
                    return None;
                }
                if let JsonData::Value(value) = data_json(source, &prop.value, facts)? {
                    map.insert(key, value);
                }
            }
            Some(JsonData::Value(serde_json::Value::Object(map)))
        }
        _ => None,
    }
}

fn fold_json(args: Vec<&Expression<'_>>) -> Option<String> {
    if args.len() != 1 {
        return None;
    }
    let Expression::StringLiteral(literal) = peel(args[0]) else {
        return None;
    };
    if literal.value.len() > MAX_TEXT {
        return None;
    }
    let value: serde_json::Value = serde_json::from_str(literal.value.as_str()).ok()?;
    if json_has_proto(&value) {
        return None;
    }
    let text = serde_json::to_string(&value).ok()?;
    if text.len() > MAX_TEXT {
        return None;
    }
    if text.starts_with('{') {
        Some(format!("({text})"))
    } else {
        Some(text)
    }
}

fn json_has_proto(value: &serde_json::Value) -> bool {
    match value {
        serde_json::Value::Array(items) => items.iter().any(json_has_proto),
        serde_json::Value::Object(map) => {
            map.contains_key("__proto__") || map.values().any(json_has_proto)
        }
        _ => false,
    }
}

fn object_keys(expr: &Expression<'_>) -> Option<String> {
    let Expression::ObjectExpression(object) = peel(expr) else {
        return None;
    };
    let mut keys = Vec::new();
    for property in &object.properties {
        let ObjectPropertyKind::ObjectProperty(prop) = property else {
            return None;
        };
        if prop.kind != PropertyKind::Init || prop.method || prop.computed {
            return None;
        }
        let name = match &prop.key {
            oxc_ast::ast::PropertyKey::StaticIdentifier(id) => id.name.to_string(),
            other => {
                let Expression::StringLiteral(literal) = other.as_expression()? else {
                    return None;
                };
                if literal.value.as_str() == "__proto__" {
                    return None;
                }
                literal.value.to_string()
            }
        };
        if name == "__proto__" {
            return None;
        }
        if !keys.iter().any(|existing| existing == &name) {
            keys.push(name);
        }
    }
    Some(format!(
        "[{}]",
        keys.iter()
            .map(|name| js_string(name))
            .collect::<Vec<_>>()
            .join(",")
    ))
}

fn array_length(source: &str, expr: &Expression<'_>, facts: &Facts<'_>) -> Option<String> {
    let Expression::ArrayExpression(array) = peel(expr) else {
        return None;
    };
    if array.elements.iter().any(|element| element.is_spread()) {
        return None;
    }
    let len = array.elements.len();
    let effects = effect_list(
        source,
        array
            .elements
            .iter()
            .filter_map(|element| element.as_expression()),
        facts,
    );
    finish_effects(&effects, &len.to_string())
}

fn array_or_object_index(
    source: &str,
    member: &oxc_ast::ast::StaticMemberExpression<'_>,
    facts: &Facts<'_>,
) -> Option<String> {
    let Expression::ObjectExpression(object) = peel(&member.object) else {
        return None;
    };
    read_object(source, object, member.property.name.as_str(), facts)
}

fn effect_list<'a>(
    source: &'a str,
    exprs: impl Iterator<Item = &'a Expression<'a>>,
    facts: &Facts<'_>,
) -> Vec<&'a str> {
    exprs
        .filter(|expr| eval_pure(source, expr, facts).is_none())
        .map(|expr| slice(source, expr.span()))
        .collect()
}

fn finish_effects(effects: &[&str], result: &str) -> Option<String> {
    if effects.is_empty() {
        return Some(result.to_string());
    }
    let mut parts = effects.to_vec();
    parts.push(result);
    Some(format!("({})", parts.join(",")))
}

fn eval_pure(source: &str, expr: &Expression<'_>, facts: &Facts<'_>) -> Option<Value> {
    match peel(expr) {
        Expression::NumericLiteral(literal) => int_from_f64(literal.value).map(Value::Num),
        Expression::StringLiteral(literal) => Some(Value::Str(literal.value.to_string())),
        Expression::BooleanLiteral(literal) => Some(Value::Bool(literal.value)),
        Expression::NullLiteral(_) => Some(Value::Null),
        Expression::Identifier(ident) => ident_value(ident, facts),
        Expression::UnaryExpression(unary) => eval_unary(source, unary, facts),
        Expression::BinaryExpression(binary) => eval_binary(source, binary, facts),
        Expression::LogicalExpression(logical) => eval_logical(source, logical, facts),
        Expression::ConditionalExpression(cond) => {
            let yes = truthy(&eval_pure(source, &cond.test, facts)?)?;
            eval_pure(
                source,
                if yes {
                    &cond.consequent
                } else {
                    &cond.alternate
                },
                facts,
            )
        }
        Expression::CallExpression(call) => eval_user_fn(source, call, facts),
        Expression::SequenceExpression(seq) => {
            let mut value = None;
            for expr in &seq.expressions {
                value = Some(eval_pure(source, expr, facts)?);
            }
            value
        }
        Expression::TemplateLiteral(template) => eval_template(source, template, facts),
        Expression::ParenthesizedExpression(expr) => eval_pure(source, &expr.expression, facts),
        _ => None,
    }
}

fn ident_value(ident: &oxc_ast::ast::IdentifierReference<'_>, facts: &Facts<'_>) -> Option<Value> {
    if let Some(reference_id) = ident.reference_id.get() {
        let reference = facts.scoping.get_reference(reference_id);
        if let Some(symbol_id) = reference.symbol_id() {
            let bound = facts
                .env
                .borrow()
                .iter()
                .rev()
                .find(|(id, _)| *id == symbol_id)
                .map(|(_, value)| value.clone());
            if let Some(value) = bound {
                return Some(value);
            }
            let fact = facts.consts.get(&symbol_id)?;
            if can_inline(facts, symbol_id, reference.scope_id(), ident.span, fact) {
                return Some(fact.value.clone());
            }
            return None;
        }
    }
    if ident.name.as_str() == "undefined" {
        let reference_id = ident.reference_id.get()?;
        let reference = facts.scoping.get_reference(reference_id);
        if reference.symbol_id().is_none() && facts.globals_ok(reference.scope_id()) {
            return Some(Value::Undef);
        }
    }
    None
}

fn eval_unary(
    source: &str,
    unary: &oxc_ast::ast::UnaryExpression<'_>,
    facts: &Facts<'_>,
) -> Option<Value> {
    let value = eval_pure(source, &unary.argument, facts)?;
    match unary.operator {
        UnaryOperator::UnaryPlus => to_js_number(&value).map(Value::Num),
        UnaryOperator::UnaryNegation => to_js_number(&value)?.checked_neg().map(Value::Num),
        UnaryOperator::LogicalNot => truthy(&value).map(|yes| Value::Bool(!yes)),
        UnaryOperator::Void => Some(Value::Undef),
        UnaryOperator::Typeof => Some(Value::Str(type_of(&value).to_string())),
        UnaryOperator::BitwiseNot => Some(Value::Num(i64::from(!to_int32(int_of(&value)?)))),
        _ => None,
    }
}

fn eval_binary(
    source: &str,
    binary: &oxc_ast::ast::BinaryExpression<'_>,
    facts: &Facts<'_>,
) -> Option<Value> {
    let left = eval_pure(source, &binary.left, facts)?;
    let right = eval_pure(source, &binary.right, facts)?;
    match binary.operator {
        BinaryOperator::Addition => add_values(&left, &right),
        BinaryOperator::Subtraction => num_op(&left, &right, i64::checked_sub),
        BinaryOperator::Multiplication => num_op(&left, &right, i64::checked_mul),
        BinaryOperator::Division => {
            let right = to_js_number(&right)?;
            if right == 0 {
                return None;
            }
            let left = to_js_number(&left)?;
            if left % right != 0 {
                return None;
            }
            Some(Value::Num(left / right))
        }
        BinaryOperator::Remainder => {
            let right = to_js_number(&right)?;
            if right == 0 {
                return None;
            }
            Some(Value::Num(to_js_number(&left)? % right))
        }
        BinaryOperator::Exponential => int_pow(int_of(&left)?, int_of(&right)?).map(Value::Num),
        BinaryOperator::Equality => Some(Value::Bool(abstract_eq(&left, &right)?)),
        BinaryOperator::Inequality => Some(Value::Bool(!abstract_eq(&left, &right)?)),
        BinaryOperator::StrictEquality => Some(Value::Bool(same_value(&left, &right))),
        BinaryOperator::StrictInequality => Some(Value::Bool(!same_value(&left, &right))),
        BinaryOperator::LessThan => cmp_ints(&left, &right, |a, b| a < b),
        BinaryOperator::LessEqualThan => cmp_ints(&left, &right, |a, b| a <= b),
        BinaryOperator::GreaterThan => cmp_ints(&left, &right, |a, b| a > b),
        BinaryOperator::GreaterEqualThan => cmp_ints(&left, &right, |a, b| a >= b),
        BinaryOperator::ShiftLeft => Some(Value::Num(i64::from(
            to_int32(int_of(&left)?) << (to_uint32(int_of(&right)?) & 31),
        ))),
        BinaryOperator::ShiftRight => Some(Value::Num(i64::from(
            to_int32(int_of(&left)?) >> (to_uint32(int_of(&right)?) & 31),
        ))),
        BinaryOperator::ShiftRightZeroFill => Some(Value::Num(i64::from(
            to_uint32(int_of(&left)?) >> (to_uint32(int_of(&right)?) & 31),
        ))),
        BinaryOperator::BitwiseOR => Some(Value::Num(i64::from(
            to_int32(int_of(&left)?) | to_int32(int_of(&right)?),
        ))),
        BinaryOperator::BitwiseXOR => Some(Value::Num(i64::from(
            to_int32(int_of(&left)?) ^ to_int32(int_of(&right)?),
        ))),
        BinaryOperator::BitwiseAnd => Some(Value::Num(i64::from(
            to_int32(int_of(&left)?) & to_int32(int_of(&right)?),
        ))),
        _ => None,
    }
}

fn eval_logical(
    source: &str,
    logical: &oxc_ast::ast::LogicalExpression<'_>,
    facts: &Facts<'_>,
) -> Option<Value> {
    let left = eval_pure(source, &logical.left, facts)?;
    match logical.operator {
        LogicalOperator::And => {
            if !truthy(&left)? {
                return Some(left);
            }
            eval_pure(source, &logical.right, facts)
        }
        LogicalOperator::Or => {
            if truthy(&left)? {
                return Some(left);
            }
            eval_pure(source, &logical.right, facts)
        }
        LogicalOperator::Coalesce => {
            if matches!(left, Value::Null | Value::Undef) {
                eval_pure(source, &logical.right, facts)
            } else {
                Some(left)
            }
        }
    }
}

fn eval_template(
    source: &str,
    template: &oxc_ast::ast::TemplateLiteral<'_>,
    facts: &Facts<'_>,
) -> Option<Value> {
    if template.quasis.iter().any(|quasi| quasi.lone_surrogates) {
        return None;
    }
    let mut out = String::new();
    for (index, quasi) in template.quasis.iter().enumerate() {
        out.push_str(quasi.value.cooked.as_ref()?.as_str());
        if let Some(expr) = template.expressions.get(index) {
            out.push_str(&to_js_string(&eval_pure(source, expr, facts)?)?);
        }
        if out.len() > MAX_TEXT {
            return None;
        }
    }
    Some(Value::Str(out))
}

fn add_values(left: &Value, right: &Value) -> Option<Value> {
    if matches!(left, Value::Str(_)) || matches!(right, Value::Str(_)) {
        let text = to_js_string(left)? + &to_js_string(right)?;
        if text.len() > MAX_TEXT {
            return None;
        }
        return Some(Value::Str(text));
    }
    num_op(left, right, i64::checked_add)
}

fn num_op(left: &Value, right: &Value, op: fn(i64, i64) -> Option<i64>) -> Option<Value> {
    op(to_js_number(left)?, to_js_number(right)?).map(Value::Num)
}

fn cmp_ints(left: &Value, right: &Value, op: fn(i64, i64) -> bool) -> Option<Value> {
    Some(Value::Bool(op(to_js_number(left)?, to_js_number(right)?)))
}

fn int_pow(base: i64, exp: i64) -> Option<i64> {
    if !(0..32).contains(&exp) {
        return None;
    }
    let mut acc = 1i64;
    for _ in 0..exp {
        acc = acc.checked_mul(base)?;
        if acc.unsigned_abs() > SAFE_INT_MAX as u64 {
            return None;
        }
    }
    Some(acc)
}

fn perfect_sqrt(n: i64) -> Option<i64> {
    let root = (n as f64).sqrt().round() as i64;
    if root >= 0 && root.checked_mul(root) == Some(n) {
        Some(root)
    } else {
        None
    }
}

fn same_value(left: &Value, right: &Value) -> bool {
    match (left, right) {
        (Value::Num(left), Value::Num(right)) => left == right,
        (Value::Str(left), Value::Str(right)) => left == right,
        (Value::Bool(left), Value::Bool(right)) => left == right,
        (Value::Null, Value::Null) | (Value::Undef, Value::Undef) => true,
        _ => false,
    }
}

fn truthy(value: &Value) -> Option<bool> {
    Some(match value {
        Value::Num(n) => *n != 0,
        Value::Str(text) => !text.is_empty(),
        Value::Bool(bit) => *bit,
        Value::Null | Value::Undef => false,
    })
}

fn type_of(value: &Value) -> &'static str {
    match value {
        Value::Num(_) => "number",
        Value::Str(_) => "string",
        Value::Bool(_) => "boolean",
        Value::Null => "object",
        Value::Undef => "undefined",
    }
}

fn int_of(value: &Value) -> Option<i64> {
    match value {
        Value::Num(n) => Some(*n),
        _ => None,
    }
}

fn to_js_number(value: &Value) -> Option<i64> {
    match value {
        Value::Num(n) => Some(*n),
        Value::Bool(true) => Some(1),
        Value::Bool(false) | Value::Null => Some(0),
        Value::Undef => None,
        Value::Str(text) => parse_number(text),
    }
}

fn parse_number(text: &str) -> Option<i64> {
    let text = text.trim();
    if text.is_empty() {
        return Some(0);
    }
    if !text
        .bytes()
        .all(|byte| byte.is_ascii_digit() || byte == b'-' || byte == b'+')
    {
        return None;
    }
    text.parse::<i64>().ok().filter(|n| n.abs() <= SAFE_INT_MAX)
}

fn to_js_string(value: &Value) -> Option<String> {
    Some(match value {
        Value::Num(n) => n.to_string(),
        Value::Str(text) => text.clone(),
        Value::Bool(true) => "true".to_string(),
        Value::Bool(false) => "false".to_string(),
        Value::Null => "null".to_string(),
        Value::Undef => "undefined".to_string(),
    })
}

fn print_value(value: &Value) -> String {
    match value {
        Value::Num(n) => n.to_string(),
        Value::Str(text) => js_string(text),
        Value::Bool(true) => "true".to_string(),
        Value::Bool(false) => "false".to_string(),
        Value::Null => "null".to_string(),
        Value::Undef => "void 0".to_string(),
    }
}

fn int_from_f64(value: f64) -> Option<i64> {
    if !value.is_finite() || value.fract() != 0.0 {
        return None;
    }
    if value == 0.0 && value.is_sign_negative() {
        return None;
    }
    if value < -SAFE_INT_MAX as f64 || value > SAFE_INT_MAX as f64 {
        return None;
    }
    Some(value as i64)
}

fn to_int32(n: i64) -> i32 {
    (n as i128).rem_euclid(1i128 << 32) as u32 as i32
}

fn to_uint32(n: i64) -> u32 {
    to_int32(n) as u32
}

fn peel<'a>(expr: &'a Expression<'a>) -> &'a Expression<'a> {
    if let Expression::ParenthesizedExpression(inner) = expr {
        peel(&inner.expression)
    } else {
        expr
    }
}

fn slice(source: &str, span: Span) -> &str {
    &source[span.start as usize..span.end as usize]
}

fn expr_text(source: &str, span: Span) -> String {
    let text = slice(source, span).trim();
    if is_atom(text) {
        text.to_string()
    } else {
        format!("({text})")
    }
}

fn is_atom(text: &str) -> bool {
    if text == "true" || text == "false" || text == "null" || text == "void 0" {
        return true;
    }
    let mut chars = text.chars();
    let Some(first) = chars.next() else {
        return false;
    };
    if first == '"' || first == '\'' {
        return text.ends_with(first);
    }
    if first == '-' {
        return text.len() > 1 && text[1..].bytes().all(|byte| byte.is_ascii_digit());
    }
    text.bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || byte == b'_' || byte == b'$')
}

struct HoistFinder {
    function: bool,
    vars: Vec<String>,
}

impl<'a> Visit<'a> for HoistFinder {
    fn visit_statement(&mut self, stmt: &Statement<'a>) {
        match stmt {
            Statement::FunctionDeclaration(_) | Statement::ExportDeclaration(_) => {
                self.function = true;
            }
            _ => walk_statement(self, stmt),
        }
    }

    fn visit_variable_declaration(&mut self, decl: &VariableDeclaration<'a>) {
        if decl.kind.is_var() {
            for declarator in &decl.declarations {
                declarator.id.all_binding_identifiers(&mut |id| {
                    self.vars.push(id.name.to_string());
                    true
                });
            }
        }
        walk::walk_variable_declaration(self, decl);
    }

    fn visit_function(&mut self, _func: &oxc_ast::ast::Function<'a>, _flags: ScopeFlags) {}

    fn visit_arrow_function_expression(
        &mut self,
        _expr: &oxc_ast::ast::ArrowFunctionExpression<'a>,
    ) {
    }
}

struct ControlFinder {
    found: bool,
}

impl<'a> Visit<'a> for ControlFinder {
    fn visit_break_statement(&mut self, _stmt: &oxc_ast::ast::BreakStatement<'a>) {
        self.found = true;
    }

    fn visit_continue_statement(&mut self, _stmt: &oxc_ast::ast::ContinueStatement<'a>) {
        self.found = true;
    }

    fn visit_function(&mut self, _func: &oxc_ast::ast::Function<'a>, _flags: ScopeFlags) {}

    fn visit_arrow_function_expression(
        &mut self,
        _expr: &oxc_ast::ast::ArrowFunctionExpression<'a>,
    ) {
    }
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use oxc_allocator::Allocator;

    use super::optimize_source;

    fn optimized(source: &str) -> String {
        optimized_at("sample.js", source)
    }

    fn optimized_at(path: &str, source: &str) -> String {
        let mut allocator = Allocator::default();
        optimize_source(&mut allocator, Path::new(path), source).0
    }

    fn squash(text: &str) -> String {
        text.split_whitespace().collect::<Vec<_>>().join(" ")
    }

    fn expect(source: &str, expected: &str) {
        let got = optimized(source);
        assert_eq!(
            squash(&got),
            squash(expected),
            "source:\n{source}\noptimized:\n{got}"
        );
        assert_eq!(
            optimized(&got),
            got,
            "second pass changed:\n{source}\n{got}"
        );
    }

    fn expect_same(source: &str) {
        let got = optimized(source);
        assert_eq!(got, source, "optimized:\n{got}");
    }

    #[test]
    fn folds_arithmetic_and_leaves_inexact_math() {
        let cases = [
            ("1 + 2;", "3;"),
            ("8 - 3;", "5;"),
            ("4 * 5;", "20;"),
            ("8 / 2;", "4;"),
            ("(-8) / 2;", "-4;"),
            ("(-8) / -2;", "4;"),
            ("7 % 3;", "1;"),
            ("(-5) % 2;", "-1;"),
            ("2 ** 3;", "8;"),
            ("1 + 2 * 3;", "7;"),
            ("(1 + 2) * 3;", "9;"),
            ("0 / 1;", "0;"),
            ("1 < 2;", "true;"),
            ("2 <= 2;", "true;"),
            ("2 > 3;", "false;"),
            ("3 >= 3;", "true;"),
            ("1 === 1;", "true;"),
            ("1 !== 2;", "true;"),
            ("1 === 2;", "false;"),
            ("8 << 1;", "16;"),
            ("8 >> 1;", "4;"),
            ("8 >>> 1;", "4;"),
            ("5 & 3;", "1;"),
            ("5 | 2;", "7;"),
            ("5 ^ 1;", "4;"),
            ("~0;", "-1;"),
            ("!0;", "true;"),
            ("!1;", "false;"),
            ("void 1;", "void 0;"),
            ("+\"4\";", "4;"),
            ("-\"3\";", "-3;"),
            ("typeof 1;", "\"number\";"),
            ("typeof \"a\";", "\"string\";"),
            ("typeof true;", "\"boolean\";"),
            ("typeof null;", "\"object\";"),
            ("typeof undefined;", "\"undefined\";"),
            ("Math.clz32(0);", "32;"),
            ("Math.clz32(1);", "31;"),
        ];
        for (source, expected) in cases {
            expect(source, expected);
        }
        for source in [
            "1 / 2;",
            "1 / 0;",
            "5 % 0;",
            "Math.sqrt(2);",
            "Math.pow(2, 63);",
            "Math.abs(1.5);",
        ] {
            expect_same(source);
        }
    }

    #[test]
    fn folds_strings_templates_and_mixed_addition() {
        expect("\"a\" + \"b\";", "\"ab\";");
        expect("\"a\" + 1;", "\"a1\";");
        expect("1 + \"a\";", "\"1a\";");
        expect("`a${1}b`;", "\"a1b\";");
        expect("`x${1 + 2}y`;", "\"x3y\";");
        expect("\"hi\".length;", "2;");
        expect("\"a\\nb\".length;", "3;");
        expect_same("\"hi\".toUpperCase();");
        expect_same("\"hi\".charAt(0);");
    }

    #[test]
    fn folds_logical_conditional_and_sequence() {
        expect("true && 1;", "1;");
        expect("false && missing();", "false;");
        expect("true || missing();", "true;");
        expect("false || 1;", "1;");
        expect("null ?? 1;", "1;");
        expect("undefined ?? 1;", "1;");
        expect("0 ?? 1;", "0;");
        expect("\"\" ?? 1;", "\"\";");
        expect("true ? 1 : missing();", "1;");
        expect("false ? missing() : 2;", "2;");
        expect("true && side();", "(side());");
        expect("false || side();", "(side());");
        expect("(1, 2, 3);", "3;");
        expect("(1, 2, side());", "(side());");
        expect("(1, side(), 3);", "(side(), 3);");
    }

    #[test]
    fn folds_constructors_globals_and_known_calls() {
        expect("new Array();", "[];");
        expect("Array();", "[];");
        expect("new Array(1, 2);", "[1,2];");
        expect("new Array(1, 2, 3);", "[1,2,3];");
        expect("new Object();", "");
        expect("Object();", "");
        expect("Object(null);", "");
        expect("Object(undefined);", "");
        expect("Object(void 0);", "");
        expect("new Object(null);", "");
        expect("Number();", "0;");
        expect("Number(1);", "1;");
        expect("Number(\"42\");", "42;");
        expect("Number(\"\");", "0;");
        expect("Number(true);", "1;");
        expect("Number(false);", "0;");
        expect("Number(null);", "0;");
        expect("String();", "\"\";");
        expect("String(1);", "\"1\";");
        expect("String(true);", "\"true\";");
        expect("String(null);", "\"null\";");
        expect("Boolean();", "false;");
        expect("Boolean(1);", "true;");
        expect("Boolean(0);", "false;");
        expect("Boolean(\"\");", "false;");
        expect("Boolean(\"a\");", "true;");
        expect("Math.abs(-4);", "4;");
        expect("Math.sign(-3);", "-1;");
        expect("Math.sign(0);", "0;");
        expect("Math.min(3, 1, 2);", "1;");
        expect("Math.max(3, 1);", "3;");
        expect("Math.imul(2, 3);", "6;");
        expect("Math.sqrt(9);", "3;");
        expect("Math.sqrt(0);", "0;");
        expect("Math.pow(2, 3);", "8;");
        expect("Math.pow(2, 0);", "1;");
        expect("Math.floor(4);", "4;");
        expect("Math.ceil(4);", "4;");
        expect("Math.trunc(4);", "4;");
        expect("Math.round(4);", "4;");
        expect("JSON.parse('{\"a\":1}');", "({\"a\":1});");
        expect("JSON.parse('[1,2]');", "[1,2];");
        expect("Array.isArray([]);", "true;");
        expect("Array.isArray({});", "false;");
        expect("Array.isArray(1);", "false;");
        expect("Array.isArray(\"a\");", "false;");
        expect("Array.isArray(null);", "false;");
        expect("Array.isArray(true);", "false;");
        expect("Object.keys({ a: 1, b: 2 });", "[\"a\",\"b\"];");
        expect("Object.keys({ a: 1, b: 2, a: 3 });", "[\"a\",\"b\"];");
        expect_same("new Array(4);");
        expect_same("Array(4);");
        expect_same("Object(1);");
        expect_same("Object(false);");
        expect_same("Math.random();");
        expect_same("Number(\"x\");");
        expect_same("JSON.parse(\"not json\");");
        expect_same("JSON.parse('{\"__proto__\":1}');");
        expect_same("JSON.parse('{\"a\":{\"__proto__\":1}}');");
        expect_same("Object.keys({ a() {} });");
        expect_same("Object.keys({ ...a });");
        expect_same("Object.keys({ [name]: 1 });");
        expect_same("Object.keys({ __proto__: 1 });");
        expect_same("Object.keys({ \"__proto__\": 1 });");
    }

    #[test]
    fn folds_members_indexes_and_keeps_side_effects() {
        expect("obj[\"foo\"];", "obj.foo;");
        expect("obj?.[\"foo\"];", "obj?.foo;");
        expect("foo.bar[\"baz\"];", "foo.bar.baz;");
        expect("foo()[\"bar\"];", "foo().bar;");
        expect("new Foo[\"bar\"];", "new Foo.bar;");
        expect("(new Foo)[\"bar\"];", "(new Foo).bar;");
        expect("[1, 2, 3][0];", "1;");
        expect("[1, 2, 3][2];", "3;");
        expect("[1, , 2][1];", "void 0;");
        expect("[1, 2, 3].length;", "3;");
        expect("[].length;", "0;");
        expect("[side(), 1].length;", "(side(),2);");
        expect("[1, side()][0];", "(side(),1);");
        expect("({ a: 1 }).a;", "1;");
        expect("({ a: 1, b: 2 }).b;", "2;");
        expect("({ a: side(), b: 1 }).b;", "(side(),1);");
        expect("({ a: 1, b: side() }).a;", "(side(),1);");
        expect("({ a: side(), a: 1 }).a;", "(side(),1);");
        expect("({ a: 1 })[\"a\"];", "1;");
        expect_same("obj[\"class\"];");
        expect_same("obj[\"__proto__\"];");
        expect_same("1[\"toString\"];");
        expect_same("[1, 2][5];");
        expect_same("[...xs][0];");
        expect_same("[side(), other()][0];");
        expect_same("({ __proto__: 1 }).x;");
    }

    #[test]
    fn drops_dead_branches_and_keeps_hoisted_bindings() {
        expect("if (true) keep(); else drop();", "keep();");
        expect("if (false) drop(); else keep();", "keep();");
        expect("if (false) drop();", "");
        expect("if (true) { keep(); }", "{ keep(); }");
        expect("while (false) { work(); }", "");
        expect("for (; false;) { work(); }", "");
        expect(
            "switch (1) { case 0: a(); break; case 1: b(); break; default: c(); }",
            "{ b(); }",
        );
        expect(
            "switch (1) { case 1: a(); case 2: b(); break; default: c(); }",
            "{ a(); b(); }",
        );
        expect(
            "switch (3) { case 1: a(); break; default: b(); break; }",
            "{ b(); }",
        );
        expect("if (false) { var x = 1; }", "");
        expect(
            "console.log(x);\nif (false) { var x = 1; }",
            "console.log(x);\nvar x;",
        );
        expect_same("if (false) { function f() {} }");
        expect("if (true) keep(); else { var x = 1; }", "keep();");
        expect("if (false) { var x = 1; } else keep();", "keep();");
        expect("while (false) { var x = 1; }", "");
        expect("for (; false;) { var kept = 1; }", "");
        expect_same("for (i = 0; false;) { work(); }");
        expect("do { work(); } while (false);", "{ work(); }");
        expect("switch (1) { case 1: var x = 1; break; default: y(); }", "");
        expect_same("switch (1) { case missing(): a(); break; default: b(); }");
    }

    #[test]
    fn propagates_primitive_consts_and_stops_at_safety_edges() {
        expect("const x = 1 + 2;\nconsole.log(x);", "console.log(3);");
        expect(
            "const a = 1;\nconst b = a;\nconsole.log(b);",
            "console.log(1);",
        );
        expect("const x = 1;\nconsole.log(x ?? x);", "console.log(1);");
        expect("const x = 1;", "");
        expect("var x = 1 + 2;", "");
        expect(
            "var x = 1 + 2;\nconsole.log(x);",
            "var x = 3;\nconsole.log(x);",
        );
        expect("let x = 1 + 2;", "");
        expect(
            "function f() { var x = 1 + 2; return 1; }",
            "function f() { return 1; }",
        );
        expect(
            "function f() { let x = side(); return 1; }",
            "function f() { (side()); return 1; }",
        );
        expect_same("function f() { var x = 1; return x; }");
        expect("let x = 1;\nx = 2;", "");
        expect_same("function f() { eval(\"\"); let x = 1; }");
        expect_same("let x = 1; export { x };");
        expect(
            "export const x = 1 + 2;\nconsole.log(x);",
            "export const x = 3; console.log(3);",
        );
        expect_same("const x = 1;\nfunction f() { return x; }");
        expect_same("console.log(x);\nconst x = 1;");
        expect("const x = 1;\nconst box = { x };", "");
        expect_same("const x = 1;\nexport { x };");
        expect("const x = 1, y = 2;\nconsole.log(x);", "console.log(1);");
        expect("const x = side();", "(side());");
        expect_same("export const x = 1;");
    }

    #[test]
    fn collapses_local_nullish_checks_only() {
        expect(
            "function f(x) { return x === null || x === undefined; }",
            "function f(x) { return x==null; }",
        );
        expect(
            "function f(x) { return x === undefined || x === null; }",
            "function f(x) { return x==null; }",
        );
        expect(
            "function f(x) { return x === null || x === void 0; }",
            "function f(x) { return x==null; }",
        );
        expect(
            "function f(x) { return x !== null && x !== undefined; }",
            "function f(x) { return x!=null; }",
        );
        expect(
            "function f(x) { return x ?? x; }",
            "function f(x) { return x; }",
        );
        expect_same("function f(x) { return x === null || x === null; }");
        expect_same("function f(obj) { return obj.x === null || obj.x === undefined; }");
        expect_same("function f(g) { return g() === null || g() === undefined; }");
        expect_same("import { x } from \"./m.js\";\nexport function f() { return x === null || x === undefined; }");
    }

    #[test]
    fn refuses_shadowed_builtins_eval_and_with() {
        expect_same("function Array() { return 0; }\nnew Array(1, 2);");
        expect_same("function Math() {}\nMath.abs(-1);");
        expect_same("function JSON() {}\nJSON.parse('{\"a\":1}');");
        expect_same("function f() {\n  eval(\"\");\n  return Math.abs(-1);\n}");
        expect_same("function f() {\n  eval(\"\");\n  const x = 1;\n  return x;\n}");
        let with_source =
            "const outside = 1 + 2;\nwith (obj) { result = new Array(1, 2); }\noutside;\n";
        let got = optimized_at("sample.cjs", with_source);
        assert!(got.contains("new Array"), "{got}");
        assert!(got.contains('3'), "{got}");
        assert!(!got.contains("1 + 2"), "{got}");
    }

    #[test]
    fn keeps_cycling_until_the_optimized_program_is_stable() {
        let mut source = "unused = false;".to_string();
        for _ in 0..12 {
            source = format!("if (true) {{ {source} }}");
        }
        expect(&source, "");
        let once = optimized(&source);
        assert_eq!(optimized(&once), once, "{once}");
        let chained = "const a = 1 + 2;\nconst b = a + 3;\nconst c = b + 4;\nconsole.log(c);\n";
        expect(chained, "console.log(10);");
        assert_eq!(optimized(&optimized(chained)), optimized(chained));
    }

    #[test]
    fn is_idempotent_and_keeps_unparseable_input() {
        let sources = [
            "const x = 1 + 2;\nconsole.log(x);\n",
            "if (true) keep(); else drop();\n",
            "obj[\"foo\"];\n",
            "new Array(1, 2);\n",
            "function f(x) { return x === null || x === undefined; }\n",
            "1 / 2;\n",
            "Math.random();\n",
        ];
        for source in sources {
            let once = optimized(source);
            assert_eq!(optimized(&once), once, "{source}");
        }
        expect_same("function (");
        expect_same("");
    }

    #[test]
    fn maps_a_trailing_marker_back_to_the_original() {
        let source = "const x = 1 + 2;\nconsole.log(x);\nvar MARKER = 1;\nMARKER;\n";
        let mut allocator = Allocator::default();
        let (out, map) = optimize_source(&mut allocator, Path::new("sample.js"), source);
        let generated = out.find("MARKER").expect(&out) as u32;
        let original = source.find("MARKER").unwrap() as u32;
        assert_eq!(map.map(generated), original, "{out}");
    }

    #[test]
    fn folds_remaining_numeric_and_operator_outcomes() {
        let cases = [
            ("(1 + 2);", "3;"),
            ("((4 * 5));", "20;"),
            ("5 % -2;", "1;"),
            ("(-5) % -2;", "-1;"),
            ("1 << 31;", "-2147483648;"),
            ("1 << 32;", "1;"),
            ("(-1) >>> 0;", "4294967295;"),
            ("(-8) >> 1;", "-4;"),
            ("Math.imul(-2, 3);", "-6;"),
            ("Math.clz32(-1);", "0;"),
            ("Math.abs(0);", "0;"),
            ("Math.min(1);", "1;"),
            ("Math.max(-2);", "-2;"),
            ("Math.pow(0, 0);", "1;"),
            ("Math.pow(-2, 3);", "-8;"),
            ("Math.sqrt(1);", "1;"),
            ("Math.sqrt(100);", "10;"),
            ("Math.abs(Math.min(-2, -8));", "8;"),
            ("\"\" + 1;", "\"1\";"),
            ("null + \"a\";", "\"nulla\";"),
            ("undefined + \"a\";", "\"undefineda\";"),
            ("true + \"a\";", "\"truea\";"),
            ("false + \"a\";", "\"falsea\";"),
            ("\"a\" + null;", "\"anull\";"),
            ("\"a\" + undefined;", "\"aundefined\";"),
            ("\"a\" + false;", "\"afalse\";"),
            ("\"a\" + true;", "\"atrue\";"),
            ("(-7) / 2;", "-7 / 2;"),
            ("1 == 1;", "true;"),
            ("1 != 2;", "true;"),
            ("true + 1;", "2;"),
            ("true + true;", "2;"),
            ("null + 1;", "1;"),
            ("false + 4;", "4;"),
            ("\"6\" / 2;", "3;"),
            ("1 < \"2\";", "true;"),
            ("true > false;", "true;"),
            ("1 == \"1\";", "true;"),
            ("null == undefined;", "true;"),
            ("null == 0;", "false;"),
            ("true == 1;", "true;"),
            ("false == \"\";", "true;"),
            ("\"2\" != 2;", "false;"),
        ];
        for (source, expected) in cases {
            expect(source, expected);
        }
        for source in [
            "\"a\" instanceof String;",
            "\"a\" in obj;",
            "Math.pow(2, -1);",
            "Math.sqrt(-1);",
            "Math.abs();",
            "Math.min();",
            "Math.max();",
            "Math.floor();",
            "delete obj.a;",
            "obj.a = 1;",
            "obj.a++;",
            "void side();",
            "/a/;",
        ] {
            expect_same(source);
        }
    }

    #[test]
    fn folds_remaining_string_template_and_global_outcomes() {
        expect("`hi`;", "\"hi\";");
        expect("``;", "\"\";");
        expect("\"a\" + true;", "\"atrue\";");
        expect("\"é\".length;", "1;");
        expect("\"use strict\"; 1 + 2;", "\"use strict\"; 3;");
        expect("/*keep*/ 1 + 2;", "/*keep*/ 3;");
        expect("1 + /*c*/ 2;", "3;");
        expect("new Array(1, side());", "[1,side()];");
        expect("new Object(undefined);", "");
        expect("Number(\"  12\");", "12;");
        expect("Number(\"+7\");", "7;");
        expect("Number(\"-4\");", "-4;");
        expect("Number(\" \");", "0;");
        expect("String(undefined);", "\"undefined\";");
        expect("String(false);", "\"false\";");
        expect("Boolean(null);", "false;");
        expect("Boolean(undefined);", "false;");
        expect("Boolean(\"0\");", "true;");
        expect("Boolean(\" \");", "true;");
        expect("JSON.parse(' { \"a\" : 1 } ');", "({\"a\":1});");
        expect("JSON.parse('[]');", "[];");
        expect("JSON.parse('null');", "null;");
        expect("JSON.parse('true');", "true;");
        expect("JSON.parse('\"hi\"');", "\"hi\";");
        expect("JSON.parse('[1,{\"b\":2}]');", "[1,{\"b\":2}];");
        expect("JSON.parse('{\"a\":[1,2]}');", "({\"a\":[1,2]});");
        expect("Object.keys({});", "[];");
        expect("Object.keys({ \"b\": 1, a: 2 });", "[\"b\",\"a\"];");
        expect_same("`a${side()}b`;");
        expect_same("'hi';");
        expect_same("new Array(...xs);");
        expect_same("Object(0);");
        expect_same("Number(undefined);");
        expect_same("Number(1, 2);");
        expect_same("String(1, 2);");
        expect_same("Boolean(1, 2);");
        expect_same("Array?.();");
        expect_same("Math?.abs(-1);");
        expect_same("JSON.parse('{\"a\":1}', extra);");
        expect_same("JSON.parse(side());");
        expect_same("Array.isArray(side());");
        expect_same("Array.isArray(void 0);");
        expect_same("Object.keys({ get a() { return 1 } });");
        expect_same("Object.keys({ 1: 2 });");
        expect_same("function f(undefined) { return Number(undefined); }");
    }

    #[test]
    fn folds_remaining_logic_and_branch_outcomes() {
        expect("0 && missing();", "0;");
        expect("\"\" && missing();", "\"\";");
        expect("null && missing();", "null;");
        expect("undefined && 1;", "void 0;");
        expect("\"x\" || missing();", "\"x\";");
        expect("0 || \"z\";", "\"z\";");
        expect("\"\" || 0;", "0;");
        expect("null ?? undefined ?? 4;", "4;");
        expect("0 ?? missing();", "0;");
        expect("null ?? side();", "(side());");
        expect("false ? 1 : 2;", "2;");
        expect("true ? side() : 0;", "(side());");
        expect("!1 ? missing() : 2;", "2;");
        expect("if (!1) drop(); else keep();", "keep();");
        expect("if (!0) keep(); else drop();", "keep();");
        expect("if (!\"\") keep(); else drop();", "keep();");
        expect("if (false) { let x = 1; }", "");
        expect("if (false) { const x = 1; }", "");
        expect("if (false) { class C {} }", "");
        expect("if (false) { (function () { var x = 1; }); }", "");
        expect("while (false);", "");
        expect("for (; false; bump()) { work(); }", "");
        expect(
            "switch (\"a\") { case \"b\": a(); break; case \"a\": b(); break; }",
            "{ b(); }",
        );
        expect(
            "switch (true) { case false: a(); break; default: b(); }",
            "{ b(); }",
        );
        expect("switch (1) { default: a(); b(); }", "{ a(); b(); }");
        expect("switch (1) { case 1: break; }", "");
        expect(
            "if (true) keep(); else if (false) drop(); else other();",
            "keep();",
        );
        expect("if (0) drop();", "");
        expect("if (\"\") drop();", "");
        expect("if (null) drop();", "");
        expect("if (undefined) drop();", "");
        expect("if (1) keep(); else drop();", "keep();");
        expect("if (\"a\") keep(); else drop();", "keep();");
        expect("if (side()) {}", "(side());");
        expect("if (side()) {} else {}", "(side());");
        expect("if (side()) a(); else a();", "(side());\na();");
        expect("flag ? true : false;", "!!flag;");
        expect("flag ? false : true;", "!flag;");
        expect("1 ? side() : missing();", "(side());");
        expect("0 ? missing() : side();", "(side());");
        expect("if (false) { { var x = 1; } }", "");
        expect(
            "let unused = false;\nif (false) {\n  var hoisted = 1;\n  unused = mark(\"if\");\n} else if (!0) {\n  unused = false;\n}",
            "",
        );
        expect("if (true) {\n  unused = false;\n}", "");
        expect("if (true) {\n  unused = side();\n}", "{\n  (side());\n}");
        expect(
            "if (true) {\n  unused = false;\n}\nconsole.log(unused);",
            "{\n  unused = false;\n}\nconsole.log(unused);",
        );
        expect_same("obj.unused = false;");
        expect_same("unused = unused;");
        expect_same("with (obj) { unused = false; }");
        expect(
            "let value = 1;\nvalue = 2;\nconsole.log(value);",
            "let value = 1;\nvalue = 2;\nconsole.log(value);",
        );
        let module_fold = optimized_at(
            "sample.mjs",
            "if (false) {\n  var hoisted = 1;\n  unused = mark(\"if\");\n} else if (!0) {\n  unused = false;\n}",
        );
        assert_eq!(squash(&module_fold), "", "optimized:\n{module_fold}");
        assert_eq!(optimized_at("sample.mjs", &module_fold), module_fold);
        expect_same("while (true) work();");
        expect("while (0) work();", "");
        expect("while (\"\") work();", "");
        expect("for (; null;) work();", "");
        expect_same("while (1) work();");
        expect("do { work(); } while (0);", "{ work(); }");
        expect_same("do { break; } while (false);");
        expect_same("do { work(); } while (true);");
        expect_same("for (;;) work();");
        expect_same("switch (1) { case 2: a(); break; }");
    }

    #[test]
    fn folds_remaining_member_and_literal_outcomes() {
        expect("([1, 2, 3])[1];", "2;");
        expect("[\"a\", \"b\"][\"1\"];", "\"b\";");
        expect("[1, , 2].length;", "3;");
        expect("[1, side(), 2][2];", "(side(),2);");
        expect("[side()][0];", "(side());");
        expect("({ \"b\": 2 }).b;", "2;");
        expect(
            "({ a: 1, b: side(), c: other() }).a;",
            "(side(),other(),1);",
        );
        expect("(new Foo())[\"bar\"];", "(new Foo()).bar;");
        expect_same("({ a: side(), b: other() }).a;");
        expect_same("({ a: 1 }).missing;");
        expect_same("obj[\"if\"];");
        expect_same("obj[\"await\"];");
        expect_same("obj[\"default\"];");
        expect_same("obj[\"let\"];");
        expect_same("obj[\"\"];");
        expect_same("obj[\"0\"];");
        expect_same("obj[\"foo bar\"];");
        expect_same("({ get a() { return 1 } }).a;");
        expect_same("({ a() { return 1 } }).a;");
        expect_same("({ ...a, b: 1 }).b;");
        expect_same("({ [name]: 1 }).x;");
        expect_same("foo?.bar;");
        expect_same("[1, 2][0.5];");
        expect_same("[1, 2][-1];");
        expect_same("[1, 2][\"a\"];");
    }

    #[test]
    fn folds_remaining_const_and_nullish_outcomes() {
        expect("const x = 2;\nconsole.log(x, x);", "console.log(2, 2);");
        expect(
            "const s = \"ab\";\nconsole.log(s.length);",
            "console.log(2);",
        );
        expect(
            "const x = 1;\nconsole.log(`a${x}`);",
            "console.log(\"a1\");",
        );
        expect("const x = 1;\n{ console.log(x); }", "{ console.log(1); }");
        expect(
            "const x = 1;\n{ const x = 2; console.log(x); }\nconsole.log(x);",
            "{ console.log(2); } console.log(1);",
        );
        expect(
            "const x = 1;\nconsole.log(x);\nfunction f() { return x; }",
            "const x = 1; console.log(1); function f() { return x; }",
        );
        expect(
            "const x = \"a\" + \"b\";\nconsole.log(x);",
            "console.log(\"ab\");",
        );
        expect("const x = true;\nconsole.log(x);", "console.log(true);");
        expect("const x = null;\nconsole.log(x);", "console.log(null);");
        expect(
            "const x = undefined;\nconsole.log(x);",
            "console.log(void 0);",
        );
        expect("const x = void 0;\nconsole.log(x);", "console.log(void 0);");
        expect(
            "const x = 1 + 2;\nconst y = x * 4;\nconsole.log(y);",
            "console.log(12);",
        );
        expect(
            "function f(x) { return null === x || undefined === x; }",
            "function f(x) { return x==null; }",
        );
        expect(
            "function f(x) { return undefined !== x && null !== x; }",
            "function f(x) { return x!=null; }",
        );
        expect(
            "function f(x) { return (x === null) || (x === undefined); }",
            "function f(x) { return x==null; }",
        );
        expect(
            "function f(x) { return x !== undefined && x !== null; }",
            "function f(x) { return x!=null; }",
        );
        expect("const x = 1;\nconst f = () => x;", "");
        expect_same("let x = 1;\nconsole.log(x);");
        expect_same("var x = 1;\nconsole.log(x);");
        expect_same("function f(x, y) { return x === null || y === undefined; }");
        expect_same("function f(x) { return x == null || x === undefined; }");
        expect(
            "function f(undefined) { return undefined === null || undefined === void 0; }",
            "function f(undefined) { return undefined==null; }",
        );
        expect_same("function f(x, undefined) { return x === null || x === undefined; }");
        expect_same("function f(x) { eval(\"\"); return x === null || x === undefined; }");
        expect_same("function f(x, y) { return x ?? y; }");
        expect_same("x ?? x;");
    }

    #[test]
    fn keeps_outer_folds_when_an_inner_scope_is_unsafe() {
        let mixed = "const n = 1 + 2;\nfunction f() { eval(\"\"); return Math.abs(-1); }\nn;\n";
        let got = optimized(mixed);
        assert!(got.contains("3"), "{got}");
        assert!(got.contains("Math.abs"), "{got}");
        assert!(!got.contains("1 + 2"), "{got}");

        let module_with = "const outside = 1 + 2;\nwith (obj) { result = 1; }\n";
        assert_eq!(optimized_at("sample.mjs", module_with), module_with);
    }

    #[test]
    fn folds_pure_calls_to_their_values() {
        expect(
            "function add(a, b) { return a + b; }\nconsole.log(add(40, 2));",
            "console.log(42);",
        );
        expect(
            "const add = (a, b) => a + b;\nconsole.log(add(40, 2));",
            "console.log(42);",
        );
        expect(
            "const add = function (a, b) { return a + b; };\nconsole.log(add(40, 2));",
            "console.log(42);",
        );
        expect(
            "function add(a, b) { return a + b; }\nfunction twice(n) { return add(n, n); }\nconsole.log(twice(21));",
            "console.log(42);",
        );
        expect(
            "function sum(n) { return n < 1 ? 0 : n + sum(n - 1); }\nconsole.log(sum(4));",
            "console.log(10);",
        );
        expect(
            "function fact(n) { return n < 2 ? 1 : n * fact(n - 1); }\nconsole.log(fact(5));",
            "console.log(120);",
        );
        expect(
            "function hi(name) { return `Hi ${name}`; }\nconsole.log(hi(\"Ada\"));",
            "console.log(\"Hi Ada\");",
        );
        expect(
            "function id(a) { return a; }\nconsole.log(id());",
            "console.log(void 0);",
        );
        expect(
            "function id(a) { return a; }\nconsole.log(id(1, 2 + 3));",
            "console.log(1);",
        );
        expect(
            "function empty() { return; }\nconsole.log(empty());",
            "console.log(void 0);",
        );
        expect(
            "function empty() {}\nconsole.log(empty());",
            "console.log(void 0);",
        );
        expect(
            "function add(a, b) { return a + b; }\nconst f = add;\nconsole.log(add(40, 2));",
            "function add(a, b) { return a + b; }\nconsole.log(42);",
        );
        expect(
            "function add(a, b) { return a + b; }\nconst f = add;\nconsole.log(f);",
            "function add(a, b) { return a + b; }\nconst f = add;\nconsole.log(f);",
        );
        expect_same("console.log(add(40, 2));\nconst add = (a, b) => a + b;\n");
        expect_same("function add(a, b) { return a + b; }\nconsole.log(add(side(), 2));");
        expect_same("function id(a) { return a; }\nconsole.log(id(1, side()));");
        expect_same("function add(a, b) { return a + b; }\nadd = other;\nconsole.log(add(40, 2));");
        expect_same("function f() { return side(); }\nconsole.log(f());");
        expect_same("function f() { return this; }\nconsole.log(f());");
        expect_same("function f() { return arguments; }\nconsole.log(f());");
        expect_same("function f(a = 1) { return a; }\nconsole.log(f(2));");
        expect_same("function f(...a) { return a; }\nconsole.log(f(1));");
        expect_same("async function f(a) { return a; }\nconsole.log(f(1));");
        expect_same("function* f(a) { return a; }\nconsole.log(f(1));");
        expect(
            "function f(a) { const b = 1; return a + b; }\nconsole.log(f(1));",
            "console.log(2);",
        );
        expect_same("const n = 1;\nfunction f() { return n; }\nconsole.log(f());");
        expect_same("function f(a) { eval(\"\"); return a; }\nconsole.log(f(1));");
        expect(
            "function f() {\n  return 1;\n  side();\n  var x = 2;\n}\n",
            "function f() {\n  return 1;\n}",
        );
        expect(
            "function f() {\n  if (true) return 1;\n  side();\n}\n",
            "function f() {\n  return 1;\n}",
        );
        expect(
            "function f(x) {\n  if (x) return 1;\n  else return 2;\n  side();\n}\n",
            "function f(x) {\n  if (x) return 1;\n  else return 2;\n}",
        );
        expect(
            "function f() {\n  throw 1;\n  side();\n}\n",
            "function f() {\n  throw 1;\n}",
        );
        expect(
            "function f() {\n  return 1;\n  function g() { return 2; }\n}\n",
            "function f() {\n  return 1;\n}",
        );
        let exported = "export function add(a, b) { return a + b; }\nconsole.log(add(40, 2));\n";
        let got = optimized_at("sample.mjs", exported);
        assert!(got.contains("function add"), "{got}");
        assert!(got.contains("42"), "{got}");
        assert!(!got.contains("40"), "{got}");
        assert_eq!(optimized_at("sample.mjs", &got), got);

        let kept =
            "function add(a, b) { return a + b; }\nexport { add };\nconsole.log(add(40, 2));\n";
        let got = optimized_at("sample.mjs", kept);
        assert!(got.contains("function add"), "{got}");
        assert!(got.contains("42"), "{got}");
        assert_eq!(optimized_at("sample.mjs", &got), got);
    }

    #[test]
    fn turns_inline_functions_into_arrows() {
        expect(
            "console.log([1, 2].map(function (n) { return n + 1; }));",
            "console.log([1, 2].map((n) => { return n + 1; }));",
        );
        expect(
            "console.log((function (n) { return n + 1; })(1));",
            "console.log(((n) => { return n + 1; })(1));",
        );
        expect(
            "console.log(async function (n) { return n; });",
            "console.log(async (n) => { return n; });",
        );
        expect(
            "console.log(void async function (n) { return n; });",
            "console.log(void (async (n) => { return n; }));",
        );
        expect(
            "console.log(void function (n) { return n; });",
            "console.log(void ((n) => { return n; }));",
        );
        expect_same("function declared(n) { return n + 1; }\nconsole.log(declared);\n");
        expect_same("const add = function (a, b) { return a + b; };\nconsole.log(add);\n");
        expect_same("{\n  function inner(n) { return n + 1; }\n  console.log(inner);\n}\n");
        expect_same("console.log(function step(n) { return n < 1 ? n : step(n - 1); });\n");
        expect_same("console.log(function () { return this; });\n");
        expect_same("console.log(function () { return arguments[0]; });\n");
        expect_same("console.log(function* () { yield 1; });\n");
        expect_same("new function () { return 1; };\n");
        expect_same("console.log(function () { return 1; }.prototype);\n");
        expect(
            "console.log(function () { leaked = 1; });",
            "console.log(() => { });",
        );
        expect_same("console.log(function () {\n  leaked = 1;\n  return leaked;\n});\n");
        expect_same("console.log(function (a, a) { return a; });\n");
        expect_same("console.log(function () { return 01; });\n");
    }

    #[test]
    fn folds_shapes_past_constant_values() {
        expect("!!!flag;", "!flag;");
        expect("!!!!flag;", "!!flag;");
        expect("!(a === b);", "a !== b;");
        expect("!(a !== b);", "a === b;");
        expect("!(a == b);", "a != b;");
        expect("!!(a === b);", "a === b;");
        expect("void void side();", "void (side());");
        expect("typeof typeof side();", "(side(),\"string\");");
        expect("typeof function () { return 1; };", "\"function\";");
        expect("typeof (() => 1);", "\"function\";");
        expect("typeof [];", "\"object\";");
        expect("typeof [side()];", "(side(),\"object\");");
        expect("typeof ({ a: side() });", "(side(),\"object\");");
        expect("flag ? 1 : 1;", "(flag, 1);");
        expect(
            "function f(name) { return name && name; }",
            "function f(name) { return name; }",
        );
        expect(
            "function f(name) { return name || name; }",
            "function f(name) { return name; }",
        );
        expect(
            "function f(name) { return name ?? name; }",
            "function f(name) { return name; }",
        );
        expect(
            "function f(name, other) { return name ? name : other; }",
            "function f(name, other) { return name || other; }",
        );
        expect(
            "function f(name, other) { return name ? other : name; }",
            "function f(name, other) { return name && other; }",
        );
        expect_same("(side(), 1);");
        expect("(1, side(), 2);", "(side(), 2);");
        expect("(1, side(), other());", "(side(), other());");
        expect("while ((side(), false)) work();", "side();");
        expect(
            "if ((side(), false)) drop(); else keep();",
            "side();\nkeep();",
        );
        expect(
            "if ((side(), true)) keep(); else drop();",
            "side();\nkeep();",
        );
        expect(
            "do { work(); } while ((side(), false));",
            "{ work(); }\nside();",
        );
        expect("for (let i = 0; i < 0; i = i + 1) work();", "");
        expect(
            "for (var i = 2; i < 1; i = i + 1) {}\nconsole.log(i);",
            "var i = 2;\nconsole.log(i);",
        );
        expect("for (let i = side(); false;) work();", "side();");
        expect("if (false) a(); else if (false) b(); else c();", "c();");
        expect("Math.hypot(3, 4);", "5;");
        expect("Math.hypot(-3, 4);", "5;");
        expect("Number.isFinite(8);", "true;");
        expect("Number.isInteger(8);", "true;");
        expect("Number.isSafeInteger(8);", "true;");
        expect("Number.isInteger(\"8\");", "false;");
        expect("Number.isNaN(1);", "false;");
        expect(
            "console.log('is number?', Number.isNaN(1));",
            "console.log('is number?', false);",
        );
        expect(
            "console.log('is number?', Number.isNaN(1));\nfunction guarded(value) {\n  eval(\"value = value + 1\");\n  return value + Math.abs(-1);\n}\n",
            "console.log('is number?', false);\nfunction guarded(value) {\n  eval(\"value = value + 1\");\n  return value + Math.abs(-1);\n}\n",
        );
        expect("Number.isNaN(\"x\");", "false;");
        expect("Object.is(1, 1);", "true;");
        expect("Object.is(1, \"1\");", "false;");
        expect("Object.is(null, undefined);", "false;");
        expect("Array.of(1, 2, 3);", "[1,2,3];");
        expect("Array.of();", "[];");
        expect("Array.of(side());", "[side()];");
        expect("String.fromCharCode(65, 66);", "\"AB\";");
        expect("JSON.stringify(1);", "\"1\";");
        expect("JSON.stringify(\"a\");", "\"\\\"a\\\"\";");
        expect("JSON.stringify({ a: 1 });", "\"{\\\"a\\\":1}\";");
        expect("JSON.stringify([1, 2]);", "\"[1,2]\";");
        expect("JSON.stringify(undefined);", "void 0;");
        expect("parseInt(\"42\", 10);", "42;");
        expect("parseFloat(\"42\");", "42;");
        expect("Number.parseInt(\"7\", 10);", "7;");
        expect("isNaN(undefined);", "true;");
        expect("isNaN(1);", "false;");
        expect("isFinite(null);", "true;");
        expect("isFinite(undefined);", "false;");
        expect("encodeURIComponent(\"Ab1\");", "\"Ab1\";");
        expect("decodeURIComponent(\"Ab 1\");", "\"Ab 1\";");
        expect("~~4;", "4;");
        expect_same("!(a < b);");
        expect_same("side() && side();");
        expect_same("side() - side();");
        expect_same("\"abc\".slice(1);");
        expect_same("parseInt(\"42px\", 10);");
        expect_same("decodeURIComponent(\"a%\");");
        expect_same("x + 0;");
        expect_same("Math.hypot(1, 1);");
        expect_same("Math.random();");
    }

    #[test]
    fn covers_each_optimizer_reduction() {
        expect("1 + 2 * 3;", "7;");
        expect("\"a\" + \"b\";", "\"ab\";");
        expect("!0;", "true;");
        expect("!!0;", "false;");
        expect("void 1;", "void 0;");
        expect("typeof 1;", "\"number\";");
        expect("1 === 1;", "true;");
        expect("1 !== 2;", "true;");
        expect("1 < 2 && 3;", "3;");
        expect("0 || 4;", "4;");
        expect("null ?? 5;", "5;");
        expect("true ? 1 : missing();", "1;");
        expect("false ? missing() : 2;", "2;");
        expect("(1, 2);", "2;");
        expect("Math.abs(-3);", "3;");
        expect("[1, 2][0];", "1;");
        expect("({ a: 1 }).a;", "1;");
        expect("if (false) drop(); else keep();", "keep();");
        expect("while (false) work();", "");
        expect("for (; false;) work();", "");
        expect(
            "switch (1) { case 1: a(); break; default: b(); }",
            "{ a(); }",
        );
        expect("const x = 1;\nconsole.log(x);", "console.log(1);");
        expect("let unused = 1;", "");
        expect("if (false) { var hoisted = 1; }", "");
        expect("\"use strict\";\n1 + 2;", "\"use strict\";\n3;");
        expect(
            "function add(a, b) { return a + b; }\nconsole.log(add(40, 2));",
            "console.log(42);",
        );
        expect("if (0) drop(); else keep();", "keep();");
        expect("do { work(); } while (false);", "{ work(); }");
        expect("1 == \"1\";", "true;");
        expect("flag ? true : false;", "!!flag;");
        expect("if (side()) {}", "(side());");
        expect("true + 1;", "2;");
        expect_same("1 + side();");
        expect_same("side() + 1;");
        expect_same("Math.random();");
        expect_same("\"abc\".slice(1);");
        expect_same("with (obj) { x = 1; }");
    }

    #[test]
    fn maps_a_marker_between_two_rewrites() {
        let source = "1 + 2;\nvar MARKER = 1;\n3 + 4;\nMARKER;\n";
        let mut allocator = Allocator::default();
        let (out, map) = optimize_source(&mut allocator, Path::new("sample.js"), source);
        assert_eq!(squash(&out), "3; var MARKER = 1; 7; MARKER;");
        let generated = out.find("MARKER").expect(&out) as u32;
        let original = source.find("MARKER").unwrap() as u32;
        assert_eq!(map.map(generated), original, "{out}");
    }
}
