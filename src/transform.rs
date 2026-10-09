//! Strip TypeScript types and lower JSX to function calls.
//!
//! The rest of the bundler then sees plain JavaScript. Offset maps point the
//! rewritten bytes back at the original file for source maps.

use std::path::Path;

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    BindingPattern, Class, ExportAllDeclaration, ExportFromDeclaration, ExportNamedDeclaration,
    ExportSpecifier, Expression, ImportDeclaration, ImportDeclarationSpecifier, JSXAttributeItem,
    JSXAttributeValue, JSXChild, JSXElement, JSXElementName, JSXExpression, JSXFragment,
    MethodDefinitionKind, ModuleExportName, Statement, TSEnumDeclaration, TSEnumMemberName,
    TSModuleReference,
};
use oxc_ast_visit::walk::{self, walk_expression, walk_statement};
use oxc_ast_visit::Visit;
use oxc_parser::Parser;
use oxc_span::{GetSpan, SourceType, Span};

use crate::error::{BundleError, BundleResult};
use crate::js::{js_string, slice};

#[derive(Clone)]
pub struct JsxConfig {
    pub pragma: String,
    pub fragment: String,
}

pub struct Transformed {
    pub source: String,
    /// True when the source was rewritten, or the file was TypeScript or JSX.
    pub rewritten: bool,
    pub map: OffsetMap,
}

#[derive(Debug, Clone)]
pub struct OffsetMap {
    /// Newest rewrite first. Each layer maps positions through one edit pass.
    layers: Vec<Vec<Piece>>,
}

#[derive(Debug, Clone)]
struct Piece {
    new_start: u32,
    old_start: u32,
    new_len: u32,
    /// Copied from the original file, so positions move by a constant delta.
    identity: bool,
}

impl OffsetMap {
    pub fn identity(len: u32) -> Self {
        Self {
            layers: vec![vec![Piece {
                new_start: 0,
                old_start: 0,
                new_len: len,
                identity: true,
            }]],
        }
    }

    /// Continue through an earlier map. `self` is the newer source.
    pub fn and_then(mut self, earlier: OffsetMap) -> OffsetMap {
        self.layers.extend(earlier.layers);
        self
    }

    pub fn map(&self, mut new_pos: u32) -> u32 {
        for layer in &self.layers {
            new_pos = map_layer(layer, new_pos);
        }
        new_pos
    }
}

fn map_layer(pieces: &[Piece], new_pos: u32) -> u32 {
    if pieces.is_empty() {
        return 0;
    }
    // Pieces are ordered and only share a boundary: the end of one piece
    // is the start of the next. That byte belongs to the earlier piece.
    let mut index = pieces.partition_point(|piece| piece.new_start <= new_pos);
    if index == 0 {
        return pieces.last().map(|piece| piece.old_start).unwrap_or(0);
    }
    index -= 1;
    if index > 0 {
        let previous = &pieces[index - 1];
        let previous_end = previous.new_start.saturating_add(previous.new_len);
        if new_pos >= previous.new_start && new_pos <= previous_end {
            index -= 1;
        }
    }
    let piece = &pieces[index];
    let end = piece.new_start.saturating_add(piece.new_len);
    if new_pos >= piece.new_start && new_pos <= end {
        if piece.identity {
            return piece.old_start + (new_pos - piece.new_start);
        }
        return piece.old_start;
    }
    pieces.last().map(|piece| piece.old_start).unwrap_or(0)
}

struct Edit {
    start: u32,
    end: u32,
    text: String,
    old_anchor: u32,
}

