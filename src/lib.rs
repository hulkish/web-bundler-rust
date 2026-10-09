//! JavaScript bundler.
//!
//! Walks an ES module or CommonJS entry point, bundles local dependencies into
//! one or more scripts, and can minify the result or strip comments with [oxc](https://oxc.rs).
//! Minification folds constants, JSON, and literal methods, drops unused code and
//! `debugger`, mangles names, pools repeated strings, keeps ES module bindings
//! on `const` and `let`, and compresses bundled CSS. A bundle that never loads another module is emitted
//! without the module runtime. An optional optimize pass rewrites modules into faster
//! code before bundling and reduces bundled CSS. It stays off unless `optimize` is set.
//! When minify is set as well, it compresses that optimized bundle.
//! ES module output drops `"use strict"` directives and prints safe `var` bindings
//! as `const` or `let`.
//! An optional
//! prettify pass reprints the finished JavaScript and CSS with indentation. It stays off
//! unless `prettify` is set, and it runs after minify when both are set. `format: "asm"`
//! lowers a single integer module to an asm.js function (`"use asm"`).
//! `format: "wasm"` lowers that same integer subset to a WebAssembly binary.
//! `threads` compiles modules on that many threads and finishes each output
//! file in parallel. Omit it and the build stays on the calling thread. The
//! written files match a single-threaded build.
//! A local image `url(...)` in CSS is copied out next to the bundle and the
//! reference is rewritten to that file. Remote, data, and missing urls stay.
//! `--reporter` prints each of those steps as it happens.

mod analyze;
mod asm;
mod comments;
mod config;
mod emit;
mod error;
mod esm_shape;
mod images;
mod js;
mod minify;
mod minify_css;
mod optimize;
mod optimize_css;
mod options;
mod parallel;
mod prettify;
mod report;
mod resolve;
mod shake;
mod sourcemap;
mod transform;
mod wasm;

use std::collections::{HashMap, HashSet};
use std::fs;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::path::{Path, PathBuf};
use std::sync::{mpsc, Arc};
use std::thread;

use oxc_allocator::Allocator;

use analyze::{analyze, Define};
use emit::{emit_bundles, unique_prefix, EmitRequest, Emitted, ModuleKind, Names, PreparedModule};
use resolve::{
    clear_resolve_cache, is_asset, is_css, module_has_side_effects, resolve_entry,
    resolve_specifier, Resolved,
};
use shake::{propagate_async, shake, ModuleView};
use sourcemap::{compose_maps, parse_map};
use transform::{preprocess, JsxConfig, OffsetMap};

pub use config::{load_config, parse_format, parse_target, FileConfig};
pub use error::{BundleError, BundleResult};
pub use options::{
    BundleOptions, BundleOutput, Format, ModuleReport, OutputAsset, OutputFile, Target,
};
pub use report::{open as open_reporter, parse_style, Event, Reporter, ReporterHandle};

