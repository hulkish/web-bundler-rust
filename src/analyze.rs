use std::collections::{HashMap, HashSet};
use std::path::Path;

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    Argument, BindingIdentifier, Declaration, ExportAllDeclaration, ExportDefaultDeclaration,
    ExportDefaultDeclarationKind, ExportFromDeclaration, ExportNamedDeclaration, Expression,
    ImportDeclaration, ImportDeclarationSpecifier, ModuleExportName, Statement,
};
use oxc_ast_visit::walk::{
    walk_arrow_function_expression, walk_await_expression, walk_call_expression, walk_expression,
    walk_function, walk_import_expression,
};
use oxc_ast_visit::Visit;
use oxc_parser::Parser;
use oxc_semantic::{Semantic, SemanticBuilder};
use oxc_span::{GetSpan, SourceType, Span};
use oxc_syntax::{scope::ScopeFlags, symbol::SymbolId};

use crate::comments::{expand_comment_spans, trivia_gap};
use crate::error::{BundleError, BundleResult};
use crate::js::{file_url, is_shorthand_property, js_string, slice};
use crate::resolve::package_is_module;
use crate::transform::plain_source_type;

#[derive(Debug)]
pub struct Analysis {
    pub dependencies: Vec<String>,
    pub is_esm: bool,
    pub is_json: bool,
    pub json: Option<String>,
    pub early_prelude: Vec<PreludeItem>,
    pub late_prelude: Vec<PreludeItem>,
    pub statement_edits: Vec<StatementEdit>,
    pub expression_edits: Vec<ExpressionEdit>,
    pub edges: Vec<ImportEdge>,
    pub pure_exports: Vec<PureExport>,
    pub reexport_spans: Vec<(String, Span)>,
    pub top_level_await: bool,
    /// Spans of comments to omit, including license and preserve comments.
    pub comment_cuts: Vec<(u32, u32)>,
}

impl Analysis {
    pub(crate) fn blank() -> Self {
        Self::empty_json("null".to_string())
    }

    fn empty_json(json: String) -> Self {
        Self {
            dependencies: Vec::new(),
            is_esm: false,
            is_json: true,
            json: Some(json),
            early_prelude: Vec::new(),
            late_prelude: Vec::new(),
            statement_edits: Vec::new(),
            expression_edits: Vec::new(),
            edges: Vec::new(),
            pure_exports: Vec::new(),
            reexport_spans: Vec::new(),
            top_level_await: false,
            comment_cuts: Vec::new(),
        }
    }
}

#[derive(Debug, Clone)]
pub enum ImportEdge {
    Eval(usize),
    All(usize),
    Dynamic(usize),
    Names(usize, Vec<String>),
    Reexport {
        dependency: usize,
        exported: String,
        imported: String,
    },
    Star(usize),
    StarAs {
        dependency: usize,
        exported: String,
    },
}

#[derive(Debug, Clone)]
pub struct PureExport {
    pub name: String,
    pub span: Span,
    pub symbol: Option<SymbolId>,
    pub locally_used: bool,
    pub deps: Vec<(usize, String)>,
}

#[derive(Debug)]
pub enum PreludeItem {
    Require(usize),
    Namespace(usize),
    Star(usize),
    StarAs { dependency: usize, name: String },
    LiveExport { name: String, value: ExportValue },
}

#[derive(Debug)]
pub enum ExportValue {
    Local(String),
    Import {
        dependency: usize,
        imported: ImportedName,
    },
}

#[derive(Debug, Clone)]
pub enum ImportedName {
    Named(String),
    Default,
    Namespace,
}

#[derive(Debug)]
pub enum StatementEdit {
    Remove(Span),
    Replace {
        span: Span,
        parts: Vec<StatementPart>,
    },
}

#[derive(Debug)]
pub enum StatementPart {
    Text(String),
    Slice(Span),
}

#[derive(Debug)]
pub enum ExpressionEdit {
    Require {
        span: Span,
        dependency: usize,
    },
    DynamicImport {
        span: Span,
        dependency: usize,
    },
    ImportMeta {
        span: Span,
    },
    ImportBinding {
        span: Span,
        dependency: usize,
        imported: ImportedName,
        shorthand: bool,
    },
    /// A compile-time replacement, such as a define or `__dirname`.
    Text {
        span: Span,
        text: String,
    },
}

impl ExpressionEdit {
    pub fn span(&self) -> Span {
        match self {
            Self::Require { span, .. }
            | Self::DynamicImport { span, .. }
            | Self::ImportMeta { span }
            | Self::ImportBinding { span, .. }
            | Self::Text { span, .. } => *span,
        }
    }

    pub fn dependency(&self) -> Option<usize> {
        match self {
            Self::Require { dependency, .. }
            | Self::DynamicImport { dependency, .. }
            | Self::ImportBinding { dependency, .. } => Some(*dependency),
            Self::ImportMeta { .. } | Self::Text { .. } => None,
        }
    }

    pub fn imported_name(&self) -> Option<&str> {
        match self {
            Self::ImportBinding { imported, .. } => Some(match imported {
                ImportedName::Named(name) => name.as_str(),
                ImportedName::Default => "default",
                ImportedName::Namespace => "*",
            }),
            Self::Require { .. } | Self::DynamicImport { .. } => Some("*"),
            Self::ImportMeta { .. } | Self::Text { .. } => None,
        }
    }
}

struct Deps {
    specs: Vec<String>,
}

impl Deps {
    fn intern(&mut self, specifier: &str) -> usize {
        if let Some(index) = self.specs.iter().position(|spec| spec == specifier) {
            return index;
        }
        self.specs.push(specifier.to_string());
        self.specs.len() - 1
    }
}

