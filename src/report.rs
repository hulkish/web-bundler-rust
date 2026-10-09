//! Live progress for a bundle.
//!
//! Reporters print as modules finish compiling, not after the build returns.
//! Color is on when stdout is a terminal, unless `NO_COLOR` is set.

use std::collections::HashMap;
use std::io::{self, IsTerminal, Write};
use std::sync::{Arc, Mutex};
use std::time::Instant;

use crate::error::{BundleError, BundleResult};

/// What a module was when it finished compiling.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Kind {
    JavaScript,
    Css,
    Asset,
}

/// A named pass the bundler is in.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Stage {
    Bundle,
    Optimize,
    Minify,
}

impl Stage {
    fn label(self) -> &'static str {
        match self {
            Stage::Bundle => "bundling",
            Stage::Optimize => "optimizing",
            Stage::Minify => "minifying",
        }
    }

    fn detail(self) -> &'static str {
        match self {
            Stage::Bundle => "assembling modules",
            Stage::Optimize => "rewriting modules into faster code",
            Stage::Minify => "compressing the output",
        }
    }

    fn color(self) -> &'static str {
        match self {
            Stage::Bundle => "1;36",
            Stage::Optimize => "1;34",
            Stage::Minify => "1;33",
        }
    }
}

/// One step the bundler has just reached.
#[derive(Debug, Clone)]
pub enum Event {
    Start {
        entries: usize,
        threads: Option<usize>,
    },
    /// Entered bundling, optimizing, or minifying.
    Stage {
        stage: Stage,
    },
    Module {
        path: String,
        kind: Kind,
        parent: Option<String>,
    },
    Link {
        included: usize,
        total: usize,
    },
    Emit,
    Task {
        label: &'static str,
        name: String,
    },
    Output {
        name: String,
        bytes: usize,
        label: &'static str,
    },
    Write {
        path: String,
        bytes: usize,
    },
    Done {
        modules: usize,
        files: usize,
        assets: usize,
        bytes: usize,
    },
}

/// Prints [`Event`]s as they happen.
pub trait Reporter: Send + Sync {
    fn report(&self, event: &Event);
}

/// Optional reporter stored on [`crate::BundleOptions`].
#[derive(Clone, Default)]
pub struct ReporterHandle {
    inner: Option<Arc<dyn Reporter>>,
}

impl ReporterHandle {
    pub fn report(&self, event: &Event) {
        if let Some(reporter) = &self.inner {
            reporter.report(event);
        }
    }

    pub fn is_active(&self) -> bool {
        self.inner.is_some()
    }
}

impl std::fmt::Debug for ReporterHandle {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter.write_str(if self.is_active() { "Reporter" } else { "none" })
    }
}

/// `log`, `bar`, `tree`, or `json`.
pub fn parse_style(value: &str) -> BundleResult<()> {
    match value {
        "log" | "bar" | "tree" | "json" => Ok(()),
        other => Err(BundleError::new(format!(
            "unknown reporter '{other}', expected log, bar, tree, or json"
        ))),
    }
}

/// A reporter that writes to the terminal, with color when stdout is a tty.
pub fn open(style: &str) -> BundleResult<ReporterHandle> {
    create(style, color_enabled(), Box::new(StdoutWriter))
}

/// Build a reporter that writes to `write`. Tests pass a buffer here.
pub fn create(
    style: &str,
    color: bool,
    write: Box<dyn Write + Send>,
) -> BundleResult<ReporterHandle> {
    parse_style(style)?;
    let reporter: Arc<dyn Reporter> = match style {
        "bar" => Arc::new(Bar::new(write, color)),
        "tree" => Arc::new(Tree::new(write, color)),
        "json" => Arc::new(Json::new(write, color)),
        _ => Arc::new(Log::new(write, color)),
    };
    Ok(ReporterHandle {
        inner: Some(reporter),
    })
}

fn color_enabled() -> bool {
    if std::env::var_os("NO_COLOR").is_some() {
        return false;
    }
    if std::env::var_os("FORCE_COLOR").is_some() {
        return true;
    }
    io::stdout().is_terminal()
}

struct StdoutWriter;

impl Write for StdoutWriter {
    fn write(&mut self, buffer: &[u8]) -> io::Result<usize> {
        let mut out = io::stdout().lock();
        let written = out.write(buffer)?;
        out.flush()?;
        Ok(written)
    }

    fn flush(&mut self) -> io::Result<()> {
        io::stdout().flush()
    }
}

