use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use webbundler::{bundle, load_config, BundleOptions, BundleOutput, Format};

static NEXT: AtomicU64 = AtomicU64::new(0);

struct Fixture {
    dir: PathBuf,
}

impl Fixture {
    fn new() -> Self {
        let n = NEXT.fetch_add(1, Ordering::Relaxed);
        let nanos = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let dir = std::env::temp_dir().join(format!("webbundler-threads-{nanos}-{n}"));
        fs::create_dir_all(&dir).unwrap();
        Self { dir }
    }

    fn file(&self, name: &str, contents: &str) -> &Self {
        let path = self.dir.join(name);
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).unwrap();
        }
        fs::write(path, contents).unwrap();
        self
    }
}

impl Drop for Fixture {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.dir);
    }
}

fn assert_same(left: &BundleOutput, right: &BundleOutput) {
    assert_eq!(left.code, right.code);
    assert_eq!(left.map, right.map);
    assert_eq!(left.files.len(), right.files.len());
    for (left, right) in left.files.iter().zip(&right.files) {
        assert_eq!(left.name, right.name);
        assert_eq!(left.code, right.code);
        assert_eq!(left.map, right.map);
    }
    assert_eq!(left.assets.len(), right.assets.len());
    for (left, right) in left.assets.iter().zip(&right.assets) {
        assert_eq!(left.name, right.name);
        assert_eq!(left.contents, right.contents);
    }
    assert_eq!(left.modules, right.modules);
    assert_eq!(left.report.len(), right.report.len());
    for (left, right) in left.report.iter().zip(&right.report) {
        assert_eq!(left.path, right.path);
        assert_eq!(left.included, right.included);
        assert_eq!(left.reason, right.reason);
    }
}

fn wide_graph(fixture: &Fixture) {
    fixture
        .file(
            "index.js",
            "import { a } from \"./a.js\";\nimport { b } from \"./b.js\";\nimport data from \"./data.json\";\nimport \"./app.css\";\nimport logo from \"./logo.svg\";\nconsole.log(a() + b() + data.n + logo.endsWith(\".svg\"));\n",
        )
        .file(
            "a.js",
            "import { shared } from \"./shared.js\";\nimport { left } from \"./left.js\";\nexport function a() { return shared() + left(); }\n",
        )
        .file(
            "b.js",
            "import { shared } from \"./shared.js\";\nimport { right } from \"./right.js\";\nexport function b() { return shared() + right(); }\n",
        )
        .file("shared.js", "export function shared() { return \"S\"; }\n")
        .file("left.js", "export function left() { return 1 + 2; }\n")
        .file("right.js", "export function right() { return \"R\"; }\n")
        .file("data.json", "{\"n\":7}\n")
        .file("app.css", "body { margin: 0px; color: #ffffff; }\n")
        .file("logo.svg", "<svg xmlns=\"http://www.w3.org/2000/svg\"/>\n")
        .file("chain.js", "import \"./chain2.js\";\nexport const chain = 1;\n")
        .file("chain2.js", "import \"./chain3.js\";\nexport const chain = 2;\n")
        .file("chain3.js", "export const chain = 3;\n");
    let index = fs::read_to_string(fixture.dir.join("index.js")).unwrap();
    fs::write(
        fixture.dir.join("index.js"),
        format!("import {{ chain }} from \"./chain.js\";\n{index}console.log(chain);\n"),
    )
    .unwrap();
}

#[test]
fn threaded_bundle_matches_one_thread() {
    let fixture = Fixture::new();
    wide_graph(&fixture);
    let options = BundleOptions::new(fixture.dir.join("index.js"));
    let serial = bundle(&options).unwrap();
    for count in [1_usize, 2, 4] {
        for _ in 0..4 {
            let threaded = bundle(&options.clone().threads(count)).unwrap();
            assert_same(&serial, &threaded);
        }
    }
    let heavy = options
        .clone()
        .optimize(true)
        .minify(true)
        .prettify(true)
        .sourcemap(true);
    let serial_heavy = bundle(&heavy).unwrap();
    let threaded_heavy = bundle(&heavy.threads(4)).unwrap();
    assert_same(&serial_heavy, &threaded_heavy);
    assert!(serial_heavy.code.contains("3"), "{}", serial_heavy.code);

    let bundle_path = fixture.dir.join("bundle.js");
    fs::write(&bundle_path, &serial.code).unwrap();
    let ran = Command::new("node").arg(&bundle_path).output().unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    assert_eq!(String::from_utf8(ran.stdout).unwrap(), "S3SR7true\n1\n");
}