/// Bundle every entry in `options` and the local modules they reach.
pub fn bundle(options: &BundleOptions) -> BundleResult<BundleOutput> {
    if options.entries.is_empty() {
        return Err(BundleError::new(
            "missing entry point. Pass a file or set \"entry\" in webbundler.config.json",
        ));
    }
    clear_resolve_cache();
    let format = options.module_format();
    if options.target == Target::Browser && format == Format::Cjs {
        return Err(BundleError::new(
            "browser output is an ES module, so format must be esm",
        ));
    }
    if format == Format::Asm && options.minify {
        return Err(BundleError::new(
            "asm output cannot be minified; the \"use asm\" module has a fixed shape",
        ));
    }
    if format == Format::Wasm && options.minify {
        return Err(BundleError::new(
            "wasm output cannot be minified; the WebAssembly module has a fixed shape",
        ));
    }
    if options.threads == Some(0) {
        return Err(BundleError::new("thread count must be at least 1"));
    }
    options.reporter.report(&report::Event::Start {
        entries: options.entries.len(),
        threads: options.threads,
    });
    if options.optimize {
        options.reporter.report(&report::Event::Stage {
            stage: report::Stage::Optimize,
        });
    } else {
        options.reporter.report(&report::Event::Stage {
            stage: report::Stage::Bundle,
        });
    }
    let defines = options
        .defines
        .iter()
        .map(|(key, value)| Define {
            parts: key.split('.').map(str::to_string).collect(),
            value: value.clone(),
        })
        .collect::<Vec<_>>();
    let jsx = JsxConfig {
        pragma: options.jsx_pragma.clone(),
        fragment: options.jsx_fragment.clone(),
    };

    let loaded = load_graph(options, &defines, &jsx)?;
    let mut modules = loaded.modules;
    let index = loaded.index;
    let entry_ids = loaded.entry_ids;

    assign_public_names(&mut modules, options.css_filename.as_str());
    let views = modules
        .iter()
        .map(|module| ModuleView {
            label: resolve::display_path(&module.path),
            analysis: &module.analysis,
            dependencies: &module.dependencies,
            side_effects: module.side_effects,
            ids: &index,
        })
        .collect::<Vec<_>>();
    let keep = shake(&views, &entry_ids);
    if options.optimize {
        options.reporter.report(&report::Event::Stage {
            stage: report::Stage::Bundle,
        });
    }
    options.reporter.report(&report::Event::Link {
        included: keep.iter().filter(|item| item.included).count(),
        total: modules.len(),
    });
    let async_mod = propagate_async(
        &views,
        &keep.iter().map(|item| item.included).collect::<Vec<_>>(),
    );
    let prefix = unique_prefix(modules.iter().map(|module| module.original.as_str()));
    let names = Names::new(prefix.clone());
    let threads = worker_count(options);
    let emitted = if format == Format::Asm {
        asm::emit(&modules, &entry_ids, &keep, &prefix)?
    } else if format == Format::Wasm {
        match wasm::emit(&modules, &entry_ids, &keep, &prefix) {
            Ok(emitted) => emitted,
            Err(err) => embed_script(
                &EmitRequest {
                    modules: &modules,
                    names: &names,
                    index: &index,
                    keep: &keep,
                    async_mod: &async_mod,
                    css_filename: &options.css_filename,
                    entry_ids: &entry_ids,
                    sourcemap: false,
                    strip_comments: options.strip_comments,
                    filename_comments: options.filename_comments,
                    format: Format::Cjs,
                    threads,
                },
                options,
                err,
            )?,
        }
    } else {
        emit_bundles(&EmitRequest {
            modules: &modules,
            names: &names,
            index: &index,
            keep: &keep,
            async_mod: &async_mod,
            css_filename: &options.css_filename,
            entry_ids: &entry_ids,
            sourcemap: options.sourcemap,
            strip_comments: options.strip_comments,
            filename_comments: options.filename_comments,
            format,
            threads,
        })?
    };

    let (output_files, assets) = {
        if options.minify {
            options.reporter.report(&report::Event::Stage {
                stage: report::Stage::Minify,
            });
        } else if options.optimize {
            options.reporter.report(&report::Event::Stage {
                stage: report::Stage::Optimize,
            });
        }
        finish_outputs(emitted.files, emitted.assets, options)?
    };

    let primary = output_files
        .iter()
        .find(|file| file.name != "chunk.js" && file.name != "shared.js")
        .or_else(|| output_files.first());
    let code = primary.map(|file| file.code.clone()).unwrap_or_default();
    let map = primary.and_then(|file| file.map.clone());

    let mut included_paths = Vec::new();
    for id in &entry_ids {
        if keep[*id].included {
            included_paths.push(modules[*id].path.clone());
        }
    }
    for (id, module) in modules.iter().enumerate() {
        if keep[id].included && !entry_ids.contains(&id) {
            included_paths.push(module.path.clone());
        }
    }
    let report = modules
        .iter()
        .enumerate()
        .map(|(id, module)| ModuleReport {
            path: module.path.clone(),
            included: keep[id].included,
            reason: keep[id].reason.clone(),
        })
        .collect();

    Ok(BundleOutput {
        code,
        map,
        files: output_files,
        assets,
        modules: included_paths,
        report,
    })
}

