use std::collections::hash_map::Entry;
use std::collections::{HashMap, HashSet};

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    BindingIdentifier, BindingPattern, Declaration, ExportDefaultDeclarationKind, Expression,
    Function, IdentifierReference, Program, Statement, VariableDeclaration,
    VariableDeclarationKind, VariableDeclarator,
};
use oxc_ast::builder::AstBuilder;
use oxc_ast_visit::walk::walk_expression;
use oxc_ast_visit::walk_mut::{
    walk_arrow_function_expression, walk_expression as walk_expression_mut, walk_function,
    walk_statement,
};
use oxc_ast_visit::{Visit, VisitMut};
use oxc_codegen::{Codegen, CodegenOptions};
use oxc_mangler::MangleOptions;
use oxc_minifier::{CompressOptions, Minifier, MinifierOptions};
use oxc_parser::Parser;
use oxc_semantic::{ScopeFlags, ScopeId, Scoping, SymbolId};
use oxc_span::{SourceType, SPAN};
use oxc_str::{CompactStr, Ident, Str};

use crate::error::{BundleError, BundleResult};

#[path = "minify_fold.rs"]
mod minify_fold;
#[path = "minify_glsl.rs"]
mod minify_glsl;

pub struct Minified {
    pub code: String,
    pub map: Option<String>,
}

/// Calls whose results can be dropped when unused. Arguments that themselves
/// have side effects are kept. `Math.random` is omitted so an unused call still
/// advances the generator.
const PURE_BUILTINS: &[&str] = &[
    "Array.isArray",
    "Object.is",
    "Number.isFinite",
    "Number.isInteger",
    "Number.isNaN",
    "Number.isSafeInteger",
    "Math.abs",
    "Math.acos",
    "Math.acosh",
    "Math.asin",
    "Math.asinh",
    "Math.atan",
    "Math.atan2",
    "Math.atanh",
    "Math.cbrt",
    "Math.ceil",
    "Math.clz32",
    "Math.cos",
    "Math.cosh",
    "Math.exp",
    "Math.expm1",
    "Math.floor",
    "Math.fround",
    "Math.hypot",
    "Math.imul",
    "Math.log",
    "Math.log10",
    "Math.log1p",
    "Math.log2",
    "Math.max",
    "Math.min",
    "Math.pow",
    "Math.round",
    "Math.sign",
    "Math.sin",
    "Math.sinh",
    "Math.sqrt",
    "Math.tan",
    "Math.tanh",
    "Math.trunc",
];

/// Fold literals, then compress and mangle a bundle and print it without whitespace.
///
/// Before compression, literal `JSON.parse` calls, array and string methods,
/// object reads, templates, and safe integer arithmetic are folded. The
/// compressor then removes unused bindings and `debugger` statements and treats
/// the pure builtins above as side-effect free. `module` and `exports` stay
/// unmangled so a CommonJS `module.exports` assignment is still visible to
/// Node. After compression, an ES module's `var` bindings become `const` or
/// `let` when that keeps the same scope and initialization. Shader source nested
/// in strings, including Three.js chunks, is minified too. Long strings that
/// occur several times are stored once.
pub fn minify(source: &str, esm: bool, sourcemap_file: Option<&str>) -> BundleResult<Minified> {
    let allocator = Allocator::default();
    let source_type = if esm {
        SourceType::mjs()
    } else {
        SourceType::cjs()
    };
    let parsed = Parser::new(&allocator, source, source_type).parse();
    if parsed.fatal_error || parsed.diagnostics.has_errors() {
        let message = parsed
            .diagnostics
            .errors()
            .map(|diagnostic| diagnostic.to_string())
            .collect::<Vec<_>>()
            .join("; ");
        return Err(BundleError::new(format!(
            "minifier could not parse the bundle: {message}"
        )));
    }

    let mut program = parsed.program;
    minify_fold::fold_literals(&allocator, &mut program);
    let minified = Minifier::new(minifier_options()).minify(&allocator, &mut program);
    if esm {
        if let Some(scoping) = &minified.scoping {
            prefer_lexical_declarations(&mut program, scoping);
        }
    }
    minify_glsl::minify_shaders(&allocator, &mut program);
    pool_strings(&allocator, &mut program, esm);
    let mut options = CodegenOptions::minify();
    if let Some(file) = sourcemap_file {
        options.source_map_path = Some(std::path::PathBuf::from(file));
    }
    let printed = Codegen::new()
        .with_options(options)
        .with_scoping(minified.scoping)
        .build(&program);
    let map = printed.map.map(|map| map.to_json_string());
    Ok(Minified {
        code: printed.code,
        map,
    })
}

