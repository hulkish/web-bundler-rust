//! Minify GLSL shader source nested inside JavaScript strings.
//!
//! Three.js stores shader chunks in template literals. The JavaScript minifier
//! leaves those strings intact, so comments and indentation survive. This pass
//! rewrites a string when it is shader source: directives such as `#include`
//! stay on their own lines, and a space remains between `#include` and `<name>`
//! so Three's include pattern still matches.

use oxc_allocator::Allocator;
use oxc_ast::ast::{Expression, Program};
use oxc_ast_visit::walk_mut::walk_expression as walk_expression_mut;
use oxc_ast_visit::VisitMut;
use oxc_str::Str;

pub fn minify_shaders<'a>(allocator: &'a Allocator, program: &mut Program<'a>) {
    ShaderMinifier { allocator }.visit_program(program);
}

struct ShaderMinifier<'a> {
    allocator: &'a Allocator,
}

impl<'a> VisitMut<'a> for ShaderMinifier<'a> {
    fn visit_expression(&mut self, expr: &mut Expression<'a>) {
        if let Expression::TaggedTemplateExpression(tagged) = expr {
            self.visit_expression(&mut tagged.tag);
            for expression in &mut tagged.quasi.expressions {
                self.visit_expression(expression);
            }
            return;
        }
        walk_expression_mut(self, expr);
        match expr {
            Expression::StringLiteral(literal) => {
                if literal.lone_surrogates {
                    return;
                }
                let Some(next) = minify_if_shader(literal.value.as_str()) else {
                    return;
                };
                literal.value = Str::from_str_in(&next, &self.allocator);
                literal.raw = None;
            }
            Expression::TemplateLiteral(template) => {
                if !template.expressions.is_empty() || template.quasis.len() != 1 {
                    return;
                }
                let Some(quasi) = template.quasis.first_mut() else {
                    return;
                };
                if quasi.lone_surrogates {
                    return;
                }
                let Some(cooked) = quasi.value.cooked.as_deref() else {
                    return;
                };
                let Some(next) = minify_if_shader(cooked) else {
                    return;
                };
                let raw = escape_template(&next);
                quasi.value.cooked = Some(Str::from_str_in(&next, &self.allocator));
                quasi.value.raw = Str::from_str_in(&raw, &self.allocator);
            }
            _ => {}
        }
    }
}

fn minify_if_shader(source: &str) -> Option<String> {
    if !looks_like_shader(source) {
        return None;
    }
    let next = minify_glsl(source);
    (next != source).then_some(next)
}

fn looks_like_shader(source: &str) -> bool {
    let mut directive = false;
    let mut shader = false;
    let mut typed = false;
    for line in source.split(['\n', '\r']) {
        let line = line.trim();
        if line.is_empty() || line.starts_with("//") {
            continue;
        }
        if is_directive(line) {
            directive = true;
        }
        if is_shader_statement(line) {
            shader = true;
        }
        if has_glsl_type(line) {
            typed = true;
        }
    }
    directive || (shader && typed)
}

fn is_directive(line: &str) -> bool {
    let Some(rest) = line.strip_prefix('#') else {
        return false;
    };
    let rest = rest.trim_start();
    [
        "include",
        "define",
        "ifdef",
        "ifndef",
        "if",
        "elif",
        "else",
        "endif",
        "undef",
        "extension",
        "pragma",
        "version",
        "line",
        "error",
    ]
    .into_iter()
    .any(|key| directive_word(rest, key))
}

fn directive_word(rest: &str, key: &str) -> bool {
    let Some(after) = rest.strip_prefix(key) else {
        return false;
    };
    after.is_empty() || after.starts_with(|c: char| c.is_whitespace() || c == '(' || c == '<')
}

fn is_shader_statement(line: &str) -> bool {
    line.contains("gl_Position")
        || line.contains("gl_FragColor")
        || line.contains("gl_FragDepth")
        || line.contains("gl_PointSize")
        || line.starts_with("precision ")
        || line.starts_with("uniform ")
        || line.starts_with("varying ")
        || line.starts_with("attribute ")
        || line.starts_with("void main")
}