fn finish_css_asset(
    name: &str,
    contents: Vec<u8>,
    optimize: bool,
    minify: bool,
    prettify: bool,
) -> Vec<u8> {
    if (!optimize && !minify && !prettify) || !is_css_asset(name) {
        return contents;
    }
    let text = match std::str::from_utf8(&contents) {
        Ok(text) => text,
        Err(_) => return contents,
    };
    let mut text = if optimize {
        optimize_css::optimize_css(text)
    } else {
        text.to_string()
    };
    if minify {
        text = minify_css::minify_css(&text);
    }
    if prettify {
        text = minify_css::prettify_css(&text);
    }
    text.into_bytes()
}

fn is_css_asset(name: &str) -> bool {
    Path::new(name)
        .extension()
        .and_then(|ext| ext.to_str())
        .is_some_and(|ext| ext.eq_ignore_ascii_case("css"))
}

fn embed_script(
    request: &EmitRequest<'_>,
    options: &BundleOptions,
    fallback: BundleError,
) -> BundleResult<Emitted> {
    let mut script = emit_bundles(request)?;
    let Some(file) = script.files.pop() else {
        return Err(fallback);
    };
    if !script.files.is_empty() {
        return Err(fallback);
    }
    let (code, _) = finish_javascript(file.code, None, file.esm, &file.name, options)?;
    let mut wrapped = wasm::wrap_script(&code)?;
    wrapped.assets.append(&mut script.assets);
    Ok(wrapped)
}

fn finish_javascript(
    code: String,
    map: Option<String>,
    esm: bool,
    name: &str,
    options: &BundleOptions,
) -> BundleResult<(String, Option<String>)> {
    // Optimize already rewrote each module. Minify compresses the bundle, then
    // prettify reprints that result. The source map comment is added after both.
    let mut code = code;
    let mut map = map;
    if options.minify {
        let minified = minify::minify(&code, esm, options.sourcemap.then_some(name))?;
        map = compose_printed_map(minified.map, map);
        code = minified.code;
    }
    if options.prettify {
        let pretty = prettify::prettify(&code, esm, options.sourcemap.then_some(name))?;
        map = compose_printed_map(pretty.map, map);
        code = pretty.code;
    }
    let code = append_map_comment(code, map.is_some(), name);
    Ok((code, map))
}

fn compose_printed_map(printed: Option<String>, bundle_map: Option<String>) -> Option<String> {
    match (printed, bundle_map) {
        (Some(printed_map), Some(bundle_map)) => {
            match (parse_map(&printed_map), parse_map(&bundle_map)) {
                (Some(printed_map), Some(bundle_map)) => {
                    Some(compose_maps(printed_map, bundle_map).to_json_string())
                }
                _ => Some(bundle_map),
            }
        }
        (Some(printed_map), None) => Some(printed_map),
        (None, other) => other,
    }
}

fn append_map_comment(mut code: String, has_map: bool, name: &str) -> String {
    if has_map {
        if !code.ends_with('\n') {
            code.push('\n');
        }
        code.push_str(&format!("//# sourceMappingURL={name}.map\n"));
    }
    code
}

