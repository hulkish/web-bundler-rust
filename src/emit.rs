use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::{Path, PathBuf};

use crate::analyze::{publishes_exports, render_module_body, Analysis, BodyOptions};
use crate::comments::strip_css_comments;
use crate::error::{BundleError, BundleResult};
use crate::esm_shape;
use crate::js::js_string;
use crate::options::Format;
use crate::resolve::{display_path, Resolved};
use crate::shake::ModuleKeep;
use crate::sourcemap::{build_map, Point};
use crate::transform::OffsetMap;

pub struct Names {
    prefix: String,
}

impl Names {
    pub fn new(prefix: String) -> Self {
        Self { prefix }
    }

    pub fn require(&self) -> String {
        format!("{}require", self.prefix)
    }

    pub fn live(&self) -> String {
        format!("{}live", self.prefix)
    }

    pub fn star(&self) -> String {
        format!("{}star", self.prefix)
    }

    pub fn interop(&self) -> String {
        format!("{}interop", self.prefix)
    }

    pub fn dynamic(&self) -> String {
        format!("{}dynamic", self.prefix)
    }

    pub fn esm(&self) -> String {
        format!("{}esm", self.prefix)
    }

    pub fn namespace(&self, index: usize) -> String {
        format!("{}ns{index}", self.prefix)
    }

    pub fn node(&self) -> String {
        format!("{}node", self.prefix)
    }

    pub fn cache(&self) -> String {
        format!("{}cache", self.prefix)
    }

    pub fn modules(&self) -> String {
        format!("{}modules", self.prefix)
    }

    pub fn entry(&self) -> String {
        format!("{}entry", self.prefix)
    }

    pub fn module_param(&self) -> String {
        format!("{}module", self.prefix)
    }

    pub fn exports_param(&self) -> String {
        format!("{}exports", self.prefix)
    }

    pub fn define(&self) -> String {
        format!("{}define", self.prefix)
    }

    pub fn wrap(&self) -> String {
        format!("{}wrap", self.prefix)
    }

    pub fn runtime(&self) -> String {
        format!("{}rt", self.prefix)
    }

    pub fn externals(&self) -> String {
        format!("{}externals", self.prefix)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ModuleKind {
    JavaScript,
    Css,
    Asset,
}

pub struct PreparedModule {
    pub path: PathBuf,
    pub source: String,
    pub original: String,
    pub offset_map: OffsetMap,
    pub analysis: Analysis,
    pub dependencies: Vec<Resolved>,
    pub kind: ModuleKind,
    pub side_effects: bool,
    pub public_name: String,
    /// Local image `url(...)` tokens in a CSS module, rewritten when the CSS is emitted.
    pub image_refs: Vec<crate::images::ImageRef>,
}

pub fn unique_prefix<'a>(sources: impl Iterator<Item = &'a str>) -> String {
    let sources = sources.collect::<Vec<_>>();
    let mut prefix = "__jsb_".to_string();
    while sources.iter().any(|source| source.contains(&prefix)) {
        prefix.insert(0, '_');
    }
    prefix
}

pub struct EmittedJs {
    pub name: String,
    pub code: String,
    pub map: Option<String>,
    pub esm: bool,
}

pub struct EmitRequest<'a> {
    pub modules: &'a [PreparedModule],
    pub names: &'a Names,
    pub index: &'a HashMap<PathBuf, usize>,
    pub keep: &'a [ModuleKeep],
    pub async_mod: &'a [bool],
    pub css_filename: &'a str,
    pub entry_ids: &'a [usize],
    pub sourcemap: bool,
    pub strip_comments: bool,
    /// When set, each module is preceded by a comment of its source path.
    pub filename_comments: bool,
    pub format: Format,
    /// Workers used to print module bodies. `1` prints on the calling thread.
    pub threads: usize,
}

pub struct Emitted {
    pub files: Vec<EmittedJs>,
    pub assets: Vec<(String, Vec<u8>)>,
}