pub fn preprocess(
    allocator: &mut Allocator,
    path: &Path,
    source: &str,
    jsx: &JsxConfig,
) -> BundleResult<Transformed> {
    let extension = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
    if !matches!(extension, "ts" | "tsx" | "mts" | "cts" | "jsx") {
        return Ok(Transformed {
            source: source.to_string(),
            rewritten: false,
            map: OffsetMap::identity(source.len() as u32),
        });
    }

    allocator.reset();
    let source_type = match extension {
        "tsx" => SourceType::tsx(),
        "jsx" => SourceType::jsx(),
        "mts" => SourceType::ts().with_module(true),
        "cts" => SourceType::ts().with_module(false),
        _ => SourceType::ts(),
    };
    let parsed = Parser::new(allocator, source, source_type).parse();
    if parsed.fatal_error || parsed.diagnostics.has_errors() {
        let message = parsed
            .diagnostics
            .errors()
            .map(|diagnostic| diagnostic.to_string())
            .collect::<Vec<_>>()
            .join("; ");
        let message = if message.is_empty() {
            "parse failed".to_string()
        } else {
            message
        };
        return Err(BundleError::new(format!("{}: {message}", path.display())));
    }

    let mut collector = Collector {
        source,
        jsx,
        edits: Vec::new(),
        jsx_depth: 0,
        path,
        error: None,
    };
    collector.visit_program(&parsed.program);
    if let Some(message) = collector.error {
        return Err(BundleError::new(message));
    }
    collector.edits.sort_by_key(|edit| (edit.start, edit.end));
    let edits = drop_contained(collector.edits);
    let (rewritten, map) = apply_edits(source, &edits);
    Ok(Transformed {
        source: rewritten,
        rewritten: true,
        map,
    })
}

fn drop_contained(edits: Vec<Edit>) -> Vec<Edit> {
    let mut kept = Vec::new();
    for edit in edits {
        let inside = kept.iter().any(|earlier: &Edit| {
            edit.start >= earlier.start && edit.end <= earlier.end && earlier.start != earlier.end
        });
        if !inside {
            kept.push(edit);
        }
    }
    kept
}

pub(crate) fn rewrite_spans(source: &str, edits: &[(u32, u32, String)]) -> (String, OffsetMap) {
    let edits = edits
        .iter()
        .map(|(start, end, text)| Edit {
            start: *start,
            end: *end,
            text: text.clone(),
            old_anchor: *start,
        })
        .collect::<Vec<_>>();
    apply_edits(source, &edits)
}

fn apply_edits(source: &str, edits: &[Edit]) -> (String, OffsetMap) {
    let mut out = String::new();
    let mut pieces = Vec::new();
    let mut cursor = 0u32;
    for edit in edits {
        if edit.start < cursor {
            continue;
        }
        if edit.start > cursor {
            let len = edit.start - cursor;
            pieces.push(Piece {
                new_start: out.len() as u32,
                old_start: cursor,
                new_len: len,
                identity: true,
            });
            out.push_str(&source[cursor as usize..edit.start as usize]);
        }
        if !edit.text.is_empty() {
            pieces.push(Piece {
                new_start: out.len() as u32,
                old_start: edit.old_anchor,
                new_len: edit.text.len() as u32,
                identity: false,
            });
            out.push_str(&edit.text);
        }
        cursor = edit.end.max(cursor);
    }
    if (cursor as usize) < source.len() {
        let len = source.len() as u32 - cursor;
        pieces.push(Piece {
            new_start: out.len() as u32,
            old_start: cursor,
            new_len: len,
            identity: true,
        });
        out.push_str(&source[cursor as usize..]);
    }
    (
        out,
        OffsetMap {
            layers: vec![pieces],
        },
    )
}

struct Collector<'a> {
    source: &'a str,
    jsx: &'a JsxConfig,
    edits: Vec<Edit>,
    jsx_depth: u32,
    path: &'a Path,
    error: Option<String>,
}

impl<'a> Collector<'a> {
    fn delete(&mut self, span: Span) {
        self.edits.push(Edit {
            start: span.start,
            end: span.end,
            text: String::new(),
            old_anchor: span.start,
        });
    }

    fn replace(&mut self, span: Span, text: String) {
        self.edits.push(Edit {
            start: span.start,
            end: span.end,
            old_anchor: span.start,
            text,
        });
    }

    fn insert(&mut self, at: u32, text: String, anchor: u32) {
        self.edits.push(Edit {
            start: at,
            end: at,
            text,
            old_anchor: anchor,
        });
    }
}