fn load_module(
    path: &Path,
    env: &LoadEnv<'_>,
    modules: &mut Vec<PreparedModule>,
    index: &mut HashMap<PathBuf, usize>,
    allocator: &mut Allocator,
    parent: Option<&Path>,
) -> BundleResult<usize> {
    let options = env.options;
    let defines = env.defines;
    let jsx = env.jsx;
    if let Some(id) = index.get(path) {
        return Ok(*id);
    }
    let id = modules.len();
    index.insert(path.to_path_buf(), id);

    if is_css(path) {
        let css = read_source(path)?;
        let image_refs = images::image_refs(path, &css);
        let mut module = empty_module(path, css.clone(), css, ModuleKind::Css);
        module.image_refs = image_refs;
        modules.push(module);
        note_module(options, path, ModuleKind::Css, parent);
        bind_images(id, env, modules, index, allocator)?;
        return Ok(id);
    }
    if is_asset(path) {
        modules.push(empty_module(
            path,
            String::new(),
            String::new(),
            ModuleKind::Asset,
        ));
        note_module(options, path, ModuleKind::Asset, parent);
        return Ok(id);
    }

    let original = read_source(path)?;
    let transformed = preprocess(allocator, path, &original, jsx)?;
    let (source, offset_map) = if options.optimize {
        let (optimized, step) = optimize::optimize_source(allocator, path, &transformed.source);
        (optimized, step.and_then(transformed.map))
    } else {
        (transformed.source, transformed.map)
    };
    let analysis = analyze(
        allocator,
        path,
        &source,
        defines,
        transformed.rewritten,
        options.strip_comments,
    )?;
    modules.push(PreparedModule {
        path: path.to_path_buf(),
        source,
        original,
        offset_map,
        analysis,
        dependencies: Vec::new(),
        kind: ModuleKind::JavaScript,
        side_effects: module_has_side_effects(path),
        public_name: String::new(),
        image_refs: Vec::new(),
    });
    note_module(options, path, ModuleKind::JavaScript, parent);

    let mut resolved = Vec::new();
    let specifiers = modules[id].analysis.dependencies.clone();
    for specifier in specifiers {
        let dependency = resolve_dependency(path, &specifier, options)?;
        if let Some(child) = dependency.path() {
            let child = child.to_path_buf();
            load_module(&child, env, modules, index, allocator, Some(path))?;
        }
        resolved.push(dependency);
    }
    modules[id].dependencies = resolved;
    Ok(id)
}

struct LoadedGraph {
    modules: Vec<PreparedModule>,
    index: HashMap<PathBuf, usize>,
    entry_ids: Vec<usize>,
}

fn load_graph(
    options: &BundleOptions,
    defines: &[Define],
    jsx: &JsxConfig,
) -> BundleResult<LoadedGraph> {
    if let Some(threads) = options.threads {
        load_graph_parallel(options, defines, jsx, threads)
    } else {
        load_graph_serial(options, defines, jsx)
    }
}

struct LoadEnv<'a> {
    options: &'a BundleOptions,
    defines: &'a [Define],
    jsx: &'a JsxConfig,
}

fn load_graph_serial(
    options: &BundleOptions,
    defines: &[Define],
    jsx: &JsxConfig,
) -> BundleResult<LoadedGraph> {
    let env = LoadEnv {
        options,
        defines,
        jsx,
    };
    let mut allocator = Allocator::default();
    let mut modules = Vec::new();
    let mut index = HashMap::new();
    let mut entry_ids = Vec::new();
    for entry in &options.entries {
        let path = resolve_entry(entry)?;
        if is_css(&path) || is_asset(&path) {
            return Err(BundleError::new(format!(
                "entry point must be JavaScript or TypeScript: {}",
                path.display()
            )));
        }
        let id = load_module(&path, &env, &mut modules, &mut index, &mut allocator, None)?;
        if !entry_ids.contains(&id) {
            entry_ids.push(id);
        }
    }
    Ok(LoadedGraph {
        modules,
        index,
        entry_ids,
    })
}