struct Analyzer<'a> {
    path: &'a Path,
    deps: Deps,
    early: Vec<PreludeItem>,
    late: Vec<PreludeItem>,
    statements: Vec<StatementEdit>,
    exports: HashSet<String>,
    namespaces: Vec<usize>,
    evaluated: Vec<usize>,
    bindings: Vec<(SymbolId, usize, ImportedName)>,
    import_by_name: HashMap<String, (usize, ImportedName)>,
    saw_module_syntax: bool,
    edges: Vec<ImportEdge>,
    pure: Vec<PureExport>,
    named_locals: Vec<(String, String, Span)>,
}

#[derive(Clone)]
pub struct Define {
    pub parts: Vec<String>,
    pub value: String,
}

pub fn analyze(
    allocator: &mut Allocator,
    path: &Path,
    source: &str,
    defines: &[Define],
    plain: bool,
    strip_comments: bool,
) -> BundleResult<Analysis> {
    if path.extension().and_then(|ext| ext.to_str()) == Some("json") {
        let value: serde_json::Value = serde_json::from_str(source).map_err(|err| {
            BundleError::new(format!("invalid JSON in {}: {err}", path.display()))
        })?;
        let json = serde_json::to_string(&value).map_err(|err| {
            BundleError::new(format!("failed to serialize {}: {err}", path.display()))
        })?;
        return Ok(Analysis::empty_json(json));
    }

    allocator.reset();
    let source_type = if plain {
        plain_source_type(path)
    } else {
        source_type_for(path)
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

    let semantic = SemanticBuilder::new()
        .with_build_nodes(true)
        .with_check_syntax_error(true)
        .build(&parsed.program);
    if semantic.diagnostics.has_errors() {
        let message = semantic
            .diagnostics
            .errors()
            .map(|diagnostic| diagnostic.to_string())
            .collect::<Vec<_>>()
            .join("; ");
        return Err(BundleError::new(format!("{}: {message}", path.display())));
    }

    let mut analyzer = Analyzer {
        path,
        deps: Deps { specs: Vec::new() },
        early: Vec::new(),
        late: Vec::new(),
        statements: Vec::new(),
        exports: HashSet::new(),
        namespaces: Vec::new(),
        evaluated: Vec::new(),
        bindings: Vec::new(),
        import_by_name: HashMap::new(),
        saw_module_syntax: false,
        edges: Vec::new(),
        pure: Vec::new(),
        named_locals: Vec::new(),
    };

    if let Some(hashbang) = &parsed.program.hashbang {
        analyzer
            .statements
            .push(StatementEdit::Remove(hashbang.span()));
    }

    for statement in &parsed.program.body {
        analyzer.statement(statement)?;
    }
    let reexport_spans = analyzer.relocate_imported_reexports();

    let mut expression_edits = Vec::new();
    for (symbol_id, dependency, imported) in &analyzer.bindings {
        let scoping = semantic.semantic.scoping();
        for reference in scoping.get_resolved_references(*symbol_id) {
            if reference.is_type() && !reference.is_value() {
                continue;
            }
            let span = semantic
                .semantic
                .nodes()
                .get_node(reference.node_id())
                .span();
            expression_edits.push(ExpressionEdit::ImportBinding {
                span,
                dependency: *dependency,
                imported: imported.clone(),
                shorthand: is_shorthand_property(source, span),
            });
        }
    }

    let mut scanner = ExprScanner {
        deps: &mut analyzer.deps,
        edits: &mut expression_edits,
        edges: Vec::new(),
        fn_depth: 0,
        top_level_await: false,
        dynamic_import_error: false,
    };
    scanner.visit_program(&parsed.program);
    let top_level_await = scanner.top_level_await;
    let dynamic_import_error = scanner.dynamic_import_error;
    analyzer.edges.append(&mut scanner.edges);
    drop(scanner);
    if dynamic_import_error {
        return Err(BundleError::new(format!(
            "{}: dynamic import() must use a string literal so it can be bundled",
            path.display()
        )));
    }

    mark_local_uses(&semantic.semantic, &mut analyzer.pure);
    fill_pure_deps(&mut analyzer.pure, &expression_edits);
    collect_defines_and_paths(
        &parsed.program,
        &semantic.semantic,
        path,
        defines,
        &mut expression_edits,
    );

    let comment_cuts = if strip_comments {
        let cuts = parsed
            .program
            .comments
            .iter()
            .filter_map(|comment| {
                let span = (comment.span.start, comment.span.end);
                (span.0 < span.1).then_some(span)
            })
            .collect::<Vec<_>>();
        expand_comment_spans(source, &cuts, &[])
    } else {
        Vec::new()
    };

    let extension = path.extension().and_then(|ext| ext.to_str());
    let saw_import_meta = expression_edits
        .iter()
        .any(|edit| matches!(edit, ExpressionEdit::ImportMeta { .. }));
    let is_esm = match extension {
        Some("mjs" | "mts") => true,
        Some("cjs" | "cts") => false,
        _ => analyzer.saw_module_syntax || saw_import_meta || package_is_module(path),
    };

    Ok(Analysis {
        dependencies: analyzer.deps.specs,
        is_esm,
        is_json: false,
        json: None,
        early_prelude: analyzer.early,
        late_prelude: analyzer.late,
        statement_edits: analyzer.statements,
        expression_edits,
        edges: analyzer.edges,
        pure_exports: analyzer.pure,
        reexport_spans,
        top_level_await,
        comment_cuts,
    })
}

fn source_type_for(path: &Path) -> SourceType {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some("mjs") => SourceType::mjs(),
        Some("cjs") => SourceType::cjs(),
        _ => SourceType::unambiguous(),
    }
}

impl<'a> Analyzer<'a> {
    fn statement(&mut self, statement: &Statement<'a>) -> BundleResult<()> {
        match statement {
            Statement::ImportDeclaration(decl) => self.import_declaration(decl),
            Statement::ExportNamedDeclaration(decl) => self.export_named(decl),
            Statement::ExportFromDeclaration(decl) => self.export_from(decl),
            Statement::ExportAllDeclaration(decl) => self.export_all(decl),
            Statement::ExportDefaultDeclaration(decl) => self.export_default(decl),
            Statement::ExportDeclaration(decl) => {
                self.export_declaration(decl.span(), &decl.declaration)
            }
            _ => Ok(()),
        }
    }