fn minifier_options() -> MinifierOptions {
    let mut compress = CompressOptions::smallest();
    compress.drop_console = false;
    compress.treeshake.manual_pure_functions = PURE_BUILTINS
        .iter()
        .map(|name| (*name).to_string())
        .collect();
    let mut mangle = MangleOptions {
        top_level: Some(true),
        ..MangleOptions::default()
    };
    mangle.reserved.insert(CompactStr::new("module"));
    mangle.reserved.insert(CompactStr::new("exports"));
    MinifierOptions {
        mangle: Some(mangle),
        mangle_properties: None,
        compress: Some(compress),
    }
}

/// A repeated literal is worth a shared binding when the copies cost more than
/// one declaration plus a short name at each use.
fn worth_pooling(len: usize, count: usize, name_len: usize) -> bool {
    if count < 2 || len < 8 {
        return false;
    }
    let literal = len + 2;
    if name_len >= literal {
        return false;
    }
    let per_use = literal - name_len;
    // `var name="…";` is 8 characters around the name and text. The `+ 7` margin
    // covers the two extra characters when an ES module prints `const` instead.
    let declaration = 8 + name_len + len;
    per_use * count > declaration + 7
}

fn pool_strings<'a>(allocator: &'a Allocator, program: &mut Program<'a>, esm: bool) {
    let mut survey = Survey::default();
    survey.visit_program(program);
    let mut next = 0usize;
    let mut taken = survey.names;
    let mut pooled = Vec::new();
    for value in survey.order {
        let count = survey.counts[&value] as usize;
        loop {
            if next > 10_000 {
                break;
            }
            let name = format!("__s{next}");
            next += 1;
            if taken.contains(&name) {
                continue;
            }
            if !worth_pooling(value.len(), count, name.len()) {
                break;
            }
            taken.insert(name.clone());
            pooled.push((value, name));
            break;
        }
    }
    if pooled.is_empty() {
        return;
    }
    let builder = AstBuilder::new(allocator);
    let mut names = HashMap::new();
    for (value, name) in &pooled {
        names.insert(value.clone(), name.clone());
    }
    let mut replace = ReplaceStrings {
        builder: &builder,
        names: &names,
    };
    replace.visit_program(program);
    let kind = if esm {
        VariableDeclarationKind::Const
    } else {
        VariableDeclarationKind::Var
    };
    let statement = pool_declaration(&builder, &pooled, kind);
    let index = program
        .body
        .iter()
        .position(|statement| !matches!(statement, Statement::ImportDeclaration(_)))
        .unwrap_or(program.body.len());
    program.body.insert(index, statement);
}

fn pool_declaration<'a>(
    builder: &AstBuilder<'a>,
    pooled: &[(String, String)],
    kind: VariableDeclarationKind,
) -> Statement<'a> {
    let mut declarators = oxc_allocator::Vec::new_in(builder);
    for (value, name) in pooled {
        let id = BindingPattern::new_binding_identifier(
            SPAN,
            Ident::from_str_in(name, builder),
            builder,
        );
        let init =
            Expression::new_string_literal(SPAN, Str::from_str_in(value, builder), None, builder);
        declarators.push(VariableDeclarator::new(
            SPAN,
            id,
            None,
            Some(init),
            false,
            builder,
        ));
    }
    Statement::new_variable_declaration(SPAN, kind, declarators, false, builder)
}

/// `var` is function scoped and hoisted. In an ES module those bindings can be
/// `const` or `let` when every declaration is a direct statement of the program
/// or a function body, nothing reads them before initialization, and `eval`
/// cannot reach them. Loop heads and nested blocks stay `var`.
pub(crate) fn prefer_lexical_declarations(program: &mut Program<'_>, scoping: &Scoping) {
    let mut rewriter = LexicalRewriter {
        scoping,
        scopes: Vec::new(),
    };
    rewriter.visit_program(program);
}

struct LexicalRewriter<'a> {
    scoping: &'a Scoping,
    scopes: Vec<Option<ScopeId>>,
}

impl<'a> VisitMut<'a> for LexicalRewriter<'_> {
    fn visit_program(&mut self, program: &mut Program<'a>) {
        self.scopes.push(program.scope_id.get());
        self.rewrite_statements(&mut program.body);
        self.scopes.pop();
    }

    fn visit_function(&mut self, func: &mut Function<'a>, flags: ScopeFlags) {
        self.scopes.push(func.scope_id.get());
        walk_function(self, func, flags);
        self.scopes.pop();
    }

    fn visit_arrow_function_expression(
        &mut self,
        arrow: &mut oxc_ast::ast::ArrowFunctionExpression<'a>,
    ) {
        self.scopes.push(arrow.scope_id.get());
        walk_arrow_function_expression(self, arrow);
        self.scopes.pop();
    }

    fn visit_function_body(&mut self, body: &mut oxc_ast::ast::FunctionBody<'a>) {
        self.rewrite_statements(&mut body.statements);
    }
}