/// Compile every reachable module on `threads` workers, then number modules with
/// the same depth-first walk the single-threaded loader uses.
fn load_graph_parallel(
    options: &BundleOptions,
    defines: &[Define],
    jsx: &JsxConfig,
    threads: usize,
) -> BundleResult<LoadedGraph> {
    if threads == 0 {
        return Err(BundleError::new("thread count must be at least 1"));
    }
    let mut roots = Vec::new();
    for entry in &options.entries {
        let path = resolve_entry(entry)?;
        if is_css(&path) || is_asset(&path) {
            return Err(BundleError::new(format!(
                "entry point must be JavaScript or TypeScript: {}",
                path.display()
            )));
        }
        roots.push(path);
    }
    let env = Arc::new(CompileEnv {
        optimize: options.optimize,
        strip_comments: options.strip_comments,
        defines: defines.to_vec(),
        jsx: jsx.clone(),
    });
    let queue = Arc::new(parallel::JobQueue::new());
    let (tx, rx) = mpsc::channel();
    let mut workers = Vec::with_capacity(threads);
    for _ in 0..threads {
        let worker_queue = Arc::clone(&queue);
        let worker_tx = tx.clone();
        let worker_env = Arc::clone(&env);
        match thread::Builder::new()
            .name("webbundler".to_string())
            .spawn(move || worker_loop(worker_queue, worker_tx, worker_env))
        {
            Ok(handle) => workers.push(handle),
            Err(err) => {
                drop(tx);
                queue.close();
                for worker in workers {
                    let _ = worker.join();
                }
                return Err(BundleError::new(format!(
                    "failed to start a worker thread: {err}"
                )));
            }
        }
    }
    drop(tx);
    let scheduled = schedule(options, &roots, &queue, rx);
    queue.close();
    let mut panicked = false;
    for worker in workers {
        if worker.join().is_err() {
            panicked = true;
        }
    }
    let graph = scheduled?;
    if panicked {
        return Err(BundleError::new("a worker thread panicked"));
    }
    Ok(graph)
}

struct CompileEnv {
    optimize: bool,
    strip_comments: bool,
    defines: Vec<Define>,
    jsx: JsxConfig,
}

struct Compiled {
    source: String,
    original: String,
    offset_map: OffsetMap,
    analysis: analyze::Analysis,
    kind: ModuleKind,
    image_refs: Vec<images::ImageRef>,
}

struct CompileDone {
    path: PathBuf,
    result: BundleResult<Compiled>,
}

fn worker_loop(
    queue: Arc<parallel::JobQueue>,
    tx: mpsc::Sender<CompileDone>,
    env: Arc<CompileEnv>,
) {
    let mut allocator = Allocator::default();
    while let Some(path) = queue.pop() {
        let result = catch_unwind(AssertUnwindSafe(|| {
            compile_one(&mut allocator, &path, &env)
        }));
        let result = match result {
            Ok(result) => result,
            Err(_) => {
                allocator = Allocator::default();
                Err(BundleError::new(format!(
                    "failed to compile {}",
                    path.display()
                )))
            }
        };
        if tx.send(CompileDone { path, result }).is_err() {
            break;
        }
    }
}

fn compile_one(allocator: &mut Allocator, path: &Path, env: &CompileEnv) -> BundleResult<Compiled> {
    if is_css(path) {
        let css = read_source(path)?;
        let image_refs = images::image_refs(path, &css);
        return Ok(Compiled {
            source: css.clone(),
            original: css,
            offset_map: OffsetMap::identity(0),
            analysis: analyze_empty(),
            kind: ModuleKind::Css,
            image_refs,
        });
    }
    if is_asset(path) {
        return Ok(Compiled {
            source: String::new(),
            original: String::new(),
            offset_map: OffsetMap::identity(0),
            analysis: analyze_empty(),
            kind: ModuleKind::Asset,
            image_refs: Vec::new(),
        });
    }
    let original = read_source(path)?;
    let transformed = preprocess(allocator, path, &original, &env.jsx)?;
    let (source, offset_map) = if env.optimize {
        let (optimized, step) = optimize::optimize_source(allocator, path, &transformed.source);
        (optimized, step.and_then(transformed.map))
    } else {
        (transformed.source, transformed.map)
    };
    let analysis = analyze(
        allocator,
        path,
        &source,
        &env.defines,
        transformed.rewritten,
        env.strip_comments,
    )?;
    Ok(Compiled {
        source,
        original,
        offset_map,
        analysis,
        kind: ModuleKind::JavaScript,
        image_refs: Vec::new(),
    })
}