    fn import_declaration(&mut self, decl: &ImportDeclaration<'a>) -> BundleResult<()> {
        self.saw_module_syntax = true;
        if decl.phase.is_some() {
            return Err(BundleError::new(format!(
                "{}: import source/defer is not supported",
                self.path.display()
            )));
        }
        self.statements.push(StatementEdit::Remove(decl.span()));
        if decl.import_kind.is_type() {
            return Ok(());
        }

        let dependency = self.deps.intern(decl.source.value.as_str());
        let specifiers = decl.specifiers.as_ref();
        let has_value_specifier = specifiers.is_some_and(|specs| {
            specs.iter().any(|spec| match spec {
                ImportDeclarationSpecifier::ImportSpecifier(spec) => spec.import_kind.is_value(),
                _ => true,
            })
        });

        if !has_value_specifier {
            self.ensure_eval(dependency);
            self.edges.push(ImportEdge::Eval(dependency));
            return Ok(());
        }

        self.ensure_namespace(dependency);
        let mut names = Vec::new();
        let mut namespace = false;
        for specifier in specifiers.into_iter().flatten() {
            match specifier {
                ImportDeclarationSpecifier::ImportSpecifier(spec) if spec.import_kind.is_type() => {
                }
                ImportDeclarationSpecifier::ImportSpecifier(spec) => {
                    let imported = if spec.imported.name().as_str() == "default" {
                        names.push("default".to_string());
                        ImportedName::Default
                    } else {
                        names.push(spec.imported.name().as_str().to_string());
                        ImportedName::Named(spec.imported.name().as_str().to_string())
                    };
                    self.bind(&spec.local, dependency, imported)?;
                }
                ImportDeclarationSpecifier::ImportDefaultSpecifier(spec) => {
                    names.push("default".to_string());
                    self.bind(&spec.local, dependency, ImportedName::Default)?;
                }
                ImportDeclarationSpecifier::ImportNamespaceSpecifier(spec) => {
                    namespace = true;
                    self.bind(&spec.local, dependency, ImportedName::Namespace)?;
                }
            }
        }
        if namespace {
            self.edges.push(ImportEdge::All(dependency));
        }
        if !names.is_empty() {
            self.edges.push(ImportEdge::Names(dependency, names));
        }
        Ok(())
    }

    fn export_named(&mut self, decl: &ExportNamedDeclaration<'a>) -> BundleResult<()> {
        self.saw_module_syntax = true;
        self.statements.push(StatementEdit::Remove(decl.span()));
        if decl.export_kind.is_type() {
            return Ok(());
        }
        for specifier in &decl.specifiers {
            if specifier.export_kind.is_type() {
                continue;
            }
            let exported = specifier.exported.name().as_str().to_string();
            self.claim_export(&exported)?;
            let local = export_local_name(&specifier.local).map_err(|message| {
                BundleError::new(format!("{}: {message}", self.path.display()))
            })?;
            self.named_locals
                .push((exported.clone(), local.clone(), decl.span()));
            self.early.push(PreludeItem::LiveExport {
                name: exported,
                value: ExportValue::Local(local),
            });
        }
        Ok(())
    }

    fn export_from(&mut self, decl: &ExportFromDeclaration<'a>) -> BundleResult<()> {
        self.saw_module_syntax = true;
        self.statements.push(StatementEdit::Remove(decl.span()));
        if decl.export_kind.is_type() {
            return Ok(());
        }
        let dependency = self.deps.intern(decl.source.value.as_str());
        let mut needed = false;
        for specifier in &decl.specifiers {
            if specifier.export_kind.is_type() {
                continue;
            }
            needed = true;
            let exported = specifier.exported.name().as_str().to_string();
            self.claim_export(&exported)?;
            let imported = imported_from_export_name(&specifier.local);
            self.ensure_namespace(dependency);
            self.edges.push(ImportEdge::Reexport {
                dependency,
                exported: exported.clone(),
                imported: match &imported {
                    ImportedName::Named(name) => name.clone(),
                    ImportedName::Default => "default".to_string(),
                    ImportedName::Namespace => "*".to_string(),
                },
            });
            self.late.push(PreludeItem::LiveExport {
                name: exported,
                value: ExportValue::Import {
                    dependency,
                    imported,
                },
            });
        }
        if needed && !self.namespaces.contains(&dependency) {
            self.ensure_namespace(dependency);
        }
        Ok(())
    }

    fn export_all(&mut self, decl: &ExportAllDeclaration<'a>) -> BundleResult<()> {
        self.saw_module_syntax = true;
        self.statements.push(StatementEdit::Remove(decl.span()));
        if decl.export_kind.is_type() {
            return Ok(());
        }
        let dependency = self.deps.intern(decl.source.value.as_str());
        if let Some(exported) = &decl.exported {
            let name = exported.name().as_str().to_string();
            self.claim_export(&name)?;
            self.edges.push(ImportEdge::StarAs {
                dependency,
                exported: name.clone(),
            });
            self.late.push(PreludeItem::StarAs { dependency, name });
        } else {
            self.edges.push(ImportEdge::Star(dependency));
            self.late.push(PreludeItem::Star(dependency));
        }
        self.ensure_eval(dependency);
        Ok(())
    }