impl<'a> Visit<'a> for Collector<'a> {
    fn visit_statement(&mut self, statement: &Statement<'a>) {
        if self.replace_statement(statement) {
            return;
        }
        walk_statement(self, statement);
    }

    fn visit_expression(&mut self, expr: &Expression<'a>) {
        match expr {
            Expression::JSXElement(_) | Expression::JSXFragment(_) if self.jsx_depth == 0 => {
                self.jsx_depth += 1;
                let text = jsx_expr(expr, self.source, self.jsx);
                self.replace(expr.span(), text);
                self.jsx_depth -= 1;
            }
            Expression::TSAsExpression(assertion) => {
                self.delete(Span::new(
                    assertion.expression.span().end,
                    assertion.span.end,
                ));
                self.visit_expression(&assertion.expression);
            }
            Expression::TSSatisfiesExpression(assertion) => {
                self.delete(Span::new(
                    assertion.expression.span().end,
                    assertion.span.end,
                ));
                self.visit_expression(&assertion.expression);
            }
            Expression::TSTypeAssertion(assertion) => {
                self.delete(Span::new(
                    assertion.span.start,
                    assertion.expression.span().start,
                ));
                self.visit_expression(&assertion.expression);
            }
            Expression::TSNonNullExpression(assertion) => {
                self.delete(Span::new(
                    assertion.expression.span().end,
                    assertion.span.end,
                ));
                self.visit_expression(&assertion.expression);
            }
            _ => walk_expression(self, expr),
        }
    }

    fn visit_ts_type_annotation(&mut self, it: &oxc_ast::ast::TSTypeAnnotation<'a>) {
        self.delete(it.span);
    }

    fn visit_ts_type_parameter_declaration(
        &mut self,
        it: &oxc_ast::ast::TSTypeParameterDeclaration<'a>,
    ) {
        self.delete(it.span);
    }

    fn visit_ts_type_parameter_instantiation(
        &mut self,
        it: &oxc_ast::ast::TSTypeParameterInstantiation<'a>,
    ) {
        self.delete(it.span);
    }

    fn visit_class(&mut self, class: &Class<'a>) {
        if class.declare {
            self.delete(class.span);
            return;
        }
        if class.r#abstract {
            strip_word(self, class.span, "abstract");
        }
        if !class.implements.is_empty() {
            if let Some(body) = class.body.span.start.checked_sub(0) {
                let start = class.span.start as usize;
                let end = body as usize;
                if let Some(found) = self.source[start..end].rfind("implements") {
                    let abs = (start + found) as u32;
                    self.delete(Span::new(abs, body));
                }
            }
        }
        walk::walk_class(self, class);
    }

    fn visit_method_definition(&mut self, method: &oxc_ast::ast::MethodDefinition<'a>) {
        if method.r#type == oxc_ast::ast::MethodDefinitionType::TSAbstractMethodDefinition {
            self.delete(method.span);
            return;
        }
        if method.accessibility.is_some() {
            if let Some(key_start) = property_key_start(&method.key) {
                strip_modifiers(self, method.span.start, key_start);
            }
        }
        if method.kind == MethodDefinitionKind::Constructor {
            let mut assignments = Vec::new();
            for param in &method.value.params.items {
                if param.accessibility.is_none() && !param.readonly && !param.r#override {
                    continue;
                }
                strip_modifiers(self, param.span.start, param.pattern.span().start);
                if let Some(name) = binding_name(&param.pattern) {
                    assignments.push(format!("this.{name} = {name};"));
                }
            }
            if let Some(body) = &method.value.body {
                if !assignments.is_empty() {
                    let at = body.span.start + 1;
                    self.insert(at, format!("\n{}\n", assignments.join("\n")), at);
                }
            }
        }
        walk::walk_method_definition(self, method);
    }

    fn visit_property_definition(&mut self, prop: &oxc_ast::ast::PropertyDefinition<'a>) {
        if prop.declare
            || matches!(
                prop.r#type,
                oxc_ast::ast::PropertyDefinitionType::TSAbstractPropertyDefinition
            )
        {
            self.delete(prop.span);
            return;
        }
        strip_modifiers(self, prop.span.start, prop.key.span().start);
        if prop.optional || prop.definite {
            let key_end = prop.key.span().end;
            if self.source.as_bytes().get(key_end as usize) == Some(&b'?')
                || self.source.as_bytes().get(key_end as usize) == Some(&b'!')
            {
                self.delete(Span::new(key_end, key_end + 1));
            }
        }
        walk::walk_property_definition(self, prop);
    }

    fn visit_ts_index_signature(&mut self, it: &oxc_ast::ast::TSIndexSignature<'a>) {
        self.delete(it.span);
    }
}