fn schedule(
    options: &BundleOptions,
    roots: &[PathBuf],
    queue: &parallel::JobQueue,
    rx: mpsc::Receiver<CompileDone>,
) -> BundleResult<LoadedGraph> {
    let mut seen = HashSet::new();
    let mut parents = HashMap::<PathBuf, PathBuf>::new();
    let mut outstanding = 0usize;
    let mut compiled = HashMap::new();
    for root in roots {
        enqueue(queue, &mut seen, &mut outstanding, root.clone());
    }
    while outstanding > 0 {
        let done = rx
            .recv()
            .map_err(|_| BundleError::new("a worker thread stopped"))?;
        outstanding -= 1;
        if let Ok(module) = done.result.as_ref() {
            note_module(
                options,
                &done.path,
                module.kind,
                parents.get(&done.path).map(PathBuf::as_path),
            );
        }
        let specifiers = match done.result.as_ref() {
            Ok(module) => module.analysis.dependencies.clone(),
            Err(_) => Vec::new(),
        };
        let images = match done.result.as_ref() {
            Ok(module) => module
                .image_refs
                .iter()
                .map(|reference| reference.path.clone())
                .collect::<Vec<_>>(),
            Err(_) => Vec::new(),
        };
        for specifier in &specifiers {
            match resolve_dependency(&done.path, specifier, options) {
                Ok(resolved) => {
                    if let Some(child) = resolved.path() {
                        let child = child.to_path_buf();
                        parents
                            .entry(child.clone())
                            .or_insert_with(|| done.path.clone());
                        enqueue(queue, &mut seen, &mut outstanding, child);
                    }
                }
                Err(_) => break,
            }
        }
        for image in images {
            parents
                .entry(image.clone())
                .or_insert_with(|| done.path.clone());
            enqueue(queue, &mut seen, &mut outstanding, image);
        }
        compiled.insert(done.path, done.result);
    }
    assemble(options, roots, compiled)
}

fn enqueue(
    queue: &parallel::JobQueue,
    seen: &mut HashSet<PathBuf>,
    outstanding: &mut usize,
    path: PathBuf,
) {
    if seen.insert(path.clone()) {
        queue.push(path);
        *outstanding += 1;
    }
}

fn assemble(
    options: &BundleOptions,
    roots: &[PathBuf],
    compiled: HashMap<PathBuf, BundleResult<Compiled>>,
) -> BundleResult<LoadedGraph> {
    let mut assembler = Assemble {
        modules: Vec::new(),
        index: HashMap::new(),
        compiled,
        options,
    };
    let mut entry_ids = Vec::new();
    for root in roots {
        let id = assembler.place(root)?;
        if !entry_ids.contains(&id) {
            entry_ids.push(id);
        }
    }
    Ok(LoadedGraph {
        modules: assembler.modules,
        index: assembler.index,
        entry_ids,
    })
}

struct Assemble<'a> {
    modules: Vec<PreparedModule>,
    index: HashMap<PathBuf, usize>,
    compiled: HashMap<PathBuf, BundleResult<Compiled>>,
    options: &'a BundleOptions,
}