pub fn emit_bundles(request: &EmitRequest<'_>) -> BundleResult<Emitted> {
    let plan = plan_chunks(request);
    let mut files = Vec::new();
    let assets = assets_for(request)?;
    match plan {
        Plan::Single { ids, entry } => {
            files.push(emit_standalone(request, &ids, entry, "bundle.js")?);
        }
        Plan::Independent(bundles) => {
            for bundle in bundles {
                files.push(emit_standalone(
                    request,
                    &bundle.ids,
                    bundle.entry,
                    &bundle.name,
                )?);
            }
        }
        Plan::Split { shared, entries } => {
            let shared_name = shared_chunk_name(&entries);
            let external_ids = all_included(request);
            let shared_code = prepare_chunk(request, &shared)?;
            let mut exported = RuntimeNeeds::default();
            let mut entry_code = Vec::new();
            for bundle in &entries {
                let mut code = prepare_chunk(request, &bundle.ids)?;
                code.needs.require = true;
                code.needs.define = !bundle.ids.is_empty();
                code.needs.finish(request.format);
                exported.absorb(&code.needs);
                entry_code.push(code);
            }
            let externals = externals_in(request, &external_ids);
            let mut defined = shared_code.needs;
            defined.absorb(&exported);
            defined.require = true;
            defined.define = true;
            defined.externals = !externals.is_empty();
            defined.finish(request.format);
            exported.externals = false;
            exported.wrap = false;
            files.push(emit_shared(
                request,
                &shared_code.factories,
                &externals,
                &defined,
                &exported,
                &shared_name,
            )?);
            for (bundle, code) in entries.iter().zip(entry_code) {
                files.push(emit_entry_wrapper(request, bundle, &code, &shared_name)?);
            }
        }
    }
    Ok(Emitted { files, assets })
}

struct EntryBundle {
    entry: usize,
    ids: Vec<usize>,
    name: String,
}

enum Plan {
    Single {
        ids: Vec<usize>,
        entry: usize,
    },
    Independent(Vec<EntryBundle>),
    Split {
        shared: Vec<usize>,
        entries: Vec<EntryBundle>,
    },
}

fn plan_chunks(request: &EmitRequest<'_>) -> Plan {
    let sets = request
        .entry_ids
        .iter()
        .map(|entry| reachable(*entry, request))
        .collect::<Vec<_>>();
    if request.entry_ids.len() == 1 {
        let mut ids = sets[0].iter().copied().collect::<Vec<_>>();
        ids.sort_unstable();
        return Plan::Single {
            ids,
            entry: request.entry_ids[0],
        };
    }

    let mut counts = HashMap::<usize, usize>::new();
    for set in &sets {
        for id in set {
            *counts.entry(*id).or_insert(0) += 1;
        }
    }
    let shared = counts
        .iter()
        .filter(|(_, count)| **count >= 2)
        .map(|(id, _)| *id)
        .collect::<HashSet<_>>();
    let mut used_names = HashSet::new();
    let entries = request
        .entry_ids
        .iter()
        .zip(sets)
        .map(|(entry, set)| {
            let mut ids = set
                .into_iter()
                .filter(|id| !shared.contains(id))
                .collect::<Vec<_>>();
            ids.sort_unstable();
            let name = unique_js_name(&request.modules[*entry].path, &mut used_names);
            EntryBundle {
                entry: *entry,
                ids,
                name,
            }
        })
        .collect::<Vec<_>>();
    if shared.is_empty() {
        Plan::Independent(entries)
    } else {
        let mut shared_ids = shared.into_iter().collect::<Vec<_>>();
        shared_ids.sort_unstable();
        Plan::Split {
            shared: shared_ids,
            entries,
        }
    }
}

fn reachable(start: usize, request: &EmitRequest<'_>) -> HashSet<usize> {
    let mut seen = HashSet::new();
    let mut stack = vec![start];
    while let Some(id) = stack.pop() {
        if !request.keep[id].included || !seen.insert(id) {
            continue;
        }
        let module = &request.modules[id];
        for dependency in &request.keep[id].deps {
            let Some(resolved) = module.dependencies.get(*dependency) else {
                continue;
            };
            let Some(path) = resolved.path() else {
                continue;
            };
            if let Some(dep_id) = request.index.get(path) {
                stack.push(*dep_id);
            }
        }
    }
    seen
}

fn unique_js_name(path: &std::path::Path, used: &mut HashSet<String>) -> String {
    let stem = path
        .file_stem()
        .and_then(|stem| stem.to_str())
        .unwrap_or("entry");
    let mut name = format!("{stem}.js");
    let mut suffix = 2;
    while !used.insert(name.clone()) {
        name = format!("{stem}-{suffix}.js");
        suffix += 1;
    }
    name
}

fn shared_chunk_name(entries: &[EntryBundle]) -> String {
    if entries.iter().any(|entry| entry.name == "chunk.js") {
        "shared.js".to_string()
    } else {
        "chunk.js".to_string()
    }
}