impl LexicalRewriter<'_> {
    fn rewrite_statements<'a>(&mut self, statements: &mut oxc_allocator::Vec<'a, Statement<'a>>) {
        let scope_id = self.scopes.last().copied().flatten();
        let tainted = scope_id.is_none_or(|id| self.scoping.scope_flags(id).contains_direct_eval());
        if !tainted {
            let hoisted = hoisted_functions(statements, self.scoping);
            let kinds: Vec<Option<VariableDeclarationKind>> = statements
                .iter()
                .enumerate()
                .map(|(index, statement)| {
                    lexical_kind(statement, &statements[..index], &hoisted, self.scoping)
                })
                .collect();
            for (statement, kind) in statements.iter_mut().zip(kinds) {
                if let Some(kind) = kind {
                    set_declaration_kind(statement, kind);
                }
            }
        }
        for statement in statements.iter_mut() {
            walk_statement(self, statement);
        }
    }
}

struct HoistedFn {
    symbol: SymbolId,
    refs: Vec<SymbolId>,
}

fn hoisted_functions(statements: &[Statement<'_>], scoping: &Scoping) -> Vec<HoistedFn> {
    let mut functions = Vec::new();
    for statement in statements {
        let Some(func) = hoisted_function(statement) else {
            continue;
        };
        let Some(id) = func.id.as_ref() else {
            continue;
        };
        let Some(symbol) = id.symbol_id.get() else {
            continue;
        };
        let mut refs = RefCollector {
            scoping,
            refs: Vec::new(),
        };
        refs.visit_function(func, ScopeFlags::Function);
        functions.push(HoistedFn {
            symbol,
            refs: refs.refs,
        });
    }
    functions
}

fn hoisted_function<'a>(statement: &'a Statement<'a>) -> Option<&'a Function<'a>> {
    match statement {
        Statement::FunctionDeclaration(func) => Some(func),
        Statement::ExportDeclaration(export) => match &export.declaration {
            Declaration::FunctionDeclaration(func) => Some(func),
            _ => None,
        },
        Statement::ExportDefaultDeclaration(export) => match &export.declaration {
            ExportDefaultDeclarationKind::FunctionDeclaration(func) => Some(func),
            _ => None,
        },
        _ => None,
    }
}

fn lexical_kind(
    statement: &Statement<'_>,
    preceding: &[Statement<'_>],
    hoisted: &[HoistedFn],
    scoping: &Scoping,
) -> Option<VariableDeclarationKind> {
    let decl = variable_declaration(statement)?;
    if !decl.kind.is_var() {
        return None;
    }
    let mut symbols = Vec::new();
    let mut groups = Vec::new();
    let mut missing = false;
    let mut duplicated = false;
    let mut initialized = true;
    for declarator in &decl.declarations {
        if declarator.init.is_none() {
            initialized = false;
        }
        let mut group = Vec::new();
        declarator.id.all_binding_identifiers(&mut |id| {
            match id.symbol_id.get() {
                Some(symbol_id) => {
                    if symbols.contains(&symbol_id) {
                        duplicated = true;
                    }
                    symbols.push(symbol_id);
                    group.push(symbol_id);
                }
                None => missing = true,
            }
            true
        });
        groups.push(group);
    }
    if missing || duplicated {
        return None;
    }
    if symbols
        .iter()
        .any(|id| !scoping.symbol_redeclarations(*id).is_empty())
    {
        return None;
    }
    if groups.iter().enumerate().any(|(index, group)| {
        !group.is_empty() && read_before_init(group, index, decl, preceding, hoisted, scoping)
    }) {
        return None;
    }
    let mutated = symbols.iter().any(|id| scoping.symbol_is_mutated(*id));
    if mutated || !initialized {
        Some(VariableDeclarationKind::Let)
    } else {
        Some(VariableDeclarationKind::Const)
    }
}

/// True when `symbols` can be observed before their initializer finishes.
///
/// The dangerous window is every statement before this declaration, plus this
/// declarator and the ones before it. Hoisted functions count when something
/// in that window mentions them, because a later `function` still runs early.
fn read_before_init(
    symbols: &[SymbolId],
    declarator_index: usize,
    decl: &VariableDeclaration<'_>,
    preceding: &[Statement<'_>],
    hoisted: &[HoistedFn],
    scoping: &Scoping,
) -> bool {
    let mut interesting = symbols.to_vec();
    interesting.extend(touching_functions(hoisted, symbols));
    if mentions(preceding, &interesting, scoping) {
        return true;
    }
    let mut scan = Mention {
        scoping,
        symbols: &interesting,
        found: false,
    };
    for declarator in decl.declarations.iter().take(declarator_index + 1) {
        scan.visit_variable_declarator(declarator);
        if scan.found {
            return true;
        }
    }
    false
}

fn touching_functions(hoisted: &[HoistedFn], targets: &[SymbolId]) -> Vec<SymbolId> {
    let mut touching = HashSet::new();
    for info in hoisted {
        if info.refs.iter().any(|id| targets.contains(id)) {
            touching.insert(info.symbol);
        }
    }
    let mut grew = true;
    while grew {
        grew = false;
        for info in hoisted {
            if touching.contains(&info.symbol) {
                continue;
            }
            if info.refs.iter().any(|id| touching.contains(id)) {
                touching.insert(info.symbol);
                grew = true;
            }
        }
    }
    touching.into_iter().collect()
}

fn mentions(statements: &[Statement<'_>], symbols: &[SymbolId], scoping: &Scoping) -> bool {
    let mut scan = Mention {
        scoping,
        symbols,
        found: false,
    };
    for statement in statements {
        scan.visit_statement(statement);
        if scan.found {
            return true;
        }
    }
    false
}

struct Mention<'a> {
    scoping: &'a Scoping,
    symbols: &'a [SymbolId],
    found: bool,
}

impl<'a> Visit<'a> for Mention<'_> {
    fn visit_identifier_reference(&mut self, ident: &IdentifierReference<'a>) {
        if self.found {
            return;
        }
        let Some(reference_id) = ident.reference_id.get() else {
            return;
        };
        let Some(symbol_id) = self.scoping.get_reference(reference_id).symbol_id() else {
            return;
        };
        if self.symbols.contains(&symbol_id) {
            self.found = true;
        }
    }
}

struct RefCollector<'a> {
    scoping: &'a Scoping,
    refs: Vec<SymbolId>,
}

