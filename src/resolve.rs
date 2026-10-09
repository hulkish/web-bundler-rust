use std::cell::RefCell;
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

use serde_json::Value;

thread_local! {
    static CACHE: RefCell<Cache> = RefCell::new(Cache::default());
}

#[derive(Default)]
struct Cache {
    json: HashMap<PathBuf, Result<Value, String>>,
    canonical: HashMap<PathBuf, PathBuf>,
    probe: HashMap<PathBuf, Option<PathBuf>>,
    /// Directory to the nearest parent that contains `package.json`.
    package_dir: HashMap<PathBuf, Option<PathBuf>>,
    side_effects: HashMap<PathBuf, bool>,
    is_module: HashMap<PathBuf, bool>,
    cwd: Option<Option<PathBuf>>,
}

/// Drop cached package metadata. Each bundle starts clean so a later rebuild
/// sees files that changed on disk.
pub fn clear_resolve_cache() {
    CACHE.with(|cache| *cache.borrow_mut() = Cache::default());
}

use crate::error::{BundleError, BundleResult};
use crate::options::Target;

const EXTENSIONS: &[&str] = &["js", "mjs", "cjs", "jsx", "ts", "tsx", "mts", "cts", "json"];

const ASSET_EXTENSIONS: &[&str] = &[
    "svg", "png", "jpg", "jpeg", "gif", "webp", "ico", "woff", "woff2", "ttf", "eot", "otf", "mp3",
    "mp4", "webm", "wav",
];

const NODE_BUILTINS: &[&str] = &[
    "assert",
    "async_hooks",
    "buffer",
    "child_process",
    "cluster",
    "console",
    "constants",
    "crypto",
    "dgram",
    "diagnostics_channel",
    "dns",
    "domain",
    "events",
    "fs",
    "http",
    "http2",
    "https",
    "inspector",
    "module",
    "net",
    "os",
    "path",
    "perf_hooks",
    "process",
    "punycode",
    "querystring",
    "readline",
    "repl",
    "stream",
    "string_decoder",
    "sys",
    "timers",
    "tls",
    "trace_events",
    "tty",
    "url",
    "util",
    "v8",
    "vm",
    "wasi",
    "worker_threads",
    "zlib",
];

#[derive(Debug, Clone)]
pub enum Resolved {
    Local(PathBuf),
    External(String),
    Css(PathBuf),
    Asset(PathBuf),
}

impl Resolved {
    pub fn path(&self) -> Option<&Path> {
        match self {
            Self::Local(path) | Self::Css(path) | Self::Asset(path) => Some(path),
            Self::External(_) => None,
        }
    }
}

pub fn resolve_entry(path: &Path) -> BundleResult<PathBuf> {
    probe(path)?
        .ok_or_else(|| BundleError::new(format!("entry point not found: {}", path.display())))
}

pub fn resolve_specifier(
    from_file: &Path,
    specifier: &str,
    external: &[String],
    target: Target,
) -> BundleResult<Resolved> {
    if is_node_specifier(specifier) {
        if target == Target::Browser {
            return Err(BundleError::new(format!(
                "cannot bundle node built-in '{specifier}' for the browser"
            )));
        }
        return Ok(Resolved::External(specifier.to_string()));
    }
    if is_external_specifier(specifier, external) {
        return Ok(Resolved::External(specifier.to_string()));
    }

    if is_relative_or_absolute(specifier) {
        let base = from_file.parent().unwrap_or(Path::new("."));
        let candidate = if specifier.starts_with('/') {
            PathBuf::from(specifier)
        } else {
            base.join(specifier)
        };
        return probe(&candidate)?
            .ok_or_else(|| {
                BundleError::new(format!(
                    "cannot resolve '{specifier}' from {}",
                    display_path(from_file)
                ))
            })
            .map(classify);
    }

    resolve_package_specifier(from_file, specifier)
}

pub fn package_is_module(file: &Path) -> bool {
    if let Some(hit) = CACHE.with(|cache| cache.borrow().is_module.get(file).copied()) {
        return hit;
    }
    let value = file
        .parent()
        .and_then(nearest_package_dir)
        .and_then(|dir| read_json(&dir.join("package.json")).ok())
        .and_then(|meta| meta.get("type").and_then(Value::as_str).map(str::to_string))
        .as_deref()
        == Some("module");
    CACHE.with(|cache| {
        cache
            .borrow_mut()
            .is_module
            .insert(file.to_path_buf(), value);
    });
    value
}