struct Core {
    out: Mutex<Box<dyn Write + Send>>,
    color: bool,
    started: Mutex<Instant>,
}

impl Core {
    fn new(write: Box<dyn Write + Send>, color: bool) -> Self {
        Self {
            out: Mutex::new(write),
            color,
            started: Mutex::new(Instant::now()),
        }
    }

    fn reset(&self) {
        *self.started.lock().unwrap() = Instant::now();
    }

    fn ms(&self) -> u128 {
        self.started.lock().unwrap().elapsed().as_millis()
    }

    fn write(&self, text: &str) {
        let mut out = self.out.lock().unwrap();
        let _ = out.write_all(text.as_bytes());
        let _ = out.flush();
    }
}

fn paint(on: bool, code: &str, text: &str) -> String {
    if !on {
        return text.to_string();
    }
    format!("\x1b[{code}m{text}\x1b[0m")
}

fn kind_meta(kind: Kind) -> (&'static str, &'static str) {
    match kind {
        Kind::JavaScript => ("js", "32"),
        Kind::Css => ("css", "35"),
        Kind::Asset => ("asset", "33"),
    }
}

fn human_bytes(bytes: usize) -> String {
    if bytes < 1024 {
        return format!("{bytes} B");
    }
    if bytes < 1024 * 1024 {
        return format!("{:.1} KB", bytes as f64 / 1024.0);
    }
    format!("{:.1} MB", bytes as f64 / (1024.0 * 1024.0))
}

fn json_string(text: &str) -> String {
    let mut out = String::from('"');
    for ch in text.chars() {
        match ch {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            ch if ch.is_control() => out.push_str(&format!("\\u{:04x}", ch as u32)),
            ch => out.push(ch),
        }
    }
    out.push('"');
    out
}

struct Log {
    core: Core,
}

impl Log {
    fn new(write: Box<dyn Write + Send>, color: bool) -> Self {
        Self {
            core: Core::new(write, color),
        }
    }

    fn line(&self, color: &str, label: &str, rest: &str) {
        let ms = paint(self.core.color, "2", &format!("{:6}ms", self.core.ms()));
        let label = paint(self.core.color, color, &format!("{label:<10}"));
        self.core.write(&format!("{ms} {label} {rest}\n"));
    }
}

impl Reporter for Log {
    fn report(&self, event: &Event) {
        match event {
            Event::Start { entries, threads } => {
                self.core.reset();
                let workers = threads
                    .map(|count| count.to_string())
                    .unwrap_or_else(|| "1".into());
                self.line(
                    "36",
                    "start",
                    &format!("{entries} entries, {workers} threads"),
                );
            }
            Event::Stage { stage } => self.line(stage.color(), stage.label(), stage.detail()),
            Event::Module { path, kind, .. } => {
                let (label, color) = kind_meta(*kind);
                self.line(color, label, path);
            }
            Event::Link { included, total } => {
                self.line(
                    "36",
                    "link",
                    &format!("{included} included, {total} loaded"),
                );
            }
            Event::Emit => self.line("36", "emit", "writing modules"),
            Event::Task { label, name } => self.line("33", label, name),
            Event::Output { name, bytes, label } => {
                self.line("32", label, &format!("{name}  {}", human_bytes(*bytes)));
            }
            Event::Write { path, bytes } => {
                self.line("32", "wrote", &format!("{path}  {}", human_bytes(*bytes)));
            }
            Event::Done {
                modules,
                files,
                assets,
                bytes,
            } => {
                let summary = format!(
                    "{modules} modules, {files} files, {assets} assets, {} in {}ms",
                    human_bytes(*bytes),
                    self.core.ms()
                );
                self.line("1;32", "done", &summary);
            }
        }
    }
}

struct BarState {
    modules: usize,
    last: String,
    last_color: &'static str,
    stage: &'static str,
    stage_color: &'static str,
    spin: usize,
    open: bool,
}

struct Bar {
    core: Core,
    state: Mutex<BarState>,
}

impl Bar {
    fn new(write: Box<dyn Write + Send>, color: bool) -> Self {
        Self {
            core: Core::new(write, color),
            state: Mutex::new(BarState {
                modules: 0,
                last: "starting".to_string(),
                last_color: "36",
                stage: "bundling",
                stage_color: "1;36",
                spin: 0,
                open: false,
            }),
        }
    }

