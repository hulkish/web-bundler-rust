//! Lowers one integer JavaScript module to a WebAssembly binary.
//!
//! The written file is `bundle.wasm`. Parameters and locals are 32-bit integers.
//! Top-level statements run from the start function when the module is instantiated.
//! Exported functions keep their names. `console.log` of one integer is the import
//! `env.log`. A module outside that integer subset is still emitted: its JavaScript
//! is stored in memory and run through the import `env.run`.

use std::path::Path;

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    AssignmentOperator, BinaryOperator, BindingPattern, Declaration, ExportDefaultDeclarationKind,
    Expression, ForStatementInit, Function, FunctionBody, ModuleExportName, Statement,
    UnaryOperator, UpdateOperator, VariableDeclarationKind,
};
use oxc_parser::{ParseOptions, Parser};
use oxc_span::{GetSpan, Span};

use crate::emit::{Emitted, ModuleKind, PreparedModule};
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
    body: &'a FunctionBody<'a>,
}

struct Compiled {
    locals: u32,
    ops: Vec<Op>,
}

enum Op {
    Byte(u8),
    Const(i32),
    LocalGet(u32),
    LocalSet(u32),
    CallUser(u32),
    CallLog,
    Br(u32),
    BrIf(u32),
}

#[derive(Clone, Copy)]
enum Frame {
    Break,
    Loop,
    Continue,
    If,
}

enum Label {
    Break,
    Continue,
    Loop,
}

pub fn emit(
    modules: &[PreparedModule],
    entry_ids: &[usize],
    keep: &[ModuleKeep],
    prefix: &str,
) -> BundleResult<Emitted> {
    if entry_ids.len() != 1 {
        return Err(BundleError::new(
            "wasm export supports a single entry module",
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
                return Err(BundleError::new("wasm export does not support CSS imports"));
            }
            ModuleKind::Asset => {
                return Err(BundleError::new(
                    "wasm export does not support asset imports",
                ));
            }
        }
    }
    if javascript != [entry] {
        return Err(BundleError::new(
            "wasm export supports one JavaScript module and does not support imports",
        ));
    }
    let module = &modules[entry];
    let bytes = compile(&module.path, &module.source, prefix)?;
    Ok(Emitted {
        files: Vec::new(),
        assets: vec![("bundle.wasm".to_string(), bytes)],
    })
}

/// Wrap a JavaScript script in a module whose start function calls `env.run`.
///
/// `env.memory` holds the source. `env.run` receives the byte offset and length.
pub fn wrap_script(source: &str) -> BundleResult<Emitted> {
    let bytes = source.as_bytes();
    if bytes.len() > i32::MAX as usize {
        return Err(BundleError::new("wasm export script is larger than 2 GiB"));
    }
    Ok(Emitted {
        files: Vec::new(),
        assets: vec![("bundle.wasm".to_string(), script_module(bytes))],
    })
}

fn script_module(source: &[u8]) -> Vec<u8> {
    let pages = u32::try_from(source.len().div_ceil(65_536).max(1)).expect("script fits in memory");
    let mut types = Vec::new();
    uleb(&mut types, 2);
    types.extend([0x60, 0x02, 0x7f, 0x7f, 0x00]);
    types.extend([0x60, 0x00, 0x00]);

    let mut imports = Vec::new();
    uleb(&mut imports, 2);
    name(&mut imports, "env");
    name(&mut imports, "run");
    imports.push(0x00);
    uleb(&mut imports, 0);
    name(&mut imports, "env");
    name(&mut imports, "memory");
    imports.push(0x02);
    imports.push(0x00);
    uleb(&mut imports, pages);

    let mut functions = Vec::new();
    uleb(&mut functions, 1);
    uleb(&mut functions, 1);

    let mut start = Vec::new();
    uleb(&mut start, 1);

    let body = encode_ops(
        &[
            Op::Const(0),
            Op::Const(source.len() as i32),
            Op::CallUser(0),
        ],
        0,
    );
    let mut code = Vec::new();
    uleb(&mut code, 1);
    push_code(&mut code, 0, &body);

    let mut data = Vec::new();
    uleb(&mut data, 1);
    data.push(0x00);
    data.push(0x41);
    sleb(&mut data, 0);
    data.push(0x0b);
    uleb(&mut data, source.len() as u32);
    data.extend_from_slice(source);

    let mut module = vec![0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00];
    section(&mut module, 1, &types);
    section(&mut module, 2, &imports);
    section(&mut module, 3, &functions);
    section(&mut module, 8, &start);
    section(&mut module, 10, &code);
    section(&mut module, 11, &data);
    module
}