fn resolve_package_specifier(from_file: &Path, specifier: &str) -> BundleResult<Resolved> {
    let (name, subpath) = split_package_name(specifier);
    let mut dir = from_file.parent();
    while let Some(current) = dir {
        let package_dir = current.join("node_modules").join(&name);
        if package_dir.is_dir() {
            return resolve_package_dir(&package_dir, subpath.as_deref(), from_file, specifier);
        }
        dir = current.parent();
    }
    Err(BundleError::new(format!(
        "cannot resolve package '{specifier}' from {}. Pass --external {name} to leave it as a runtime require.",
        display_path(from_file)
    )))
}

fn resolve_package_dir(
    package_dir: &Path,
    subpath: Option<&str>,
    from_file: &Path,
    specifier: &str,
) -> BundleResult<Resolved> {
    let meta = read_json(&package_dir.join("package.json")).ok();

    if let Some(subpath) = subpath {
        if let Some(meta) = &meta {
            if let Some(exports) = meta.get("exports") {
                if let Some(target) = export_subpath(exports, subpath) {
                    if let Some(found) = probe(&package_dir.join(target))? {
                        return Ok(classify(found));
                    }
                }
            }
        }
        return probe(&package_dir.join(subpath))?
            .map(classify)
            .ok_or_else(|| missing_package(specifier, from_file));
    }

    if let Some(meta) = &meta {
        if let Some(exports) = meta.get("exports") {
            if let Some(target) = export_root(exports) {
                if let Some(found) = probe(&package_dir.join(target))? {
                    return Ok(classify(found));
                }
            }
        }
        for field in ["module", "main"] {
            if let Some(target) = meta.get(field).and_then(Value::as_str) {
                if let Some(found) = probe(&package_dir.join(target))? {
                    return Ok(classify(found));
                }
            }
        }
    }

    probe_directory(package_dir)?
        .ok_or_else(|| missing_package(specifier, from_file))
        .map(classify)
}

fn missing_package(specifier: &str, from_file: &Path) -> BundleError {
    BundleError::new(format!(
        "cannot resolve '{specifier}' from {}",
        display_path(from_file)
    ))
}

fn probe(path: &Path) -> BundleResult<Option<PathBuf>> {
    let key = path.to_path_buf();
    if let Some(hit) = CACHE.with(|cache| cache.borrow().probe.get(&key).cloned()) {
        return Ok(hit);
    }
    let found = probe_uncached(path)?;
    CACHE.with(|cache| {
        cache.borrow_mut().probe.insert(key, found.clone());
    });
    Ok(found)
}

fn probe_uncached(path: &Path) -> BundleResult<Option<PathBuf>> {
    if path.is_file() {
        return Ok(Some(canonicalize(path)?));
    }

    if path.extension().is_none() {
        for ext in EXTENSIONS {
            let candidate = path.with_extension(ext);
            if candidate.is_file() {
                return Ok(Some(canonicalize(&candidate)?));
            }
        }
    }

    if path.is_dir() {
        return probe_directory(path);
    }

    Ok(None)
}

fn probe_directory(dir: &Path) -> BundleResult<Option<PathBuf>> {
    let package_json = dir.join("package.json");
    if package_json.is_file() {
        if let Ok(meta) = read_json(&package_json) {
            for field in ["module", "main"] {
                if let Some(target) = meta.get(field).and_then(Value::as_str) {
                    if let Some(found) = probe(&dir.join(target))? {
                        return Ok(Some(found));
                    }
                }
            }
        }
    }

    for name in [
        "index.js",
        "index.mjs",
        "index.cjs",
        "index.jsx",
        "index.ts",
        "index.tsx",
        "index.mts",
        "index.cts",
        "index.json",
    ] {
        let candidate = dir.join(name);
        if candidate.is_file() {
            return Ok(Some(canonicalize(&candidate)?));
        }
    }
    Ok(None)
}

fn export_root(exports: &Value) -> Option<String> {
    match exports {
        Value::String(_) => pick_export_target(exports),
        Value::Object(map) => map
            .get(".")
            .and_then(pick_export_target)
            .or_else(|| pick_export_target(exports)),
        _ => None,
    }
}

