use std::fs;
use std::path::{Path, PathBuf};
use std::process::ExitCode;
use std::thread;
use std::time::{Duration, SystemTime};

use clap::Parser;
use webbundler::{
    bundle, load_config, open_reporter, parse_format, parse_target, BundleOptions, BundleOutput,
    Event, FileConfig, Format,
};

#[derive(Parser)]
#[command(
    name = "webbundler",
    version,
    about = "Bundle JavaScript modules into a single file"
)]
struct Cli {
    /// Entry point files. Repeat or pass several. A config file can supply them instead.
    #[arg(required = false)]
    entries: Vec<PathBuf>,

    /// JavaScript file to write, or a directory when there is more than one entry.
    #[arg(short, long)]
    output: Option<PathBuf>,

    /// Minify the bundle: constant folding, JSON and literal folding, dead code
    /// elimination, name mangling, repeated-string pooling, lexical bindings for
    /// ES modules, whitespace removal, and CSS compression.
    #[arg(short, long)]
    minify: bool,

    /// Leave minification off even when the config file turns it on.
    #[arg(long, conflicts_with = "minify")]
    no_minify: bool,

    /// Reprint the JavaScript and CSS with indentation. Runs after minify when both are set.
    #[arg(long)]
    prettify: bool,

    /// Leave prettifying off even when the config file turns it on.
    #[arg(long, conflicts_with = "prettify")]
    no_prettify: bool,

    /// Rewrite modules into faster code before bundling, and reduce bundled CSS.
    #[arg(long)]
    optimize: bool,

    /// Leave optimization off even when the config file turns it on.
    #[arg(long, conflicts_with = "optimize")]
    no_optimize: bool,

    /// Remove every comment, including `/*! */`, `//!`, `@license`, and `@preserve`.
    #[arg(long)]
    strip_comments: bool,

    /// Keep comments even when the config file strips them.
    #[arg(long, conflicts_with = "strip_comments")]
    no_strip_comments: bool,

    /// Write a comment naming each module's source file. On by default.
    #[arg(long)]
    filename_comments: bool,

    /// Omit the source-file comment written above each module.
    #[arg(long, conflicts_with = "filename_comments")]
    no_filename_comments: bool,

    /// Package name to leave for the runtime to load. Repeat for more than one.
    /// Node built-ins are always external when the target is node.
    #[arg(long = "external")]
    external: Vec<String>,

    /// Replace a compile-time expression. `KEY` is a dotted name and `VALUE` is JavaScript.
    /// Example: `--define process.env.NODE_ENV='"production"'`
    #[arg(long = "define", value_name = "KEY=VALUE")]
    define: Vec<String>,

    /// `node` (default) or `browser`.
    #[arg(long)]
    target: Option<String>,

    /// `cjs`, `esm`, `asm`, or `wasm`. Node defaults to `cjs`. Browser output is `esm`.
    #[arg(long)]
    format: Option<String>,

    /// Write a source map next to each JavaScript file.
    #[arg(long)]
    sourcemap: bool,

    /// Skip source maps even when the config file requests them.
    #[arg(long, conflicts_with = "sourcemap")]
    no_sourcemap: bool,

    /// Rebuild when an input file changes.
    #[arg(long)]
    watch: bool,

    /// Print why each module was included.
    #[arg(long)]
    report: bool,

    /// JSON config file. `webbundler.config.json` in the current directory is used when this is omitted.
    #[arg(long)]
    config: Option<PathBuf>,

    /// Function used for JSX elements.
    #[arg(long)]
    jsx_pragma: Option<String>,

    /// Identifier used for JSX fragments.
    #[arg(long)]
    jsx_fragment: Option<String>,

    /// Compile modules on this many threads, and finish each JavaScript and CSS
    /// output in parallel. The written files match a single-threaded build.
    /// Omit the flag to stay on one thread.
    #[arg(long, value_name = "COUNT")]
    threads: Option<usize>,

    /// Live progress while the bundle runs: `log`, `bar`, `tree`, or `json`.
    #[arg(long, value_name = "STYLE")]
    reporter: Option<String>,
}

fn main() -> ExitCode {
    match run() {
        Ok(()) => ExitCode::SUCCESS,
        Err(err) => {
            eprintln!("error: {err}");
            ExitCode::FAILURE
        }
    }
}