impl<'a> Collector<'a> {
    fn replace_statement(&mut self, statement: &Statement<'a>) -> bool {
        match statement {
            Statement::TSTypeAliasDeclaration(decl) => {
                self.delete(decl.span);
                true
            }
            Statement::TSInterfaceDeclaration(decl) => {
                self.delete(decl.span);
                true
            }
            Statement::TSEnumDeclaration(decl) => {
                self.replace(decl.span, lower_enum(decl, self.source));
                true
            }
            Statement::TSNamespaceDeclaration(_) | Statement::TSGlobalDeclaration(_) => {
                self.error = Some(format!(
                    "{}: TypeScript namespaces are not supported",
                    self.path.display()
                ));
                true
            }
            Statement::TSImportEqualsDeclaration(decl) => {
                self.replace(decl.span, lower_import_equals(decl, self.source));
                true
            }
            Statement::ExportDeclaration(decl) => match &decl.declaration {
                oxc_ast::ast::Declaration::TSTypeAliasDeclaration(_)
                | oxc_ast::ast::Declaration::TSInterfaceDeclaration(_) => {
                    self.delete(decl.span);
                    true
                }
                oxc_ast::ast::Declaration::TSNamespaceDeclaration(_)
                | oxc_ast::ast::Declaration::TSGlobalDeclaration(_) => {
                    self.error = Some(format!(
                        "{}: TypeScript namespaces are not supported",
                        self.path.display()
                    ));
                    true
                }
                oxc_ast::ast::Declaration::TSEnumDeclaration(enum_decl) => {
                    self.replace(enum_decl.span, lower_enum(enum_decl, self.source));
                    false
                }
                oxc_ast::ast::Declaration::VariableDeclaration(var) if var.declare => {
                    self.delete(decl.span);
                    true
                }
                oxc_ast::ast::Declaration::FunctionDeclaration(func) if func.declare => {
                    self.delete(decl.span);
                    true
                }
                _ => false,
            },
            Statement::ImportDeclaration(decl) => rewrite_import(self, decl),
            Statement::ExportNamedDeclaration(decl) => rewrite_export_named(self, decl),
            Statement::ExportFromDeclaration(decl) => rewrite_export_from(self, decl),
            Statement::ExportAllDeclaration(decl) => rewrite_export_all(self, decl),
            Statement::VariableDeclaration(var) if var.declare => {
                self.delete(var.span);
                true
            }
            Statement::FunctionDeclaration(func) if func.declare => {
                self.delete(func.span);
                true
            }
            Statement::TSExportAssignment(assignment) => {
                let value = slice(self.source, assignment.expression.span());
                self.replace(assignment.span, format!("module.exports = {value};"));
                true
            }
            Statement::TSNamespaceExportDeclaration(decl) => {
                self.delete(decl.span);
                true
            }
            _ => false,
        }
    }
}

fn rewrite_import(collector: &mut Collector<'_>, decl: &ImportDeclaration<'_>) -> bool {
    if decl.import_kind.is_type() {
        collector.delete(decl.span);
        return true;
    }
    let Some(specifiers) = &decl.specifiers else {
        return false;
    };
    if !specifiers.iter().any(specifier_is_type) {
        return false;
    }
    let kept = specifiers
        .iter()
        .filter(|specifier| !specifier_is_type(specifier))
        .collect::<Vec<_>>();
    if kept.is_empty() {
        collector.delete(decl.span);
        return true;
    }
    collector.replace(decl.span, format_import(&kept, decl.source.value.as_str()));
    true
}