fn export_subpath(exports: &Value, subpath: &str) -> Option<String> {
    let Value::Object(map) = exports else {
        return None;
    };
    let key = format!("./{subpath}");
    if let Some(found) = map.get(&key).and_then(pick_export_target) {
        return Some(found);
    }
    let mut best: Option<(usize, String)> = None;
    for (pattern, target) in map {
        let Some(star) = pattern.find('*') else {
            continue;
        };
        if pattern[star + 1..].contains('*') {
            continue;
        }
        let prefix = &pattern[..star];
        let suffix = &pattern[star + 1..];
        if !key.starts_with(prefix) || !key.ends_with(suffix) {
            continue;
        }
        if key.len() < prefix.len() + suffix.len() {
            continue;
        }
        let captured = &key[prefix.len()..key.len() - suffix.len()];
        if captured
            .split('/')
            .any(|part| part.is_empty() || part == "." || part == "..")
        {
            continue;
        }
        let Some(template) = pick_export_target(target) else {
            continue;
        };
        if !template.contains('*') {
            continue;
        }
        let replaced = template.replacen('*', captured, 1);
        if best.as_ref().is_none_or(|(score, _)| prefix.len() > *score) {
            best = Some((prefix.len(), replaced));
        }
    }
    best.map(|(_, path)| path)
}

fn pick_export_target(value: &Value) -> Option<String> {
    match value {
        Value::String(target) => Some(target.clone()),
        Value::Array(items) => items.iter().find_map(pick_export_target),
        Value::Object(map) => {
            for key in ["import", "module", "browser", "default", "require"] {
                if let Some(found) = map.get(key).and_then(pick_export_target) {
                    return Some(found);
                }
            }
            None
        }
        _ => None,
    }
}

fn split_package_name(specifier: &str) -> (String, Option<String>) {
    if let Some(rest) = specifier.strip_prefix('@') {
        let (scope, after) = rest.split_once('/').unwrap_or((rest, ""));
        let (name, sub) = after.split_once('/').unwrap_or((after, ""));
        let package = if name.is_empty() {
            format!("@{scope}")
        } else {
            format!("@{scope}/{name}")
        };
        let subpath = (!sub.is_empty()).then(|| sub.to_string());
        (package, subpath)
    } else {
        let (name, sub) = specifier.split_once('/').unwrap_or((specifier, ""));
        let subpath = (!sub.is_empty()).then(|| sub.to_string());
        (name.to_string(), subpath)
    }
}

fn is_relative_or_absolute(specifier: &str) -> bool {
    specifier.starts_with('.') || specifier.starts_with('/')
}

fn is_node_specifier(specifier: &str) -> bool {
    specifier.starts_with("node:") || is_node_builtin(specifier)
}

fn is_external_specifier(specifier: &str, external: &[String]) -> bool {
    external.iter().any(|name| {
        specifier == name
            || specifier
                .strip_prefix(name.as_str())
                .is_some_and(|rest| rest.starts_with('/'))
    })
}

pub fn module_has_side_effects(file: &Path) -> bool {
    if let Some(hit) = CACHE.with(|cache| cache.borrow().side_effects.get(file).copied()) {
        return hit;
    }
    let value = side_effects_uncached(file);
    CACHE.with(|cache| {
        cache
            .borrow_mut()
            .side_effects
            .insert(file.to_path_buf(), value);
    });
    value
}

fn side_effects_uncached(file: &Path) -> bool {
    let Some(parent) = file.parent() else {
        return true;
    };
    let Some(package_dir) = nearest_package_dir(parent) else {
        return true;
    };
    let Ok(value) = read_json(&package_dir.join("package.json")) else {
        return true;
    };
    let relative = file
        .strip_prefix(&package_dir)
        .map(|path| path.to_string_lossy().replace('\\', "/"))
        .unwrap_or_default();
    match value.get("sideEffects") {
        Some(Value::Bool(side_effects)) => *side_effects,
        Some(Value::Array(patterns)) => patterns.iter().any(|pattern| {
            pattern
                .as_str()
                .is_some_and(|pattern| glob_match(pattern, &relative))
        }),
        Some(Value::String(pattern)) => glob_match(pattern, &relative),
        _ => true,
    }
}

