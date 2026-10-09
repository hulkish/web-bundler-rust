//! Lowers one integer JavaScript module to an [asm.js](http://asmjs.org/) function.
//!
//! The written file is still JavaScript: a `"use asm"` module plus a loader that
//! builds the foreign imports, calls the top-level statements, and exports the
//! module object. Parameters and locals are 32-bit integers. Strings, objects,
//! imports, and nested functions are rejected.

use std::path::Path;

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    AssignmentOperator, BinaryOperator, BindingPattern, Declaration, ExportDefaultDeclarationKind,
    Expression, ForStatementInit, Function, FunctionBody, ModuleExportName, Statement,
    UnaryOperator, UpdateOperator, VariableDeclarationKind,
};
use oxc_parser::{ParseOptions, Parser};
use oxc_span::{GetSpan, Span};

use crate::emit::{Emitted, EmittedJs, ModuleKind, PreparedModule};
use crate::error::{BundleError, BundleResult};
use crate::shake::ModuleKeep;
use crate::transform::plain_source_type;

struct Sig {
    name: String,
    params: Vec<String>,
    exported: bool,
    returns_int: bool,
}

struct Func<'a> {
    name: String,
    params: Vec<String>,
    exported: bool,
    returns_int: bool,
    locals: Vec<String>,
    consts: Vec<String>,
    body: &'a FunctionBody<'a>,
}

pub fn emit(
    modules: &[PreparedModule],
    entry_ids: &[usize],
    keep: &[ModuleKeep],
    prefix: &str,
) -> BundleResult<Emitted> {
    if entry_ids.len() != 1 {
        return Err(BundleError::new(
            "asm export supports a single entry module",
        ));
    }
    let entry = entry_ids[0];
    let mut javascript = Vec::new();
    for (id, module) in modules.iter().enumerate() {
        if !keep[id].included {
            continue;
        }
        match module.kind {
            ModuleKind::JavaScript => javascript.push(id),
            ModuleKind::Css => {
                return Err(BundleError::new("asm export does not support CSS imports"));
            }
            ModuleKind::Asset => {
                return Err(BundleError::new(
                    "asm export does not support asset imports",
                ));
            }
        }
    }
    if javascript != [entry] {
        return Err(BundleError::new(
            "asm export supports one JavaScript module and does not support imports",
        ));
    }
    let module = &modules[entry];
    let code = compile(&module.path, &module.source, prefix)?;
    Ok(Emitted {
        files: vec![EmittedJs {
            name: "bundle.js".to_string(),
            code,
            map: None,
            esm: true,
        }],
        assets: Vec::new(),
    })
}