fn all_included(request: &EmitRequest<'_>) -> Vec<usize> {
    request
        .keep
        .iter()
        .enumerate()
        .filter(|(_, keep)| keep.included)
        .map(|(id, _)| id)
        .collect()
}

fn emit_standalone(
    request: &EmitRequest<'_>,
    ids: &[usize],
    entry: usize,
    name: &str,
) -> BundleResult<EmittedJs> {
    if let Some(emitted) = emit_direct(request, ids, name)? {
        return Ok(emitted);
    }
    let externals = externals_in(request, ids);
    let mut needs = RuntimeNeeds {
        require: true,
        define: true,
        externals: !externals.is_empty(),
        ..RuntimeNeeds::default()
    };
    let factories = render_factories(request, ids, RenderMode::Factory)?;
    for (_, rendered) in &factories {
        needs.absorb(&needs_from_code(request.names, &rendered.code));
    }
    needs.finish(request.format);
    let mut buffer = Buffer::new(request.sourcemap);
    if request.format == Format::Esm {
        buffer.push(&external_imports(request.names, &externals));
    }
    buffer.push(&runtime_prelude(request, &externals, &needs));
    buffer.push(&module_table(request.names));
    buffer.push(&helper_functions(request, &needs));
    for (id, rendered) in factories {
        write_rendered_factory(request, &mut buffer, id, &rendered);
    }
    buffer.push(&assign_entry(request, entry));
    finish(buffer, name, request.format == Format::Esm)
}

fn emit_shared(
    request: &EmitRequest<'_>,
    factories: &[(usize, RenderedFactory)],
    externals: &[String],
    defined: &RuntimeNeeds,
    exported: &RuntimeNeeds,
    name: &str,
) -> BundleResult<EmittedJs> {
    let mut buffer = Buffer::new(request.sourcemap);
    if request.format == Format::Esm {
        buffer.push(&external_imports(request.names, externals));
    }
    buffer.push(&runtime_prelude(request, externals, defined));
    buffer.push(&module_table(request.names));
    buffer.push(&helper_functions(request, defined));
    for (id, rendered) in factories {
        write_rendered_factory(request, &mut buffer, *id, rendered);
    }
    buffer.push(&shared_footer(request, exported));
    finish(buffer, name, request.format == Format::Esm)
}

fn emit_entry_wrapper(
    request: &EmitRequest<'_>,
    bundle: &EntryBundle,
    code: &ChunkCode,
    shared_name: &str,
) -> BundleResult<EmittedJs> {
    let mut buffer = Buffer::new(request.sourcemap);
    buffer.push(&import_helpers(
        request.names,
        &code.needs,
        shared_name,
        request.format,
    ));
    for (id, rendered) in &code.factories {
        write_rendered_factory(request, &mut buffer, *id, rendered);
    }
    buffer.push(&assign_entry(request, bundle.entry));
    finish(buffer, &bundle.name, request.format == Format::Esm)
}

fn write_rendered_factory(
    request: &EmitRequest<'_>,
    buffer: &mut Buffer,
    id: usize,
    rendered: &RenderedFactory,
) {
    let module = &request.modules[id];
    let names = request.names;
    let async_kw = if request.async_mod[id] { "async " } else { "" };
    let banner = filename_banner(request, &module.path);
    let params = factory_params(names, rendered);
    let header = format!(
        "{define}({id}, {async_kw}function ({params}) {{\n{banner}",
        define = names.define()
    );
    let body_at = buffer.code.len() + header.len();
    buffer.push(&header);
    buffer.push_mapped(&rendered.code, &rendered.points, body_at, module);
    if !rendered.code.ends_with('\n') {
        buffer.push("\n");
    }
    buffer.push("});\n");
}

struct RenderedFactory {
    code: String,
    points: Vec<(u32, u32)>,
}

#[derive(Clone, Copy)]
enum RenderMode {
    /// Inside `__jsb_define`. ESM modules still mark `__esModule` for interop.
    Factory,
    /// Top-level output. The exports binding exists only when the module publishes one.
    Direct,
}

