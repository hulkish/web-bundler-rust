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
    let dir = std::env::temp_dir().join(format!("webbundler-asm-{nanos}-{n}"));
    fs::create_dir_all(&dir).unwrap();
    dir
}

fn compile(source: &str) -> Result<String, String> {
    let dir = scratch();
    fs::write(dir.join("index.js"), source).unwrap();
    let result = bundle(&BundleOptions::new(dir.join("index.js")).format(Format::Asm));
    let _ = fs::remove_dir_all(&dir);
    result
        .map(|output| output.code)
        .map_err(|err| err.to_string())
}

fn run(source: &str) -> String {
    let dir = scratch();
    fs::write(dir.join("index.js"), source).unwrap();
    let output = bundle(&BundleOptions::new(dir.join("index.js")).format(Format::Asm)).unwrap();
    let bundle_path = dir.join("bundle.mjs");
    fs::write(&bundle_path, &output.code).unwrap();
    let ran = Command::new("node")
        .arg(&bundle_path)
        .current_dir(&dir)
        .output()
        .expect("node");
    let stdout = String::from_utf8(ran.stdout).unwrap();
    let stderr = String::from_utf8(ran.stderr).unwrap();
    assert!(
        ran.status.success(),
        "node failed\nstdout:\n{stdout}\nstderr:\n{stderr}\nbundle:\n{}",
        output.code
    );
    let _ = fs::remove_dir_all(&dir);
    stdout
}

#[test]
fn asm_export_runs_integer_functions() {
    let code =
        compile("export function add(a, b) { return a + b; }\nconsole.log(add(40, 2));\n").unwrap();
    assert!(code.contains("\"use asm\";"), "{code}");
    assert!(code.contains("| 0"), "{code}");
    assert!(!code.contains("__jsb_require"), "{code}");
    assert!(code.contains("export default"), "{code}");
    assert_eq!(
        run("export function add(a, b) { return a + b; }\nconsole.log(add(40, 2));\n"),
        "42\n"
    );
    assert_eq!(
        run(
            "export function sum(n) {\n  var total = 0;\n  var i = 0;\n  while (i < n) {\n    total = total + i;\n    i = i + 1;\n  }\n  return total;\n}\nconsole.log(sum(5));\n"
        ),
        "10\n"
    );
}

#[test]
fn asm_export_keeps_optimized_constants() {
    let dir = scratch();
    fs::write(
        dir.join("index.js"),
        "export function value() { return 1 + 2 * 3; }\nconsole.log(value());\n",
    )
    .unwrap();
    let output = bundle(
        &BundleOptions::new(dir.join("index.js"))
            .format(Format::Asm)
            .optimize(true),
    )
    .unwrap();
    assert!(output.code.contains("return 7;"), "{}", output.code);
    fs::write(dir.join("bundle.mjs"), &output.code).unwrap();
    let ran = Command::new("node")
        .arg(dir.join("bundle.mjs"))
        .current_dir(&dir)
        .output()
        .unwrap();
    assert_eq!(String::from_utf8(ran.stdout).unwrap(), "7\n");
    let _ = fs::remove_dir_all(&dir);
}

#[test]
fn asm_prettify_indents_and_still_runs() {
    let dir = scratch();
    let source = "export function add(a, b) { return a + b; }\nconsole.log(add(40, 2));\n";
    fs::write(dir.join("index.js"), source).unwrap();
    let output = bundle(
        &BundleOptions::new(dir.join("index.js"))
            .format(Format::Asm)
            .prettify(true),
    );
    let output = match output {
        Ok(output) => output,
        Err(err) => panic!("{err}"),
    };
    eprintln!("PRETTY ASM:\n{}", output.code);
    assert!(output.code.contains("\"use asm\""), "{}", output.code);
    assert!(output.code.contains("\n  "), "{}", output.code);
    fs::write(dir.join("bundle.mjs"), &output.code).unwrap();
    let ran = Command::new("node")
        .arg(dir.join("bundle.mjs"))
        .current_dir(&dir)
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "stdout:\n{}\nstderr:\n{}\n{}",
        String::from_utf8_lossy(&ran.stdout),
        String::from_utf8_lossy(&ran.stderr),
        output.code
    );
    assert_eq!(String::from_utf8(ran.stdout).unwrap(), "42\n");
    let _ = fs::remove_dir_all(&dir);
}

#[test]
fn asm_export_rejects_unsupported_code_and_minification() {
    let objects = compile("const box = {};\nconsole.log(1);\n").unwrap_err();
    assert!(objects.contains("asm export"), "{objects}");
    let imports = compile("import fs from \"fs\";\nconsole.log(1);\n").unwrap_err();
    assert!(imports.contains("import"), "{imports}");
    let dir = scratch();
    fs::write(dir.join("index.js"), "console.log(1);\n").unwrap();
    let error = bundle(
        &BundleOptions::new(dir.join("index.js"))
            .format(Format::Asm)
            .minify(true),
    )
    .unwrap_err();
    assert!(error.to_string().contains("cannot be minified"), "{error}");
    let _ = fs::remove_dir_all(&dir);
}