fn compile(path: &Path, source: &str, prefix: &str) -> BundleResult<String> {
    let allocator = Allocator::default();
    let parsed = Parser::new(&allocator, source, plain_source_type(path))
        .with_options(ParseOptions {
            parse_regular_expression: false,
            ..ParseOptions::default()
        })
        .parse();
    if parsed.fatal_error || parsed.diagnostics.has_errors() {
        return Err(BundleError::new(format!(
            "{}: asm export could not parse the module",
            path.display()
        )));
    }
    let mut funcs = Vec::new();
    let mut main_stmts = Vec::new();
    let mut exported = Vec::new();
    for statement in &parsed.program.body {
        match statement {
            Statement::FunctionDeclaration(func) => {
                funcs.push(function_record(path, source, func, false)?);
            }
            Statement::ExportDeclaration(export) => match &export.declaration {
                Declaration::FunctionDeclaration(func) => {
                    funcs.push(function_record(path, source, func, true)?);
                }
                _ => {
                    return Err(at(
                        path,
                        source,
                        export.span(),
                        "asm export can only export functions",
                    ));
                }
            },
            Statement::ExportDefaultDeclaration(export) => {
                let ExportDefaultDeclarationKind::FunctionDeclaration(func) = &export.declaration
                else {
                    return Err(at(
                        path,
                        source,
                        export.span(),
                        "asm export can only export functions",
                    ));
                };
                funcs.push(function_record(path, source, func, true)?);
            }
            Statement::ExportNamedDeclaration(export) => {
                if export.export_kind.is_type() {
                    continue;
                }
                for specifier in &export.specifiers {
                    exported.push(export_local_name(path, source, &specifier.local)?);
                }
            }
            Statement::ImportDeclaration(import) => {
                return Err(at(
                    path,
                    source,
                    import.span(),
                    "asm export does not support import declarations",
                ));
            }
            Statement::EmptyStatement(_) => {}
            other => main_stmts.push(other),
        }
    }
    for name in &exported {
        let Some(func) = funcs.iter_mut().find(|func| func.name == *name) else {
            return Err(BundleError::new(format!(
                "{}: asm export can only export functions, and '{name}' is not one",
                path.display()
            )));
        };
        func.exported = true;
    }
    if funcs
        .iter()
        .any(|func| func.name == format!("{prefix}main"))
    {
        return Err(BundleError::new(format!(
            "{}: asm export reserves the name {prefix}main",
            path.display()
        )));
    }
    let signatures = funcs
        .iter()
        .map(|func| Sig {
            name: func.name.clone(),
            params: func.params.clone(),
            exported: func.exported,
            returns_int: func.returns_int,
        })
        .collect::<Vec<_>>();
    let mut compiler = Compiler {
        path,
        source,
        signatures: &signatures,
        params: Vec::new(),
        uses_log: false,
        uses_imul: false,
    };
    let mut rendered = Vec::new();
    for func in &funcs {
        rendered.push(compiler.render_function(func)?);
    }
    let main = if main_stmts.is_empty() {
        None
    } else {
        let mut locals = Vec::new();
        for statement in &main_stmts {
            collect_stmt_locals(path, source, statement, &mut locals)?;
        }
        let consts = consts_in_stmts_ref(&main_stmts);
        let mut body = String::new();
        for local in &locals {
            body.push_str(&format!("var {local} = 0;\n"));
        }
        for statement in &main_stmts {
            body.push_str(&compiler.statement(statement, &locals, &consts, 2)?);
        }
        Some(body)
    };
    Ok(link(
        prefix,
        &rendered,
        main.as_deref(),
        compiler.uses_log,
        compiler.uses_imul,
        &signatures,
    ))
}

struct Compiler<'a> {
    path: &'a Path,
    source: &'a str,
    signatures: &'a [Sig],
    params: Vec<String>,
    uses_log: bool,
    uses_imul: bool,
}

impl<'a> Compiler<'a> {
    fn render_function(&mut self, func: &Func<'a>) -> BundleResult<String> {
        self.params.clone_from(&func.params);
        let mut body = String::new();
        for (param, slot) in func.params.iter().enumerate() {
            body.push_str(&format!("{slot} = {slot} | 0;\n"));
            let _ = param;
        }
        for local in &func.locals {
            body.push_str(&format!("var {local} = 0;\n"));
        }
        for statement in &func.body.statements {
            body.push_str(&self.statement(statement, &func.locals, &func.consts, 2)?);
        }
        if func.returns_int && !always_returns(&func.body.statements) {
            body.push_str("return 0;\n");
        }
        let params = func.params.join(", ");
        Ok(format!("function {}({params}) {{\n{body}}}\n", func.name))
    }