fn render_factory_body(
    request: &EmitRequest<'_>,
    id: usize,
    mode: RenderMode,
) -> BundleResult<RenderedFactory> {
    let module = &request.modules[id];
    let names = request.names;
    match module.kind {
        ModuleKind::Css | ModuleKind::Asset => {
            let url = format!("./{}", module.public_name);
            let code = format!(
                "{esm}({exports});\n{live}({exports}, \"default\", function() {{ return {url}; }});\n",
                esm = names.esm(),
                exports = names.exports_param(),
                live = names.live(),
                url = js_string(&url)
            );
            Ok(RenderedFactory {
                code,
                points: Vec::new(),
            })
        }
        ModuleKind::JavaScript if module.analysis.is_json => {
            let code = format!(
                "{}.exports = {};\n",
                names.module_param(),
                module.analysis.json.as_deref().unwrap_or("null")
            );
            Ok(RenderedFactory {
                code,
                points: Vec::new(),
            })
        }
        ModuleKind::JavaScript => {
            let inline_exports = matches!(mode, RenderMode::Direct);
            let probe = render_javascript(request, id, false, false, inline_exports)?;
            let mentions = mentions_cjs_free_names(&probe.code);
            let publishes = publishes_exports(&module.analysis, request.keep[id].exports.as_ref());
            let bind_cjs = !module.analysis.is_esm
                && mentions
                && (matches!(mode, RenderMode::Factory) || request.format == Format::Esm);
            let mark_esmodule =
                module.analysis.is_esm && (matches!(mode, RenderMode::Factory) || publishes);
            if !bind_cjs && !mark_esmodule {
                return Ok(probe);
            }
            render_javascript(request, id, bind_cjs, mark_esmodule, inline_exports)
        }
    }
}

fn render_javascript(
    request: &EmitRequest<'_>,
    id: usize,
    bind_cjs: bool,
    mark_esmodule: bool,
    inline_exports: bool,
) -> BundleResult<RenderedFactory> {
    let module = &request.modules[id];
    let args = dependency_args(&module.dependencies, request.index);
    let async_deps = async_dependency_flags(module, request);
    let rendered = render_module_body(
        &module.path,
        &module.source,
        &module.analysis,
        request.names,
        &args,
        &BodyOptions {
            async_deps: &async_deps,
            module_async: request.async_mod[id],
            keep_exports: request.keep[id].exports.as_ref(),
            keep_deps: &request.keep[id].deps,
            inline_exports,
            bind_cjs,
            mark_esmodule,
            emit_strict: request.format == Format::Cjs && module.analysis.is_esm,
        },
    )?;
    Ok(RenderedFactory {
        code: rendered.code,
        points: rendered.points,
    })
}

fn factory_params(names: &Names, rendered: &RenderedFactory) -> String {
    let module_name = names.module_param();
    let exports_name = names.exports_param();
    let uses_exports = contains_ident(&rendered.code, &exports_name);
    let uses_module = contains_ident(&rendered.code, &module_name);
    if uses_exports {
        format!("{module_name}, {exports_name}")
    } else if uses_module {
        module_name
    } else {
        String::new()
    }
}

fn mentions_cjs_free_names(code: &str) -> bool {
    contains_ident(code, "module") || contains_ident(code, "exports")
}

fn async_dependency_flags(module: &PreparedModule, request: &EmitRequest<'_>) -> Vec<bool> {
    module
        .dependencies
        .iter()
        .map(|dependency| {
            dependency
                .path()
                .and_then(|path| request.index.get(path))
                .is_some_and(|id| request.async_mod[*id])
        })
        .collect()
}

fn dependency_args(dependencies: &[Resolved], index: &HashMap<PathBuf, usize>) -> Vec<String> {
    dependencies
        .iter()
        .map(|dependency| match dependency {
            Resolved::External(specifier) => js_string(specifier),
            Resolved::Local(path) | Resolved::Css(path) | Resolved::Asset(path) => index
                .get(path)
                .map(ToString::to_string)
                .unwrap_or_else(|| "undefined".to_string()),
        })
        .collect()
}

#[derive(Clone, Copy, Default)]
struct RuntimeNeeds {
    require: bool,
    live: bool,
    star: bool,
    interop: bool,
    dynamic: bool,
    esm: bool,
    wrap: bool,
    define: bool,
    externals: bool,
}

impl RuntimeNeeds {
    fn absorb(&mut self, other: &Self) {
        self.require |= other.require;
        self.live |= other.live;
        self.star |= other.star;
        self.interop |= other.interop;
        self.dynamic |= other.dynamic;
        self.esm |= other.esm;
        self.wrap |= other.wrap;
        self.define |= other.define;
        self.externals |= other.externals;
    }

    fn finish(&mut self, format: Format) {
        if self.star {
            self.live = true;
            self.require = true;
        }
        if self.dynamic {
            self.require = true;
        }
        self.wrap = self.externals && format == Format::Esm;
    }
}

struct ChunkCode {
    factories: Vec<(usize, RenderedFactory)>,
    needs: RuntimeNeeds,
}