    fn status(&self, state: &BarState) -> String {
        const FRAMES: [&str; 10] = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
        let frame = paint(self.core.color, "36", FRAMES[state.spin % FRAMES.len()]);
        let stage = paint(self.core.color, state.stage_color, state.stage);
        let count = paint(self.core.color, "1", &format!("{}", state.modules));
        let last = paint(self.core.color, state.last_color, &fit(&state.last, 64));
        format!("\r\x1b[K {frame}  {stage}  {count} modules  {last}")
    }
}

impl Reporter for Bar {
    fn report(&self, event: &Event) {
        let mut state = self.state.lock().unwrap();
        match event {
            Event::Start { .. } => {
                self.core.reset();
                state.modules = 0;
                state.last = "starting".to_string();
                state.last_color = "36";
                state.stage = "bundling";
                state.stage_color = "1;36";
                state.open = true;
                let line = self.status(&state);
                drop(state);
                self.core.write(&line);
            }
            Event::Stage { stage } => {
                state.spin += 1;
                state.stage = stage.label();
                state.stage_color = stage.color();
                state.last = stage.detail().to_string();
                state.last_color = stage.color();
                state.open = true;
                let line = self.status(&state);
                drop(state);
                self.core.write(&line);
            }
            Event::Module { path, kind, .. } => {
                let (label, color) = kind_meta(*kind);
                state.modules += 1;
                state.spin += 1;
                state.last = format!("{label}  {path}");
                state.last_color = color;
                state.open = true;
                let line = self.status(&state);
                drop(state);
                self.core.write(&line);
            }
            Event::Link { included, .. } => {
                state.spin += 1;
                state.last = format!("link  {included} included");
                state.last_color = "36";
                state.open = true;
                let line = self.status(&state);
                drop(state);
                self.core.write(&line);
            }
            Event::Emit => {
                state.spin += 1;
                state.last = "emit".to_string();
                state.last_color = "36";
                state.open = true;
                let line = self.status(&state);
                drop(state);
                self.core.write(&line);
            }
            Event::Task { label, name } => {
                state.spin += 1;
                state.last = format!("{label}  {name}");
                state.last_color = "33";
                state.open = true;
                let line = self.status(&state);
                drop(state);
                self.core.write(&line);
            }
            Event::Output { name, bytes, label } => {
                state.spin += 1;
                state.last = format!("{label}  {name}  {}", human_bytes(*bytes));
                state.last_color = "32";
                state.open = true;
                let line = self.status(&state);
                drop(state);
                self.core.write(&line);
            }
            Event::Write { path, bytes } => {
                state.open = false;
                drop(state);
                let path = paint(self.core.color, "32", path);
                self.core.write(&format!(
                    "\r\x1b[K  wrote  {path}  {}\n",
                    human_bytes(*bytes)
                ));
            }
            Event::Done {
                modules,
                files,
                assets,
                bytes,
            } => {
                state.open = false;
                drop(state);
                let summary = paint(
                    self.core.color,
                    "1;32",
                    &format!(
                        "done  {modules} modules, {files} files, {assets} assets, {} in {}ms",
                        human_bytes(*bytes),
                        self.core.ms()
                    ),
                );
                self.core.write(&format!("\r\x1b[K  {summary}\n"));
            }
        }
    }
}

impl Drop for Bar {
    fn drop(&mut self) {
        if self.state.lock().unwrap().open {
            self.core.write("\n");
        }
    }
}

struct Tree {
    core: Core,
    parents: Mutex<HashMap<String, Option<String>>>,
}

impl Tree {
    fn new(write: Box<dyn Write + Send>, color: bool) -> Self {
        Self {
            core: Core::new(write, color),
            parents: Mutex::new(HashMap::new()),
        }
    }

    fn depth(parents: &HashMap<String, Option<String>>, parent: &Option<String>) -> usize {
        let mut depth = 0;
        let mut cursor = parent.clone();
        while let Some(path) = cursor {
            depth += 1;
            if depth > 32 {
                break;
            }
            cursor = parents.get(&path).cloned().flatten();
        }
        depth
    }
}