    fn statement(
        &mut self,
        stmt: &Statement<'_>,
        locals: &[String],
        consts: &[String],
        indent: usize,
    ) -> BundleResult<String> {
        let pad = " ".repeat(indent);
        let text = match stmt {
            Statement::EmptyStatement(_) => String::new(),
            Statement::BlockStatement(block) => {
                let mut out = String::new();
                for statement in &block.body {
                    out.push_str(&self.statement(statement, locals, consts, indent)?);
                }
                out
            }
            Statement::VariableDeclaration(decl) => {
                if matches!(
                    decl.kind,
                    VariableDeclarationKind::Using | VariableDeclarationKind::AwaitUsing
                ) {
                    return Err(self.at(decl.span(), "asm export does not support using"));
                }
                let mut out = String::new();
                for declarator in &decl.declarations {
                    let name = binding_name(self.path, self.source, &declarator.id)?;
                    if let Some(init) = &declarator.init {
                        let value = self.int_expr(init, locals)?;
                        out.push_str(&format!("{pad}{name} = {value};\n"));
                    }
                }
                out
            }
            Statement::ExpressionStatement(stmt) => {
                format!("{pad}{};\n", self.effect(&stmt.expression, locals)?)
            }
            Statement::ReturnStatement(stmt) => match &stmt.argument {
                Some(expr) => format!("{pad}return {};\n", self.int_expr(expr, locals)?),
                None => format!("{pad}return;\n"),
            },
            Statement::IfStatement(stmt) => self.if_statement(stmt, locals, consts, indent)?,
            Statement::WhileStatement(stmt) => {
                let test = self.condition(&stmt.test, locals)?;
                let body = self.statement(&stmt.body, locals, consts, indent + 2)?;
                format!("{pad}while ({test}) {{\n{body}{pad}}}\n")
            }
            Statement::ForStatement(stmt) => self.for_statement(stmt, locals, consts, indent)?,
            Statement::BreakStatement(stmt) => {
                if stmt.label.is_some() {
                    return Err(self.at(stmt.span(), "asm export does not support labeled break"));
                }
                format!("{pad}break;\n")
            }
            Statement::ContinueStatement(stmt) => {
                if stmt.label.is_some() {
                    return Err(
                        self.at(stmt.span(), "asm export does not support labeled continue")
                    );
                }
                format!("{pad}continue;\n")
            }
            other => {
                return Err(self.at(other.span(), "asm export does not support this statement"));
            }
        };
        Ok(text)
    }

    fn if_statement(
        &mut self,
        stmt: &oxc_ast::ast::IfStatement<'_>,
        locals: &[String],
        consts: &[String],
        indent: usize,
    ) -> BundleResult<String> {
        let pad = " ".repeat(indent);
        let test = self.condition(&stmt.test, locals)?;
        let consequent = self.nested(&stmt.consequent, locals, consts, indent)?;
        let alternate = match &stmt.alternate {
            Some(alt) => {
                let alt = self.nested(alt, locals, consts, indent)?;
                format!("{pad}else {{\n{alt}{pad}}}\n")
            }
            None => String::new(),
        };
        Ok(format!(
            "{pad}if ({test}) {{\n{consequent}{pad}}}\n{alternate}"
        ))
    }

    fn nested(
        &mut self,
        stmt: &Statement<'_>,
        locals: &[String],
        consts: &[String],
        indent: usize,
    ) -> BundleResult<String> {
        match stmt {
            Statement::BlockStatement(block) => {
                let mut out = String::new();
                for statement in &block.body {
                    out.push_str(&self.statement(statement, locals, consts, indent + 2)?);
                }
                Ok(out)
            }
            other => self.statement(other, locals, consts, indent + 2),
        }
    }

    fn for_statement(
        &mut self,
        stmt: &oxc_ast::ast::ForStatement<'_>,
        locals: &[String],
        consts: &[String],
        indent: usize,
    ) -> BundleResult<String> {
        let pad = " ".repeat(indent);
        let init = match &stmt.init {
            None => String::new(),
            Some(ForStatementInit::VariableDeclaration(decl)) => {
                let declarator = decl.declarations.first().ok_or_else(|| {
                    self.at(decl.span(), "asm export does not support an empty for loop")
                })?;
                if decl.declarations.len() != 1 {
                    return Err(self.at(decl.span(), "asm export supports one for-loop binding"));
                }
                let name = binding_name(self.path, self.source, &declarator.id)?;
                match &declarator.init {
                    Some(expr) => format!("{name} = {}", self.int_expr(expr, locals)?),
                    None => format!("{name} = 0"),
                }
            }
            Some(other) => {
                return Err(self.at(
                    other.span(),
                    "asm export does not support this for-loop header",
                ));
            }
        };
        let test = match &stmt.test {
            Some(expr) => self.condition(expr, locals)?,
            None => "1".to_string(),
        };
        let update = match &stmt.update {
            Some(Expression::UpdateExpression(update)) => self.update_assign(update, locals)?,
            Some(Expression::AssignmentExpression(assign)) => self
                .assign_text(assign, locals)?
                .trim_end_matches(';')
                .to_string(),
            Some(other) => {
                return Err(self.at(
                    other.span(),
                    "asm export does not support this for-loop update",
                ));
            }
            None => String::new(),
        };
        let body = self.nested(&stmt.body, locals, consts, indent)?;
        Ok(format!(
            "{pad}for ({init}; {test}; {update}) {{\n{body}{pad}}}\n"
        ))
    }