fn prepare_chunk(request: &EmitRequest<'_>, ids: &[usize]) -> BundleResult<ChunkCode> {
    let factories = render_factories(request, ids, RenderMode::Factory)?;
    let mut needs = RuntimeNeeds::default();
    for (_, rendered) in &factories {
        needs.absorb(&needs_from_code(request.names, &rendered.code));
    }
    Ok(ChunkCode { factories, needs })
}

fn render_factories(
    request: &EmitRequest<'_>,
    ids: &[usize],
    mode: RenderMode,
) -> BundleResult<Vec<(usize, RenderedFactory)>> {
    crate::parallel::try_map(request.threads, ids.to_vec(), |id| {
        render_factory_body(request, id, mode).map(|rendered| (id, rendered))
    })
}

fn needs_from_code(names: &Names, code: &str) -> RuntimeNeeds {
    RuntimeNeeds {
        require: calls(code, &names.require()),
        live: calls(code, &names.live()),
        star: calls(code, &names.star()),
        interop: calls(code, &names.interop()),
        dynamic: calls(code, &names.dynamic()),
        esm: calls(code, &names.esm()),
        wrap: calls(code, &names.wrap()),
        define: false,
        externals: false,
    }
}

fn calls(code: &str, name: &str) -> bool {
    let mut rest = code;
    let needle = format!("{name}(");
    while let Some(index) = rest.find(&needle) {
        let before = rest.as_bytes().get(index.wrapping_sub(1));
        let boundary = index == 0 || before.is_none_or(|byte| !is_ident_byte(*byte));
        if boundary {
            return true;
        }
        rest = &rest[index + 1..];
    }
    false
}

fn contains_ident(code: &str, name: &str) -> bool {
    let mut rest = code;
    while let Some(index) = rest.find(name) {
        let before = index == 0 || !is_ident_byte(rest.as_bytes()[index - 1]);
        let after = index + name.len();
        let after_ok = after >= rest.len() || !is_ident_byte(rest.as_bytes()[after]);
        if before && after_ok {
            return true;
        }
        rest = &rest[index + 1..];
    }
    false
}

fn is_ident_byte(byte: u8) -> bool {
    byte.is_ascii_alphanumeric() || byte == b'_' || byte == b'$'
}

fn helper_names(names: &Names, needs: &RuntimeNeeds) -> Vec<String> {
    let mut out = Vec::new();
    if needs.require {
        out.push(names.require());
    }
    if needs.live {
        out.push(names.live());
    }
    if needs.star {
        out.push(names.star());
    }
    if needs.interop {
        out.push(names.interop());
    }
    if needs.dynamic {
        out.push(names.dynamic());
    }
    if needs.esm {
        out.push(names.esm());
    }
    if needs.define {
        out.push(names.define());
    }
    out
}

fn import_helpers(
    names: &Names,
    needs: &RuntimeNeeds,
    shared_name: &str,
    format: Format,
) -> String {
    let list = helper_names(names, needs);
    if list.is_empty() {
        return if format == Format::Cjs {
            "\"use strict\";\n".to_string()
        } else {
            String::new()
        };
    }
    let joined = list.join(", ");
    if format == Format::Esm {
        format!("import {{ {joined} }} from \"./{shared_name}\";\n")
    } else {
        let mut out = format!(
            "\"use strict\";\nvar {rt} = require(\"./{shared_name}\");\n",
            rt = names.runtime()
        );
        for name in list {
            out.push_str(&format!(
                "var {name} = {rt}.{name};\n",
                rt = names.runtime()
            ));
        }
        out
    }
}

fn emit_direct(
    request: &EmitRequest<'_>,
    ids: &[usize],
    name: &str,
) -> BundleResult<Option<EmittedJs>> {
    if ids.len() != 1 {
        return Ok(None);
    }
    let id = ids[0];
    let module = &request.modules[id];
    if module.kind != ModuleKind::JavaScript {
        return Ok(None);
    }
    if request.async_mod[id] && request.format != Format::Esm {
        return Ok(None);
    }
    if module.analysis.is_json {
        return Ok(Some(emit_direct_json(request, id, name)?));
    }
    let probe = render_factory_body(request, id, RenderMode::Factory)?;
    let probe_needs = needs_from_code(request.names, &probe.code);
    if probe_needs.require
        || probe_needs.star
        || probe_needs.dynamic
        || probe_needs.interop
        || probe_needs.wrap
    {
        return Ok(None);
    }

    let mut rendered = render_factory_body(request, id, RenderMode::Direct)?;
    strip_strict_directive(&mut rendered);
    let need_module = contains_ident(&rendered.code, &request.names.module_param());
    let need_exports = contains_ident(&rendered.code, &request.names.exports_param());
    let mut buffer = Buffer::new(request.sourcemap);
    if request.format == Format::Cjs {
        buffer.push("\"use strict\";\n");
    }
    if need_module || need_exports {
        buffer.push(&exports_binding(request, need_module));
    }
    let banner = filename_banner(request, &module.path);
    let body_at = buffer.code.len() + banner.len();
    buffer.push(&banner);
    buffer.push_mapped(&rendered.code, &rendered.points, body_at, module);
    if !rendered.code.ends_with('\n') {
        buffer.push("\n");
    }
    if need_module || need_exports {
        buffer.push(&direct_footer(request, need_module));
    }
    Ok(Some(finish(buffer, name, request.format == Format::Esm)?))
}