impl Reporter for Tree {
    fn report(&self, event: &Event) {
        match event {
            Event::Start { entries, threads } => {
                self.core.reset();
                let workers = threads
                    .map(|count| count.to_string())
                    .unwrap_or_else(|| "1".into());
                let title = paint(self.core.color, "1;36", "bundle");
                self.core
                    .write(&format!("{title}  {entries} entries, {workers} threads\n"));
            }
            Event::Stage { stage } => {
                let label = paint(self.core.color, stage.color(), stage.label());
                self.core.write(&format!("{label}  {}\n", stage.detail()));
            }
            Event::Module { path, kind, parent } => {
                let mut parents = self.parents.lock().unwrap();
                let depth = Self::depth(&parents, parent);
                parents.insert(path.clone(), parent.clone());
                drop(parents);
                let (label, color) = kind_meta(*kind);
                let mut prefix = String::new();
                for _ in 0..depth {
                    prefix.push_str("│  ");
                }
                let branch = paint(self.core.color, color, "├─");
                let badge = paint(self.core.color, color, label);
                self.core
                    .write(&format!("{prefix}{branch} {badge}  {path}\n"));
            }
            Event::Link { included, total } => {
                let label = paint(self.core.color, "36", "link");
                self.core
                    .write(&format!("{label}  {included} included of {total}\n"));
            }
            Event::Emit => {
                let label = paint(self.core.color, "36", "emit");
                self.core.write(&format!("{label}\n"));
            }
            Event::Task { label, name } => {
                let label = paint(self.core.color, "33", label);
                self.core.write(&format!("{label}  {name}\n"));
            }
            Event::Output { name, bytes, label } => {
                let label = paint(self.core.color, "32", label);
                self.core
                    .write(&format!("{label}  {name}  {}\n", human_bytes(*bytes)));
            }
            Event::Write { path, bytes } => {
                let label = paint(self.core.color, "32", "wrote");
                self.core
                    .write(&format!("{label}  {path}  {}\n", human_bytes(*bytes)));
            }
            Event::Done {
                modules,
                files,
                assets,
                bytes,
            } => {
                let label = paint(self.core.color, "1;32", "done");
                self.core.write(&format!(
                    "{label}  {modules} modules, {files} files, {assets} assets, {} in {}ms\n",
                    human_bytes(*bytes),
                    self.core.ms()
                ));
            }
        }
    }
}

struct Json {
    core: Core,
}

impl Json {
    fn new(write: Box<dyn Write + Send>, color: bool) -> Self {
        Self {
            core: Core::new(write, color),
        }
    }

    fn emit(&self, name: &str, color: &str, fields: &str) {
        let body = format!(
            "{{\"event\":{},\"ms\":{}{fields}}}",
            json_string(name),
            self.core.ms()
        );
        if self.core.color {
            let badge = paint(true, color, name);
            self.core.write(&format!("{badge} {body}\n"));
        } else {
            self.core.write(&format!("{body}\n"));
        }
    }
}

impl Reporter for Json {
    fn report(&self, event: &Event) {
        match event {
            Event::Start { entries, threads } => {
                self.core.reset();
                let threads = threads
                    .map(|count| count.to_string())
                    .unwrap_or_else(|| "null".to_string());
                self.emit(
                    "start",
                    "36",
                    &format!(",\"entries\":{entries},\"threads\":{threads}"),
                );
            }
            Event::Stage { stage } => {
                self.emit(
                    "stage",
                    stage.color(),
                    &format!(",\"stage\":{}", json_string(stage.label())),
                );
            }
            Event::Module { path, kind, parent } => {
                let (name, color) = kind_meta(*kind);
                let parent = parent
                    .as_ref()
                    .map(|path| json_string(path))
                    .unwrap_or_else(|| "null".to_string());
                self.emit(
                    "compile",
                    color,
                    &format!(
                        ",\"path\":{},\"kind\":{},\"parent\":{parent}",
                        json_string(path),
                        json_string(name)
                    ),
                );
            }
            Event::Link { included, total } => {
                self.emit(
                    "link",
                    "36",
                    &format!(",\"included\":{included},\"total\":{total}"),
                );
            }
            Event::Emit => self.emit("emit", "36", ""),
            Event::Task { label, name } => {
                self.emit(
                    "task",
                    "33",
                    &format!(
                        ",\"label\":{},\"name\":{}",
                        json_string(label),
                        json_string(name)
                    ),
                );
            }
            Event::Output { name, bytes, label } => {
                self.emit(
                    "output",
                    "32",
                    &format!(
                        ",\"name\":{},\"bytes\":{bytes},\"label\":{}",
                        json_string(name),
                        json_string(label)
                    ),
                );
            }
            Event::Write { path, bytes } => {
                self.emit(
                    "wrote",
                    "32",
                    &format!(",\"path\":{},\"bytes\":{bytes}", json_string(path)),
                );
            }
            Event::Done {
                modules,
                files,
                assets,
                bytes,
            } => {
                self.emit(
                    "done",
                    "1;32",
                    &format!(",\"modules\":{modules},\"files\":{files},\"assets\":{assets},\"bytes\":{bytes}"),
                );
            }
        }
    }
}