fn run() -> Result<(), webbundler::BundleError> {
    let cli = Cli::parse();
    let config = load_cli_config(cli.config.as_deref())?;
    let options = build_options(&cli, config.as_ref())?;
    let output_path = output_path(&cli, config.as_ref(), options.entries.len(), options.format);
    let watch = cli.watch || config.as_ref().is_some_and(|config| config.config.watch);
    let report = cli.report || config.as_ref().is_some_and(|config| config.config.report);
    if watch {
        watch_loop(
            &options,
            &output_path,
            report,
            config.as_ref().map(|item| item.path.clone()),
        )?;
        return Ok(());
    }
    let output = bundle(&options)?;
    write_output(&output, &output_path, &options.reporter)?;
    finish_report(&output, &options.reporter);
    if report {
        print!("{}", format_report(&output));
    }
    Ok(())
}

struct LoadedConfig {
    path: PathBuf,
    config: FileConfig,
}

fn load_cli_config(
    explicit: Option<&Path>,
) -> Result<Option<LoadedConfig>, webbundler::BundleError> {
    let path = if let Some(path) = explicit {
        path.to_path_buf()
    } else {
        let candidate = std::env::current_dir()
            .map_err(|err| {
                webbundler::BundleError::new(format!("failed to read working directory: {err}"))
            })?
            .join("webbundler.config.json");
        if !candidate.is_file() {
            return Ok(None);
        }
        candidate
    };
    let config = load_config(&path)?;
    Ok(Some(LoadedConfig { path, config }))
}

fn build_options(
    cli: &Cli,
    config: Option<&LoadedConfig>,
) -> Result<BundleOptions, webbundler::BundleError> {
    let file = config.map(|loaded| &loaded.config);
    let entries = if !cli.entries.is_empty() {
        cli.entries.clone()
    } else {
        file.map(|file| file.entries.clone()).unwrap_or_default()
    };
    if entries.is_empty() {
        return Err(webbundler::BundleError::new(
            "missing entry point. Pass a file or set \"entry\" in webbundler.config.json",
        ));
    }
    let mut options = BundleOptions::new(entries[0].clone()).entries(entries);
    options.minify = if cli.no_minify {
        false
    } else if cli.minify {
        true
    } else {
        file.and_then(|file| file.minify).unwrap_or(false)
    };
    options.prettify = if cli.no_prettify {
        false
    } else if cli.prettify {
        true
    } else {
        file.and_then(|file| file.prettify).unwrap_or(false)
    };
    options.optimize = if cli.no_optimize {
        false
    } else if cli.optimize {
        true
    } else {
        file.and_then(|file| file.optimize).unwrap_or(false)
    };
    options.strip_comments = if cli.no_strip_comments {
        false
    } else if cli.strip_comments {
        true
    } else {
        file.and_then(|file| file.strip_comments).unwrap_or(false)
    };
    options.filename_comments = if cli.no_filename_comments {
        false
    } else if cli.filename_comments {
        true
    } else {
        file.and_then(|file| file.filename_comments).unwrap_or(true)
    };
    options.sourcemap = if cli.no_sourcemap {
        false
    } else if cli.sourcemap {
        true
    } else {
        file.and_then(|file| file.sourcemap).unwrap_or(false)
    };
    let mut external = file.map(|file| file.external.clone()).unwrap_or_default();
    external.extend(cli.external.iter().cloned());
    options.external = external;
    let mut defines = file.map(|file| file.defines.clone()).unwrap_or_default();
    for define in &cli.define {
        let Some((key, value)) = define.split_once('=') else {
            return Err(webbundler::BundleError::new(format!(
                "expected KEY=VALUE in --define, found {define}"
            )));
        };
        defines.retain(|(existing, _)| existing != key);
        defines.push((key.to_string(), value.to_string()));
    }
    options.defines = defines;
    if let Some(target) = &cli.target {
        options.target = parse_target(target)?;
    } else if let Some(target) = file.and_then(|file| file.target) {
        options.target = target;
    }
    if let Some(format) = &cli.format {
        options.format = Some(parse_format(format)?);
    } else if let Some(format) = file.and_then(|file| file.format) {
        options.format = Some(format);
    }
    if let Some(pragma) = cli
        .jsx_pragma
        .clone()
        .or_else(|| file.and_then(|file| file.jsx_pragma.clone()))
    {
        options.jsx_pragma = pragma;
    }
    if let Some(fragment) = cli
        .jsx_fragment
        .clone()
        .or_else(|| file.and_then(|file| file.jsx_fragment.clone()))
    {
        options.jsx_fragment = fragment;
    }
    options.threads = if let Some(count) = cli.threads {
        if count == 0 {
            return Err(webbundler::BundleError::new(
                "thread count must be at least 1",
            ));
        }
        Some(count)
    } else {
        file.and_then(|file| file.threads)
    };
    if let Some(style) = cli
        .reporter
        .clone()
        .or_else(|| file.and_then(|file| file.reporter.clone()))
    {
        options.reporter = open_reporter(&style)?;
    }
    let css_name = output_path(cli, config, options.entries.len(), options.format);
    options.css_filename = css_filename(&css_name, options.entries.len());
    Ok(options)
}