fn specifier_is_type(specifier: &ImportDeclarationSpecifier<'_>) -> bool {
    match specifier {
        ImportDeclarationSpecifier::ImportSpecifier(spec) => spec.import_kind.is_type(),
        _ => false,
    }
}

fn format_import(specs: &[&ImportDeclarationSpecifier<'_>], source: &str) -> String {
    let mut default = None;
    let mut namespace = None;
    let mut named = Vec::new();
    for specifier in specs {
        match specifier {
            ImportDeclarationSpecifier::ImportDefaultSpecifier(spec) => {
                default = Some(spec.local.name.as_str());
            }
            ImportDeclarationSpecifier::ImportNamespaceSpecifier(spec) => {
                namespace = Some(spec.local.name.as_str());
            }
            ImportDeclarationSpecifier::ImportSpecifier(spec) => {
                let imported = spec.imported.name();
                let local = spec.local.name.as_str();
                if imported.as_str() == local {
                    named.push(local.to_string());
                } else {
                    named.push(format!("{} as {local}", imported.as_str()));
                }
            }
        }
    }
    let from = js_string(source);
    if let Some(namespace) = namespace {
        return format!("import * as {namespace} from {from};");
    }
    match (default, named.is_empty()) {
        (Some(default), true) => format!("import {default} from {from};"),
        (Some(default), false) => {
            format!("import {default}, {{ {} }} from {from};", named.join(", "))
        }
        (None, false) => format!("import {{ {} }} from {from};", named.join(", ")),
        (None, true) => format!("import {from};"),
    }
}

fn rewrite_export_named(collector: &mut Collector<'_>, decl: &ExportNamedDeclaration<'_>) -> bool {
    if decl.export_kind.is_type() {
        collector.delete(decl.span);
        return true;
    }
    if !decl
        .specifiers
        .iter()
        .any(|spec| spec.export_kind.is_type())
    {
        return false;
    }
    let kept = decl
        .specifiers
        .iter()
        .filter(|spec| !spec.export_kind.is_type())
        .collect::<Vec<_>>();
    if kept.is_empty() {
        collector.delete(decl.span);
        return true;
    }
    collector.replace(decl.span, format_named_export(&kept));
    true
}

fn format_named_export(specs: &[&ExportSpecifier<'_>]) -> String {
    let parts = specs
        .iter()
        .map(|spec| {
            let local = export_name(&spec.local);
            let exported = export_name(&spec.exported);
            if local == exported {
                local
            } else {
                format!("{local} as {exported}")
            }
        })
        .collect::<Vec<_>>();
    format!("export {{ {} }};", parts.join(", "))
}

fn rewrite_export_from(collector: &mut Collector<'_>, decl: &ExportFromDeclaration<'_>) -> bool {
    if decl.export_kind.is_type() {
        collector.delete(decl.span);
        return true;
    }
    if !decl
        .specifiers
        .iter()
        .any(|spec| spec.export_kind.is_type())
    {
        return false;
    }
    let kept = decl
        .specifiers
        .iter()
        .filter(|spec| !spec.export_kind.is_type())
        .collect::<Vec<_>>();
    if kept.is_empty() {
        collector.delete(decl.span);
        return true;
    }
    let parts = kept
        .iter()
        .map(|spec| {
            let local = export_name(&spec.local);
            let exported = export_name(&spec.exported);
            if local == exported {
                local
            } else {
                format!("{local} as {exported}")
            }
        })
        .collect::<Vec<_>>();
    collector.replace(
        decl.span,
        format!(
            "export {{ {} }} from {};",
            parts.join(", "),
            js_string(decl.source.value.as_str())
        ),
    );
    true
}

fn rewrite_export_all(collector: &mut Collector<'_>, decl: &ExportAllDeclaration<'_>) -> bool {
    if decl.export_kind.is_type() {
        collector.delete(decl.span);
        return true;
    }
    false
}

fn export_name(name: &ModuleExportName<'_>) -> String {
    name.name().as_str().to_string()
}

fn lower_enum(decl: &TSEnumDeclaration<'_>, source: &str) -> String {
    if decl.declare {
        return String::new();
    }
    let name = decl.id.name.as_str();
    let mut next = 0i64;
    let mut fields = Vec::new();
    for member in &decl.body.members {
        let key = match &member.id {
            TSEnumMemberName::Identifier(id) => js_string(id.name.as_str()),
            TSEnumMemberName::String(literal) | TSEnumMemberName::ComputedString(literal) => {
                js_string(literal.value.as_str())
            }
            TSEnumMemberName::ComputedTemplateString(_) => {
                slice(source, member.id.span()).to_string()
            }
        };
        let value = if let Some(init) = &member.initializer {
            let text = slice(source, init.span()).trim().to_string();
            if let Ok(number) = text.parse::<i64>() {
                next = number + 1;
            }
            text
        } else {
            let current = next.to_string();
            next += 1;
            current
        };
        fields.push(format!("{key}: {value}"));
    }
    format!("var {name} = {{ {} }};", fields.join(", "))
}

fn lower_import_equals(decl: &oxc_ast::ast::TSImportEqualsDeclaration<'_>, source: &str) -> String {
    let name = decl.id.name.as_str();
    let value = match &decl.module_reference {
        TSModuleReference::ExternalModuleReference(reference) => {
            format!(
                "require({})",
                js_string(reference.expression.value.as_str())
            )
        }
        TSModuleReference::IdentifierReference(ident) => ident.name.as_str().to_string(),
        TSModuleReference::QualifiedName(_) => {
            slice(source, decl.module_reference.span()).to_string()
        }
    };
    format!("var {name} = {value};")
}

fn lower_jsx_element(element: &JSXElement<'_>, source: &str, jsx: &JsxConfig) -> String {
    let name = jsx_name(&element.opening_element.name, source);
    let props = jsx_props(&element.opening_element.attributes, source, jsx);
    let children = element
        .children
        .iter()
        .filter_map(|child| jsx_child(child, source, jsx))
        .collect::<Vec<_>>();
    call_element(&jsx.pragma, &name, props, &children)
}

fn jsx_expr(expr: &Expression<'_>, source: &str, jsx: &JsxConfig) -> String {
    splice_jsx(expr, source, jsx)
}

struct JsxHit {
    start: u32,
    end: u32,
    text: String,
}

struct JsxFinder<'a> {
    source: &'a str,
    jsx: &'a JsxConfig,
    hits: Vec<JsxHit>,
}

impl<'a> Visit<'a> for JsxFinder<'a> {
    fn visit_expression(&mut self, expr: &Expression<'a>) {
        let text = match expr {
            Expression::JSXElement(element) => {
                Some(lower_jsx_element(element, self.source, self.jsx))
            }
            Expression::JSXFragment(fragment) => {
                Some(lower_fragment(fragment, self.source, self.jsx))
            }
            _ => None,
        };
        if let Some(text) = text {
            let span = expr.span();
            self.hits.push(JsxHit {
                start: span.start,
                end: span.end,
                text,
            });
            return;
        }
        walk_expression(self, expr);
    }
}