    fn effect(&mut self, expr: &Expression<'_>, locals: &[String]) -> BundleResult<String> {
        if let Expression::AssignmentExpression(assign) = peel(expr) {
            return Ok(self
                .assign_text(assign, locals)?
                .trim_end_matches(';')
                .to_string());
        }
        if let Expression::UpdateExpression(update) = peel(expr) {
            return self.update_assign(update, locals);
        }
        if let Some(call) = console_log(expr) {
            self.uses_log = true;
            let argument = call.arguments.first().ok_or_else(|| {
                self.at(
                    call.span(),
                    "asm export requires console.log to take one integer",
                )
            })?;
            if call.arguments.len() != 1 {
                return Err(self.at(
                    call.span(),
                    "asm export requires console.log to take one integer",
                ));
            }
            let oxc_ast::ast::Argument::SpreadElement(_) = argument else {
                let value = self.int_expr(argument.to_expression(), locals)?;
                return Ok(format!("__jsb_log({value})"));
            };
            return Err(self.at(call.span(), "asm export does not support spread arguments"));
        }
        let Expression::CallExpression(call) = peel(expr) else {
            return Err(self.at(
                expr.span(),
                "asm export does not support this expression statement",
            ));
        };
        let name = self.call_name(call)?;
        let signature = self.signature(&name, call.span())?;
        if signature.returns_int {
            return Err(self.at(
                call.span(),
                &format!("asm export cannot ignore the return value of {name}"),
            ));
        }
        self.call_text(&name, call, locals)
    }

    fn int_expr(&mut self, expr: &Expression<'_>, locals: &[String]) -> BundleResult<String> {
        if let Some(number) = int_literal(expr) {
            return Ok(number.to_string());
        }
        match peel(expr) {
            Expression::Identifier(ident) => {
                let name = ident.name.as_str();
                if locals.iter().any(|local| local == name)
                    || self.params.iter().any(|param| param == name)
                {
                    return Ok(format!("{name} | 0"));
                }
                Err(self.at(ident.span(), &format!("asm export does not know '{name}'")))
            }
            Expression::BinaryExpression(binary) => {
                let left = self.int_expr(&binary.left, locals)?;
                let right = self.int_expr(&binary.right, locals)?;
                let op = match binary.operator {
                    BinaryOperator::Addition => "+",
                    BinaryOperator::Subtraction => "-",
                    BinaryOperator::Multiplication => {
                        self.uses_imul = true;
                        return Ok(format!("(__jsb_imul({left}, {right})) | 0"));
                    }
                    BinaryOperator::Division => "/",
                    BinaryOperator::Remainder => "%",
                    BinaryOperator::BitwiseOR => "|",
                    BinaryOperator::BitwiseXOR => "^",
                    BinaryOperator::BitwiseAnd => "&",
                    BinaryOperator::ShiftLeft => "<<",
                    BinaryOperator::ShiftRight => ">>",
                    BinaryOperator::ShiftRightZeroFill => ">>>",
                    _ => {
                        return Err(
                            self.at(binary.span(), "asm export does not support this operator")
                        );
                    }
                };
                Ok(format!("(({left}) {op} ({right})) | 0"))
            }
            Expression::UnaryExpression(unary) => match unary.operator {
                UnaryOperator::UnaryNegation => {
                    let value = self.int_expr(&unary.argument, locals)?;
                    Ok(format!("((0 - ({value}))) | 0"))
                }
                UnaryOperator::BitwiseNot => {
                    let value = self.int_expr(&unary.argument, locals)?;
                    Ok(format!("(~({value})) | 0"))
                }
                UnaryOperator::UnaryPlus => self.int_expr(&unary.argument, locals),
                _ => Err(self.at(
                    unary.span(),
                    "asm export does not support this unary operator",
                )),
            },
            Expression::CallExpression(call) => {
                let name = self.call_name(call)?;
                let signature = self.signature(&name, call.span())?;
                if !signature.returns_int {
                    return Err(self.at(
                        call.span(),
                        &format!("asm export cannot use void function {name} as a number"),
                    ));
                }
                Ok(format!("({}) | 0", self.call_text(&name, call, locals)?))
            }
            Expression::ParenthesizedExpression(inner) => self.int_expr(&inner.expression, locals),
            other => Err(self.at(other.span(), "asm export does not support this expression")),
        }
    }