fn output_path(
    cli: &Cli,
    config: Option<&LoadedConfig>,
    entry_count: usize,
    format: Option<Format>,
) -> PathBuf {
    let path = if let Some(output) = &cli.output {
        output.clone()
    } else if let Some(output) = config.and_then(|loaded| loaded.config.output.clone()) {
        output
    } else if entry_count > 1 {
        PathBuf::from("dist")
    } else if format == Some(Format::Wasm) {
        PathBuf::from("dist/bundle.wasm")
    } else {
        PathBuf::from("dist/bundle.js")
    };
    if format == Some(Format::Wasm) {
        with_wasm_extension(path)
    } else {
        path
    }
}

fn with_wasm_extension(mut path: PathBuf) -> PathBuf {
    if path.extension().is_some() {
        path.set_extension("wasm");
    }
    path
}

fn css_filename(output: &Path, entry_count: usize) -> String {
    if entry_count > 1 || output.extension().is_none() {
        return "bundle.css".to_string();
    }
    let stem = output
        .file_stem()
        .and_then(|stem| stem.to_str())
        .unwrap_or("bundle");
    format!("{stem}.css")
}

fn write_output(
    output: &BundleOutput,
    destination: &Path,
    reporter: &webbundler::ReporterHandle,
) -> Result<(), webbundler::BundleError> {
    if output.files.is_empty() {
        return write_binary_output(output, destination, reporter);
    }
    if output.files.len() == 1 && destination.extension().is_some() {
        let file = output
            .files
            .first()
            .ok_or_else(|| webbundler::BundleError::new("bundler produced no JavaScript"))?;
        write_js(destination, &file.code, file.map.as_deref())?;
        if let Some(parent) = destination.parent() {
            write_assets(parent, output, reporter)?;
        }
        wrote(
            reporter,
            destination,
            file.code.len(),
            format!(
                "Wrote bundle ({} modules, {} bytes) to {}",
                output.modules.len(),
                file.code.len(),
                destination.display()
            ),
        );
        return Ok(());
    }

    let directory = if destination.extension().is_some() {
        destination.parent().unwrap_or(Path::new(".")).to_path_buf()
    } else {
        destination.to_path_buf()
    };
    fs::create_dir_all(&directory).map_err(|err| {
        webbundler::BundleError::new(format!("failed to create {}: {err}", directory.display()))
    })?;
    for file in &output.files {
        write_js(&directory.join(&file.name), &file.code, file.map.as_deref())?;
        wrote(
            reporter,
            &directory.join(&file.name),
            file.code.len(),
            format!(
                "Wrote {} ({} bytes) to {}",
                file.name,
                file.code.len(),
                directory.join(&file.name).display()
            ),
        );
    }
    write_assets(&directory, output, reporter)?;
    Ok(())
}

fn write_binary_output(
    output: &BundleOutput,
    destination: &Path,
    reporter: &webbundler::ReporterHandle,
) -> Result<(), webbundler::BundleError> {
    if output.assets.is_empty() {
        return Err(webbundler::BundleError::new(
            "bundler produced no JavaScript",
        ));
    }
    if output.assets.len() == 1 && destination.extension().is_some() {
        let asset = &output.assets[0];
        let mut path = destination.to_path_buf();
        if let Some(extension) = Path::new(&asset.name).extension() {
            path.set_extension(extension);
        }
        if let Some(parent) = path.parent() {
            if !parent.as_os_str().is_empty() {
                fs::create_dir_all(parent).map_err(|err| {
                    webbundler::BundleError::new(format!(
                        "failed to create {}: {err}",
                        parent.display()
                    ))
                })?;
            }
        }
        fs::write(&path, &asset.contents).map_err(|err| {
            webbundler::BundleError::new(format!("failed to write {}: {err}", path.display()))
        })?;
        wrote(
            reporter,
            &path,
            asset.contents.len(),
            format!(
                "Wrote bundle ({} modules, {} bytes) to {}",
                output.modules.len(),
                asset.contents.len(),
                path.display()
            ),
        );
        return Ok(());
    }
    let directory = if destination.extension().is_some() {
        destination.parent().unwrap_or(Path::new(".")).to_path_buf()
    } else {
        destination.to_path_buf()
    };
    fs::create_dir_all(&directory).map_err(|err| {
        webbundler::BundleError::new(format!("failed to create {}: {err}", directory.display()))
    })?;
    write_assets(&directory, output, reporter)
}