impl<'a> Visit<'a> for RefCollector<'_> {
    fn visit_identifier_reference(&mut self, ident: &IdentifierReference<'a>) {
        let Some(reference_id) = ident.reference_id.get() else {
            return;
        };
        if let Some(symbol_id) = self.scoping.get_reference(reference_id).symbol_id() {
            self.refs.push(symbol_id);
        }
    }
}

fn variable_declaration<'a>(statement: &'a Statement<'a>) -> Option<&'a VariableDeclaration<'a>> {
    match statement {
        Statement::VariableDeclaration(decl) => Some(decl),
        Statement::ExportDeclaration(export) => match &export.declaration {
            Declaration::VariableDeclaration(decl) => Some(decl),
            _ => None,
        },
        _ => None,
    }
}

fn set_declaration_kind(statement: &mut Statement<'_>, kind: VariableDeclarationKind) {
    let decl = match statement {
        Statement::VariableDeclaration(decl) => decl,
        Statement::ExportDeclaration(export) => match &mut export.declaration {
            Declaration::VariableDeclaration(decl) => decl,
            _ => return,
        },
        _ => return,
    };
    decl.kind = kind;
}

#[derive(Default)]
struct Survey {
    order: Vec<String>,
    counts: HashMap<String, u32>,
    names: HashSet<String>,
}

impl<'a> Visit<'a> for Survey {
    fn visit_binding_identifier(&mut self, identifier: &BindingIdentifier<'a>) {
        self.names.insert(identifier.name.to_string());
    }

    fn visit_identifier_reference(&mut self, identifier: &IdentifierReference<'a>) {
        self.names.insert(identifier.name.to_string());
    }

    fn visit_expression(&mut self, expr: &Expression<'a>) {
        if let Expression::StringLiteral(literal) = expr {
            if !literal.lone_surrogates && literal.value.len() >= 8 {
                match self.counts.entry(literal.value.to_string()) {
                    Entry::Occupied(mut entry) => {
                        *entry.get_mut() += 1;
                    }
                    Entry::Vacant(entry) => {
                        self.order.push(entry.key().clone());
                        entry.insert(1);
                    }
                }
            }
        }
        walk_expression(self, expr);
    }
}

struct ReplaceStrings<'b, 'a> {
    builder: &'b AstBuilder<'a>,
    names: &'b HashMap<String, String>,
}

impl<'a> VisitMut<'a> for ReplaceStrings<'_, 'a> {
    fn visit_expression(&mut self, expr: &mut Expression<'a>) {
        walk_expression_mut(self, expr);
        let Expression::StringLiteral(literal) = &*expr else {
            return;
        };
        if literal.lone_surrogates {
            return;
        }
        let Some(name) = self.names.get(literal.value.as_str()) else {
            return;
        };
        let span = literal.span;
        let name = name.clone();
        *expr =
            Expression::new_identifier(span, Ident::from_str_in(&name, self.builder), self.builder);
    }
}

#[cfg(test)]
#[path = "minify_tests.rs"]
mod tests;