    fn condition(&mut self, expr: &Expression<'_>, locals: &[String]) -> BundleResult<String> {
        if let Expression::BinaryExpression(binary) = peel(expr) {
            let op = match binary.operator {
                BinaryOperator::LessThan => "<",
                BinaryOperator::LessEqualThan => "<=",
                BinaryOperator::GreaterThan => ">",
                BinaryOperator::GreaterEqualThan => ">=",
                BinaryOperator::Equality | BinaryOperator::StrictEquality => "==",
                BinaryOperator::Inequality | BinaryOperator::StrictInequality => "!=",
                _ => {
                    let value = self.int_expr(expr, locals)?;
                    return Ok(format!("({value}) | 0"));
                }
            };
            let left = self.int_expr(&binary.left, locals)?;
            let right = self.int_expr(&binary.right, locals)?;
            return Ok(format!("({left}) {op} ({right})"));
        }
        if let Expression::UnaryExpression(unary) = peel(expr) {
            if unary.operator == UnaryOperator::LogicalNot {
                let value = self.int_expr(&unary.argument, locals)?;
                return Ok(format!("({value}) == 0"));
            }
        }
        let value = self.int_expr(expr, locals)?;
        Ok(format!("({value}) | 0"))
    }

    fn call_name(&self, call: &oxc_ast::ast::CallExpression<'_>) -> BundleResult<String> {
        let Expression::Identifier(ident) = peel(&call.callee) else {
            return Err(self.at(call.span(), "asm export only calls functions by name"));
        };
        Ok(ident.name.to_string())
    }

    fn signature(&self, name: &str, span: Span) -> BundleResult<&Sig> {
        self.signatures
            .iter()
            .find(|sig| sig.name == name)
            .ok_or_else(|| self.at(span, &format!("asm export does not know function '{name}'")))
    }

    fn call_text(
        &mut self,
        name: &str,
        call: &oxc_ast::ast::CallExpression<'_>,
        locals: &[String],
    ) -> BundleResult<String> {
        let signature = self.signature(name, call.span())?;
        if call.arguments.len() != signature.params.len() {
            return Err(self.at(
                call.span(),
                &format!(
                    "asm export expected {} to take {} arguments",
                    name,
                    signature.params.len()
                ),
            ));
        }
        let mut args = Vec::new();
        for argument in &call.arguments {
            let oxc_ast::ast::Argument::SpreadElement(_) = argument else {
                args.push(self.int_expr(argument.to_expression(), locals)?);
                continue;
            };
            return Err(self.at(call.span(), "asm export does not support spread arguments"));
        }
        Ok(format!("{name}({})", args.join(", ")))
    }

    fn update_assign(
        &mut self,
        update: &oxc_ast::ast::UpdateExpression<'_>,
        locals: &[String],
    ) -> BundleResult<String> {
        let oxc_ast::ast::SimpleAssignmentTarget::AssignmentTargetIdentifier(ident) =
            &update.argument
        else {
            return Err(self.at(update.span(), "asm export only updates integer locals"));
        };
        let name = ident.name.as_str();
        if !locals.iter().any(|local| local == name)
            && !self.params.iter().any(|param| param == name)
        {
            return Err(self.at(ident.span(), &format!("asm export does not know '{name}'")));
        }
        let op = match update.operator {
            UpdateOperator::Increment => "+",
            UpdateOperator::Decrement => "-",
        };
        Ok(format!("{name} = (({name} | 0) {op} 1) | 0"))
    }