    fn export_default(&mut self, decl: &ExportDefaultDeclaration<'a>) -> BundleResult<()> {
        self.saw_module_syntax = true;
        self.claim_export("default")?;
        match &decl.declaration {
            ExportDefaultDeclarationKind::FunctionDeclaration(func)
            | ExportDefaultDeclarationKind::FunctionExpression(func) => {
                self.export_default_function_or_class(decl.span(), func.span(), func.id.as_ref())
            }
            ExportDefaultDeclarationKind::ClassDeclaration(class)
            | ExportDefaultDeclarationKind::ClassExpression(class) => {
                self.export_default_function_or_class(decl.span(), class.span(), class.id.as_ref())
            }
            ExportDefaultDeclarationKind::Identifier(ident) => {
                self.statements.push(StatementEdit::Remove(decl.span()));
                self.early.push(PreludeItem::LiveExport {
                    name: "default".to_string(),
                    value: ExportValue::Local(ident.name.as_str().to_string()),
                });
                Ok(())
            }
            _ => {
                self.statements.push(StatementEdit::Replace {
                    span: decl.span(),
                    parts: vec![
                        StatementPart::Text(format!(
                            "{exports}.default = (",
                            exports = exports_token()
                        )),
                        StatementPart::Slice(decl.declaration.span()),
                        StatementPart::Text(");".to_string()),
                    ],
                });
                Ok(())
            }
        }
    }

    fn export_default_function_or_class(
        &mut self,
        statement_span: Span,
        value_span: Span,
        id: Option<&BindingIdentifier<'a>>,
    ) -> BundleResult<()> {
        if let Some(id) = id {
            self.pure.push(PureExport {
                name: "default".to_string(),
                span: statement_span,
                symbol: id.symbol_id.get(),
                locally_used: false,
                deps: Vec::new(),
            });
            self.early.push(PreludeItem::LiveExport {
                name: "default".to_string(),
                value: ExportValue::Local(id.name.as_str().to_string()),
            });
            self.statements.push(StatementEdit::Replace {
                span: statement_span,
                parts: vec![StatementPart::Slice(value_span)],
            });
        } else {
            self.pure.push(PureExport {
                name: "default".to_string(),
                span: statement_span,
                symbol: None,
                locally_used: false,
                deps: Vec::new(),
            });
            self.statements.push(StatementEdit::Replace {
                span: statement_span,
                parts: vec![
                    StatementPart::Text(format!("{}.default = ", exports_token())),
                    StatementPart::Slice(value_span),
                    StatementPart::Text(";".to_string()),
                ],
            });
        }
        Ok(())
    }

    fn export_declaration(
        &mut self,
        span: Span,
        declaration: &Declaration<'a>,
    ) -> BundleResult<()> {
        self.saw_module_syntax = true;
        if declaration.is_typescript_syntax() {
            return Err(BundleError::new(format!(
                "{}: TypeScript syntax is not supported",
                self.path.display()
            )));
        }
        let pure_symbol = match declaration {
            Declaration::FunctionDeclaration(func) => {
                func.id.as_ref().and_then(|id| id.symbol_id.get())
            }
            Declaration::ClassDeclaration(class) => {
                class.id.as_ref().and_then(|id| id.symbol_id.get())
            }
            _ => None,
        };
        let pure = matches!(
            declaration,
            Declaration::FunctionDeclaration(_) | Declaration::ClassDeclaration(_)
        );
        let names = match declaration {
            Declaration::VariableDeclaration(var) => var
                .declarations
                .iter()
                .flat_map(|declarator| declarator.id.get_binding_identifiers())
                .map(|ident| ident.name.as_str().to_string())
                .collect::<Vec<_>>(),
            Declaration::FunctionDeclaration(func) => func
                .id
                .as_ref()
                .map(|id| vec![id.name.as_str().to_string()])
                .unwrap_or_default(),
            Declaration::ClassDeclaration(class) => class
                .id
                .as_ref()
                .map(|id| vec![id.name.as_str().to_string()])
                .unwrap_or_default(),
            _ => {
                return Err(BundleError::new(format!(
                    "{}: this export declaration is not supported",
                    self.path.display()
                )));
            }
        };
        if names.is_empty() {
            return Err(BundleError::new(format!(
                "{}: exported declaration has no binding name",
                self.path.display()
            )));
        }
        for name in &names {
            self.claim_export(name)?;
            if pure {
                self.pure.push(PureExport {
                    name: name.clone(),
                    span,
                    symbol: pure_symbol,
                    locally_used: false,
                    deps: Vec::new(),
                });
            }
            self.early.push(PreludeItem::LiveExport {
                name: name.clone(),
                value: ExportValue::Local(name.clone()),
            });
        }
        self.statements.push(StatementEdit::Replace {
            span,
            parts: vec![StatementPart::Slice(declaration.span())],
        });
        Ok(())
    }

    fn bind(
        &mut self,
        ident: &BindingIdentifier<'a>,
        dependency: usize,
        imported: ImportedName,
    ) -> BundleResult<()> {
        let symbol_id = ident.symbol_id.get().ok_or_else(|| {
            BundleError::new(format!(
                "{}: failed to resolve import binding '{}'",
                self.path.display(),
                ident.name.as_str()
            ))
        })?;
        self.import_by_name.insert(
            ident.name.as_str().to_string(),
            (dependency, imported.clone()),
        );
        self.bindings.push((symbol_id, dependency, imported));
        Ok(())
    }

    /// `export { foo }` where `foo` was imported is a re-export. Point the live
    /// binding at the imported module once every import in the file is known.
    fn relocate_imported_reexports(&mut self) -> Vec<(String, Span)> {
        let mut reexport_spans = Vec::new();
        let early = std::mem::take(&mut self.early);
        for item in early {
            let PreludeItem::LiveExport {
                name,
                value: ExportValue::Local(local),
            } = item
            else {
                self.early.push(item);
                continue;
            };
            if let Some((dependency, imported)) = self.import_by_name.get(&local).cloned() {
                self.ensure_namespace(dependency);
                let imported_name = match &imported {
                    ImportedName::Named(imported) => imported.clone(),
                    ImportedName::Default => "default".to_string(),
                    ImportedName::Namespace => "*".to_string(),
                };
                self.edges.push(ImportEdge::Reexport {
                    dependency,
                    exported: name.clone(),
                    imported: imported_name,
                });
                if let Some((_, _, span)) = self
                    .named_locals
                    .iter()
                    .find(|(exported, binding, _)| exported == &name && binding == &local)
                {
                    reexport_spans.push((name.clone(), *span));
                }
                self.late.push(PreludeItem::LiveExport {
                    name,
                    value: ExportValue::Import {
                        dependency,
                        imported,
                    },
                });
            } else {
                self.early.push(PreludeItem::LiveExport {
                    name,
                    value: ExportValue::Local(local),
                });
            }
        }
        reexport_spans
    }

