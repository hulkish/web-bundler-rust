//! Make an ES module bundle look like an ES module.
//!
//! Modules are already strict, so a `"use strict"` directive is removed. A
//! string that merely contains that text stays. `var` becomes `const` or `let`
//! only when that keeps the same bindings: loop heads, nested blocks, switch
//! cases, use-before-init, and `"use asm"` functions stay `var`.

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    Directive, Expression, ExpressionStatement, FunctionBody, Program, VariableDeclaration,
};
use oxc_ast_visit::walk::{
    walk_expression_statement, walk_function_body, walk_program, walk_variable_declaration,
};
use oxc_ast_visit::Visit;
use oxc_parser::Parser;
use oxc_semantic::SemanticBuilder;
use oxc_span::{SourceType, Span};

use crate::minify::prefer_lexical_declarations;

pub(crate) struct ShapeEdit {
    pub start: u32,
    pub end: u32,
    pub delta: i32,
}

/// Rewrite `source` when it is the text of an ES module bundle.
///
/// Returns the new text and the spans that changed, in original coordinates,
/// so sourcemap points can move with the edit. `None` means the text is already
/// in shape, or it could not be parsed and should be left alone.
pub(crate) fn respect_esm(source: &str) -> Option<(String, Vec<ShapeEdit>)> {
    let allocator = Allocator::default();
    let mut parsed = Parser::new(&allocator, source, SourceType::mjs()).parse();
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
    prefer_lexical_declarations(&mut parsed.program, &scoping);
    let mut found = Finder {
        source,
        cuts: Vec::new(),
        keywords: Vec::new(),
        asm: Vec::new(),
    };
    found.visit_program(&parsed.program);
    if found.cuts.is_empty() && found.keywords.is_empty() {
        return None;
    }
    let mut edits = Vec::new();
    for (start, end) in found.cuts {
        edits.push(TextEdit {
            start,
            end,
            text: String::new(),
        });
    }
    for (start, word) in found.keywords {
        edits.push(TextEdit {
            start,
            end: start + 3,
            text: word.to_string(),
        });
    }
    edits.sort_by_key(|edit| edit.start);
    if overlaps(&edits) {
        return None;
    }
    let shifted = edits
        .iter()
        .map(|edit| ShapeEdit {
            start: edit.start,
            end: edit.end,
            delta: edit.text.len() as i32 - (edit.end - edit.start) as i32,
        })
        .collect();
    Some((apply(source, &edits)?, shifted))
}

pub(crate) fn shift_generated(offset: u32, edits: &[ShapeEdit]) -> u32 {
    let mut shift = 0i32;
    for edit in edits {
        if offset <= edit.start {
            break;
        }
        if offset >= edit.end {
            shift += edit.delta;
        } else {
            return add_shift(edit.start, shift);
        }
    }
    add_shift(offset, shift)
}

fn add_shift(offset: u32, shift: i32) -> u32 {
    let next = offset as i32 + shift;
    if next < 0 {
        0
    } else {
        next as u32
    }
}

struct TextEdit {
    start: u32,
    end: u32,
    text: String,
}

struct Finder<'a> {
    source: &'a str,
    cuts: Vec<(u32, u32)>,
    keywords: Vec<(u32, &'static str)>,
    asm: Vec<Span>,
}

impl<'a> Visit<'a> for Finder<'_> {
    fn visit_program(&mut self, program: &Program<'a>) {
        self.note_directives(&program.directives);
        if has_asm(&program.directives) {
            self.asm.push(program.span);
        }
        walk_program(self, program);
    }

    fn visit_function_body(&mut self, body: &FunctionBody<'a>) {
        self.note_directives(&body.directives);
        if has_asm(&body.directives) {
            self.asm.push(body.span);
        }
        walk_function_body(self, body);
    }

    fn visit_variable_declaration(&mut self, decl: &VariableDeclaration<'a>) {
        self.note_var(decl);
        walk_variable_declaration(self, decl);
    }

    fn visit_expression_statement(&mut self, stmt: &ExpressionStatement<'a>) {
        // A `"use strict";` after other statements is not a directive. It only
        // yields that string, so an ES module can drop the statement.
        if string_value(&stmt.expression) == Some("use strict") {
            let (start, end) = directive_range(self.source, stmt.span);
            if start < end {
                self.cuts.push((start, end));
            }
        }
        walk_expression_statement(self, stmt);
    }
}