    fn assign_text(
        &mut self,
        assign: &oxc_ast::ast::AssignmentExpression<'_>,
        locals: &[String],
    ) -> BundleResult<String> {
        let oxc_ast::ast::AssignmentTarget::AssignmentTargetIdentifier(ident) = &assign.left else {
            return Err(self.at(assign.span(), "asm export only assigns integer locals"));
        };
        let name = ident.name.as_str();
        if !locals.iter().any(|local| local == name)
            && !self.params.iter().any(|param| param == name)
        {
            return Err(self.at(ident.span(), &format!("asm export does not know '{name}'")));
        }
        let right = self.int_expr(&assign.right, locals)?;
        let text = match assign.operator {
            AssignmentOperator::Assign => format!("{name} = {right}"),
            AssignmentOperator::Addition => format!("{name} = (({name} | 0) + ({right})) | 0"),
            AssignmentOperator::Subtraction => format!("{name} = (({name} | 0) - ({right})) | 0"),
            AssignmentOperator::Multiplication => {
                self.uses_imul = true;
                format!("{name} = (__jsb_imul({name} | 0, {right})) | 0")
            }
            AssignmentOperator::Division => format!("{name} = (({name} | 0) / ({right})) | 0"),
            AssignmentOperator::Remainder => format!("{name} = (({name} | 0) % ({right})) | 0"),
            AssignmentOperator::ShiftLeft => format!("{name} = (({name} | 0) << ({right})) | 0"),
            AssignmentOperator::ShiftRight => format!("{name} = (({name} | 0) >> ({right})) | 0"),
            AssignmentOperator::ShiftRightZeroFill => {
                format!("{name} = (({name} | 0) >>> ({right})) | 0")
            }
            AssignmentOperator::BitwiseOR => format!("{name} = (({name} | 0) | ({right})) | 0"),
            AssignmentOperator::BitwiseXOR => format!("{name} = (({name} | 0) ^ ({right})) | 0"),
            AssignmentOperator::BitwiseAnd => format!("{name} = (({name} | 0) & ({right})) | 0"),
            AssignmentOperator::Exponential
            | AssignmentOperator::LogicalOr
            | AssignmentOperator::LogicalAnd
            | AssignmentOperator::LogicalNullish => {
                return Err(self.at(assign.span(), "asm export does not support this assignment"));
            }
        };
        Ok(format!("{text};"))
    }

    fn at(&self, span: Span, message: &str) -> BundleError {
        at(self.path, self.source, span, message)
    }
}

fn link(
    prefix: &str,
    functions: &[String],
    main: Option<&str>,
    uses_log: bool,
    uses_imul: bool,
    signatures: &[Sig],
) -> String {
    let mut imports = String::new();
    if uses_imul {
        imports.push_str("var __jsb_imul = stdlib.Math.imul;\n");
    }
    if uses_log {
        imports.push_str("var __jsb_log = foreign.log;\n");
    }
    let mut body = String::new();
    for function in functions {
        body.push_str(function);
    }
    let main_name = format!("{prefix}main");
    if let Some(main) = main {
        body.push_str(&format!("function {main_name}() {{\n{main}}}\n"));
    }
    let mut fields = Vec::new();
    for signature in signatures {
        if signature.exported {
            fields.push(format!("{}: {}", signature.name, signature.name));
        }
    }
    if main.is_some() {
        fields.push(format!("{main_name}: {main_name}"));
    }
    let returned = fields.join(", ");
    let foreign = if uses_log {
        "{ log: function (value) { console.log(value); } }"
    } else {
        "{}"
    };
    let call_main = if main.is_some() {
        format!("{prefix}module.{main_name}();\n")
    } else {
        String::new()
    };
    format!(
        "function {prefix}asm(stdlib, foreign, heap) {{\n\"use asm\";\n{imports}{body}return {{ {returned} }};\n}}\nvar {prefix}module = {prefix}asm(globalThis, {foreign}, new ArrayBuffer(4096));\n{call_main}export default {prefix}module;\n"
    )
}