    fn claim_export(&mut self, name: &str) -> BundleResult<()> {
        if !self.exports.insert(name.to_string()) {
            return Err(BundleError::new(format!(
                "{}: duplicate export '{name}'",
                self.path.display()
            )));
        }
        Ok(())
    }

    fn ensure_namespace(&mut self, dependency: usize) {
        if self.namespaces.contains(&dependency) {
            return;
        }
        self.namespaces.push(dependency);
        self.late
            .retain(|item| !matches!(item, PreludeItem::Require(dep) if *dep == dependency));
        self.evaluated.retain(|dep| *dep != dependency);
        self.late.push(PreludeItem::Namespace(dependency));
    }

    fn ensure_eval(&mut self, dependency: usize) {
        if self.namespaces.contains(&dependency) || self.evaluated.contains(&dependency) {
            return;
        }
        self.evaluated.push(dependency);
        self.late.push(PreludeItem::Require(dependency));
    }
}

fn export_local_name(name: &ModuleExportName<'_>) -> Result<String, String> {
    if name.is_identifier() {
        Ok(name.name().as_str().to_string())
    } else {
        Err(format!(
            "exporting string name {} requires a local binding",
            js_string(name.name().as_str())
        ))
    }
}

fn imported_from_export_name(name: &ModuleExportName<'_>) -> ImportedName {
    let text = name.name().as_str();
    if text == "default" {
        ImportedName::Default
    } else {
        ImportedName::Named(text.to_string())
    }
}

/// Placeholder rewritten to the real exports parameter when the bundle is emitted.
fn exports_token() -> &'static str {
    "__JSB_EXPORTS__"
}

struct ExprScanner<'a> {
    deps: &'a mut Deps,
    edits: &'a mut Vec<ExpressionEdit>,
    edges: Vec<ImportEdge>,
    fn_depth: u32,
    top_level_await: bool,
    dynamic_import_error: bool,
}

impl<'a> Visit<'a> for ExprScanner<'a> {
    fn visit_function(&mut self, it: &oxc_ast::ast::Function<'a>, flags: ScopeFlags) {
        self.fn_depth += 1;
        walk_function(self, it, flags);
        self.fn_depth -= 1;
    }

    fn visit_arrow_function_expression(&mut self, it: &oxc_ast::ast::ArrowFunctionExpression<'a>) {
        self.fn_depth += 1;
        walk_arrow_function_expression(self, it);
        self.fn_depth -= 1;
    }

    fn visit_await_expression(&mut self, it: &oxc_ast::ast::AwaitExpression<'a>) {
        if self.fn_depth == 0 {
            self.top_level_await = true;
        }
        walk_await_expression(self, it);
    }

    fn visit_import_meta(&mut self, it: &oxc_ast::ast::ImportMeta) {
        self.edits
            .push(ExpressionEdit::ImportMeta { span: it.span() });
    }

    fn visit_import_expression(&mut self, it: &oxc_ast::ast::ImportExpression<'a>) {
        if let Expression::StringLiteral(literal) = &it.source {
            let dependency = self.deps.intern(literal.value.as_str());
            self.edges.push(ImportEdge::Dynamic(dependency));
            self.edits.push(ExpressionEdit::DynamicImport {
                span: it.span(),
                dependency,
            });
            return;
        }
        self.dynamic_import_error = true;
        walk_import_expression(self, it);
    }

    fn visit_call_expression(&mut self, it: &oxc_ast::ast::CallExpression<'a>) {
        if !it.optional {
            if let Expression::Identifier(ident) = &it.callee {
                if ident.name.as_str() == "require" && it.arguments.len() == 1 {
                    if let Argument::StringLiteral(literal) = &it.arguments[0] {
                        let dependency = self.deps.intern(literal.value.as_str());
                        self.edges.push(ImportEdge::All(dependency));
                        self.edits.push(ExpressionEdit::Require {
                            span: it.span(),
                            dependency,
                        });
                        return;
                    }
                }
            }
        }
        walk_call_expression(self, it);
    }
}

pub struct BodyOptions<'a> {
    pub async_deps: &'a [bool],
    pub module_async: bool,
    pub keep_exports: Option<&'a std::collections::HashSet<String>>,
    pub keep_deps: &'a std::collections::HashSet<usize>,
    /// Write `Object.defineProperty` instead of `__jsb_esm` / `__jsb_live` calls.
    pub inline_exports: bool,
    /// Alias `module` and `exports` to the factory parameters. Off when a
    /// CommonJS file is emitted at the top level and those names are the host's.
    pub bind_cjs: bool,
    /// Set `__esModule` on the exports object. Off when that object is not created.
    pub mark_esmodule: bool,
    /// Inject `"use strict"` for an ES module source. Off when the bundle itself
    /// is already an ES module, which is strict without the directive.
    pub emit_strict: bool,
}

pub struct RenderedBody {
    pub code: String,
    pub points: Vec<(u32, u32)>,
}