fn fit(text: &str, width: usize) -> String {
    let count = text.chars().count();
    if count <= width {
        return text.to_string();
    }
    let keep = width.saturating_sub(1);
    let mut out: String = text.chars().take(keep).collect();
    out.push('…');
    out
}

#[cfg(test)]
mod tests {
    use super::{create, Event, Kind};

    fn sample(style: &str, color: bool) -> String {
        let buffer = std::sync::Arc::new(std::sync::Mutex::new(Vec::<u8>::new()));
        let handle = create(style, color, Box::new(Buffer(buffer.clone()))).unwrap();
        handle.report(&Event::Start {
            entries: 1,
            threads: None,
        });
        handle.report(&Event::Stage {
            stage: super::Stage::Optimize,
        });
        handle.report(&Event::Module {
            path: "src/index.js".to_string(),
            kind: Kind::JavaScript,
            parent: None,
        });
        handle.report(&Event::Module {
            path: "src/app.css".to_string(),
            kind: Kind::Css,
            parent: Some("src/index.js".to_string()),
        });
        handle.report(&Event::Link {
            included: 2,
            total: 2,
        });
        handle.report(&Event::Stage {
            stage: super::Stage::Bundle,
        });
        handle.report(&Event::Stage {
            stage: super::Stage::Minify,
        });
        handle.report(&Event::Done {
            modules: 2,
            files: 1,
            assets: 1,
            bytes: 40,
        });
        let bytes = buffer.lock().unwrap().clone();
        String::from_utf8(bytes).unwrap()
    }

    struct Buffer(std::sync::Arc<std::sync::Mutex<Vec<u8>>>);

    impl std::io::Write for Buffer {
        fn write(&mut self, data: &[u8]) -> std::io::Result<usize> {
            self.0.lock().unwrap().extend_from_slice(data);
            Ok(data.len())
        }

        fn flush(&mut self) -> std::io::Result<()> {
            Ok(())
        }
    }

    #[test]
    fn log_names_the_module_and_can_color_it() {
        let plain = sample("log", false);
        assert!(plain.contains("src/index.js"), "{plain}");
        assert!(plain.contains("optimizing"), "{plain}");
        assert!(plain.contains("bundling"), "{plain}");
        assert!(plain.contains("minifying"), "{plain}");
        assert!(plain.contains("done"), "{plain}");
        assert!(!plain.contains('\u{1b}'), "{plain}");
        let colored = sample("log", true);
        assert!(colored.contains("\u{1b}[32m"), "{colored}");
        assert!(colored.contains("src/index.js"), "{colored}");
    }

    #[test]
    fn bar_updates_the_current_line() {
        let text = sample("bar", true);
        assert!(text.contains('\r'), "{text}");
        assert!(text.contains("src/index.js"), "{text}");
        assert!(text.contains("optimizing"), "{text}");
        assert!(text.contains("minifying"), "{text}");
        assert!(text.contains("done"), "{text}");
        assert!(text.contains("\u{1b}[32m"), "{text}");
    }

    #[test]
    fn tree_indents_a_child_under_its_parent() {
        let text = sample("tree", true);
        let parent = text.find("src/index.js").unwrap();
        let child = text.find("src/app.css").unwrap();
        assert!(child > parent, "{text}");
        assert!(text.contains("├─"), "{text}");
        assert!(text.contains("optimizing"), "{text}");
        assert!(text.contains("bundling"), "{text}");
        assert!(text.contains("minifying"), "{text}");
        assert!(text.contains("\u{1b}[35m"), "{text}");
    }

    #[test]
    fn json_stays_parseable_until_color_is_on() {
        let plain = sample("json", false);
        assert!(
            plain.contains("{\"event\":\"stage\",\"stage\":\"bundling\"}")
                || plain.contains("\"stage\":\"bundling\""),
            "{plain}"
        );
        assert!(plain.contains("\"stage\":\"optimizing\""), "{plain}");
        assert!(plain.contains("\"stage\":\"minifying\""), "{plain}");
        assert!(!plain.contains('\u{1b}'), "{plain}");
        let colored = sample("json", true);
        assert!(colored.contains("\u{1b}[32mcompile\u{1b}[0m"), "{colored}");
        assert!(colored.contains("{\"event\":\"compile\""), "{colored}");
    }

    #[test]
    fn unknown_style_is_rejected() {
        let error = create("dots", false, Box::new(std::io::sink())).unwrap_err();
        assert!(error.to_string().contains("log, bar, tree, or json"));
    }
}