fn write_js(path: &Path, code: &str, map: Option<&str>) -> Result<(), webbundler::BundleError> {
    if let Some(parent) = path.parent() {
        if !parent.as_os_str().is_empty() {
            fs::create_dir_all(parent).map_err(|err| {
                webbundler::BundleError::new(format!("failed to create {}: {err}", parent.display()))
            })?;
        }
    }
    let code = match map {
        Some(_) => retarget_source_map_comment(code, path),
        None => code.to_string(),
    };
    fs::write(path, &code).map_err(|err| {
        webbundler::BundleError::new(format!("failed to write {}: {err}", path.display()))
    })?;
    if let Some(map) = map {
        let map_path = PathBuf::from(format!("{}.map", path.display()));
        fs::write(&map_path, map).map_err(|err| {
            webbundler::BundleError::new(format!("failed to write {}: {err}", map_path.display()))
        })?;
    }
    Ok(())
}

/// The bundle is emitted as `bundle.js`, then written under the output path.
/// The trailing source map comment has to name that written file.
fn retarget_source_map_comment(code: &str, path: &Path) -> String {
    let Some(file_name) = path.file_name().and_then(|name| name.to_str()) else {
        return code.to_string();
    };
    let marker = "//# sourceMappingURL=";
    let Some(at) = code.rfind(marker) else {
        return code.to_string();
    };
    let tail = &code[at + marker.len()..];
    let line_end = tail.find('\n').unwrap_or(tail.len());
    if !tail[line_end..].trim().is_empty() {
        return code.to_string();
    }
    let mut out = String::with_capacity(code.len() + file_name.len());
    out.push_str(&code[..at]);
    out.push_str(marker);
    out.push_str(file_name);
    out.push_str(".map");
    if tail.contains('\n') {
        out.push('\n');
    }
    out
}

fn write_assets(
    directory: &Path,
    output: &BundleOutput,
    reporter: &webbundler::ReporterHandle,
) -> Result<(), webbundler::BundleError> {
    for asset in &output.assets {
        let path = directory.join(&asset.name);
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|err| {
                webbundler::BundleError::new(format!("failed to create {}: {err}", parent.display()))
            })?;
        }
        fs::write(&path, &asset.contents).map_err(|err| {
            webbundler::BundleError::new(format!("failed to write {}: {err}", path.display()))
        })?;
        wrote(
            reporter,
            &path,
            asset.contents.len(),
            format!("Wrote {} ({} bytes)", asset.name, asset.contents.len()),
        );
    }
    Ok(())
}

fn wrote(reporter: &webbundler::ReporterHandle, path: &Path, bytes: usize, fallback: String) {
    if reporter.is_active() {
        reporter.report(&Event::Write {
            path: path.display().to_string(),
            bytes,
        });
    } else {
        println!("{fallback}");
    }
}

fn finish_report(output: &BundleOutput, reporter: &webbundler::ReporterHandle) {
    if !reporter.is_active() {
        return;
    }
    let bytes = output
        .files
        .iter()
        .map(|file| file.code.len())
        .sum::<usize>()
        + output
            .assets
            .iter()
            .map(|asset| asset.contents.len())
            .sum::<usize>();
    reporter.report(&Event::Done {
        modules: output.modules.len(),
        files: output.files.len(),
        assets: output.assets.len(),
        bytes,
    });
}

fn format_report(output: &BundleOutput) -> String {
    let mut text = String::from("modules:\n");
    for item in &output.report {
        let state = if item.included { "included" } else { "omitted" };
        text.push_str(&format!(
            "  {state} {} ({})\n",
            item.path.display(),
            item.reason
        ));
    }
    text
}

fn watch_loop(
    options: &BundleOptions,
    destination: &Path,
    report: bool,
    config_path: Option<PathBuf>,
) -> Result<(), webbundler::BundleError> {
    eprintln!("Watching for changes. Press Ctrl+C to stop.");
    let mut inputs = options.entries.clone();
    if let Some(config_path) = config_path {
        inputs.push(config_path);
    }
    loop {
        match bundle(options) {
            Ok(output) => {
                if let Err(err) = write_output(&output, destination, &options.reporter) {
                    eprintln!("error: {err}");
                } else {
                    finish_report(&output, &options.reporter);
                    if report {
                        print!("{}", format_report(&output));
                    }
                }
                inputs = output.modules;
                inputs.extend(options.entries.iter().cloned());
            }
            Err(err) => eprintln!("error: {err}"),
        }
        let snapshot = mtimes(&inputs);
        loop {
            thread::sleep(Duration::from_millis(200));
            if mtimes(&inputs) != snapshot {
                break;
            }
        }
    }
}

fn mtimes(paths: &[PathBuf]) -> Vec<(PathBuf, Option<SystemTime>)> {
    paths
        .iter()
        .map(|path| {
            let modified = fs::metadata(path).and_then(|meta| meta.modified()).ok();
            (path.clone(), modified)
        })
        .collect()
}