fn compile(path: &Path, source: &str, prefix: &str) -> BundleResult<Vec<u8>> {
    let allocator = Allocator::default();
    let parsed = Parser::new(&allocator, source, plain_source_type(path))
        .with_options(ParseOptions {
            parse_regular_expression: false,
            ..ParseOptions::default()
        })
        .parse();
    if parsed.fatal_error || parsed.diagnostics.has_errors() {
        return Err(BundleError::new(format!(
            "{}: wasm export could not parse the module",
            path.display()
        )));
    }
    let mut funcs = Vec::new();
    let mut main_stmts = Vec::new();
    let mut exported = Vec::new();
    for statement in &parsed.program.body {
        match statement {
            Statement::FunctionDeclaration(func) => {
                push_func(path, source, &mut funcs, func, false)?
            }
            Statement::ExportDeclaration(export) => match &export.declaration {
                Declaration::FunctionDeclaration(func) => {
                    push_func(path, source, &mut funcs, func, true)?;
                }
                _ => {
                    return Err(at(
                        path,
                        source,
                        export.span(),
                        "wasm export can only export functions",
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
                        "wasm export can only export functions",
                    ));
                };
                push_func(path, source, &mut funcs, func, true)?;
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
                    "wasm export does not support import declarations",
                ));
            }
            Statement::EmptyStatement(_) => {}
            other => main_stmts.push(other),
        }
    }
    for name in &exported {
        let Some(func) = funcs.iter_mut().find(|func| func.name == *name) else {
            return Err(BundleError::new(format!(
                "{}: wasm export can only export functions, and '{name}' is not one",
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
            "{}: wasm export reserves the name {prefix}main",
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
        locals: Vec::new(),
        returns_int: false,
        ops: Vec::new(),
        frames: Vec::new(),
    };
    let mut functions = Vec::new();
    for func in &funcs {
        functions.push(compiler.function(func)?);
    }
    let main = if main_stmts.is_empty() {
        None
    } else {
        let mut locals = Vec::new();
        for statement in &main_stmts {
            collect_stmt_locals(path, source, statement, &mut locals)?;
        }
        compiler.params.clear();
        compiler.locals.clone_from(&locals);
        compiler.returns_int = false;
        compiler.ops.clear();
        compiler.frames.clear();
        for statement in &main_stmts {
            compiler.statement(statement)?;
        }
        Some(Compiled {
            locals: locals.len() as u32,
            ops: std::mem::take(&mut compiler.ops),
        })
    };
    Ok(module_bytes(&signatures, &functions, main.as_ref()))
}

fn push_func<'a>(
    path: &Path,
    source: &str,
    funcs: &mut Vec<Func<'a>>,
    func: &'a Function<'a>,
    exported: bool,
) -> BundleResult<()> {
    let record = function_record(path, source, func, exported)?;
    if funcs.iter().any(|existing| existing.name == record.name) {
        return Err(at(
            path,
            source,
            func.span(),
            &format!(
                "wasm export function '{}' is declared more than once",
                record.name
            ),
        ));
    }
    funcs.push(record);
    Ok(())
}

struct Compiler<'a> {
    path: &'a Path,
    source: &'a str,
    signatures: &'a [Sig],
    params: Vec<String>,
    locals: Vec<String>,
    returns_int: bool,
    ops: Vec<Op>,
    frames: Vec<Frame>,
}

impl<'a> Compiler<'a> {
    fn function(&mut self, func: &Func<'a>) -> BundleResult<Compiled> {
        self.params.clone_from(&func.params);
        self.locals.clone_from(&func.locals);
        self.returns_int = func.returns_int;
        self.ops.clear();
        self.frames.clear();
        for statement in &func.body.statements {
            self.statement(statement)?;
        }
        if func.returns_int && !always_returns(&func.body.statements) {
            self.const_i32(0);
        }
        Ok(Compiled {
            locals: func.locals.len() as u32,
            ops: std::mem::take(&mut self.ops),
        })
    }

    fn statement(&mut self, stmt: &Statement<'_>) -> BundleResult<()> {
        match stmt {
            Statement::EmptyStatement(_) => Ok(()),
            Statement::BlockStatement(block) => {
                for statement in &block.body {
                    self.statement(statement)?;
                }
                Ok(())
            }
            Statement::VariableDeclaration(decl) => {
                if matches!(
                    decl.kind,
                    VariableDeclarationKind::Using | VariableDeclarationKind::AwaitUsing
                ) {
                    return Err(self.at(decl.span(), "wasm export does not support using"));
                }
                for declarator in &decl.declarations {
                    let name = binding_name(self.path, self.source, &declarator.id)?;
                    if let Some(init) = &declarator.init {
                        let slot = self.local(&name, declarator.span())?;
                        self.int_expr(init)?;
                        self.ops.push(Op::LocalSet(slot));
                    }
                }
                Ok(())
            }
            Statement::ExpressionStatement(stmt) => self.effect(&stmt.expression),
            Statement::ReturnStatement(stmt) => {
                if let Some(expr) = &stmt.argument {
                    self.int_expr(expr)?;
                } else if self.returns_int {
                    self.const_i32(0);
                }
                self.byte(0x0f);
                Ok(())
            }
            Statement::IfStatement(stmt) => {
                self.condition(&stmt.test)?;
                self.begin(Frame::If);
                self.statement(&stmt.consequent)?;
                if let Some(alt) = &stmt.alternate {
                    self.byte(0x05);
                    self.statement(alt)?;
                }
                self.end_frame();
                Ok(())
            }
            Statement::WhileStatement(stmt) => self.while_statement(stmt),
            Statement::ForStatement(stmt) => self.for_statement(stmt),
            Statement::BreakStatement(stmt) => {
                if stmt.label.is_some() {
                    return Err(self.at(stmt.span(), "wasm export does not support labeled break"));
                }
                let index = self.label_index(stmt.span(), Label::Break)?;
                self.ops.push(Op::Br(index));
                Ok(())
            }
            Statement::ContinueStatement(stmt) => {
                if stmt.label.is_some() {
                    return Err(
                        self.at(stmt.span(), "wasm export does not support labeled continue")
                    );
                }
                let index = self.label_index(stmt.span(), Label::Continue)?;
                self.ops.push(Op::Br(index));
                Ok(())
            }
            other => Err(self.at(other.span(), "wasm export does not support this statement")),
        }
    }

    fn while_statement(&mut self, stmt: &oxc_ast::ast::WhileStatement<'_>) -> BundleResult<()> {
        self.begin(Frame::Break);
        self.begin(Frame::Loop);
        self.condition(&stmt.test)?;
        self.byte(0x45);
        let break_at = self.label_index(stmt.span(), Label::Break)?;
        self.ops.push(Op::BrIf(break_at));
        self.statement(&stmt.body)?;
        let loop_at = self.label_index(stmt.span(), Label::Loop)?;
        self.ops.push(Op::Br(loop_at));
        self.end_frame();
        self.end_frame();
        Ok(())
    }

    fn for_statement(&mut self, stmt: &oxc_ast::ast::ForStatement<'_>) -> BundleResult<()> {
        match &stmt.init {
            None => {}
            Some(ForStatementInit::VariableDeclaration(decl)) => {
                let declarator = decl.declarations.first().ok_or_else(|| {
                    self.at(
                        decl.span(),
                        "wasm export does not support an empty for loop",
                    )
                })?;
                if decl.declarations.len() != 1 {
                    return Err(self.at(decl.span(), "wasm export supports one for-loop binding"));
                }
                let name = binding_name(self.path, self.source, &declarator.id)?;
                let slot = self.local(&name, declarator.span())?;
                if let Some(expr) = &declarator.init {
                    self.int_expr(expr)?;
                } else {
                    self.const_i32(0);
                }
                self.ops.push(Op::LocalSet(slot));
            }
            Some(other) => {
                return Err(self.at(
                    other.span(),
                    "wasm export does not support this for-loop header",
                ));
            }
        }
        self.begin(Frame::Break);
        self.begin(Frame::Loop);
        if let Some(test) = &stmt.test {
            self.condition(test)?;
        } else {
            self.const_i32(1);
        }
        self.byte(0x45);
        let break_at = self.label_index(stmt.span(), Label::Break)?;
        self.ops.push(Op::BrIf(break_at));
        self.begin(Frame::Continue);
        self.statement(&stmt.body)?;
        self.end_frame();
        if let Some(update) = &stmt.update {
            self.for_update(update)?;
        }
        let loop_at = self.label_index(stmt.span(), Label::Loop)?;
        self.ops.push(Op::Br(loop_at));
        self.end_frame();
        self.end_frame();
        Ok(())
    }

    fn for_update(&mut self, update: &Expression<'_>) -> BundleResult<()> {
        match peel(update) {
            Expression::UpdateExpression(update) => self.update(update),
            Expression::AssignmentExpression(assign) => self.assign(assign),
            other => Err(self.at(
                other.span(),
                "wasm export does not support this for-loop update",
            )),
        }
    }

    fn effect(&mut self, expr: &Expression<'_>) -> BundleResult<()> {
        if let Expression::AssignmentExpression(assign) = peel(expr) {
            return self.assign(assign);
        }
        if let Expression::UpdateExpression(update) = peel(expr) {
            return self.update(update);
        }
        if let Some(call) = console_log(expr) {
            return self.log_call(call);
        }
        let Expression::CallExpression(call) = peel(expr) else {
            return Err(self.at(
                expr.span(),
                "wasm export does not support this expression statement",
            ));
        };
        if call.optional {
            return Err(self.at(call.span(), "wasm export only calls functions by name"));
        }
        let name = self.call_name(call)?;
        let (index, returns_int, arity) = self.signature(&name, call.span())?;
        if returns_int {
            return Err(self.at(
                call.span(),
                &format!("wasm export cannot ignore the return value of {name}"),
            ));
        }
        self.emit_call(index, arity, &name, call)
    }

    fn log_call(&mut self, call: &oxc_ast::ast::CallExpression<'_>) -> BundleResult<()> {
        if call.optional || call.arguments.len() != 1 {
            return Err(self.at(
                call.span(),
                "wasm export requires console.log to take one integer",
            ));
        }
        let argument = &call.arguments[0];
        if matches!(argument, oxc_ast::ast::Argument::SpreadElement(_)) {
            return Err(self.at(call.span(), "wasm export does not support spread arguments"));
        }
        self.int_expr(argument.to_expression())?;
        self.ops.push(Op::CallLog);
        Ok(())
    }

    fn int_expr(&mut self, expr: &Expression<'_>) -> BundleResult<()> {
        if let Some(number) = int_literal(expr) {
            self.const_i32(number);
            return Ok(());
        }
        match peel(expr) {
            Expression::NumericLiteral(literal) => {
                Err(self.at(literal.span(), "wasm export only supports 32-bit integers"))
            }
            Expression::Identifier(ident) => {
                let slot = self.local(ident.name.as_str(), ident.span())?;
                self.ops.push(Op::LocalGet(slot));
                Ok(())
            }
            Expression::BinaryExpression(binary) => {
                let Some(opcode) = binary_opcode(binary.operator) else {
                    return Err(
                        self.at(binary.span(), "wasm export does not support this operator")
                    );
                };
                self.int_expr(&binary.left)?;
                self.int_expr(&binary.right)?;
                self.byte(opcode);
                Ok(())
            }
            Expression::UnaryExpression(unary) => match unary.operator {
                UnaryOperator::UnaryNegation => {
                    self.const_i32(0);
                    self.int_expr(&unary.argument)?;
                    self.byte(0x6b);
                    Ok(())
                }
                UnaryOperator::BitwiseNot => {
                    self.int_expr(&unary.argument)?;
                    self.const_i32(-1);
                    self.byte(0x73);
                    Ok(())
                }
                UnaryOperator::UnaryPlus => self.int_expr(&unary.argument),
                _ => Err(self.at(
                    unary.span(),
                    "wasm export does not support this unary operator",
                )),
            },
            Expression::CallExpression(call) => {
                if call.optional {
                    return Err(self.at(call.span(), "wasm export only calls functions by name"));
                }
                let name = self.call_name(call)?;
                let (index, returns_int, arity) = self.signature(&name, call.span())?;
                if !returns_int {
                    return Err(self.at(
                        call.span(),
                        &format!("wasm export cannot use void function {name} as a number"),
                    ));
                }
                self.emit_call(index, arity, &name, call)
            }
            Expression::ParenthesizedExpression(inner) => self.int_expr(&inner.expression),
            other => Err(self.at(other.span(), "wasm export does not support this expression")),
        }
    }

    fn condition(&mut self, expr: &Expression<'_>) -> BundleResult<()> {
        if let Expression::UnaryExpression(unary) = peel(expr) {
            if unary.operator == UnaryOperator::LogicalNot {
                self.condition(&unary.argument)?;
                self.byte(0x45);
                return Ok(());
            }
        }
        self.int_expr(expr)
    }

    fn call_name(&self, call: &oxc_ast::ast::CallExpression<'_>) -> BundleResult<String> {
        let Expression::Identifier(ident) = peel(&call.callee) else {
            return Err(self.at(call.span(), "wasm export only calls functions by name"));
        };
        Ok(ident.name.to_string())
    }

    fn signature(&self, name: &str, span: Span) -> BundleResult<(u32, bool, usize)> {
        let Some((index, sig)) = self
            .signatures
            .iter()
            .enumerate()
            .find(|(_, sig)| sig.name == name)
        else {
            return Err(self.at(
                span,
                &format!("wasm export does not know function '{name}'"),
            ));
        };
        Ok((index as u32, sig.returns_int, sig.params.len()))
    }

    fn emit_call(
        &mut self,
        index: u32,
        arity: usize,
        name: &str,
        call: &oxc_ast::ast::CallExpression<'_>,
    ) -> BundleResult<()> {
        if call.arguments.len() != arity {
            return Err(self.at(
                call.span(),
                &format!("wasm export expected {name} to take {arity} arguments"),
            ));
        }
        for argument in &call.arguments {
            if matches!(argument, oxc_ast::ast::Argument::SpreadElement(_)) {
                return Err(self.at(call.span(), "wasm export does not support spread arguments"));
            }
            self.int_expr(argument.to_expression())?;
        }
        self.ops.push(Op::CallUser(index));
        Ok(())
    }

    fn update(&mut self, update: &oxc_ast::ast::UpdateExpression<'_>) -> BundleResult<()> {
        let oxc_ast::ast::SimpleAssignmentTarget::AssignmentTargetIdentifier(ident) =
            &update.argument
        else {
            return Err(self.at(update.span(), "wasm export only updates integer locals"));
        };
        let slot = self.local(ident.name.as_str(), ident.span())?;
        let opcode = match update.operator {
            UpdateOperator::Increment => 0x6a,
            UpdateOperator::Decrement => 0x6b,
        };
        self.ops.push(Op::LocalGet(slot));
        self.const_i32(1);
        self.byte(opcode);
        self.ops.push(Op::LocalSet(slot));
        Ok(())
    }

    fn assign(&mut self, assign: &oxc_ast::ast::AssignmentExpression<'_>) -> BundleResult<()> {
        let oxc_ast::ast::AssignmentTarget::AssignmentTargetIdentifier(ident) = &assign.left else {
            return Err(self.at(assign.span(), "wasm export only assigns integer locals"));
        };
        let slot = self.local(ident.name.as_str(), ident.span())?;
        if assign.operator == AssignmentOperator::Assign {
            self.int_expr(&assign.right)?;
            self.ops.push(Op::LocalSet(slot));
            return Ok(());
        }
        let Some(opcode) = assign_opcode(assign.operator) else {
            return Err(self.at(
                assign.span(),
                "wasm export does not support this assignment",
            ));
        };
        self.ops.push(Op::LocalGet(slot));
        self.int_expr(&assign.right)?;
        self.byte(opcode);
        self.ops.push(Op::LocalSet(slot));
        Ok(())
    }

    fn local(&self, name: &str, span: Span) -> BundleResult<u32> {
        if let Some(index) = self.params.iter().position(|param| param == name) {
            return Ok(index as u32);
        }
        if let Some(index) = self.locals.iter().position(|local| local == name) {
            return Ok((self.params.len() + index) as u32);
        }
        Err(self.at(span, &format!("wasm export does not know '{name}'")))
    }

    fn label_index(&self, span: Span, kind: Label) -> BundleResult<u32> {
        for (index, frame) in self.frames.iter().rev().enumerate() {
            let hit = match kind {
                Label::Break => matches!(frame, Frame::Break),
                Label::Continue => matches!(frame, Frame::Continue | Frame::Loop),
                Label::Loop => matches!(frame, Frame::Loop),
            };
            if hit {
                return Ok(index as u32);
            }
        }
        let message = match kind {
            Label::Break => "wasm export break is outside a loop",
            Label::Continue => "wasm export continue is outside a loop",
            Label::Loop => "wasm export loop is missing its header",
        };
        Err(self.at(span, message))
    }

    fn begin(&mut self, frame: Frame) {
        let opcode = match frame {
            Frame::Break | Frame::Continue => 0x02,
            Frame::Loop => 0x03,
            Frame::If => 0x04,
        };
        self.byte(opcode);
        self.byte(0x40);
        self.frames.push(frame);
    }

    fn end_frame(&mut self) {
        self.byte(0x0b);
        let _ = self.frames.pop();
    }

    fn byte(&mut self, opcode: u8) {
        self.ops.push(Op::Byte(opcode));
    }

    fn const_i32(&mut self, value: i32) {
        self.ops.push(Op::Const(value));
    }

    fn at(&self, span: Span, message: &str) -> BundleError {
        at(self.path, self.source, span, message)
    }
}

fn binary_opcode(op: BinaryOperator) -> Option<u8> {
    Some(match op {
        BinaryOperator::Addition => 0x6a,
        BinaryOperator::Subtraction => 0x6b,
        BinaryOperator::Multiplication => 0x6c,
        BinaryOperator::Division => 0x6d,
        BinaryOperator::Remainder => 0x6f,
        BinaryOperator::BitwiseAnd => 0x71,
        BinaryOperator::BitwiseOR => 0x72,
        BinaryOperator::BitwiseXOR => 0x73,
        BinaryOperator::ShiftLeft => 0x74,
        BinaryOperator::ShiftRight => 0x75,
        BinaryOperator::ShiftRightZeroFill => 0x76,
        BinaryOperator::Equality | BinaryOperator::StrictEquality => 0x46,
        BinaryOperator::Inequality | BinaryOperator::StrictInequality => 0x47,
        BinaryOperator::LessThan => 0x48,
        BinaryOperator::GreaterThan => 0x4a,
        BinaryOperator::LessEqualThan => 0x4c,
        BinaryOperator::GreaterEqualThan => 0x4e,
        _ => return None,
    })
}

fn assign_opcode(op: AssignmentOperator) -> Option<u8> {
    Some(match op {
        AssignmentOperator::Addition => 0x6a,
        AssignmentOperator::Subtraction => 0x6b,
        AssignmentOperator::Multiplication => 0x6c,
        AssignmentOperator::Division => 0x6d,
        AssignmentOperator::Remainder => 0x6f,
        AssignmentOperator::ShiftLeft => 0x74,
        AssignmentOperator::ShiftRight => 0x75,
        AssignmentOperator::ShiftRightZeroFill => 0x76,
        AssignmentOperator::BitwiseOR => 0x72,
        AssignmentOperator::BitwiseXOR => 0x73,
        AssignmentOperator::BitwiseAnd => 0x71,
        _ => return None,
    })
}

struct FuncType {
    params: u32,
    results: u32,
}

fn module_bytes(signatures: &[Sig], functions: &[Compiled], main: Option<&Compiled>) -> Vec<u8> {
    let uses_log = functions.iter().any(|func| uses_log(&func.ops))
        || main.is_some_and(|body| uses_log(&body.ops));
    let mut types = Vec::new();
    let log_type = if uses_log {
        Some(intern_type(&mut types, 1, 0))
    } else {
        None
    };
    let mut func_types = Vec::new();
    for sig in signatures {
        let results = u32::from(sig.returns_int);
        func_types.push(intern_type(&mut types, sig.params.len() as u32, results));
    }
    let main_type = if main.is_some() {
        Some(intern_type(&mut types, 0, 0))
    } else {
        None
    };

    let mut module = vec![0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00];
    if !types.is_empty() {
        let mut body = Vec::new();
        uleb(&mut body, types.len() as u32);
        for ty in &types {
            body.push(0x60);
            uleb(&mut body, ty.params);
            body.extend(std::iter::repeat_n(0x7f, ty.params as usize));
            uleb(&mut body, ty.results);
            body.extend(std::iter::repeat_n(0x7f, ty.results as usize));
        }
        section(&mut module, 1, &body);
    }

    let import_count = u32::from(uses_log);
    if let Some(log_type) = log_type {
        let mut body = Vec::new();
        uleb(&mut body, 1);
        name(&mut body, "env");
        name(&mut body, "log");
        body.push(0x00);
        uleb(&mut body, log_type);
        section(&mut module, 2, &body);
    }

    let defined = functions.len() + usize::from(main.is_some());
    if defined > 0 {
        let mut body = Vec::new();
        uleb(&mut body, defined as u32);
        for ty in &func_types {
            uleb(&mut body, *ty);
        }
        if let Some(ty) = main_type {
            uleb(&mut body, ty);
        }
        section(&mut module, 3, &body);
    }

    let exported = signatures
        .iter()
        .enumerate()
        .filter(|(_, sig)| sig.exported)
        .collect::<Vec<_>>();
    if !exported.is_empty() {
        let mut body = Vec::new();
        uleb(&mut body, exported.len() as u32);
        for (index, sig) in exported {
            name(&mut body, &sig.name);
            body.push(0x00);
            uleb(&mut body, import_count + index as u32);
        }
        section(&mut module, 7, &body);
    }

    if main.is_some() {
        let mut body = Vec::new();
        uleb(&mut body, import_count + functions.len() as u32);
        section(&mut module, 8, &body);
    }

    if defined > 0 {
        let mut body = Vec::new();
        uleb(&mut body, defined as u32);
        for func in functions {
            push_code(&mut body, func.locals, &encode_ops(&func.ops, import_count));
        }
        if let Some(main) = main {
            push_code(&mut body, main.locals, &encode_ops(&main.ops, import_count));
        }
        section(&mut module, 10, &body);
    }
    module
}

fn uses_log(ops: &[Op]) -> bool {
    ops.iter().any(|op| matches!(op, Op::CallLog))
}

fn intern_type(types: &mut Vec<FuncType>, params: u32, results: u32) -> u32 {
    if let Some(index) = types
        .iter()
        .position(|ty| ty.params == params && ty.results == results)
    {
        return index as u32;
    }
    types.push(FuncType { params, results });
    (types.len() - 1) as u32
}

fn encode_ops(ops: &[Op], import_count: u32) -> Vec<u8> {
    let mut out = Vec::new();
    for op in ops {
        match op {
            Op::Byte(opcode) => out.push(*opcode),
            Op::Const(value) => {
                out.push(0x41);
                sleb(&mut out, *value);
            }
            Op::LocalGet(index) => {
                out.push(0x20);
                uleb(&mut out, *index);
            }
            Op::LocalSet(index) => {
                out.push(0x21);
                uleb(&mut out, *index);
            }
            Op::CallUser(index) => {
                out.push(0x10);
                uleb(&mut out, import_count + *index);
            }
            Op::CallLog => {
                out.push(0x10);
                uleb(&mut out, 0);
            }
            Op::Br(label) => {
                out.push(0x0c);
                uleb(&mut out, *label);
            }
            Op::BrIf(label) => {
                out.push(0x0d);
                uleb(&mut out, *label);
            }
        }
    }
    out
}

fn push_code(buf: &mut Vec<u8>, locals: u32, instr: &[u8]) {
    let mut body = Vec::new();
    if locals == 0 {
        uleb(&mut body, 0);
    } else {
        uleb(&mut body, 1);
        uleb(&mut body, locals);
        body.push(0x7f);
    }
    body.extend_from_slice(instr);
    body.push(0x0b);
    uleb(buf, body.len() as u32);
    buf.extend(body);
}

fn section(module: &mut Vec<u8>, id: u8, body: &[u8]) {
    module.push(id);
    uleb(module, body.len() as u32);
    module.extend_from_slice(body);
}

fn name(buf: &mut Vec<u8>, text: &str) {
    uleb(buf, text.len() as u32);
    buf.extend_from_slice(text.as_bytes());
}

fn uleb(buf: &mut Vec<u8>, mut value: u32) {
    loop {
        let mut byte = (value & 0x7f) as u8;
        value >>= 7;
        if value != 0 {
            byte |= 0x80;
        }
        buf.push(byte);
        if value == 0 {
            break;
        }
    }
}

fn sleb(buf: &mut Vec<u8>, mut value: i32) {
    loop {
        let byte = (value as u8) & 0x7f;
        value >>= 7;
        let signed = (byte & 0x40) != 0;
        if (value == 0 && !signed) || (value == -1 && signed) {
            buf.push(byte);
            break;
        }
        buf.push(byte | 0x80);
    }
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
            "wasm export requires a function name",
        ));
    };
    if func.params.rest.is_some() || func.r#async || func.generator {
        return Err(at(
            path,
            source,
            func.span(),
            "wasm export does not support rest, async, or generator functions",
        ));
    }
    let Some(body) = &func.body else {
        return Err(at(
            path,
            source,
            func.span(),
            "wasm export requires a function body",
        ));
    };
    let mut params = Vec::new();
    for param in &func.params.items {
        if param.initializer.is_some() {
            return Err(at(
                path,
                source,
                param.span(),
                "wasm export does not support default parameters",
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
                &format!("wasm export parameter '{param}' is declared again"),
            ));
        }
    }
    Ok(Func {
        name: id.name.to_string(),
        params,
        exported,
        returns_int: returns_int(&body.statements),
        locals,
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
                push_local(path, source, &declarator.id, declarator.span(), names)?;
            }
        }
        Statement::ForStatement(stmt) => {
            if let Some(ForStatementInit::VariableDeclaration(decl)) = &stmt.init {
                for declarator in &decl.declarations {
                    push_local(path, source, &declarator.id, declarator.span(), names)?;
                }
            }
            collect_stmt_locals(path, source, &stmt.body, names)?;
        }
        Statement::BlockStatement(block) => collect_locals(path, source, &block.body, names)?,
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