fn has_glsl_type(line: &str) -> bool {
    line.contains("vec2")
        || line.contains("vec3")
        || line.contains("vec4")
        || line.contains("mat3")
        || line.contains("mat4")
        || line.contains("sampler2D")
        || line.contains("samplerCube")
        || line.contains("float")
}

fn minify_glsl(source: &str) -> String {
    let normalized = source.replace("\r\n", "\n").replace('\r', "\n");
    let stripped = strip_comments(&normalized);
    let spliced = splice_continuations(&stripped);
    let lead = normalized.starts_with('\n');
    let trail = normalized.ends_with('\n');
    let mut out = String::with_capacity(spliced.len());
    for line in spliced.split('\n') {
        // Three concatenates prefixes such as "#define " and "#define SHADER_TYPE "
        // with the macro name. The trailing space is the separator, so it stays.
        let (body, trailing) = split_trailing_hspace(line);
        let collapsed = collapse_line(body.trim_start());
        if collapsed.is_empty() {
            continue;
        }
        if collapsed.starts_with('#') {
            if !out.is_empty() && !out.ends_with('\n') {
                out.push('\n');
            }
            out.push_str(&collapsed);
            out.push_str(trailing);
            out.push('\n');
        } else if out.is_empty() || out.ends_with('\n') {
            out.push_str(&collapsed);
            out.push_str(trailing);
        } else {
            let prev = out.chars().next_back().unwrap();
            let next = collapsed.chars().next().unwrap();
            if is_word(prev) && is_word(next) {
                out.push(' ');
            }
            out.push_str(&collapsed);
            out.push_str(trailing);
        }
    }
    if lead && !out.starts_with('\n') {
        out.insert(0, '\n');
    }
    if trail && !out.ends_with('\n') {
        out.push('\n');
    }
    if !trail && out.ends_with('\n') {
        out.pop();
    }
    out
}

fn split_trailing_hspace(line: &str) -> (&str, &str) {
    let body_len = line.trim_end_matches([' ', '\t']).len();
    (&line[..body_len], &line[body_len..])
}

fn strip_comments(source: &str) -> String {
    let chars: Vec<char> = source.chars().collect();
    let mut out = String::with_capacity(source.len());
    let mut index = 0;
    let mut in_string = false;
    while index < chars.len() {
        let current = chars[index];
        if in_string {
            out.push(current);
            if current == '\\' && index + 1 < chars.len() {
                index += 1;
                out.push(chars[index]);
            } else if current == '"' {
                in_string = false;
            }
            index += 1;
            continue;
        }
        if current == '"' {
            in_string = true;
            out.push(current);
            index += 1;
            continue;
        }
        if current == '/' && chars.get(index + 1) == Some(&'/') {
            index += 2;
            while index < chars.len() && chars[index] != '\n' {
                index += 1;
            }
            continue;
        }
        if current == '/' && chars.get(index + 1) == Some(&'*') {
            index += 2;
            let mut split_line = false;
            while index < chars.len()
                && !(chars[index] == '*' && chars.get(index + 1) == Some(&'/'))
            {
                if chars[index] == '\n' {
                    split_line = true;
                }
                index += 1;
            }
            if index < chars.len() {
                index += 2;
            }
            if split_line {
                out.push('\n');
            } else {
                out.push(' ');
            }
            continue;
        }
        out.push(current);
        index += 1;
    }
    out
}

fn splice_continuations(source: &str) -> String {
    let mut out = String::with_capacity(source.len());
    let mut chars = source.chars().peekable();
    while let Some(current) = chars.next() {
        if current == '\\' && chars.peek() == Some(&'\n') {
            chars.next();
            while matches!(chars.peek(), Some(next) if next.is_whitespace() && *next != '\n') {
                chars.next();
            }
            out.push(' ');
            continue;
        }
        out.push(current);
    }
    out
}

