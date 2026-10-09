use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

use webbundler::load_config;

#[test]
fn reporter_log_prints_each_module_before_the_build_ends() {
    let dir = temp_dir();
    fs::write(dir.join("util.js"), "export const value = 1;\n").unwrap();
    fs::write(
        dir.join("index.js"),
        "import { value } from \"./util.js\";\nconsole.log(value);\n",
    )
    .unwrap();
    let output = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&dir)
        .arg("index.js")
        .arg("--reporter")
        .arg("log")
        .arg("-o")
        .arg("dist/bundle.js")
        .output()
        .unwrap();
    let stdout = String::from_utf8(output.stdout).unwrap();
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(stdout.contains("index.js"), "{stdout}");
    assert!(stdout.contains("util.js"), "{stdout}");
    assert!(stdout.contains("bundling"), "{stdout}");
    assert!(stdout.contains("link"), "{stdout}");
    assert!(stdout.contains("done"), "{stdout}");
    assert!(!stdout.contains("optimizing"), "{stdout}");
    assert!(!stdout.contains("minifying"), "{stdout}");
    assert!(dir.join("dist/bundle.js").is_file());
}

#[test]
fn reporter_marks_optimizing_bundling_and_minifying_in_order() {
    let dir = temp_dir();
    fs::write(dir.join("index.js"), "console.log(1 + 2);\n").unwrap();
    fs::write(dir.join("app.css"), "body { margin: 0px; }\n").unwrap();
    fs::write(
        dir.join("main.js"),
        "import \"./index.js\";\nimport \"./app.css\";\n",
    )
    .unwrap();
    let output = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&dir)
        .arg("main.js")
        .arg("--reporter")
        .arg("log")
        .arg("--optimize")
        .arg("--minify")
        .arg("-o")
        .arg("dist/bundle.js")
        .output()
        .unwrap();
    let stdout = String::from_utf8(output.stdout).unwrap();
    assert!(
        output.status.success(),
        "{}\n{stdout}",
        String::from_utf8_lossy(&output.stderr)
    );
    let optimizing = stdout.find("optimizing").expect(&stdout);
    let bundling = stdout.find("bundling").expect(&stdout);
    let minifying = stdout.find("minifying").expect(&stdout);
    assert!(optimizing < bundling, "{stdout}");
    assert!(bundling < minifying, "{stdout}");
}

#[test]
fn every_reporter_style_finishes() {
    let dir = temp_dir();
    fs::write(dir.join("index.js"), "console.log(1);\n").unwrap();
    for style in ["log", "bar", "tree", "json"] {
        let output = Command::new(env!("CARGO_BIN_EXE_webbundler"))
            .current_dir(&dir)
            .arg("index.js")
            .arg("--reporter")
            .arg(style)
            .arg("-o")
            .arg(format!("dist/{style}.js"))
            .output()
            .unwrap();
        assert!(
            output.status.success(),
            "{style}: {}",
            String::from_utf8_lossy(&output.stderr)
        );
        let stdout = String::from_utf8(output.stdout).unwrap();
        assert!(stdout.contains("index.js"), "{style}: {stdout}");
    }
}

#[test]
fn unknown_reporter_is_rejected() {
    let dir = temp_dir();
    fs::write(dir.join("index.js"), "console.log(1);\n").unwrap();
    let output = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&dir)
        .arg("index.js")
        .arg("--reporter")
        .arg("dots")
        .output()
        .unwrap();
    assert!(!output.status.success());
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(stderr.contains("log, bar, tree, or json"), "{stderr}");
}

#[test]
fn config_selects_a_reporter() {
    let dir = temp_dir();
    fs::write(
        dir.join("webbundler.config.json"),
        "{\"entry\":\"index.js\",\"reporter\":\"tree\"}\n",
    )
    .unwrap();
    fs::write(dir.join("index.js"), "console.log(1);\n").unwrap();
    let config = load_config(&dir.join("webbundler.config.json")).unwrap();
    assert_eq!(config.reporter.as_deref(), Some("tree"));
    let output = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&dir)
        .arg("-o")
        .arg("dist/bundle.js")
        .output()
        .unwrap();
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    let stdout = String::from_utf8(output.stdout).unwrap();
    assert!(stdout.contains("index.js"), "{stdout}");
}

fn temp_dir() -> PathBuf {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    let dir = std::env::temp_dir().join(format!("webbundler-reporter-{nanos}"));
    fs::create_dir_all(&dir).unwrap();
    dir
}