impl Assemble<'_> {
    fn place(&mut self, path: &Path) -> BundleResult<usize> {
        if let Some(id) = self.index.get(path).copied() {
            return Ok(id);
        }
        let compiled = match self.compiled.remove(path) {
            Some(Ok(compiled)) => compiled,
            Some(Err(err)) => return Err(BundleError::new(err.to_string())),
            None => {
                return Err(BundleError::new(format!(
                    "failed to load {}",
                    path.display()
                )))
            }
        };
        let id = self.modules.len();
        self.index.insert(path.to_path_buf(), id);
        if compiled.kind != ModuleKind::JavaScript {
            let paths = compiled
                .image_refs
                .iter()
                .map(|reference| reference.path.clone())
                .collect::<Vec<_>>();
            let mut module = empty_module(path, compiled.source, compiled.original, compiled.kind);
            module.image_refs = compiled.image_refs;
            self.modules.push(module);
            let mut resolved = Vec::new();
            for image in paths {
                self.place(&image)?;
                resolved.push(Resolved::Asset(image));
            }
            bind_image_edges(&mut self.modules[id], resolved);
            return Ok(id);
        }
        let specifiers = compiled.analysis.dependencies.clone();
        self.modules.push(PreparedModule {
            path: path.to_path_buf(),
            source: compiled.source,
            original: compiled.original,
            offset_map: compiled.offset_map,
            analysis: compiled.analysis,
            dependencies: Vec::new(),
            kind: ModuleKind::JavaScript,
            side_effects: module_has_side_effects(path),
            public_name: String::new(),
            image_refs: Vec::new(),
        });
        let mut resolved = Vec::new();
        for specifier in specifiers {
            let dependency = resolve_dependency(path, &specifier, self.options)?;
            if let Some(child) = dependency.path() {
                let child = child.to_path_buf();
                self.place(&child)?;
            }
            resolved.push(dependency);
        }
        self.modules[id].dependencies = resolved;
        Ok(id)
    }
}

fn resolve_dependency(
    from: &Path,
    specifier: &str,
    options: &BundleOptions,
) -> BundleResult<Resolved> {
    match resolve_specifier(from, specifier, &options.external, options.target)? {
        Resolved::External(name) => Ok(Resolved::External(name)),
        Resolved::Local(path) | Resolved::Css(path) | Resolved::Asset(path) => Ok(reclassify(path)),
    }
}

fn reclassify(path: PathBuf) -> Resolved {
    if is_css(&path) {
        Resolved::Css(path)
    } else if is_asset(&path) {
        Resolved::Asset(path)
    } else {
        Resolved::Local(path)
    }
}

fn read_source(path: &Path) -> BundleResult<String> {
    fs::read_to_string(path)
        .map_err(|err| BundleError::new(format!("failed to read {}: {err}", path.display())))
}

fn worker_count(options: &BundleOptions) -> usize {
    options.threads.unwrap_or(1)
}

fn note_module(options: &BundleOptions, path: &Path, kind: ModuleKind, parent: Option<&Path>) {
    if !options.reporter.is_active() {
        return;
    }
    options.reporter.report(&report::Event::Module {
        path: resolve::display_path(path),
        kind: match kind {
            ModuleKind::JavaScript => report::Kind::JavaScript,
            ModuleKind::Css => report::Kind::Css,
            ModuleKind::Asset => report::Kind::Asset,
        },
        parent: parent.map(resolve::display_path),
    });
}

fn script_label(options: &BundleOptions) -> &'static str {
    if options.minify {
        "minify"
    } else if options.prettify {
        "prettify"
    } else {
        "bundle"
    }
}

fn asset_label(name: &str, options: &BundleOptions) -> &'static str {
    if !is_css_asset(name) {
        return "asset";
    }
    if options.minify {
        "minify css"
    } else if options.optimize {
        "optimize css"
    } else if options.prettify {
        "prettify css"
    } else {
        "css"
    }
}

enum FinishJob {
    Js(emit::EmittedJs),
    Css(String, Vec<u8>),
}

enum Finished {
    Js(OutputFile),
    Css(OutputAsset),
}

