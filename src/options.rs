use std::path::PathBuf;

/// Where the bundle is meant to run.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Target {
    /// Node-compatible script. Node built-ins stay external.
    Node,
    /// Browser script. Node built-ins are rejected, and the bundle is an ES module.
    Browser,
}

/// Module syntax of the written JavaScript.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Format {
    /// `module.exports` and `require` for packages and Node built-ins.
    Cjs,
    /// `export` and `import` for packages, Node built-ins, and shared chunks.
    Esm,
    /// asm.js. One integer module is lowered to a `"use asm"` function.
    Asm,
    /// WebAssembly. One integer module is lowered to a `.wasm` binary.
    Wasm,
}

impl Format {
    pub fn as_str(self) -> &'static str {
        match self {
            Format::Cjs => "cjs",
            Format::Esm => "esm",
            Format::Asm => "asm",
            Format::Wasm => "wasm",
        }
    }
}

/// One format to write, with the file extension that format should use.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FormatOutput {
    pub format: Format,
    /// Extension without a leading dot, such as `mjs`, `cjs`, or `wasm`.
    /// `None` uses the default for that format.
    pub extension: Option<String>,
}

/// Options for [`crate::bundle`].
#[derive(Debug, Clone)]
pub struct BundleOptions {
    /// Entry modules. The first entry is the primary bundle when only one file is emitted.
    pub entries: Vec<PathBuf>,
    /// Compress the finished JavaScript and any bundled CSS.
    pub minify: bool,
    /// Reprint the finished JavaScript and CSS with indentation. Runs after
    /// minify when both are set. Off by default.
    pub prettify: bool,
    /// Rewrite each module into faster code before it is bundled, and reduce bundled CSS.
    /// Off by default.
    pub optimize: bool,
    /// Remove every comment, including `/*! */`, `//!`, `@license`, and `@preserve`.
    pub strip_comments: bool,
    /// Write a comment naming each module's source file. On by default.
    pub filename_comments: bool,
    /// Package names left for the runtime to load. Node built-ins are always external on Node.
    pub external: Vec<String>,
    /// Compile-time replacements. The value is a JavaScript expression, so a string needs quotes.
    pub defines: Vec<(String, String)>,
    pub target: Target,
    /// Module syntax of the written files. `None` uses CommonJS for Node and ES modules for the browser.
    /// Ignored when [`Self::outputs`] is not empty.
    pub format: Option<Format>,
    /// Write every listed format in one build. Each entry can set its own file extension.
    pub outputs: Vec<FormatOutput>,
    /// Emit a source map next to each JavaScript file.
    pub sourcemap: bool,
    /// Function called for JSX elements. Defaults to `React.createElement`.
    pub jsx_pragma: String,
    /// Function or identifier used for JSX fragments. Defaults to `React.Fragment`.
    pub jsx_fragment: String,
    /// File name of the bundled CSS, relative to the JavaScript output.
    pub css_filename: String,
    /// Compile modules and finish output files on this many threads.
    /// `None` keeps the build on the calling thread. The written files match
    /// a single-threaded build.
    pub threads: Option<usize>,
    /// Live progress printer. Empty unless a CLI reporter was selected.
    pub reporter: crate::report::ReporterHandle,
}

impl BundleOptions {
    pub fn new(entry: impl Into<PathBuf>) -> Self {
        Self {
            entries: vec![entry.into()],
            minify: false,
            prettify: false,
            optimize: false,
            strip_comments: false,
            filename_comments: true,
            external: Vec::new(),
            defines: Vec::new(),
            target: Target::Node,
            format: None,
            outputs: Vec::new(),
            sourcemap: false,
            jsx_pragma: "React.createElement".to_string(),
            jsx_fragment: "React.Fragment".to_string(),
            css_filename: "bundle.css".to_string(),
            threads: None,
            reporter: crate::report::ReporterHandle::default(),
        }
    }

    pub fn entries(mut self, entries: impl IntoIterator<Item = impl Into<PathBuf>>) -> Self {
        self.entries = entries.into_iter().map(Into::into).collect();
        self
    }