pub fn render_module_body(
    path: &Path,
    source: &str,
    analysis: &Analysis,
    names: &crate::emit::Names,
    dependency_args: &[String],
    body_options: &BodyOptions<'_>,
) -> BundleResult<RenderedBody> {
    let expression_edits = analysis
        .expression_edits
        .iter()
        .map(|edit| {
            render_expression_edit(path, source, edit, names, dependency_args, body_options)
        })
        .collect::<BundleResult<Vec<_>>>()?;

    let dropped = dropped_export_spans(analysis, body_options.keep_exports);
    let statement_spans = analysis
        .statement_edits
        .iter()
        .map(StatementEdit::span)
        .collect::<Vec<_>>();

    let mut edits = Vec::new();
    for statement in &analysis.statement_edits {
        let span = statement.span();
        let text = if dropped.contains(&span) {
            (String::new(), Vec::new())
        } else {
            match statement {
                StatementEdit::Remove(_) => (String::new(), Vec::new()),
                StatementEdit::Replace { parts, .. } => {
                    let mut text = String::new();
                    let mut inner = Vec::new();
                    for part in parts {
                        match part {
                            StatementPart::Text(value) => {
                                let value = value.replace(exports_token(), &names.exports_param());
                                if text.is_empty() && !value.is_empty() {
                                    inner.push((0, span.start));
                                }
                                text.push_str(&value);
                            }
                            StatementPart::Slice(slice_span) => {
                                let mapped = apply_range(
                                    source,
                                    *slice_span,
                                    &expression_edits,
                                    &analysis.comment_cuts,
                                )?;
                                let base = text.len() as u32;
                                if mapped.points.is_empty() && !mapped.code.is_empty() {
                                    inner.push((base, slice_span.start));
                                } else {
                                    inner.extend(
                                        mapped.points.into_iter().map(|(generated, original)| {
                                            (base + generated, original)
                                        }),
                                    );
                                }
                                text.push_str(&mapped.code);
                            }
                        }
                    }
                    (text, inner)
                }
            }
        };
        let (text, points) = text;
        edits.push(TextEdit {
            start: span.start,
            end: span.end,
            text,
            points,
        });
    }

    for edit in &expression_edits {
        let inside_statement = statement_spans
            .iter()
            .any(|span| edit.start >= span.start && edit.end <= span.end);
        if !inside_statement {
            edits.push(edit.clone());
        }
    }

    let mapped = apply_range(
        source,
        Span::new(0, source.len() as u32),
        &edits,
        &analysis.comment_cuts,
    )?;
    let prelude = render_prelude(analysis, names, dependency_args, body_options)?;
    let mut header = String::new();
    if body_options.emit_strict {
        header.push_str("\"use strict\";\n");
    } else if !analysis.is_json && body_options.bind_cjs {
        header.push_str(&format!(
            "var module = {module}, exports = {exports};\n",
            module = names.module_param(),
            exports = names.exports_param()
        ));
    }
    header.push_str(&prelude);
    let points = mapped
        .points
        .into_iter()
        .map(|(generated, original)| (generated + header.len() as u32, original))
        .collect();
    Ok(RenderedBody {
        code: format!("{header}{}", mapped.code),
        points,
    })
}

fn render_expression_edit(
    path: &Path,
    source: &str,
    edit: &ExpressionEdit,
    names: &crate::emit::Names,
    dependency_args: &[String],
    body_options: &BodyOptions<'_>,
) -> BundleResult<TextEdit> {
    let (span, text) = match edit {
        ExpressionEdit::Require { span, dependency } => (
            *span,
            format!(
                "{}{}({})",
                await_prefix(*dependency, body_options),
                names.require(),
                arg(dependency_args, *dependency)?
            ),
        ),
        ExpressionEdit::DynamicImport { span, dependency } => (
            *span,
            format!(
                "{}({})",
                names.dynamic(),
                arg(dependency_args, *dependency)?
            ),
        ),
        ExpressionEdit::ImportMeta { span } => {
            let directory = path
                .parent()
                .map(|dir| dir.to_string_lossy().to_string())
                .unwrap_or_else(|| ".".to_string());
            (
                *span,
                format!(
                    "({{url:{},dirname:{},filename:{}}})",
                    js_string(&file_url(path)),
                    js_string(&directory),
                    js_string(&path.to_string_lossy())
                ),
            )
        }
        ExpressionEdit::Text { span, text } => (*span, text.clone()),
        ExpressionEdit::ImportBinding {
            span,
            dependency,
            imported,
            shorthand,
        } => {
            let access = import_access(names, *dependency, imported)?;
            let text = if *shorthand {
                format!("{}: {access}", slice(source, *span))
            } else {
                access
            };
            (*span, text)
        }
    };
    Ok(TextEdit {
        start: span.start,
        end: span.end,
        text,
        points: Vec::new(),
    })
}