fn emit_direct_json(request: &EmitRequest<'_>, id: usize, name: &str) -> BundleResult<EmittedJs> {
    let module = &request.modules[id];
    let json = module.analysis.json.as_deref().unwrap_or("null");
    let mut buffer = Buffer::new(request.sourcemap);
    if request.format == Format::Cjs {
        buffer.push("\"use strict\";\n");
    }
    let text = if request.format == Format::Esm {
        format!("export default {json};\n")
    } else {
        format!("module.exports = {json};\n")
    };
    let body_at = buffer.code.len();
    buffer.push_mapped(&text, &[], body_at, module);
    finish(buffer, name, request.format == Format::Esm)
}

fn filename_banner(request: &EmitRequest<'_>, path: &Path) -> String {
    if request.strip_comments || !request.filename_comments {
        return String::new();
    }
    let comment = display_path(path).replace("*/", "* /");
    format!("/* {comment} */\n")
}

fn exports_binding(request: &EmitRequest<'_>, need_module: bool) -> String {
    let names = request.names;
    let kw = if request.format == Format::Esm {
        "const"
    } else {
        "var"
    };
    if need_module {
        format!(
            "{kw} {module} = {{ exports: {{}} }};\n{kw} {exports} = {module}.exports;\n",
            module = names.module_param(),
            exports = names.exports_param()
        )
    } else {
        format!("{kw} {exports} = {{}};\n", exports = names.exports_param())
    }
}

fn direct_footer(request: &EmitRequest<'_>, need_module: bool) -> String {
    let value = if need_module {
        format!("{}.exports", request.names.module_param())
    } else {
        request.names.exports_param()
    };
    if request.format == Format::Esm {
        format!("export default {value};\n")
    } else {
        format!(
            "if (typeof module === \"object\" && module && module.exports) module.exports = {value};\n"
        )
    }
}

fn strip_strict_directive(rendered: &mut RenderedFactory) {
    let directive = "\"use strict\";\n";
    if !rendered.code.starts_with(directive) {
        return;
    }
    rendered.code.replace_range(..directive.len(), "");
    let len = directive.len() as u32;
    for (generated, _) in &mut rendered.points {
        if *generated >= len {
            *generated -= len;
        }
    }
}

fn externals_in(request: &EmitRequest<'_>, ids: &[usize]) -> Vec<String> {
    let mut names = Vec::new();
    for id in ids {
        for dependency in &request.modules[*id].dependencies {
            if let Resolved::External(name) = dependency {
                if !names.iter().any(|existing| existing == name) {
                    names.push(name.clone());
                }
            }
        }
    }
    names
}

fn external_imports(names: &Names, externals: &[String]) -> String {
    let mut out = String::new();
    for (index, specifier) in externals.iter().enumerate() {
        out.push_str(&format!(
            "import * as {prefix}ext{index} from {specifier};\n",
            prefix = names.require().trim_end_matches("require"),
            specifier = js_string(specifier)
        ));
    }
    out
}

fn ext_binding(names: &Names, index: usize) -> String {
    format!(
        "{prefix}ext{index}",
        prefix = names.require().trim_end_matches("require")
    )
}