impl Finder<'_> {
    fn note_directives(&mut self, directives: &[Directive<'_>]) {
        for directive in directives {
            if directive.expression.value.as_str() != "use strict" {
                continue;
            }
            let (start, end) = directive_range(self.source, directive.span);
            if start < end {
                self.cuts.push((start, end));
            }
        }
    }

    fn note_var(&mut self, decl: &VariableDeclaration<'_>) {
        if decl.kind.is_var() {
            return;
        }
        let start = decl.span.start;
        if self
            .asm
            .iter()
            .any(|span| span.start <= start && start < span.end)
        {
            return;
        }
        let at = start as usize;
        if self.source.get(at..at + 3) != Some("var") {
            return;
        }
        let word = if decl.kind.is_const() { "const" } else { "let" };
        self.keywords.push((start, word));
    }
}

fn string_value<'a>(expr: &'a Expression<'a>) -> Option<&'a str> {
    match expr {
        Expression::StringLiteral(literal) => Some(literal.value.as_str()),
        Expression::ParenthesizedExpression(inner) => string_value(&inner.expression),
        _ => None,
    }
}

fn has_asm(directives: &[Directive<'_>]) -> bool {
    directives
        .iter()
        .any(|directive| directive.expression.value.as_str() == "use asm")
}

/// Drop a directive line, including its indent and the newline that ends it.
fn directive_range(source: &str, span: Span) -> (u32, u32) {
    let bytes = source.as_bytes();
    let mut start = span.start as usize;
    let mut end = (span.end as usize).min(bytes.len());
    start = start.min(end);
    while end < bytes.len() && matches!(bytes[end], b' ' | b'\t') {
        end += 1;
    }
    if end + 1 < bytes.len() && bytes[end] == b'\r' && bytes[end + 1] == b'\n' {
        end += 2;
    } else if end < bytes.len() && matches!(bytes[end], b'\n' | b'\r') {
        end += 1;
    }
    let line_start = source[..start]
        .rfind('\n')
        .map(|index| index + 1)
        .unwrap_or(0);
    if source[line_start..start]
        .bytes()
        .all(|byte| byte == b' ' || byte == b'\t')
    {
        start = line_start;
    }
    (start as u32, end as u32)
}

fn overlaps(edits: &[TextEdit]) -> bool {
    edits.windows(2).any(|pair| pair[1].start < pair[0].end)
}

fn apply(source: &str, edits: &[TextEdit]) -> Option<String> {
    let mut out = source.to_string();
    for edit in edits.iter().rev() {
        let start = edit.start as usize;
        let end = edit.end as usize;
        if start > end
            || end > out.len()
            || !out.is_char_boundary(start)
            || !out.is_char_boundary(end)
        {
            return None;
        }
        out.replace_range(start..end, &edit.text);
    }
    Some(out)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn shaped(source: &str) -> String {
        respect_esm(source)
            .map(|(code, _)| code)
            .unwrap_or_else(|| source.to_string())
    }

    fn strict_line(code: &str) -> bool {
        code.lines().any(|line| {
            let line = line.trim();
            line == "\"use strict\";" || line == "'use strict';"
        })
    }

    #[test]
    fn drops_the_directive_and_promotes_an_initialized_binding() {
        let out = shaped("\"use strict\";\nvar label = 1;\nconsole.log(label, \"use strict\");\n");
        assert!(!strict_line(&out), "{out}");
        assert!(out.contains("const label = 1;"), "{out}");
        assert!(out.contains("\"use strict\""), "{out}");
        assert!(!out.contains("var label"), "{out}");
    }

    #[test]
    fn a_mutated_binding_becomes_let() {
        let out = shaped("var value = 1;\nvalue = value + 1;\nconsole.log(value);\n");
        assert!(out.contains("let value = 1;"), "{out}");
        assert!(out.contains("value = value + 1;"), "{out}");
    }

    #[test]
    fn property_writes_still_allow_const() {
        let out = shaped("var box = { n: 1 };\nbox.n = 2;\nconsole.log(box.n);\n");
        assert!(out.contains("const box = { n: 1 };"), "{out}");
    }

    #[test]
    fn use_before_init_and_a_hoisted_read_stay_var() {
        let early = shaped("console.log(n);\nvar n = 1;\n");
        assert!(early.contains("var n = 1;"), "{early}");
        let hoisted = shaped("function read() { return n; }\nconsole.log(read());\nvar n = 1;\n");
        assert!(hoisted.contains("var n = 1;"), "{hoisted}");
    }

    #[test]
    fn loops_blocks_switch_and_eval_stay_var() {
        let looped = shaped("var total = 0;\nfor (var i = 0; i < 3; i++) total += i;\n");
        assert!(looped.contains("let total = 0;"), "{looped}");
        assert!(looped.contains("for (var i = 0;"), "{looped}");
        let nested = shaped("{\n  var inner = 3;\n}\nconsole.log(inner);\n");
        assert!(nested.contains("var inner = 3;"), "{nested}");
        let switched = shaped(
            "switch (1) {\n  case 1:\n    var seen = 1;\n  case 2:\n    console.log(seen);\n}\n",
        );
        assert!(switched.contains("var seen = 1;"), "{switched}");
        let evaluated = shaped("function box() {\n  var n = 1;\n  eval(\"\");\n  return n;\n}\n");
        assert!(evaluated.contains("var n = 1;"), "{evaluated}");
    }

    #[test]
    fn an_asm_function_keeps_var_and_its_directive() {
        let out = shaped("function asm() {\n  \"use asm\";\n  var n = 1;\n  return n | 0;\n}\n");
        assert!(out.contains("\"use asm\";"), "{out}");
        assert!(out.contains("var n = 1;"), "{out}");
    }

    #[test]
    fn a_string_statement_after_other_code_is_removed() {
        let out = shaped("function read() {\n  var n = 1;\n  \"use strict\";\n  return n;\n}\n");
        assert!(!strict_line(&out), "{out}");
        assert!(out.contains("const n = 1;"), "{out}");
        assert!(out.contains("return n;"), "{out}");
        let kept = shaped("console.log(\"use strict\");\n");
        assert_eq!(kept, "console.log(\"use strict\");\n");
    }

    #[test]
    fn a_function_directive_line_is_removed() {
        let out = shaped("function read() {\n  \"use strict\";\n  var n = 1;\n  return n;\n}\n");
        assert!(!strict_line(&out), "{out}");
        assert!(out.contains("const n = 1;"), "{out}");
        assert!(out.contains("function read() {\n  const n = 1;\n"), "{out}");
    }

    #[test]
    fn exported_var_and_a_real_string_are_handled() {
        let out =
            shaped("export var value = 1;\nconsole.log(Function('\"use strict\"; return 1'));\n");
        assert!(out.contains("export const value = 1;"), "{out}");
        assert!(out.contains("'\"use strict\"; return 1'"), "{out}");
        assert!(!strict_line(&out), "{out}");
    }

    #[test]
    fn a_second_pass_changes_nothing() {
        let once = shaped("\"use strict\";\nvar label = 1;\nlabel = 2;\nconsole.log(label);\n");
        assert!(respect_esm(&once).is_none(), "{once}");
    }

    #[test]
    fn const_shifts_a_later_offset_and_a_cut_pulls_it_back() {
        let source = "\"use strict\";\nvar label = 1;\nconsole.log(label);\n";
        let (code, edits) = respect_esm(source).unwrap();
        let marker = source.find("console.log").unwrap() as u32;
        let shifted = shift_generated(marker, &edits);
        assert_eq!(&code[shifted as usize..shifted as usize + 7], "console");
        assert!(code.len() < source.len());
    }
}