/// Lower every JSX element nested in `expr`, leaving the surrounding JavaScript in place.
fn splice_jsx(expr: &Expression<'_>, source: &str, jsx: &JsxConfig) -> String {
    match expr {
        Expression::JSXElement(element) => return lower_jsx_element(element, source, jsx),
        Expression::JSXFragment(fragment) => return lower_fragment(fragment, source, jsx),
        _ => {}
    }
    let mut finder = JsxFinder {
        source,
        jsx,
        hits: Vec::new(),
    };
    finder.visit_expression(expr);
    let span = expr.span();
    if finder.hits.is_empty() {
        return slice(source, span).to_string();
    }
    finder.hits.sort_by_key(|hit| hit.start);
    let mut out = String::new();
    let mut cursor = span.start;
    for hit in finder.hits {
        out.push_str(slice(source, Span::new(cursor, hit.start)));
        out.push_str(&hit.text);
        cursor = hit.end;
    }
    out.push_str(slice(source, Span::new(cursor, span.end)));
    out
}

fn lower_fragment(fragment: &JSXFragment<'_>, source: &str, jsx: &JsxConfig) -> String {
    let children = fragment
        .children
        .iter()
        .filter_map(|child| jsx_child(child, source, jsx))
        .collect::<Vec<_>>();
    call_element(&jsx.pragma, &jsx.fragment, None, &children)
}