fn runtime_prelude(
    request: &EmitRequest<'_>,
    externals: &[String],
    needs: &RuntimeNeeds,
) -> String {
    let names = request.names;
    let mut out = String::new();
    if request.format == Format::Cjs {
        out.push_str("\"use strict\";\n");
        if needs.externals {
            out.push_str(&format!(
                "var {node} = typeof require === \"function\" ? require : null;\n",
                node = names.node()
            ));
        }
    } else if needs.externals {
        let fields = externals
            .iter()
            .enumerate()
            .map(|(index, name)| {
                format!(
                    "{key}: {wrap}({binding})",
                    key = js_string(name),
                    wrap = names.wrap(),
                    binding = ext_binding(names, index)
                )
            })
            .collect::<Vec<_>>()
            .join(", ");
        out.push_str(&format!(
            "var {externals} = {{ {fields} }};\n",
            externals = names.externals()
        ));
    }
    out.push_str(&format!(
        "var {cache} = Object.create(null);\n",
        cache = names.cache()
    ));
    out
}

fn module_table(names: &Names) -> String {
    format!(
        "var {modules} = Object.create(null);\nfunction {define}(id, factory) {{ {modules}[id] = factory; }}\n",
        modules = names.modules(),
        define = names.define()
    )
}

fn helper_functions(request: &EmitRequest<'_>, needs: &RuntimeNeeds) -> String {
    let names = request.names;
    let mut out = String::new();
    if needs.require {
        let external_lookup = if !needs.externals {
            "throw new Error(\"External module was not bundled: \" + id);".to_string()
        } else if request.format == Format::Esm {
            format!(
                "if (Object.prototype.hasOwnProperty.call({externals}, id)) return {externals}[id];\n      throw new Error(\"External module was not bundled: \" + id);",
                externals = names.externals()
            )
        } else {
            format!(
                "if (typeof {node} === \"function\") return {node}(id);\n      throw new Error(\"External module was not bundled: \" + id);",
                node = names.node()
            )
        };
        out.push_str(&format!(
            r#"function {require}(id) {{
    if (typeof id === "string") {{
      {external_lookup}
    }}
    var cached = {cache}[id];
    if (cached) return cached.pending ? cached.pending : cached.exports;
    var module = {{ exports: {{}} }};
    {cache}[id] = module;
    var result = {modules}[id].call(module.exports, module, module.exports);
    if (result && typeof result.then === "function") {{
      module.pending = result.then(function () {{ return module.exports; }});
      return module.pending;
    }}
    return module.exports;
  }}
"#,
            require = names.require(),
            cache = names.cache(),
            modules = names.modules(),
            external_lookup = external_lookup,
        ));
    }
    if needs.live {
        out.push_str(&format!(
            r#"function {live}(exports, name, get) {{
    Object.defineProperty(exports, name, {{ enumerable: true, configurable: true, get: get }});
  }}
"#,
            live = names.live()
        ));
    }
    if needs.interop {
        out.push_str(&format!(
            r#"function {interop}(mod) {{
    return mod && mod.__esModule ? mod.default : mod;
  }}
"#,
            interop = names.interop()
        ));
    }
    if needs.star {
        out.push_str(&format!(
            r#"function {star}(target, id) {{
    var mod = {require}(id);
    var copy = function (resolved) {{
      Object.keys(resolved).forEach(function (key) {{
        if (key === "default" || key === "__esModule") return;
        if (Object.prototype.hasOwnProperty.call(target, key)) return;
        {live}(target, key, function () {{ return resolved[key]; }});
      }});
    }};
    if (mod && typeof mod.then === "function") return mod.then(copy);
    copy(mod);
  }}
"#,
            star = names.star(),
            require = names.require(),
            live = names.live(),
        ));
    }
    if needs.dynamic {
        out.push_str(&format!(
            r#"function {dynamic}(id) {{
    return Promise.resolve().then(function () {{ return {require}(id); }});
  }}
"#,
            dynamic = names.dynamic(),
            require = names.require(),
        ));
    }
    if needs.esm {
        out.push_str(&format!(
            r#"function {esm}(exports) {{
    Object.defineProperty(exports, "__esModule", {{ value: true }});
  }}
"#,
            esm = names.esm()
        ));
    }
    if needs.wrap {
        out.push_str(&format!(
            r#"function {wrap}(ns) {{
    return new Proxy(ns, {{ get: function (target, prop) {{ return prop === "__esModule" ? true : target[prop]; }} }});
  }}
"#,
            wrap = names.wrap()
        ));
    }
    out
}

fn assign_entry(request: &EmitRequest<'_>, entry: usize) -> String {
    let names = request.names;
    if request.format == Format::Esm {
        if request.async_mod[entry] {
            format!(
                "export default await {require}({entry});\n",
                require = names.require()
            )
        } else {
            format!(
                "var {entry_name} = {require}({entry});\nexport default {entry_name};\n",
                entry_name = names.entry(),
                require = names.require()
            )
        }
    } else {
        format!(
            r#"var {entry_name} = {require}({entry});
  if ({entry_name} && typeof {entry_name}.then === "function") {{
    {entry_name}.then(function (value) {{
      if (typeof module === "object" && module && module.exports) module.exports = value;
    }});
  }} else if (typeof module === "object" && module && module.exports) module.exports = {entry_name};
"#,
            entry_name = names.entry(),
            require = names.require()
        )
    }
}

