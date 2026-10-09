//! Reprint finished JavaScript with indentation.
//!
//! The pass parses the bundle and prints it again. It does not rename bindings
//! or drop statements. A source map, when requested, records the move from the
//! pretty text back to the bundle that was printed.

use oxc_allocator::Allocator;
use oxc_codegen::{Codegen, CodegenOptions, IndentChar};
use oxc_parser::Parser;
use oxc_span::SourceType;

use crate::error::{BundleError, BundleResult};

pub struct Prettified {
    pub code: String,
    pub map: Option<String>,
}

/// Reprint `source` with two-space indentation.
pub fn prettify(source: &str, esm: bool, sourcemap_file: Option<&str>) -> BundleResult<Prettified> {
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
            "prettifier could not parse the bundle: {message}"
        )));
    }
    let mut options = CodegenOptions {
        indent_char: IndentChar::Space,
        indent_width: 2,
        ..CodegenOptions::default()
    };
    if let Some(file) = sourcemap_file {
        options.source_map_path = Some(std::path::PathBuf::from(file));
    }
    let printed = Codegen::new().with_options(options).build(&parsed.program);
    Ok(Prettified {
        code: printed.code,
        map: printed.map.map(|map| map.to_json_string()),
    })
}

#[cfg(test)]
mod tests {
    use super::prettify;

    #[test]
    fn indents_a_nested_function_and_stays_stable() {
        let source = "function add(a,b){if(a){return a+b}return b}\n";
        let once = prettify(source, false, None).unwrap().code;
        assert!(once.contains("function add(a, b) {"), "{once}");
        assert!(once.contains("\n  if (a) {"), "{once}");
        assert!(once.contains("\n    return a + b;"), "{once}");
        assert!(once.contains("\n  return b;"), "{once}");
        let twice = prettify(&once, false, None).unwrap().code;
        assert_eq!(twice, once);
    }

    #[test]
    fn keeps_a_comment_and_rejects_broken_input() {
        let source = "// keep-me\nfunction add(a, b) {\nreturn a + b\n}\n";
        let code = prettify(source, true, None).unwrap().code;
        assert!(code.contains("keep-me"), "{code}");
        assert!(code.contains("return a + b;"), "{code}");
        assert!(prettify("function (", false, None).is_err());
    }
}