fn call_element(pragma: &str, name: &str, props: Option<String>, children: &[String]) -> String {
    let mut args = vec![
        name.to_string(),
        props.unwrap_or_else(|| "null".to_string()),
    ];
    args.extend(children.iter().cloned());
    format!("{pragma}({})", args.join(", "))
}

fn jsx_name(name: &JSXElementName<'_>, source: &str) -> String {
    match name {
        JSXElementName::Identifier(ident) => intrinsic_or_ident(ident.name.as_str()),
        JSXElementName::IdentifierReference(ident) => intrinsic_or_ident(ident.name.as_str()),
        JSXElementName::NamespacedName(name) => js_string(slice(source, name.span())),
        JSXElementName::MemberExpression(member) => slice(source, member.span()).to_string(),
        JSXElementName::ThisExpression(_) => "this".to_string(),
    }
}

fn intrinsic_or_ident(name: &str) -> String {
    let intrinsic = name
        .chars()
        .next()
        .is_some_and(|ch| ch.is_ascii_lowercase());
    if intrinsic {
        js_string(name)
    } else {
        name.to_string()
    }
}

fn jsx_props(attributes: &[JSXAttributeItem<'_>], source: &str, jsx: &JsxConfig) -> Option<String> {
    if attributes.is_empty() {
        return None;
    }
    let mut groups = vec![Vec::new()];
    for attribute in attributes {
        match attribute {
            JSXAttributeItem::Attribute(attr) => {
                let key = match &attr.name {
                    oxc_ast::ast::JSXAttributeName::Identifier(ident) => {
                        let name = ident.name.as_str();
                        if name.contains('-') {
                            js_string(name)
                        } else {
                            name.to_string()
                        }
                    }
                    oxc_ast::ast::JSXAttributeName::NamespacedName(name) => {
                        js_string(slice(source, name.span()))
                    }
                };
                let value = match &attr.value {
                    None => "true".to_string(),
                    Some(JSXAttributeValue::StringLiteral(literal)) => {
                        js_string(literal.value.as_str())
                    }
                    Some(JSXAttributeValue::ExpressionContainer(container)) => {
                        jsx_container(&container.expression, source, jsx)
                    }
                    Some(JSXAttributeValue::Element(element)) => {
                        lower_jsx_element(element, source, jsx)
                    }
                    Some(JSXAttributeValue::Fragment(fragment)) => {
                        lower_fragment(fragment, source, jsx)
                    }
                };
                groups.last_mut().unwrap().push(format!("{key}: {value}"));
            }
            JSXAttributeItem::SpreadAttribute(spread) => {
                groups.push(Vec::new());
                let expr = jsx_expr(&spread.argument, source, jsx);
                groups.last_mut().unwrap().push(format!("...{expr}"));
            }
        }
    }
    let has_spread = groups
        .iter()
        .any(|group| group.len() == 1 && group[0].starts_with("..."));
    if !has_spread {
        let fields = groups.into_iter().flatten().collect::<Vec<_>>();
        return Some(format!("{{ {} }}", fields.join(", ")));
    }
    let parts = groups
        .into_iter()
        .filter(|group| !group.is_empty())
        .map(|group| {
            if group.len() == 1 && group[0].starts_with("...") {
                group[0][3..].to_string()
            } else {
                format!("{{ {} }}", group.join(", "))
            }
        })
        .collect::<Vec<_>>();
    Some(format!("Object.assign({{}}, {})", parts.join(", ")))
}

fn jsx_child(child: &JSXChild<'_>, source: &str, jsx: &JsxConfig) -> Option<String> {
    match child {
        JSXChild::Text(text) => {
            let value = text.value.as_str();
            if value.chars().all(char::is_whitespace) {
                None
            } else {
                Some(js_string(value))
            }
        }
        JSXChild::Element(element) => Some(lower_jsx_element(element, source, jsx)),
        JSXChild::Fragment(fragment) => Some(lower_fragment(fragment, source, jsx)),
        JSXChild::ExpressionContainer(container) => {
            Some(jsx_container(&container.expression, source, jsx))
        }
        JSXChild::Spread(spread) => {
            Some(format!("...{}", jsx_expr(&spread.expression, source, jsx)))
        }
    }
}

fn jsx_container(expression: &JSXExpression<'_>, source: &str, jsx: &JsxConfig) -> String {
    match expression {
        JSXExpression::EmptyExpression(_) => "null".to_string(),
        other => splice_jsx(other.to_expression(), source, jsx),
    }
}

fn binding_name(pattern: &BindingPattern<'_>) -> Option<String> {
    match pattern {
        BindingPattern::BindingIdentifier(ident) => Some(ident.name.as_str().to_string()),
        _ => None,
    }
}

fn property_key_start(key: &oxc_ast::ast::PropertyKey<'_>) -> Option<u32> {
    Some(key.span().start)
}

fn strip_word(collector: &mut Collector<'_>, span: Span, word: &str) {
    let text = slice(collector.source, span);
    if let Some(index) = text.find(word) {
        let start = span.start + index as u32;
        let mut end = start + word.len() as u32;
        while collector.source.as_bytes().get(end as usize) == Some(&b' ') {
            end += 1;
        }
        collector.delete(Span::new(start, end));
    }
}

fn strip_modifiers(collector: &mut Collector<'_>, start: u32, key_start: u32) {
    if key_start <= start {
        return;
    }
    let gap = &collector.source[start as usize..key_start as usize];
    let cleaned = strip_modifier_words(gap);
    if cleaned != gap {
        collector.replace(Span::new(start, key_start), cleaned);
    }
}

fn strip_modifier_words(gap: &str) -> String {
    const WORDS: &[&str] = &[
        "public",
        "private",
        "protected",
        "readonly",
        "declare",
        "abstract",
        "override",
    ];
    let mut out = String::new();
    let bytes = gap.as_bytes();
    let mut index = 0;
    while index < bytes.len() {
        if bytes[index].is_ascii_alphabetic() {
            let start = index;
            while index < bytes.len()
                && (bytes[index].is_ascii_alphanumeric() || bytes[index] == b'_')
            {
                index += 1;
            }
            let word = &gap[start..index];
            if WORDS.contains(&word) {
                continue;
            }
            out.push_str(word);
        } else {
            out.push(bytes[index] as char);
            index += 1;
        }
    }
    out
}

pub fn plain_source_type(path: &Path) -> SourceType {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some("cjs" | "cts") => SourceType::cjs(),
        Some("mjs" | "mts") => SourceType::mjs(),
        _ => SourceType::unambiguous(),
    }
}

#[cfg(test)]
mod tests {
    use super::{apply_edits, Edit};

    #[test]
    fn boundary_byte_stays_on_the_earlier_piece() {
        let source = "0123456789abcdefghij";
        let edits = vec![Edit {
            start: 10,
            end: 20,
            text: "XYZ".to_string(),
            old_anchor: 99,
        }];
        let (_rewritten, map) = apply_edits(source, &edits);
        assert_eq!(map.map(9), 9);
        assert_eq!(map.map(10), 10);
        assert_eq!(map.map(11), 99);
    }
}