#[test]
fn threaded_entries_match_one_thread() {
    let fixture = Fixture::new();
    fixture
        .file("shared.js", "export function shared() { return \"S\"; }\n")
        .file(
            "a.js",
            "import { shared } from \"./shared.js\";\nconsole.log(\"A\" + shared());\n",
        )
        .file(
            "b.js",
            "import { shared } from \"./shared.js\";\nconsole.log(\"B\" + shared());\n",
        )
        .file("app.css", "h1 { padding: 0px; }\n");
    let options = BundleOptions::new(fixture.dir.join("a.js"))
        .entries([fixture.dir.join("a.js"), fixture.dir.join("b.js")])
        .format(Format::Esm)
        .minify(true);
    let serial = bundle(&options).unwrap();
    let threaded = bundle(&options.threads(3)).unwrap();
    assert_same(&serial, &threaded);
    assert!(serial.files.len() > 1, "{}", serial.files.len());
}

#[test]
fn threaded_cycle_matches_one_thread() {
    let fixture = Fixture::new();
    fixture
        .file(
            "a.js",
            "import { b } from \"./b.js\";\nexport function a() { return \"a\" + b(); }\nconsole.log(a());\n",
        )
        .file(
            "b.js",
            "import { a } from \"./a.js\";\nexport function b() { return \"b\"; }\n",
        );
    let options = BundleOptions::new(fixture.dir.join("a.js"));
    let serial = bundle(&options).unwrap();
    let threaded = bundle(&options.threads(2)).unwrap();
    assert_same(&serial, &threaded);
}

#[test]
fn threaded_failure_matches_one_thread() {
    let fixture = Fixture::new();
    fixture
        .file(
            "index.js",
            "import \"./bad.js\";\nimport \"./missing.js\";\n",
        )
        .file("bad.js", "function (\n")
        .file("later.js", "function (\n");
    let options = BundleOptions::new(fixture.dir.join("index.js"));
    let serial = bundle(&options).unwrap_err();
    let threaded = bundle(&options.threads(4)).unwrap_err();
    assert_eq!(serial.to_string(), threaded.to_string());
    assert!(serial.to_string().contains("bad.js"), "{}", serial);
    assert!(!serial.to_string().contains("missing.js"), "{}", serial);
}

#[test]
fn zero_threads_is_rejected() {
    let fixture = Fixture::new();
    fixture.file("index.js", "console.log(1);\n");
    let error = bundle(&BundleOptions::new(fixture.dir.join("index.js")).threads(0)).unwrap_err();
    assert_eq!(error.to_string(), "thread count must be at least 1");
}

#[test]
fn config_threads_and_cli_flag() {
    let fixture = Fixture::new();
    wide_graph(&fixture);
    fixture.file(
        "webbundler.config.json",
        "{\"entry\":\"index.js\",\"output\":\"dist/bundle.js\"}\n",
    );
    let counted = Fixture::new();
    counted.file(
        "webbundler.config.json",
        "{\"entry\":\"index.js\",\"threads\":2}\n",
    );
    let config = load_config(&counted.dir.join("webbundler.config.json")).unwrap();
    assert_eq!(config.threads, Some(2));

    let broken = Fixture::new();
    broken.file("webbundler.config.json", "{\"threads\":0}\n");
    let error = load_config(&broken.dir.join("webbundler.config.json")).unwrap_err();
    assert_eq!(error.to_string(), "thread count must be at least 1");

    let text = Fixture::new();
    text.file("webbundler.config.json", "{\"threads\":\"4\"}\n");
    let error = load_config(&text.dir.join("webbundler.config.json")).unwrap_err();
    assert_eq!(
        error.to_string(),
        "\"threads\" must be an integer of at least 1"
    );

    let plain = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&fixture.dir)
        .arg("-o")
        .arg("dist/bundle.js")
        .output()
        .unwrap();
    assert!(
        plain.status.success(),
        "{}",
        String::from_utf8_lossy(&plain.stderr)
    );
    let plain_code = fs::read_to_string(fixture.dir.join("dist/bundle.js")).unwrap();
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&fixture.dir)
        .arg("--threads")
        .arg("2")
        .arg("-o")
        .arg("dist/bundle.js")
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    let threaded_code = fs::read_to_string(fixture.dir.join("dist/bundle.js")).unwrap();
    assert_eq!(plain_code, threaded_code);

    let rejected = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&fixture.dir)
        .arg("--threads")
        .arg("0")
        .output()
        .unwrap();
    assert!(!rejected.status.success());
    let stderr = String::from_utf8_lossy(&rejected.stderr);
    assert!(
        stderr.contains("thread count must be at least 1"),
        "{stderr}"
    );
}