    pub fn minify(mut self, minify: bool) -> Self {
        self.minify = minify;
        self
    }

    pub fn prettify(mut self, prettify: bool) -> Self {
        self.prettify = prettify;
        self
    }

    pub fn optimize(mut self, optimize: bool) -> Self {
        self.optimize = optimize;
        self
    }

    pub fn strip_comments(mut self, strip_comments: bool) -> Self {
        self.strip_comments = strip_comments;
        self
    }

    pub fn filename_comments(mut self, filename_comments: bool) -> Self {
        self.filename_comments = filename_comments;
        self
    }

    pub fn external(mut self, external: impl IntoIterator<Item = impl Into<String>>) -> Self {
        self.external = external.into_iter().map(Into::into).collect();
        self
    }

    pub fn define(mut self, key: impl Into<String>, value: impl Into<String>) -> Self {
        self.defines.push((key.into(), value.into()));
        self
    }

    pub fn target(mut self, target: Target) -> Self {
        self.target = target;
        self
    }

    pub fn format(mut self, format: Format) -> Self {
        self.outputs.clear();
        self.format = Some(format);
        self
    }

    /// Add a format to write, using `extension` as its file extension (`mjs`, `wasm`).
    /// A leading dot is optional. Calling this more than once writes every format.
    pub fn output_as(mut self, format: Format, extension: impl Into<String>) -> Self {
        if self.outputs.is_empty() {
            if let Some(format) = self.format.take() {
                self.outputs.push(FormatOutput {
                    format,
                    extension: None,
                });
            }
        }
        self.format = None;
        self.outputs.push(FormatOutput {
            format,
            extension: Some(extension.into()),
        });
        self
    }

    /// Format chosen for the written files. Browser output is ESM unless a format was set.
    pub fn module_format(&self) -> Format {
        self.format.unwrap_or(match self.target {
            Target::Browser => Format::Esm,
            Target::Node => Format::Cjs,
        })
    }

    pub fn sourcemap(mut self, sourcemap: bool) -> Self {
        self.sourcemap = sourcemap;
        self
    }

    pub fn jsx(mut self, pragma: impl Into<String>, fragment: impl Into<String>) -> Self {
        self.jsx_pragma = pragma.into();
        self.jsx_fragment = fragment.into();
        self
    }

    pub fn css_filename(mut self, name: impl Into<String>) -> Self {
        self.css_filename = name.into();
        self
    }

    /// Compile modules and finish output files on `count` threads.
    pub fn threads(mut self, count: usize) -> Self {
        self.threads = Some(count);
        self
    }
}

/// One JavaScript file produced by a bundle.
#[derive(Debug, Clone)]
pub struct OutputFile {
    /// Suggested file name, such as `app.js` or `chunk.js`.
    pub name: String,
    pub code: String,
    pub map: Option<String>,
}

/// A CSS bundle or copied asset, written next to the JavaScript.
#[derive(Debug, Clone)]
pub struct OutputAsset {
    pub name: String,
    pub contents: Vec<u8>,
}

/// Why a module was kept or left out of the bundle.
#[derive(Debug, Clone)]
pub struct ModuleReport {
    pub path: PathBuf,
    pub included: bool,
    pub reason: String,
}

/// A finished bundle.
#[derive(Debug, Clone)]
pub struct BundleOutput {
    /// JavaScript for the first entry. Present so a one-file bundle can be read directly.
    pub code: String,
    /// Source map for [`Self::code`], when source maps were requested.
    pub map: Option<String>,
    /// Every JavaScript file. A shared chunk, when one exists, comes before the entries.
    pub files: Vec<OutputFile>,
    /// Bundled CSS and copied files such as images and fonts.
    pub assets: Vec<OutputAsset>,
    /// Canonical paths of modules that were included. The first entry is listed first.
    pub modules: Vec<PathBuf>,
    pub report: Vec<ModuleReport>,
}