fn function_record<'a>(
    path: &Path,
    source: &str,
    func: &'a Function<'a>,
    exported: bool,
) -> BundleResult<Func<'a>> {
    let Some(id) = &func.id else {
        return Err(at(
            path,
            source,
            func.span(),
            "asm export requires a function name",
        ));
    };
    if func.params.rest.is_some() || func.r#async || func.generator {
        return Err(at(
            path,
            source,
            func.span(),
            "asm export does not support rest, async, or generator functions",
        ));
    }
    let Some(body) = &func.body else {
        return Err(at(
            path,
            source,
            func.span(),
            "asm export requires a function body",
        ));
    };
    let mut params = Vec::new();
    for param in &func.params.items {
        if param.initializer.is_some() {
            return Err(at(
                path,
                source,
                param.span(),
                "asm export does not support default parameters",
            ));
        }
        params.push(binding_name(path, source, &param.pattern)?);
    }
    let locals = locals_in_stmts(path, source, &body.statements)?;
    for param in &params {
        if locals.iter().any(|local| local == param) {
            return Err(at(
                path,
                source,
                func.span(),
                &format!("asm export parameter '{param}' is declared again"),
            ));
        }
    }
    Ok(Func {
        name: id.name.to_string(),
        params,
        exported,
        returns_int: returns_int(&body.statements),
        locals,
        consts: consts_in_stmts(&body.statements),
        body,
    })
}