fn push_local(
    path: &Path,
    source: &str,
    pattern: &BindingPattern<'_>,
    span: Span,
    names: &mut Vec<String>,
) -> BundleResult<()> {
    let name = binding_name(path, source, pattern)?;
    if names.iter().any(|existing| existing == &name) {
        return Err(at(
            path,
            source,
            span,
            &format!("wasm export binding '{name}' is declared more than once"),
        ));
    }
    names.push(name);
    Ok(())
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
                "wasm export only supports plain integer names",
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
            "wasm export does not support string export names",
        )),
    }
}

fn at(path: &Path, source: &str, span: Span, message: &str) -> BundleError {
    let end = (span.start as usize).min(source.len());
    let line = source[..end].bytes().filter(|byte| *byte == b'\n').count() + 1;
    BundleError::new(format!("{}:{line}: {message}", path.display()))
}

#[cfg(test)]
mod tests {
    use super::sleb;

    #[test]
    fn signed_leb128_encodes_i32() {
        let mut buf = Vec::new();
        sleb(&mut buf, 0);
        assert_eq!(buf, [0]);
        buf.clear();
        sleb(&mut buf, 42);
        assert_eq!(buf, [42]);
        buf.clear();
        sleb(&mut buf, -1);
        assert_eq!(buf, [0x7f]);
        buf.clear();
        sleb(&mut buf, -2);
        assert_eq!(buf, [0x7e]);
        buf.clear();
        sleb(&mut buf, 128);
        assert_eq!(buf, [0x80, 0x01]);
    }
}