fn collapse_line(line: &str) -> String {
    let keep_define_space = define_keeps_space_before_paren(line);
    let mut out = String::with_capacity(line.len());
    let mut chars = line.chars().peekable();
    let mut in_string = false;
    let mut pending_space = false;
    let mut guarded_paren = keep_define_space;
    while let Some(current) = chars.next() {
        if in_string {
            out.push(current);
            if current == '\\' {
                if let Some(escaped) = chars.next() {
                    out.push(escaped);
                }
            } else if current == '"' {
                in_string = false;
            }
            pending_space = false;
            continue;
        }
        if current == '"' {
            if pending_space && needs_gap(&out, current) {
                out.push(' ');
            }
            pending_space = false;
            in_string = true;
            out.push(current);
            continue;
        }
        if current.is_whitespace() {
            pending_space = !out.is_empty();
            continue;
        }
        if current == '(' && guarded_paren {
            if pending_space {
                out.push(' ');
            }
            guarded_paren = false;
            pending_space = false;
            out.push(current);
            continue;
        }
        if pending_space && needs_gap(&out, current) {
            out.push(' ');
        }
        pending_space = false;
        out.push(current);
    }
    out
}

fn define_keeps_space_before_paren(line: &str) -> bool {
    let Some(rest) = line.trim_start().strip_prefix("#define") else {
        return false;
    };
    let mut chars = rest.trim_start().chars().peekable();
    if !matches!(chars.peek(), Some(current) if is_word(*current)) {
        return false;
    }
    while matches!(chars.peek(), Some(current) if is_word(*current)) {
        chars.next();
    }
    if !matches!(chars.peek(), Some(current) if current.is_whitespace()) {
        return false;
    }
    while matches!(chars.peek(), Some(current) if current.is_whitespace()) {
        chars.next();
    }
    chars.peek() == Some(&'(')
}

fn needs_gap(out: &str, next: char) -> bool {
    let Some(prev) = out.chars().next_back() else {
        return false;
    };
    if next == '<' && out.ends_with("include") {
        return true;
    }
    is_word(prev) && is_word(next)
}

fn is_word(current: char) -> bool {
    current.is_ascii_alphanumeric() || current == '_'
}

fn escape_template(cooked: &str) -> String {
    let mut raw = String::with_capacity(cooked.len());
    let mut chars = cooked.chars().peekable();
    while let Some(current) = chars.next() {
        match current {
            '\\' => raw.push_str("\\\\"),
            '`' => raw.push_str("\\`"),
            '$' if chars.peek() == Some(&'{') => {
                chars.next();
                raw.push_str("\\${");
            }
            _ => raw.push(current),
        }
    }
    raw
}

#[cfg(test)]
mod tests {
    use super::minify_glsl;

    #[test]
    fn drops_shader_comments_and_keeps_include_lines() {
        let source = "\n#define PI 3.141592653589793\n// drop-shader-comment\n#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n#include <common>\nfloat pow2( const in float x ) { return x * x; }\n";
        let out = minify_glsl(source);
        assert!(!out.contains("drop-shader-comment"), "{out}");
        assert!(out.contains("#include <common>"), "{out}");
        assert!(out.contains("#define saturate(a)clamp(a,0.0,1.0)"), "{out}");
        assert!(
            out.contains("float pow2(const in float x){return x*x;}"),
            "{out}"
        );
        assert!(out.starts_with('\n'), "{out}");
        assert!(out.ends_with('\n'), "{out}");
        assert_eq!(minify_glsl(&out), out);
    }

    #[test]
    fn keeps_the_trailing_space_three_uses_to_join_define_names() {
        assert_eq!(minify_glsl("#define "), "#define ");
        assert_eq!(minify_glsl("#define SHADER_TYPE "), "#define SHADER_TYPE ");
        assert_eq!(
            minify_glsl("#define DEPTH_PACKING "),
            "#define DEPTH_PACKING "
        );
        assert_eq!(minify_glsl(&minify_glsl("#define ")), "#define ");
    }

    #[test]
    fn keeps_an_object_like_define_from_becoming_a_function() {
        let source = "#define PI (3.141592653589793)\n";
        let out = minify_glsl(source);
        assert_eq!(out, "#define PI (3.141592653589793)\n");
    }
}