fn await_prefix(dependency: usize, options: &BodyOptions<'_>) -> &'static str {
    if options.module_async && options.async_deps.get(dependency).copied().unwrap_or(false) {
        "await "
    } else {
        ""
    }
}

fn dropped_export_spans(
    analysis: &Analysis,
    keep_exports: Option<&std::collections::HashSet<String>>,
) -> Vec<Span> {
    let Some(keep) = keep_exports else {
        return Vec::new();
    };
    analysis
        .pure_exports
        .iter()
        .filter(|export| !export.locally_used && !keep.contains(&export.name))
        .map(|export| export.span)
        .collect()
}

fn export_kept(name: &str, options: &BodyOptions<'_>) -> bool {
    options.keep_exports.is_none_or(|keep| keep.contains(name))
}

fn dep_kept(dependency: usize, options: &BodyOptions<'_>) -> bool {
    options.keep_deps.contains(&dependency)
}

fn render_prelude(
    analysis: &Analysis,
    names: &crate::emit::Names,
    dependency_args: &[String],
    options: &BodyOptions<'_>,
) -> BundleResult<String> {
    let mut out = String::new();
    if analysis.is_esm && options.mark_esmodule {
        if options.inline_exports {
            out.push_str(&format!(
                "Object.defineProperty({exports}, \"__esModule\", {{ value: true }});\n",
                exports = names.exports_param()
            ));
        } else {
            out.push_str(&format!(
                "{}({exports});\n",
                names.esm(),
                exports = names.exports_param()
            ));
        }
    }
    for item in analysis
        .early_prelude
        .iter()
        .chain(analysis.late_prelude.iter())
    {
        match item {
            PreludeItem::Require(dependency) => {
                if !dep_kept(*dependency, options) {
                    continue;
                }
                let value = arg(dependency_args, *dependency)?;
                out.push_str(&format!(
                    "{}{}({value});\n",
                    await_prefix(*dependency, options),
                    names.require()
                ));
            }
            PreludeItem::Namespace(dependency) => {
                if !dep_kept(*dependency, options) {
                    continue;
                }
                let value = arg(dependency_args, *dependency)?;
                out.push_str(&format!(
                    "var {ns} = {await_kw}{require}({value});\n",
                    ns = names.namespace(*dependency),
                    await_kw = await_prefix(*dependency, options),
                    require = names.require()
                ));
            }
            PreludeItem::Star(dependency) => {
                if !dep_kept(*dependency, options) {
                    continue;
                }
                let value = arg(dependency_args, *dependency)?;
                out.push_str(&format!(
                    "{await_kw}{star}({exports}, {value});\n",
                    await_kw = await_prefix(*dependency, options),
                    star = names.star(),
                    exports = names.exports_param()
                ));
            }
            PreludeItem::StarAs { dependency, name } => {
                if !dep_kept(*dependency, options) || !export_kept(name, options) {
                    continue;
                }
                let value = arg(dependency_args, *dependency)?;
                let getter = format!("{require}({value})", require = names.require());
                out.push_str(&live_export(names, options, name, &getter));
            }
            PreludeItem::LiveExport { name, value } => {
                if !export_kept(name, options) {
                    continue;
                }
                if let ExportValue::Import { dependency, .. } = value {
                    if !dep_kept(*dependency, options) {
                        continue;
                    }
                }
                let value_expr = match value {
                    ExportValue::Local(local) => local.clone(),
                    ExportValue::Import {
                        dependency,
                        imported,
                    } => import_access(names, *dependency, imported)?,
                };
                out.push_str(&live_export(names, options, name, &value_expr));
            }
        }
    }
    Ok(out)
}

pub fn publishes_exports(
    analysis: &Analysis,
    keep_exports: Option<&std::collections::HashSet<String>>,
) -> bool {
    let kept = |name: &str| keep_exports.is_none_or(|keep| keep.contains(name));
    let from_prelude = analysis
        .early_prelude
        .iter()
        .chain(analysis.late_prelude.iter())
        .any(|item| match item {
            PreludeItem::LiveExport { name, .. } | PreludeItem::StarAs { name, .. } => kept(name),
            PreludeItem::Star(_) => true,
            PreludeItem::Require(_) | PreludeItem::Namespace(_) => false,
        });
    if from_prelude {
        return true;
    }
    analysis.statement_edits.iter().any(|edit| {
        let StatementEdit::Replace { parts, .. } = edit else {
            return false;
        };
        parts
            .iter()
            .any(|part| matches!(part, StatementPart::Text(text) if text.contains(exports_token())))
    })
}

fn live_export(
    names: &crate::emit::Names,
    options: &BodyOptions<'_>,
    name: &str,
    value: &str,
) -> String {
    if options.inline_exports {
        format!(
            "Object.defineProperty({exports}, {name}, {{ enumerable: true, configurable: true, get: function() {{ return {value}; }} }});\n",
            exports = names.exports_param(),
            name = js_string(name)
        )
    } else {
        format!(
            "{live}({exports}, {name}, function() {{ return {value}; }});\n",
            live = names.live(),
            exports = names.exports_param(),
            name = js_string(name)
        )
    }
}

fn import_access(
    names: &crate::emit::Names,
    dependency: usize,
    imported: &ImportedName,
) -> BundleResult<String> {
    let namespace = names.namespace(dependency);
    Ok(match imported {
        ImportedName::Namespace => namespace,
        ImportedName::Default => format!("{}({namespace})", names.interop()),
        ImportedName::Named(name) => format!("{namespace}[{}]", js_string(name)),
    })
}

fn arg(dependency_args: &[String], dependency: usize) -> BundleResult<&str> {
    dependency_args
        .get(dependency)
        .map(String::as_str)
        .ok_or_else(|| BundleError::new(format!("internal error: missing dependency {dependency}")))
}

impl StatementEdit {
    fn span(&self) -> Span {
        match self {
            Self::Remove(span) | Self::Replace { span, .. } => *span,
        }
    }
}

#[derive(Clone)]
struct TextEdit {
    start: u32,
    end: u32,
    text: String,
    /// Positions inside `text`, paired with offsets in the original source.
    /// An empty list maps the whole replacement to `start`.
    points: Vec<(u32, u32)>,
}

struct Mapped {
    code: String,
    points: Vec<(u32, u32)>,
}

fn apply_range(
    source: &str,
    span: Span,
    edits: &[TextEdit],
    cuts: &[(u32, u32)],
) -> BundleResult<Mapped> {
    let mut order = edits
        .iter()
        .enumerate()
        .filter(|(_, edit)| edit.start >= span.start && edit.end <= span.end)
        .map(|(index, _)| index)
        .collect::<Vec<_>>();
    order.sort_by_key(|&index| (edits[index].start, edits[index].end));

    let mut code = String::new();
    let mut points = Vec::new();
    let mut cursor = span.start;
    for index in order {
        let edit = &edits[index];
        if edit.start < cursor {
            return Err(BundleError::new(
                "internal error: overlapping source edits while bundling",
            ));
        }
        push_copy(&mut code, &mut points, source, cursor, edit.start, cuts);
        if !edit.text.is_empty() {
            let base = code.len() as u32;
            if edit.points.is_empty() {
                points.push((base, edit.start));
            } else {
                points.extend(
                    edit.points
                        .iter()
                        .map(|(generated, original)| (base + generated, *original)),
                );
            }
            code.push_str(&edit.text);
        }
        cursor = edit.end;
    }
    let end = span.end.min(source.len() as u32);
    push_copy(&mut code, &mut points, source, cursor, end, cuts);
    Ok(Mapped { code, points })
}

fn push_copy(
    code: &mut String,
    points: &mut Vec<(u32, u32)>,
    source: &str,
    start: u32,
    end: u32,
    cuts: &[(u32, u32)],
) {
    if end <= start {
        return;
    }
    if cuts.is_empty() {
        push_copy_bytes(code, points, source, start, end);
        return;
    }
    let mut cursor = start;
    let mut index = cuts.partition_point(|cut| cut.1 <= cursor);
    while index < cuts.len() && cuts[index].0 < end {
        let (cut_start, cut_end) = cuts[index];
        if cut_end <= cursor {
            index += 1;
            continue;
        }
        let copy_to = cut_start.max(cursor).min(end);
        if copy_to > cursor {
            push_copy_bytes(code, points, source, cursor, copy_to);
        }
        if cut_end <= end {
            code.push_str(trivia_gap(source, cut_start, cut_end));
            index += 1;
        }
        cursor = cut_end.min(end);
        if cut_end > end {
            break;
        }
    }
    push_copy_bytes(code, points, source, cursor, end);
}

fn push_copy_bytes(
    code: &mut String,
    points: &mut Vec<(u32, u32)>,
    source: &str,
    start: u32,
    end: u32,
) {
    if end <= start {
        return;
    }
    let chunk = &source[start as usize..end as usize];
    let base = code.len() as u32;
    points.push((base, start));
    for (offset, byte) in chunk.bytes().enumerate() {
        if byte == b'\n' {
            let next = offset as u32 + 1;
            if next < chunk.len() as u32 {
                points.push((base + next, start + next));
            }
        }
    }
    code.push_str(chunk);
}

fn mark_local_uses(semantic: &Semantic<'_>, exports: &mut [PureExport]) {
    let scoping = semantic.scoping();
    for export in exports.iter_mut() {
        let Some(symbol_id) = export.symbol else {
            continue;
        };
        for reference in scoping.get_resolved_references(symbol_id) {
            if reference.is_type() && !reference.is_value() {
                continue;
            }
            let span = semantic.nodes().get_node(reference.node_id()).span();
            if span.start < export.span.start || span.end > export.span.end {
                export.locally_used = true;
                break;
            }
        }
    }
}

fn fill_pure_deps(exports: &mut [PureExport], edits: &[ExpressionEdit]) {
    for export in exports.iter_mut() {
        for edit in edits {
            let span = edit.span();
            if span.start < export.span.start || span.end > export.span.end {
                continue;
            }
            if let Some(name) = edit.imported_name() {
                if let Some(dependency) = edit.dependency() {
                    export.deps.push((dependency, name.to_string()));
                }
            }
        }
    }
}

fn collect_defines_and_paths(
    program: &oxc_ast::ast::Program<'_>,
    semantic: &Semantic<'_>,
    path: &Path,
    defines: &[Define],
    edits: &mut Vec<ExpressionEdit>,
) {
    let mut scanner = DefineScanner {
        semantic,
        path,
        defines,
        edits,
    };
    scanner.visit_program(program);
}

struct DefineScanner<'a> {
    semantic: &'a Semantic<'a>,
    path: &'a Path,
    defines: &'a [Define],
    edits: &'a mut Vec<ExpressionEdit>,
}

