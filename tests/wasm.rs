use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use webbundler::{bundle, BundleOptions, Format};

static NEXT: AtomicU64 = AtomicU64::new(0);

fn scratch() -> PathBuf {
    let n = NEXT.fetch_add(1, Ordering::Relaxed);
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    let dir = std::env::temp_dir().join(format!("webbundler-wasm-{nanos}-{n}"));
    fs::create_dir_all(&dir).unwrap();
    dir
}

fn bundle_wasm(dir: &std::path::Path, source: &str, optimize: bool) -> webbundler::BundleOutput {
    fs::write(dir.join("index.js"), source).unwrap();
    bundle(
        &BundleOptions::new(dir.join("index.js"))
            .format(Format::Wasm)
            .optimize(optimize),
    )
    .unwrap_or_else(|err| panic!("{err}"))
}

fn wasm_bytes(output: &webbundler::BundleOutput) -> &[u8] {
    let asset = output
        .assets
        .iter()
        .find(|asset| asset.name.ends_with(".wasm"))
        .expect("wasm asset");
    assert_eq!(asset.name, "bundle.wasm");
    assert!(output.files.is_empty());
    assert!(output.code.is_empty());
    assert_eq!(&asset.contents[..8], b"\0asm\x01\0\0\0");
    &asset.contents
}

fn run_wasm(bytes: &[u8], imports_log: bool) -> String {
    let dir = scratch();
    let wasm_path = dir.join("bundle.wasm");
    fs::write(&wasm_path, bytes).unwrap();
    let script = if imports_log {
        r#"
const fs = require("fs");
const bytes = fs.readFileSync(process.argv[2]);
const mod = new WebAssembly.Module(bytes);
const wanted = new Set(WebAssembly.Module.imports(mod).map((item) => item.name));
let linked = null;
for (let pages = 1; pages <= 64; pages++) {
  const env = {};
  if (wanted.has("log")) env.log = (value) => console.log(value);
  if (wanted.has("memory")) env.memory = new WebAssembly.Memory({ initial: pages });
  if (wanted.has("run")) {
    env.run = (ptr, len) => {
      const src = new TextDecoder().decode(new Uint8Array(env.memory.buffer, ptr, len));
      const module = { exports: {} };
      try {
        new Function("require", "module", "exports", src)(require, module, module.exports);
      } catch (error) {
        console.error(src);
        throw error;
      }
    };
  }
  try {
    linked = new WebAssembly.Instance(mod, { env });
    break;
  } catch (error) {
    if (!(error instanceof WebAssembly.LinkError) || pages === 64) throw error;
  }
}
if (!wanted.has("log") && !wanted.has("run") && linked.exports.add) {
  console.log(linked.exports.add(40, 2));
}
"#
    } else {
        r#"
const fs = require("fs");
const bytes = fs.readFileSync(process.argv[2]);
const instance = new WebAssembly.Instance(new WebAssembly.Module(bytes), {});
console.log(instance.exports.add(40, 2));
"#
    };
    fs::write(dir.join("run.js"), script).unwrap();
    let ran = Command::new("node")
        .arg(dir.join("run.js"))
        .arg(&wasm_path)
        .current_dir(&dir)
        .output()
        .expect("node");
    let stdout = String::from_utf8(ran.stdout).unwrap();
    let stderr = String::from_utf8(ran.stderr).unwrap();
    assert!(
        ran.status.success(),
        "node failed\nstdout:\n{stdout}\nstderr:\n{stderr}"
    );
    let _ = fs::remove_dir_all(&dir);
    stdout
}

const INTEGER: &str = "\
export function add(a, b) { return a + b; }
export function sum(n) {
  var total = 0;
  var i = 0;
  while (i < n) {
    total = total + i;
    i = i + 1;
  }
  return total;
}
export function skipped(n) {
  var total = 0;
  for (var i = 0; i < n; i = i + 1) {
    if (i == 1) continue;
    total = total + i;
  }
  return total;
}
export function stopped(n) {
  var i = 0;
  while (i < n) {
    if (i == 2) break;
    i = i + 1;
  }
  return i;
}
export function ushr(a) { return a >>> 1; }
export function ashr(a) { return a >> 1; }
console.log(add(40, 2));
console.log(add(0, -2));
console.log(sum(5));
console.log(skipped(4));
console.log(stopped(9));
console.log(ushr(-8));
console.log(ashr(-8));
";

#[test]
fn wasm_export_runs_integer_functions() {
    let dir = scratch();
    let output = bundle_wasm(&dir, INTEGER, false);
    let stdout = run_wasm(wasm_bytes(&output), true);
    assert_eq!(stdout, "42\n-2\n10\n5\n2\n2147483644\n-4\n");
    let _ = fs::remove_dir_all(&dir);
}

