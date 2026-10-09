use std::fs;
use std::path::{Path, PathBuf};

use serde_json::Value;

use crate::error::{BundleError, BundleResult};
use crate::options::{Format, Target};

#[derive(Debug, Clone)]
pub struct FileConfig {
    pub entries: Vec<PathBuf>,
    pub output: Option<PathBuf>,
    pub minify: Option<bool>,
    pub prettify: Option<bool>,
    pub optimize: Option<bool>,
    pub strip_comments: Option<bool>,
    pub filename_comments: Option<bool>,
    pub external: Vec<String>,
    pub defines: Vec<(String, String)>,
    pub target: Option<Target>,
    pub format: Option<Format>,
    pub sourcemap: Option<bool>,
    pub jsx_pragma: Option<String>,
    pub jsx_fragment: Option<String>,
    pub watch: bool,
    pub report: bool,
    /// Worker count from `"threads"`. `None` keeps the build on one thread.
    pub threads: Option<usize>,
    /// `log`, `bar`, `tree`, or `json`.
    pub reporter: Option<String>,
}

pub fn load_config(path: &Path) -> BundleResult<FileConfig> {
    let text = fs::read_to_string(path)
        .map_err(|err| BundleError::new(format!("failed to read {}: {err}", path.display())))?;
    let value: Value = serde_json::from_str(&text)
        .map_err(|err| BundleError::new(format!("invalid JSON in {}: {err}", path.display())))?;
    let base = path.parent().unwrap_or(Path::new("."));
    let mut entries = Vec::new();
    if let Some(entry) = value.get("entry").and_then(Value::as_str) {
        entries.push(base.join(entry));
    }
    if let Some(list) = value.get("entries").and_then(Value::as_array) {
        for item in list {
            if let Some(entry) = item.as_str() {
                entries.push(base.join(entry));
            }
        }
    }
    let output = value
        .get("output")
        .and_then(Value::as_str)
        .map(|output| base.join(output));
    let external = value
        .get("external")
        .and_then(Value::as_array)
        .map(|items| {
            items
                .iter()
                .filter_map(Value::as_str)
                .map(str::to_string)
                .collect()
        })
        .unwrap_or_default();
    let mut defines = Vec::new();
    if let Some(map) = value.get("define").and_then(Value::as_object) {
        for (key, item) in map {
            let replacement = match item {
                Value::String(text) => text.clone(),
                other => other.to_string(),
            };
            defines.push((key.clone(), replacement));
        }
    }
    let target = value
        .get("target")
        .and_then(Value::as_str)
        .map(parse_target)
        .transpose()?;
    let format = value
        .get("format")
        .and_then(Value::as_str)
        .map(parse_format)
        .transpose()?;
    let jsx = value.get("jsx");
    Ok(FileConfig {
        entries,
        output,
        minify: value.get("minify").and_then(Value::as_bool),
        prettify: value.get("prettify").and_then(Value::as_bool),
        optimize: value.get("optimize").and_then(Value::as_bool),
        strip_comments: value.get("stripComments").and_then(Value::as_bool),
        filename_comments: value.get("filenameComments").and_then(Value::as_bool),
        external,
        defines,
        target,
        format,
        sourcemap: value.get("sourcemap").and_then(Value::as_bool),
        jsx_pragma: jsx
            .and_then(|jsx| jsx.get("pragma"))
            .and_then(Value::as_str)
            .map(str::to_string),
        jsx_fragment: jsx
            .and_then(|jsx| jsx.get("fragment"))
            .and_then(Value::as_str)
            .map(str::to_string),
        watch: value.get("watch").and_then(Value::as_bool).unwrap_or(false),
        report: value
            .get("report")
            .and_then(Value::as_bool)
            .unwrap_or(false),
        threads: parse_threads(&value)?,
        reporter: parse_reporter(&value)?,
    })
}

fn parse_threads(value: &Value) -> BundleResult<Option<usize>> {
    let Some(threads) = value.get("threads") else {
        return Ok(None);
    };
    let Some(count) = threads.as_u64() else {
        return Err(BundleError::new(
            "\"threads\" must be an integer of at least 1",
        ));
    };
    if count == 0 {
        return Err(BundleError::new("thread count must be at least 1"));
    }
    Ok(Some(count as usize))
}

fn parse_reporter(value: &Value) -> BundleResult<Option<String>> {
    let Some(reporter) = value.get("reporter") else {
        return Ok(None);
    };
    let Some(style) = reporter.as_str() else {
        return Err(BundleError::new(
            "\"reporter\" must be log, bar, tree, or json",
        ));
    };
    crate::report::parse_style(style)?;
    Ok(Some(style.to_string()))
}

pub fn parse_target(value: &str) -> BundleResult<Target> {
    match value {
        "node" => Ok(Target::Node),
        "browser" => Ok(Target::Browser),
        other => Err(BundleError::new(format!(
            "unknown target '{other}', expected node or browser"
        ))),
    }
}

pub fn parse_format(value: &str) -> BundleResult<Format> {
    match value {
        "cjs" => Ok(Format::Cjs),
        "esm" => Ok(Format::Esm),
        "asm" => Ok(Format::Asm),
        "wasm" => Ok(Format::Wasm),
        other => Err(BundleError::new(format!(
            "unknown format '{other}', expected cjs, esm, asm, or wasm"
        ))),
    }
}