impl<'a> Visit<'a> for DefineScanner<'a> {
    fn visit_expression(&mut self, expr: &Expression<'a>) {
        if let Some((span, parts, node_id)) = member_chain(expr) {
            if let Some(define) = self.defines.iter().find(|define| define.parts == parts) {
                if self.semantic.is_unresolved_reference(node_id) {
                    self.edits.push(ExpressionEdit::Text {
                        span,
                        text: define.value.clone(),
                    });
                    return;
                }
            }
        }
        walk_expression(self, expr);
    }

    fn visit_identifier_reference(&mut self, ident: &oxc_ast::ast::IdentifierReference<'a>) {
        let name = ident.name.as_str();
        if name != "__dirname" && name != "__filename" {
            if let Some(define) = self
                .defines
                .iter()
                .find(|define| define.parts.len() == 1 && define.parts[0] == name)
            {
                if self.semantic.is_unresolved_reference(ident.node_id.get()) {
                    self.edits.push(ExpressionEdit::Text {
                        span: ident.span(),
                        text: define.value.clone(),
                    });
                }
            }
            return;
        }
        if self.semantic.is_unresolved_reference(ident.node_id.get()) {
            let value = if name == "__dirname" {
                ident
                    .span()
                    .start
                    .checked_sub(0)
                    .map(|_| {
                        self.path
                            .parent()
                            .map(|dir| dir.to_string_lossy().to_string())
                            .unwrap_or_else(|| ".".to_string())
                    })
                    .unwrap_or_else(|| ".".to_string())
            } else {
                self.path.to_string_lossy().to_string()
            };
            self.edits.push(ExpressionEdit::Text {
                span: ident.span(),
                text: js_string(&value),
            });
        }
    }
}

fn member_chain(expr: &Expression<'_>) -> Option<(Span, Vec<String>, oxc_syntax::node::NodeId)> {
    let span = expr.span();
    let mut parts = Vec::new();
    let mut current = expr;
    loop {
        match current {
            Expression::StaticMemberExpression(member) if !member.optional => {
                parts.push(member.property.name.as_str().to_string());
                current = &member.object;
            }
            Expression::Identifier(ident) => {
                parts.push(ident.name.as_str().to_string());
                parts.reverse();
                return Some((span, parts, ident.node_id.get()));
            }
            _ => return None,
        }
    }
}