#[test]
fn wasm_export_calls_an_exported_function() {
    let dir = scratch();
    let output = bundle_wasm(&dir, "export function add(a, b) { return a + b; }\n", false);
    assert_eq!(run_wasm(wasm_bytes(&output), false), "42\n");
    let _ = fs::remove_dir_all(&dir);
}

#[test]
fn wasm_export_keeps_optimized_constants() {
    let dir = scratch();
    let output = bundle_wasm(
        &dir,
        "export function value() { return 1 + 2 * 3; }\nconsole.log(value());\n",
        true,
    );
    assert_eq!(run_wasm(wasm_bytes(&output), true), "7\n");
    let _ = fs::remove_dir_all(&dir);
}

#[test]
fn wasm_export_runs_ordinary_javascript() {
    let dir = scratch();
    let source = "\
export function abs(n) { return Math.abs(n); }
const effects = [];
function mark(name) {
  effects.push(name);
  return name;
}
console.log(\"is number?\", Number.isNaN(1));
console.log(abs(-8));
mark(\"index\");
console.log(effects.join(\"+\"));
";
    let output = bundle_wasm(&dir, source, false);
    assert_eq!(
        run_wasm(wasm_bytes(&output), true),
        "is number? false\n8\nindex\n"
    );
    let _ = fs::remove_dir_all(&dir);
}

#[test]
fn wasm_export_rejects_minification() {
    let dir = scratch();
    fs::write(dir.join("index.js"), "const box = {};\nconsole.log(1);\n").unwrap();
    let output = bundle(&BundleOptions::new(dir.join("index.js")).format(Format::Wasm)).unwrap();
    assert_eq!(run_wasm(wasm_bytes(&output), true), "1\n");
    fs::write(
        dir.join("index.js"),
        "import fs from \"fs\";\nconsole.log(1);\n",
    )
    .unwrap();
    let output = bundle(&BundleOptions::new(dir.join("index.js")).format(Format::Wasm)).unwrap();
    assert_eq!(run_wasm(wasm_bytes(&output), true), "1\n");
    fs::write(dir.join("index.js"), "console.log(1);\n").unwrap();
    let error = bundle(
        &BundleOptions::new(dir.join("index.js"))
            .format(Format::Wasm)
            .minify(true),
    )
    .unwrap_err()
    .to_string();
    assert_eq!(
        error,
        "wasm output cannot be minified; the WebAssembly module has a fixed shape"
    );
    let _ = fs::remove_dir_all(&dir);
}

#[test]
fn wasm_output_file_uses_the_wasm_extension() {
    let dir = scratch();
    fs::write(
        dir.join("index.js"),
        "export function add(a, b) { return a + b; }\nconsole.log(add(40, 2));\n",
    )
    .unwrap();
    let requested = dir.join("dist").join("app.js");
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&dir)
        .arg(dir.join("index.js"))
        .arg("--format")
        .arg("wasm")
        .arg("--output")
        .arg(&requested)
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "stdout:\n{}\nstderr:\n{}",
        String::from_utf8_lossy(&ran.stdout),
        String::from_utf8_lossy(&ran.stderr)
    );
    let wasm_path = dir.join("dist").join("app.wasm");
    let bytes = fs::read(&wasm_path).expect("dist/app.wasm");
    assert_eq!(&bytes[..4], b"\0asm");
    assert!(!requested.exists(), "wasm output kept the .js extension");
    assert_eq!(run_wasm(&bytes, true), "42\n");

    let out_dir = dir.join("nested");
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&dir)
        .arg(dir.join("index.js"))
        .arg("--format")
        .arg("wasm")
        .arg("--output")
        .arg(&out_dir)
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    assert!(out_dir.join("bundle.wasm").is_file());

    let plain = scratch();
    fs::write(
        plain.join("index.js"),
        "export function add(a, b) { return a + b; }\nconsole.log(add(1, 2));\n",
    )
    .unwrap();
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&plain)
        .arg("index.js")
        .arg("--format")
        .arg("wasm")
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    assert!(plain.join("dist").join("bundle.wasm").is_file());
    assert!(!plain.join("dist").join("bundle.js").exists());
    let _ = fs::remove_dir_all(&plain);

    fs::write(
        dir.join("webbundler.config.json"),
        "{\"entry\":\"index.js\",\"format\":\"wasm\",\"output\":\"dist/bundle.js\"}\n",
    )
    .unwrap();
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&dir)
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    assert!(dir.join("dist").join("bundle.wasm").is_file());
    assert!(!dir.join("dist").join("bundle.js").exists());
    let _ = fs::remove_dir_all(&dir);
}