fn nearest_package_dir(start: &Path) -> Option<PathBuf> {
    let mut current = start.to_path_buf();
    let mut pending: Vec<PathBuf> = Vec::new();
    loop {
        if let Some(known) = CACHE.with(|cache| cache.borrow().package_dir.get(&current).cloned()) {
            for dir in &pending {
                let found = known.clone();
                CACHE.with(|cache| {
                    cache.borrow_mut().package_dir.insert(dir.clone(), found);
                });
            }
            return known;
        }
        if current.join("package.json").is_file() {
            let found = Some(current.clone());
            pending.push(current);
            for dir in pending {
                CACHE.with(|cache| {
                    cache.borrow_mut().package_dir.insert(dir, found.clone());
                });
            }
            return found;
        }
        pending.push(current.clone());
        match current.parent() {
            Some(parent) => current = parent.to_path_buf(),
            None => {
                for dir in pending {
                    CACHE.with(|cache| {
                        cache.borrow_mut().package_dir.insert(dir, None);
                    });
                }
                return None;
            }
        }
    }
}

fn glob_match(pattern: &str, text: &str) -> bool {
    fn rec(pattern: &[u8], text: &[u8]) -> bool {
        let mut pattern_index = 0;
        let mut text_index = 0;
        while pattern_index < pattern.len() {
            if pattern[pattern_index] == b'*' {
                let double =
                    pattern_index + 1 < pattern.len() && pattern[pattern_index + 1] == b'*';
                let rest = if double {
                    let mut rest = &pattern[pattern_index + 2..];
                    if rest.first() == Some(&b'/') {
                        rest = &rest[1..];
                    }
                    rest
                } else {
                    &pattern[pattern_index + 1..]
                };
                let mut look = text_index;
                loop {
                    if rec(rest, &text[look..]) {
                        return true;
                    }
                    if look >= text.len() {
                        return false;
                    }
                    if !double && text[look] == b'/' {
                        return false;
                    }
                    look += 1;
                }
            }
            if text_index >= text.len() || pattern[pattern_index] != text[text_index] {
                return false;
            }
            pattern_index += 1;
            text_index += 1;
        }
        text_index == text.len()
    }
    rec(pattern.as_bytes(), text.as_bytes())
}

fn classify(path: PathBuf) -> Resolved {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some("css") => Resolved::Css(path),
        Some(ext) if ASSET_EXTENSIONS.contains(&ext) => Resolved::Asset(path),
        _ => Resolved::Local(path),
    }
}

pub fn is_css(path: &Path) -> bool {
    path.extension().and_then(|ext| ext.to_str()) == Some("css")
}

pub fn is_asset(path: &Path) -> bool {
    path.extension()
        .and_then(|ext| ext.to_str())
        .is_some_and(|ext| ASSET_EXTENSIONS.contains(&ext))
}

fn is_node_builtin(specifier: &str) -> bool {
    let specifier = specifier.strip_prefix("node:").unwrap_or(specifier);
    let root = specifier.split('/').next().unwrap_or(specifier);
    NODE_BUILTINS.contains(&root) && (specifier == root || specifier[root.len()..].starts_with('/'))
}

fn read_json(path: &Path) -> BundleResult<Value> {
    let key = path.to_path_buf();
    if let Some(hit) = CACHE.with(|cache| cache.borrow().json.get(&key).cloned()) {
        return hit.map_err(BundleError::new);
    }
    let loaded = match fs::read_to_string(&key) {
        Ok(text) => serde_json::from_str(&text)
            .map_err(|err| format!("invalid JSON in {}: {err}", key.display())),
        Err(err) => Err(format!("failed to read {}: {err}", key.display())),
    };
    CACHE.with(|cache| {
        cache.borrow_mut().json.insert(key, loaded.clone());
    });
    loaded.map_err(BundleError::new)
}

fn canonicalize(path: &Path) -> BundleResult<PathBuf> {
    if let Some(hit) = CACHE.with(|cache| cache.borrow().canonical.get(path).cloned()) {
        return Ok(hit);
    }
    let found = fs::canonicalize(path)
        .map_err(|err| BundleError::new(format!("failed to resolve {}: {err}", path.display())))?;
    CACHE.with(|cache| {
        cache
            .borrow_mut()
            .canonical
            .insert(path.to_path_buf(), found.clone());
    });
    Ok(found)
}

pub fn display_path(path: &Path) -> String {
    let cwd = CACHE.with(|cache| {
        let mut cache = cache.borrow_mut();
        if cache.cwd.is_none() {
            cache.cwd = Some(std::env::current_dir().ok());
        }
        cache.cwd.clone().flatten()
    });
    cwd.and_then(|cwd| {
        path.strip_prefix(&cwd)
            .ok()
            .map(|rel| rel.display().to_string())
    })
    .unwrap_or_else(|| path.display().to_string())
}