fn shared_footer(request: &EmitRequest<'_>, exported: &RuntimeNeeds) -> String {
    let names = request.names;
    let list = helper_names(names, exported);
    let joined = list.join(", ");
    if request.format == Format::Esm {
        format!("export {{ {joined} }};\n")
    } else {
        let fields = list
            .iter()
            .map(|name| format!("{name}: {name}"))
            .collect::<Vec<_>>()
            .join(", ");
        format!(
            "var {rt} = {{ {fields} }};\nif (typeof module === \"object\" && module && module.exports) module.exports = {rt};\n",
            rt = names.runtime()
        )
    }
}

struct Buffer {
    code: String,
    points: Vec<Point>,
    sources: Vec<(String, String)>,
    source_ids: HashMap<PathBuf, usize>,
    sourcemap: bool,
}

impl Buffer {
    fn new(sourcemap: bool) -> Self {
        Self {
            code: String::new(),
            points: Vec::new(),
            sources: Vec::new(),
            source_ids: HashMap::new(),
            sourcemap,
        }
    }

    fn push(&mut self, text: &str) {
        self.code.push_str(text);
    }

    fn push_mapped(
        &mut self,
        text: &str,
        points: &[(u32, u32)],
        body_at: usize,
        module: &PreparedModule,
    ) {
        if self.sourcemap {
            let source = self.intern(module);
            for (generated, original) in points {
                self.points.push(Point {
                    generated: body_at as u32 + generated,
                    original: module.offset_map.map(*original),
                    source,
                });
            }
            if points.is_empty() {
                self.points.push(Point {
                    generated: body_at as u32,
                    original: 0,
                    source,
                });
            }
        }
        self.code.push_str(text);
    }

    fn intern(&mut self, module: &PreparedModule) -> usize {
        if let Some(id) = self.source_ids.get(&module.path) {
            return *id;
        }
        let id = self.sources.len();
        self.sources
            .push((display_path(&module.path), module.original.clone()));
        self.source_ids.insert(module.path.clone(), id);
        id
    }
}

fn finish(mut buffer: Buffer, name: &str, esm: bool) -> BundleResult<EmittedJs> {
    if esm {
        if let Some((code, edits)) = esm_shape::respect_esm(&buffer.code) {
            for point in &mut buffer.points {
                point.generated = esm_shape::shift_generated(point.generated, &edits);
            }
            buffer.code = code;
        }
    }
    let map = if buffer.sourcemap {
        Some(build_map(
            name,
            &buffer.code,
            &buffer.sources,
            buffer.points,
        ))
    } else {
        None
    };
    Ok(EmittedJs {
        name: name.to_string(),
        code: buffer.code,
        map,
        esm,
    })
}

fn assets_for(request: &EmitRequest<'_>) -> BundleResult<Vec<(String, Vec<u8>)>> {
    let mut assets = Vec::new();
    let mut css = String::new();
    for (id, module) in request.modules.iter().enumerate() {
        if !request.keep[id].included {
            continue;
        }
        match module.kind {
            ModuleKind::Css => {
                let rewritten = crate::images::rewrite_css_images(
                    &module.original,
                    &module.image_refs,
                    |path| {
                        request
                            .index
                            .get(path)
                            .map(|id| request.modules[*id].public_name.clone())
                    },
                );
                let text = if request.strip_comments {
                    strip_css_comments(&rewritten)
                } else {
                    rewritten
                };
                if request.strip_comments && text.trim().is_empty() {
                    continue;
                }
                if !css.is_empty() && !css.ends_with('\n') {
                    css.push('\n');
                }
                css.push_str(&text);
                if !text.ends_with('\n') {
                    css.push('\n');
                }
            }
            ModuleKind::Asset => {
                let bytes = fs::read(&module.path).map_err(|err| {
                    BundleError::new(format!("failed to read {}: {err}", module.path.display()))
                })?;
                assets.push((module.public_name.clone(), bytes));
            }
            ModuleKind::JavaScript => {}
        }
    }
    if !css.is_empty() {
        assets.insert(0, (request.css_filename.to_string(), css.into_bytes()));
    }
    Ok(assets)
}