fn finish_outputs(
    files: Vec<emit::EmittedJs>,
    assets: Vec<(String, Vec<u8>)>,
    options: &BundleOptions,
) -> BundleResult<(Vec<OutputFile>, Vec<OutputAsset>)> {
    let threads = worker_count(options);
    let js_count = files.len();
    let mut jobs = Vec::with_capacity(js_count + assets.len());
    for file in files {
        jobs.push(FinishJob::Js(file));
    }
    for (name, contents) in assets {
        jobs.push(FinishJob::Css(name, contents));
    }
    let done = parallel::try_map(threads, jobs, |job| match job {
        FinishJob::Js(file) => {
            let name = file.name;
            let label = script_label(options);
            options.reporter.report(&report::Event::Task {
                label,
                name: name.clone(),
            });
            let (code, map) = finish_javascript(file.code, file.map, file.esm, &name, options)?;
            options.reporter.report(&report::Event::Output {
                bytes: code.len(),
                label,
                name: name.clone(),
            });
            Ok(Finished::Js(OutputFile { name, code, map }))
        }
        FinishJob::Css(name, contents) => {
            let label = asset_label(&name, options);
            options.reporter.report(&report::Event::Task {
                label,
                name: name.clone(),
            });
            let contents = finish_css_asset(
                &name,
                contents,
                options.optimize,
                options.minify,
                options.prettify,
            );
            options.reporter.report(&report::Event::Output {
                bytes: contents.len(),
                label,
                name: name.clone(),
            });
            Ok(Finished::Css(OutputAsset { contents, name }))
        }
    })?;
    let mut output_files = Vec::with_capacity(js_count);
    let mut output_assets = Vec::new();
    for item in done {
        match item {
            Finished::Js(file) => output_files.push(file),
            Finished::Css(asset) => output_assets.push(asset),
        }
    }
    Ok((output_files, output_assets))
}

fn bind_images(
    id: usize,
    env: &LoadEnv<'_>,
    modules: &mut Vec<PreparedModule>,
    index: &mut HashMap<PathBuf, usize>,
    allocator: &mut Allocator,
) -> BundleResult<()> {
    let paths = modules[id]
        .image_refs
        .iter()
        .map(|reference| reference.path.clone())
        .collect::<Vec<_>>();
    let parent = modules[id].path.clone();
    let mut resolved = Vec::new();
    for image in paths {
        load_module(&image, env, modules, index, allocator, Some(&parent))?;
        resolved.push(Resolved::Asset(image));
    }
    bind_image_edges(&mut modules[id], resolved);
    Ok(())
}

fn bind_image_edges(module: &mut PreparedModule, resolved: Vec<Resolved>) {
    for index in 0..resolved.len() {
        module.analysis.edges.push(analyze::ImportEdge::All(index));
    }
    module.dependencies = resolved;
}

fn empty_module(path: &Path, source: String, original: String, kind: ModuleKind) -> PreparedModule {
    PreparedModule {
        path: path.to_path_buf(),
        source,
        original,
        offset_map: OffsetMap::identity(0),
        analysis: analyze_empty(),
        dependencies: Vec::new(),
        kind,
        side_effects: true,
        public_name: String::new(),
        image_refs: Vec::new(),
    }
}

fn analyze_empty() -> analyze::Analysis {
    analyze::Analysis::blank()
}

fn assign_public_names(modules: &mut [PreparedModule], css_filename: &str) {
    let mut used = HashSet::new();
    used.insert(css_filename.to_string());
    for module in modules.iter_mut() {
        match module.kind {
            ModuleKind::Css => module.public_name = css_filename.to_string(),
            ModuleKind::Asset => {
                let file_name = module
                    .path
                    .file_name()
                    .and_then(|name| name.to_str())
                    .unwrap_or("asset");
                let mut name = file_name.to_string();
                if used.contains(&name) {
                    let hash = fnv(&module.path.to_string_lossy());
                    let stem = module
                        .path
                        .file_stem()
                        .and_then(|stem| stem.to_str())
                        .unwrap_or("asset");
                    let ext = module
                        .path
                        .extension()
                        .and_then(|ext| ext.to_str())
                        .unwrap_or("bin");
                    name = format!("{stem}-{hash:06x}.{ext}");
                }
                used.insert(name.clone());
                module.public_name = name;
            }
            ModuleKind::JavaScript => {}
        }
    }
}

fn fnv(text: &str) -> u32 {
    let mut hash = 2166136261u32;
    for byte in text.bytes() {
        hash ^= u32::from(byte);
        hash = hash.wrapping_mul(16777619);
    }
    hash & 0x00ff_ffff
}