fn locals_in_stmts(
    path: &Path,
    source: &str,
    stmts: &[Statement<'_>],
) -> BundleResult<Vec<String>> {
    let mut names = Vec::new();
    collect_locals(path, source, stmts, &mut names)?;
    Ok(names)
}

fn collect_locals(
    path: &Path,
    source: &str,
    stmts: &[Statement<'_>],
    names: &mut Vec<String>,
) -> BundleResult<()> {
    for stmt in stmts {
        collect_stmt_locals(path, source, stmt, names)?;
    }
    Ok(())
}

fn collect_stmt_locals(
    path: &Path,
    source: &str,
    stmt: &Statement<'_>,
    names: &mut Vec<String>,
) -> BundleResult<()> {
    match stmt {
        Statement::VariableDeclaration(decl) => {
            for declarator in &decl.declarations {
                let name = binding_name(path, source, &declarator.id)?;
                if names.iter().any(|existing| existing == &name) {
                    return Err(at(
                        path,
                        source,
                        declarator.span(),
                        &format!("asm export binding '{name}' is declared more than once"),
                    ));
                }
                names.push(name);
            }
        }
        Statement::ForStatement(stmt) => {
            if let Some(ForStatementInit::VariableDeclaration(decl)) = &stmt.init {
                for declarator in &decl.declarations {
                    let name = binding_name(path, source, &declarator.id)?;
                    if names.iter().any(|existing| existing == &name) {
                        return Err(at(
                            path,
                            source,
                            declarator.span(),
                            &format!("asm export binding '{name}' is declared more than once"),
                        ));
                    }
                    names.push(name);
                }
            }
            collect_stmt_locals(path, source, &stmt.body, names)?;
        }
        Statement::BlockStatement(block) => {
            collect_locals(path, source, &block.body, names)?;
        }
        Statement::IfStatement(stmt) => {
            collect_stmt_locals(path, source, &stmt.consequent, names)?;
            if let Some(alt) = &stmt.alternate {
                collect_stmt_locals(path, source, alt, names)?;
            }
        }
        Statement::WhileStatement(stmt) => collect_stmt_locals(path, source, &stmt.body, names)?,
        Statement::DoWhileStatement(stmt) => collect_stmt_locals(path, source, &stmt.body, names)?,
        _ => {}
    }
    Ok(())
}

fn consts_in_stmts(stmts: &[Statement<'_>]) -> Vec<String> {
    let mut names = Vec::new();
    for stmt in stmts {
        push_consts(stmt, &mut names);
    }
    names
}

fn consts_in_stmts_ref(stmts: &[&Statement<'_>]) -> Vec<String> {
    let mut names = Vec::new();
    for stmt in stmts {
        push_consts(stmt, &mut names);
    }
    names
}

fn push_consts(stmt: &Statement<'_>, names: &mut Vec<String>) {
    if let Statement::VariableDeclaration(decl) = stmt {
        if decl.kind.is_const() {
            for declarator in &decl.declarations {
                if let Some(id) = declarator.id.get_binding_identifier() {
                    names.push(id.name.to_string());
                }
            }
        }
    }
}

fn returns_int(stmts: &[Statement<'_>]) -> bool {
    stmts.iter().any(stmt_returns_int)
}

fn stmt_returns_int(stmt: &Statement<'_>) -> bool {
    match stmt {
        Statement::ReturnStatement(stmt) => stmt.argument.is_some(),
        Statement::BlockStatement(block) => block.body.iter().any(stmt_returns_int),
        Statement::IfStatement(stmt) => {
            stmt_returns_int(&stmt.consequent)
                || stmt.alternate.as_ref().is_some_and(stmt_returns_int)
        }
        Statement::WhileStatement(stmt) => stmt_returns_int(&stmt.body),
        Statement::DoWhileStatement(stmt) => stmt_returns_int(&stmt.body),
        Statement::ForStatement(stmt) => stmt_returns_int(&stmt.body),
        _ => false,
    }
}

fn always_returns(stmts: &[Statement<'_>]) -> bool {
    stmts.last().is_some_and(stmt_always_returns)
}

fn stmt_always_returns(stmt: &Statement<'_>) -> bool {
    match stmt {
        Statement::ReturnStatement(_) => true,
        Statement::BlockStatement(block) => always_returns(&block.body),
        Statement::IfStatement(stmt) => stmt
            .alternate
            .as_ref()
            .is_some_and(|alt| stmt_always_returns(&stmt.consequent) && stmt_always_returns(alt)),
        _ => false,
    }
}

fn console_log<'a, 'b>(expr: &'b Expression<'a>) -> Option<&'b oxc_ast::ast::CallExpression<'a>> {
    let Expression::CallExpression(call) = peel(expr) else {
        return None;
    };
    let Expression::StaticMemberExpression(member) = peel(&call.callee) else {
        return None;
    };
    let Expression::Identifier(object) = peel(&member.object) else {
        return None;
    };
    if object.name.as_str() == "console" && member.property.name.as_str() == "log" {
        Some(call)
    } else {
        None
    }
}

fn int_literal(expr: &Expression<'_>) -> Option<i32> {
    match peel(expr) {
        Expression::NumericLiteral(literal) => parse_i32(literal.value),
        Expression::UnaryExpression(unary) if unary.operator == UnaryOperator::UnaryNegation => {
            let Expression::NumericLiteral(literal) = peel(&unary.argument) else {
                return None;
            };
            if !literal.value.is_finite() || literal.value.fract() != 0.0 {
                return None;
            }
            let wide = literal.value as i64;
            if literal.value.abs() > 2147483648.0 {
                return None;
            }
            i32::try_from(-wide).ok()
        }
        _ => None,
    }
}

fn parse_i32(value: f64) -> Option<i32> {
    if !value.is_finite() || value.fract() != 0.0 {
        return None;
    }
    if value < f64::from(i32::MIN) || value > f64::from(i32::MAX) {
        return None;
    }
    Some(value as i32)
}

fn peel<'a, 'b>(expr: &'b Expression<'a>) -> &'b Expression<'a> {
    if let Expression::ParenthesizedExpression(inner) = expr {
        peel(&inner.expression)
    } else {
        expr
    }
}

fn binding_name(path: &Path, source: &str, pattern: &BindingPattern<'_>) -> BundleResult<String> {
    pattern
        .get_binding_identifier()
        .map(|id| id.name.to_string())
        .ok_or_else(|| {
            at(
                path,
                source,
                pattern.span(),
                "asm export only supports plain integer names",
            )
        })
}

fn export_local_name(
    path: &Path,
    source: &str,
    name: &ModuleExportName<'_>,
) -> BundleResult<String> {
    match name {
        ModuleExportName::IdentifierReference(ident) => Ok(ident.name.to_string()),
        ModuleExportName::IdentifierName(ident) => Ok(ident.name.to_string()),
        ModuleExportName::StringLiteral(literal) => Err(at(
            path,
            source,
            literal.span(),
            "asm export does not support string export names",
        )),
    }
}

fn at(path: &Path, source: &str, span: Span, message: &str) -> BundleError {
    let end = (span.start as usize).min(source.len());
    let line = source[..end].bytes().filter(|byte| *byte == b'\n').count() + 1;
    BundleError::new(format!("{}:{line}: {message}", path.display()))
}
