use std::fs;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::thread;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

use webbundler::{bundle, BundleError, BundleOptions, Format, Target};

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
        let dir = std::env::temp_dir().join(format!("webbundler-{nanos}-{n}"));
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

    fn bundle(&self, entry: &str, minify: bool) -> Result<String, BundleError> {
        let output = bundle(&BundleOptions::new(self.dir.join(entry)).minify(minify))?;
        let bundle_path = self
            .dir
            .join(if minify { "bundle.min.js" } else { "bundle.js" });
        fs::write(&bundle_path, &output.code).unwrap();
        Ok(output.code)
    }

    fn run(&self, entry: &str, minify: bool) -> String {
        let code = self.bundle(entry, minify).unwrap();
        let bundle_path = self
            .dir
            .join(if minify { "bundle.min.js" } else { "bundle.js" });
        if !bundle_path.exists() {
            fs::write(&bundle_path, code).unwrap();
        }
        let output = Command::new("node")
            .arg(&bundle_path)
            .current_dir(&self.dir)
            .output()
            .expect("node is required to execute bundled fixtures");
        assert!(
            output.status.success(),
            "node failed\nstdout:\n{}\nstderr:\n{}\nbundle:\n{}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr),
            fs::read_to_string(&bundle_path).unwrap_or_default()
        );
        String::from_utf8(output.stdout).unwrap()
    }
}

impl Drop for Fixture {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.dir);
    }
}

fn stdout(dir: &Fixture, entry: &str) -> String {
    dir.run(entry, false)
}

#[test]
fn bundles_esm_named_default_and_namespace_imports() {
    let fixture = Fixture::new();
    fixture
        .file(
            "math.js",
            r#"
            export function add(a, b) { return a + b; }
            export const label = "math";
            export default function mul(a, b) { return a * b; }
            "#,
        )
        .file(
            "index.js",
            r#"
            import mul, { add, label } from "./math.js";
            import * as math from "./math.js";
            console.log([add(2, 3), mul(2, 4), label, math.add(1, 1)].join(","));
            "#,
        );
    assert_eq!(stdout(&fixture, "index.js"), "5,8,math,2\n");
}

#[test]
fn rewrites_shorthand_properties_and_destructured_exports() {
    let fixture = Fixture::new();
    fixture
        .file(
            "point.js",
            r#"
            export const { x, y: z } = { x: 4, y: 5 };
            export function read(value) { return value; }
            "#,
        )
        .file(
            "index.js",
            r#"
            import { x, z, read } from "./point.js";
            const box = { read };
            console.log([x, z, box.read(9)].join(","));
            "#,
        );
    assert_eq!(stdout(&fixture, "index.js"), "4,5,9\n");
}

#[test]
fn leaves_imported_names_intact_inside_template_strings() {
    let fixture = Fixture::new();
    fixture.file("size.js", "export const MIN = 44;\n").file(
        "index.js",
        r#"
            import { MIN } from "./size.js";
            const style = { minHeight: `${MIN}px` };
            const box = { MIN };
            const nested = `${{ MIN }}`;
            console.log(style.minHeight + "," + box.MIN + "," + nested);
            "#,
    );
    assert_eq!(stdout(&fixture, "index.js"), "44px,44,[object Object]\n");
}

#[test]
fn rewrites_shorthand_after_a_character_class_regex() {
    let fixture = Fixture::new();
    fixture.file("mod.js", "export const diff = 7;\n").file(
        "index.js",
        r#"
            import { diff } from "./mod.js";
            function parsePath(path) {
              return path.replace(/([^\\])\[/g, "$1.[").match(/(\\.|[^.]+?)+/g);
            }
            const utils = { diff };
            console.log(String(parsePath("a.b")) + utils.diff);
            "#,
    );
    assert_eq!(stdout(&fixture, "index.js"), "a,b7\n");
}

#[test]
fn keeps_the_factory_close_outside_a_trailing_line_comment() {
    let fixture = Fixture::new();
    fixture
        .file(
            "dep.js",
            "export const n = 4;\n//# sourceMappingURL=dep.js.map",
        )
        .file(
            "index.js",
            "import { n } from \"./dep.js\";\nconsole.log(n);\n",
        );
    assert_eq!(stdout(&fixture, "index.js"), "4\n");
}

#[test]
fn bundles_reexports_star_exports_cjs_and_json() {
    let fixture = Fixture::new();
    fixture
        .file(
            "math.js",
            "export function add(a, b) { return a + b; }\nexport const base = 1;\n",
        )
        .file(
            "bridge.js",
            "export { add as plus } from \"./math.js\";\nexport * from \"./math.js\";\n",
        )
        .file("data.json", "{\"name\":\"widget\",\"n\":3}\n")
        .file("legacy.cjs", "module.exports = { bonus: 4 };\n")
        .file(
            "index.js",
            r#"
            import data from "./data.json";
            import legacy from "./legacy.cjs";
            import { plus, base } from "./bridge.js";
            console.log([data.name, plus(base, data.n), legacy.bonus].join(","));
            "#,
        );
    assert_eq!(stdout(&fixture, "index.js"), "widget,4,4\n");
}

#[test]
fn keeps_live_bindings_across_cycles() {
    let fixture = Fixture::new();
    fixture
        .file(
            "a.js",
            r#"
            import { fromB } from "./b.js";
            export function fromA(n) { return n > 0 ? fromB(n - 1) : "a"; }
            "#,
        )
        .file(
            "b.js",
            r#"
            import { fromA } from "./a.js";
            export function fromB(n) { return n > 0 ? fromA(n - 1) : "b"; }
            "#,
        )
        .file(
            "index.js",
            "import { fromA } from \"./a.js\";\nconsole.log(fromA(4));\n",
        );
    assert_eq!(stdout(&fixture, "index.js"), "a\n");
}

#[test]
fn bundles_dynamic_import_and_import_meta() {
    let fixture = Fixture::new();
    fixture
        .file("math.js", "export function add(a, b) { return a + b; }\n")
        .file(
            "index.js",
            r#"
            const file = import.meta.url;
            import("./math.js").then((math) => {
              console.log(math.add(1, 2) + ":" + file.includes("index.js"));
            });
            "#,
        );
    assert_eq!(stdout(&fixture, "index.js"), "3:true\n");
}

#[test]
fn leaves_node_builtins_external_and_bundles_packages() {
    let fixture = Fixture::new();
    fixture
        .file(
            "node_modules/left-pad/package.json",
            "{\"main\":\"index.js\"}\n",
        )
        .file(
            "node_modules/left-pad/index.js",
            "module.exports = function pad(value) { return \"pad:\" + value; };\n",
        )
        .file(
            "index.js",
            r#"
            import fs from "fs";
            import pad from "left-pad";
            console.log(typeof fs.readFileSync + ":" + pad("ok"));
            "#,
        );
    assert_eq!(stdout(&fixture, "index.js"), "function:pad:ok\n");
}

#[test]
fn resolves_package_exports_import_condition() {
    let fixture = Fixture::new();
    fixture
        .file(
            "node_modules/widgets/package.json",
            "{\"exports\":{\".\":{\"import\":\"./esm.js\",\"require\":\"./cjs.js\"}}}\n",
        )
        .file(
            "node_modules/widgets/esm.js",
            "export const kind = \"esm\";\n",
        )
        .file(
            "node_modules/widgets/cjs.js",
            "module.exports = { kind: \"cjs\" };\n",
        )
        .file(
            "index.js",
            "import { kind } from \"widgets\";\nconsole.log(kind);\n",
        );
    assert_eq!(stdout(&fixture, "index.js"), "esm\n");
}

#[test]
fn resolves_package_export_wildcards() {
    let fixture = Fixture::new();
    fixture
        .file(
            "node_modules/widgets/package.json",
            "{\"exports\":{\"./addons/*\":\"./examples/*\"}}\n",
        )
        .file(
            "node_modules/widgets/examples/controls/orbit.js",
            "export const label = \"orbit\";\n",
        )
        .file(
            "index.js",
            "import { label } from \"widgets/addons/controls/orbit.js\";\nconsole.log(label);\n",
        );
    assert_eq!(stdout(&fixture, "index.js"), "orbit\n");
}

#[test]
fn reports_missing_modules() {
    let fixture = Fixture::new();
    fixture.file("index.js", "import missing from \"./missing.js\";\n");
    let error = fixture.bundle("index.js", false).unwrap_err();
    assert!(
        error.to_string().contains("cannot resolve './missing.js'"),
        "{error}"
    );
}

#[test]
fn minified_bundle_runs_and_is_smaller() {
    let fixture = Fixture::new();
    fixture
        .file(
            "math.js",
            "export function add(left, right) { return left + right; }\n",
        )
        .file(
            "index.js",
            "import { add } from \"./math.js\";\nfunction unusedMarker() { return \"unused-marker-98765\"; }\ndebugger;\nconsole.log(add(20, 22));\n",
        );
    let plain = fixture.bundle("index.js", false).unwrap();
    let minified = fixture.bundle("index.js", true).unwrap();
    assert!(
        minified.len() < plain.len(),
        "minified {} vs plain {}",
        minified.len(),
        plain.len()
    );
    assert!(!minified.contains("unused-marker-98765"), "{minified}");
    assert!(!minified.contains("debugger"), "{minified}");
    assert_eq!(fixture.run("index.js", true), "42\n");
}

#[test]
fn example_app_prints_combined_total() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("examples/app/index.js");
    let output = bundle(&BundleOptions::new(&root)).unwrap();
    let bundle_path =
        std::env::temp_dir().join(format!("webbundler-example-{}", std::process::id()));
    fs::write(&bundle_path, output.code).unwrap();
    let ran = Command::new("node").arg(&bundle_path).output().unwrap();
    let _ = fs::remove_file(&bundle_path);
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    assert_eq!(
        String::from_utf8(ran.stdout).unwrap(),
        "Hello Ada, the answer is 20\n"
    );
}

fn node_source(dir: &std::path::Path, name: &str, source: &str) -> String {
    let path = dir.join(name);
    fs::write(&path, source).unwrap();
    let output = Command::new("node")
        .arg(&path)
        .current_dir(dir)
        .output()
        .expect("node is required to execute bundled fixtures");
    assert!(
        output.status.success(),
        "node failed\nstdout:\n{}\nstderr:\n{}\nsource:\n{source}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    String::from_utf8(output.stdout).unwrap()
}

#[test]
fn strips_typescript_and_lowers_enums() {
    let fixture = Fixture::new();
    fixture
        .file(
            "math.ts",
            r#"
            export interface Ignored { value: number }
            export type Label = string;
            enum Kind { Yes = "yes" }
            export function add(left: number, right: number): number {
              return left + right;
            }
            export const kind: Label = Kind.Yes as Label;
            "#,
        )
        .file(
            "index.ts",
            r#"
            import { add, kind } from "./math.ts";
            console.log(add(2, 3) + kind);
            "#,
        );
    assert_eq!(stdout(&fixture, "index.ts"), "5yes\n");
}

#[test]
fn lowers_jsx_to_create_element() {
    let fixture = Fixture::new();
    fixture
        .file(
            "view.jsx",
            r#"
            export function view() {
              return <p className="hi">{1 + 2}</p>;
            }
            "#,
        )
        .file(
            "index.js",
            r#"
            import { view } from "./view.jsx";
            globalThis.React = {
              createElement(type, props, ...children) {
                return JSON.stringify({ type, props, children });
              }
            };
            console.log(view());
            "#,
        );
    assert_eq!(
        stdout(&fixture, "index.js"),
        "{\"type\":\"p\",\"props\":{\"className\":\"hi\"},\"children\":[3]}\n"
    );
}

#[test]
fn lowers_jsx_nested_in_expressions() {
    let fixture = Fixture::new();
    fixture
        .file(
            "view.jsx",
            r#"
            export function view(flag, items) {
              return (
                <ul>
                  {items.map((item) => <li key={item}>{item}</li>)}
                  {flag ? <b>yes</b> : <i>no</i>}
                </ul>
              );
            }
            "#,
        )
        .file(
            "index.js",
            r#"
            import { view } from "./view.jsx";
            globalThis.React = {
              createElement(type, props, ...children) {
                return JSON.stringify({ type, props, children });
              }
            };
            const rendered = view(true, ["a"]);
            const ok = rendered.includes("li") && rendered.includes("yes") && !rendered.includes("<");
            console.log(ok ? "jsx" : rendered);
            "#,
        );
    assert_eq!(stdout(&fixture, "index.js"), "jsx\n");
}

#[test]
fn writes_a_source_map_back_to_the_original_file() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "export const sourceMapMarker = 1;\nconsole.log(sourceMapMarker);\n",
    );
    let output = bundle(&BundleOptions::new(fixture.dir.join("index.js")).sourcemap(true)).unwrap();
    let map = output.map.expect("source map");
    assert!(map.contains("index.js"), "{map}");
    assert!(map.contains("sourceMapMarker"), "{map}");
    assert!(output.code.contains("sourceMappingURL=bundle.js.map"));
}

#[test]
fn replaces_defines_before_minification() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        r#"
        if (process.env.NODE_ENV !== "production") {
          console.log("dev-only-marker");
        } else {
          console.log("prod");
        }
        "#,
    );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .define("process.env.NODE_ENV", "\"production\"")
            .minify(true),
    )
    .unwrap();
    assert!(!output.code.contains("dev-only-marker"), "{}", output.code);
    assert_eq!(
        node_source(&fixture.dir, "bundle.js", &output.code),
        "prod\n"
    );
}

#[test]
fn runs_top_level_await() {
    let fixture = Fixture::new();
    fixture
        .file(
            "async.js",
            "export const value = await Promise.resolve(\"go\");\n",
        )
        .file(
            "index.js",
            "import { value } from \"./async.js\";\nconsole.log(value);\n",
        );
    assert_eq!(stdout(&fixture, "index.js"), "go\n");
}

#[test]
fn drops_unused_exports_from_side_effect_free_packages() {
    let fixture = Fixture::new();
    fixture
        .file(
            "node_modules/ui/package.json",
            "{\"sideEffects\":false,\"module\":\"index.js\"}\n",
        )
        .file(
            "node_modules/ui/index.js",
            "export { used } from \"./used.js\";\nexport { unused } from \"./unused.js\";\n",
        )
        .file(
            "node_modules/ui/used.js",
            "export function used() { return \"used\"; }\n",
        )
        .file(
            "node_modules/ui/unused.js",
            "console.log(\"unused-side-effect\");\nexport function unused() { return \"unused\"; }\n",
        )
        .file(
            "lib.js",
            "export function used() { return \"yes\"; }\nexport function unused() { return \"no-unused-marker\"; }\n",
        )
        .file(
            "index.js",
            "import { used as pack } from \"ui\";\nimport { used } from \"./lib.js\";\nconsole.log(pack() + used());\n",
        );
    let output = bundle(&BundleOptions::new(fixture.dir.join("index.js"))).unwrap();
    assert!(
        !output.code.contains("unused-side-effect"),
        "{}",
        output.code
    );
    assert!(!output.code.contains("no-unused-marker"), "{}", output.code);
    assert_eq!(
        node_source(&fixture.dir, "bundle.js", &output.code),
        "usedyes\n"
    );
}

#[test]
fn rewrites_dirname_filename_and_import_meta_dirname() {
    let fixture = Fixture::new();
    let dir_name = fixture
        .dir
        .file_name()
        .unwrap()
        .to_string_lossy()
        .to_string();
    fixture.file(
        "index.js",
        &format!(
            "console.log(import.meta.dirname.endsWith(\"{dir_name}\") + \":\" + __filename.endsWith(\"index.js\"));\n"
        ),
    );
    assert_eq!(stdout(&fixture, "index.js"), "true:true\n");
}

#[test]
fn browser_target_imports_externals_and_rejects_node_builtins() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "import value from \"left-pad\";\nconsole.log(value);\n",
    );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .external(["left-pad"])
            .target(Target::Browser),
    )
    .unwrap();
    assert!(output.code.contains("from \"left-pad\""), "{}", output.code);
    assert!(output.code.contains("export default"), "{}", output.code);
    fixture.file("node.js", "import fs from \"fs\";\nconsole.log(fs);\n");
    let error = bundle(&BundleOptions::new(fixture.dir.join("node.js")).target(Target::Browser))
        .unwrap_err();
    assert!(error.to_string().contains("fs"), "{error}");
    assert!(error.to_string().contains("browser"), "{error}");
}

#[test]
fn esm_format_imports_node_builtins_and_can_run() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "import fs from \"fs\";\nimport { basename } from \"path\";\nconsole.log(typeof fs.readFileSync + \":\" + basename(\"a/b.js\"));\n",
    );
    let output =
        bundle(&BundleOptions::new(fixture.dir.join("index.js")).format(Format::Esm)).unwrap();
    assert!(output.code.contains("from \"fs\""), "{}", output.code);
    assert!(output.code.contains("from \"path\""), "{}", output.code);
    assert!(output.code.contains("export default"), "{}", output.code);
    assert!(!output.code.contains("module.exports ="), "{}", output.code);
    assert_eq!(
        node_source(&fixture.dir, "bundle.mjs", &output.code),
        "function:b.js\n"
    );
}

#[test]
fn esm_format_awaits_an_async_entry() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "const value = await Promise.resolve(\"go\");\nconsole.log(value);\n",
    );
    let output =
        bundle(&BundleOptions::new(fixture.dir.join("index.js")).format(Format::Esm)).unwrap();
    assert!(output.code.contains("await "), "{}", output.code);
    assert!(!output.code.contains("__jsb_require"), "{}", output.code);
    assert!(!output.code.contains("__jsb_exports"), "{}", output.code);
    assert_eq!(
        node_source(&fixture.dir, "bundle.mjs", &output.code),
        "go\n"
    );
}

#[test]
fn esm_format_imports_the_shared_chunk() {
    let fixture = Fixture::new();
    fixture
        .file("package.json", "{\"type\":\"module\"}\n")
        .file(
            "shared.js",
            "export function shared() { return \"shared\"; }\n",
        )
        .file(
            "a.js",
            "import { shared } from \"./shared.js\";\nconsole.log(\"A\" + shared());\n",
        )
        .file(
            "b.js",
            "import { shared } from \"./shared.js\";\nconsole.log(\"B\" + shared());\n",
        );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("a.js"))
            .entries([fixture.dir.join("a.js"), fixture.dir.join("b.js")])
            .format(Format::Esm),
    )
    .unwrap();
    let chunk = output
        .files
        .iter()
        .find(|file| file.name == "chunk.js")
        .expect("chunk");
    assert!(chunk.code.contains("export {"), "{}", chunk.code);
    for file in &output.files {
        if file.name != "chunk.js" {
            assert!(file.code.contains("from \"./chunk.js\""), "{}", file.code);
        }
        fs::write(fixture.dir.join(&file.name), &file.code).unwrap();
    }
    assert_eq!(
        node_source(
            &fixture.dir,
            "a.js",
            &fs::read_to_string(fixture.dir.join("a.js")).unwrap()
        ),
        "Ashared\n"
    );
    assert_eq!(
        node_source(
            &fixture.dir,
            "b.js",
            &fs::read_to_string(fixture.dir.join("b.js")).unwrap()
        ),
        "Bshared\n"
    );
}

#[test]
fn browser_target_rejects_commonjs_format() {
    let fixture = Fixture::new();
    fixture.file("index.js", "console.log(1);\n");
    let error = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .target(Target::Browser)
            .format(Format::Cjs),
    )
    .unwrap_err();
    assert!(error.to_string().contains("esm"), "{error}");
}

#[test]
fn config_file_sets_esm_format() {
    let fixture = Fixture::new();
    fixture
        .file(
            "index.js",
            "import { basename } from \"path\";\nconsole.log(basename(\"a/b.js\"));\n",
        )
        .file(
            "webbundler.config.json",
            "{\"entry\":\"index.js\",\"format\":\"esm\",\"output\":\"dist/app.mjs\"}\n",
        );
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&fixture.dir)
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    let code = fs::read_to_string(fixture.dir.join("dist/app.mjs")).unwrap();
    assert!(code.contains("export default"), "{code}");
    assert!(code.contains("from \"path\""), "{code}");
    assert_eq!(node_source(&fixture.dir, "dist/app.mjs", &code), "b.js\n");
}

#[test]
fn minified_source_map_uses_the_output_filename() {
    let fixture = Fixture::new();
    fixture.file("index.js", "console.log(\"map-ok\");\n");
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&fixture.dir)
        .args([
            "index.js",
            "--output",
            "dist/workshop.mjs",
            "--minify",
            "--sourcemap",
            "--format",
            "esm",
        ])
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    let code = fs::read_to_string(fixture.dir.join("dist/workshop.mjs")).unwrap();
    assert!(code.contains("sourceMappingURL=workshop.mjs.map"), "{code}");
    assert!(!code.contains("sourceMappingURL=bundle.js.map"), "{code}");
    assert!(fixture.dir.join("dist/workshop.mjs.map").is_file());
    assert_eq!(
        node_source(&fixture.dir, "dist/workshop.mjs", &code),
        "map-ok\n"
    );
}

#[test]
fn splits_shared_modules_across_entries() {
    let fixture = Fixture::new();
    fixture
        .file(
            "shared.js",
            "export function shared() { return \"shared\"; }\n",
        )
        .file(
            "a.js",
            "import { shared } from \"./shared.js\";\nconsole.log(\"A\" + shared());\n",
        )
        .file(
            "b.js",
            "import { shared } from \"./shared.js\";\nconsole.log(\"B\" + shared());\n",
        );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("a.js"))
            .entries([fixture.dir.join("a.js"), fixture.dir.join("b.js")]),
    )
    .unwrap();
    assert!(
        output.files.iter().any(|file| file.name == "chunk.js"),
        "{:?}",
        output
            .files
            .iter()
            .map(|file| &file.name)
            .collect::<Vec<_>>()
    );
    for file in &output.files {
        fs::write(fixture.dir.join(&file.name), &file.code).unwrap();
    }
    assert_eq!(
        node_source(
            &fixture.dir,
            "a.js",
            &fs::read_to_string(fixture.dir.join("a.js")).unwrap()
        ),
        "Ashared\n"
    );
    assert_eq!(
        node_source(
            &fixture.dir,
            "b.js",
            &fs::read_to_string(fixture.dir.join("b.js")).unwrap()
        ),
        "Bshared\n"
    );
}

#[test]
fn bundles_css_and_copies_assets() {
    let fixture = Fixture::new();
    fixture
        .file("app.css", "body { color: red; }\n")
        .file("logo.svg", "<svg></svg>\n")
        .file(
            "index.js",
            "import \"./app.css\";\nimport logo from \"./logo.svg\";\nconsole.log(logo.endsWith(\".svg\"));\n",
        );
    let output = bundle(&BundleOptions::new(fixture.dir.join("index.js"))).unwrap();
    let css = output
        .assets
        .iter()
        .find(|asset| asset.name.ends_with(".css"))
        .expect("css asset");
    assert!(
        std::str::from_utf8(&css.contents)
            .unwrap()
            .contains("color: red"),
        "{}",
        String::from_utf8_lossy(&css.contents)
    );
    assert!(output
        .assets
        .iter()
        .any(|asset| asset.name.ends_with(".svg")));
    assert_eq!(
        node_source(&fixture.dir, "bundle.js", &output.code),
        "true\n"
    );
}

#[test]
fn strips_comments_including_licenses() {
    let fixture = Fixture::new();
    fixture
        .file(
            "app.css",
            ".a { content: \"/* stay */\"; color: red; } /* drop-css */\n/*! keep-css */\n",
        )
        .file(
            "index.js",
            r#"
            import "./app.css";
            /*! keep-license */
            // @license keep-line
            // @preserve keep-preserve
            // drop-line
            /* drop-block */
            const label = "/* stay */ // stay";
            const tick = `// stay ${1 /* drop-interp */ + 1}`;
            const slash = 8 / 2 / 2;
            const pattern = /[/]/;
            function answer() { return/*drop*/"ok"; }
            console.log([label, tick, slash, pattern.test("/"), answer()].join("|"));
            "#,
        );
    let plain = bundle(&BundleOptions::new(fixture.dir.join("index.js"))).unwrap();
    assert!(plain.code.contains("drop-line"), "{}", plain.code);
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .strip_comments(true)
            .sourcemap(true),
    )
    .unwrap();
    let code = &output.code;
    assert!(!code.contains("drop-line"), "{code}");
    assert!(!code.contains("drop-block"), "{code}");
    assert!(!code.contains("drop-interp"), "{code}");
    assert!(!code.contains("/*drop*/"), "{code}");
    assert!(!code.contains("/* /"), "{code}");
    assert!(!code.contains("keep-license"), "{code}");
    assert!(!code.contains("keep-line"), "{code}");
    assert!(!code.contains("@license"), "{code}");
    assert!(!code.contains("@preserve"), "{code}");
    let label_at = code.find("const label").unwrap();
    let gap = &code[code.rfind("__jsb_require(1);").unwrap()..label_at];
    assert!(
        !gap.contains("/*") && !gap.contains("//"),
        "license comments stayed in the module: {gap:?}"
    );
    assert!(code.contains("/* stay */ // stay"), "{code}");
    assert!(code.contains("// stay"), "{code}");
    assert!(code.contains("/[/]/"), "{code}");
    assert!(code.contains("sourceMappingURL=bundle.js.map"), "{code}");
    let map = output.map.expect("source map");
    assert!(map.contains("drop-line"), "{map}");
    let css = output
        .assets
        .iter()
        .find(|asset| asset.name.ends_with(".css"))
        .expect("css");
    let css = String::from_utf8(css.contents.clone()).unwrap();
    assert!(!css.contains("drop-css"), "{css}");
    assert!(!css.contains("\n\n"), "{css}");
    assert!(!css.contains("keep-css"), "{css}");
    assert!(css.contains("/* stay */"), "{css}");
    assert_eq!(
        node_source(&fixture.dir, "bundle.js", code),
        "/* stay */ // stay|// stay 2|2|true|ok\n"
    );
}

#[test]
fn stripping_comments_drops_the_lines_they_occupied() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        r#"
        const a = 1;
        // drop line
        /*
         * drop
         * several
         */
        const b = 2; /* tail
        still
        */ const c = 3;
        function answer() {
          return /*
          inside
          */ 4;
        }
        console.log([a, b, c, answer()].join(" "));
        "#,
    );
    let output =
        bundle(&BundleOptions::new(fixture.dir.join("index.js")).strip_comments(true)).unwrap();
    let code = &output.code;
    assert!(!code.contains("drop"), "{code}");
    assert!(!code.contains("tail"), "{code}");
    assert!(!code.contains("inside"), "{code}");
    assert!(!code.contains("still"), "{code}");
    let start = code.find("const a = 1;").unwrap() + "const a = 1;".len();
    let between = &code[start..code.find("const b = 2;").unwrap()];
    assert_eq!(
        between, "\n        ",
        "comment lines stayed behind: {between:?}\n{code}"
    );
    assert!(code.contains("const b = 2; const c = 3;"), "{code}");
    assert!(code.contains("return 4;"), "{code}");
    assert_eq!(node_source(&fixture.dir, "bundle.js", code), "1 2 3 4\n");
}

#[test]
fn strips_comments_from_node_modules() {
    let fixture = Fixture::new();
    fixture
        .file(
            "node_modules/banner/package.json",
            "{\"main\":\"index.js\"}\n",
        )
        .file(
            "node_modules/banner/index.js",
            "/*! pkg-license */\n// @license pkg-line\nmodule.exports = function (value) { return value + \"!\"; };\n",
        )
        .file(
            "node_modules/banner/theme.css",
            "/*! pkg-css-license */\n.a { color: red; }\n",
        )
        .file("app.css", "/*! app-css-license */\n.b { color: blue; }\n")
        .file(
            "index.js",
            r#"
            /*! app-license */
            // @license app-line
            import banner from "banner";
            import "banner/theme.css";
            import "./app.css";
            console.log(banner("ok"));
            "#,
        );
    let output =
        bundle(&BundleOptions::new(fixture.dir.join("index.js")).strip_comments(true)).unwrap();
    let code = &output.code;
    assert!(!code.contains("app-license"), "{code}");
    assert!(!code.contains("app-line"), "{code}");
    assert!(!code.contains("pkg-license"), "{code}");
    assert!(!code.contains("pkg-line"), "{code}");
    let css = output
        .assets
        .iter()
        .find(|asset| asset.name.ends_with(".css"))
        .expect("css");
    let css = String::from_utf8(css.contents.clone()).unwrap();
    assert!(!css.contains("app-css-license"), "{css}");
    assert!(!css.contains("pkg-css-license"), "{css}");
    assert!(css.contains("color: red"), "{css}");
    assert_eq!(node_source(&fixture.dir, "bundle.js", code), "ok!\n");
}

#[test]
fn config_file_strips_comments() {
    let fixture = Fixture::new();
    fixture
        .file("index.js", "// drop-from-config\nconsole.log(\"kept\");\n")
        .file(
            "webbundler.config.json",
            "{\"entry\":\"index.js\",\"stripComments\":true,\"output\":\"dist/bundle.js\"}\n",
        );
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&fixture.dir)
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    let code = fs::read_to_string(fixture.dir.join("dist/bundle.js")).unwrap();
    assert!(!code.contains("drop-from-config"), "{code}");
    assert_eq!(node_source(&fixture.dir, "dist/bundle.js", &code), "kept\n");
}

#[test]
fn no_filename_comments_omits_the_source_path_banner() {
    let fixture = Fixture::new();
    fixture.file("index.js", "console.log(\"ok\");\n");
    let plain = bundle(&BundleOptions::new(fixture.dir.join("index.js"))).unwrap();
    assert!(
        plain.code.contains("index.js"),
        "expected a filename comment\n{}",
        plain.code
    );
    let quiet =
        bundle(&BundleOptions::new(fixture.dir.join("index.js")).filename_comments(false)).unwrap();
    assert!(
        !quiet.code.contains("index.js"),
        "filename comment stayed\n{}",
        quiet.code
    );
    assert_eq!(node_source(&fixture.dir, "bundle.js", &quiet.code), "ok\n");

    fixture.file(
        "webbundler.config.json",
        "{\"entry\":\"index.js\",\"filenameComments\":false,\"output\":\"dist/bundle.js\"}\n",
    );
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&fixture.dir)
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    let code = fs::read_to_string(fixture.dir.join("dist/bundle.js")).unwrap();
    assert!(!code.contains("index.js"), "{code}");

    let flagged = Fixture::new();
    flagged.file("index.js", "console.log(\"ok\");\n");
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&flagged.dir)
        .arg("index.js")
        .arg("--no-filename-comments")
        .arg("--output")
        .arg("dist/bundle.js")
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    let code = fs::read_to_string(flagged.dir.join("dist/bundle.js")).unwrap();
    assert!(!code.contains("index.js"), "{code}");
    assert_eq!(node_source(&flagged.dir, "dist/bundle.js", &code), "ok\n");
}

#[test]
fn config_file_sets_minify_and_entry() {
    let fixture = Fixture::new();
    fixture.file("index.js", "console.log(1 + 2);\n").file(
        "webbundler.config.json",
        "{\"entry\":\"index.js\",\"minify\":true,\"output\":\"dist/bundle.js\"}\n",
    );
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&fixture.dir)
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    let bundle_path = fixture.dir.join("dist/bundle.js");
    let code = fs::read_to_string(&bundle_path).unwrap();
    assert!(!code.contains("console.log(1 + 2)"), "{code}");
    let output = Command::new("node").arg(&bundle_path).output().unwrap();
    assert_eq!(String::from_utf8(output.stdout).unwrap(), "3\n");
}

#[test]
fn report_lists_included_modules() {
    let fixture = Fixture::new();
    fixture.file("math.js", "export const n = 1;\n").file(
        "index.js",
        "import { n } from \"./math.js\";\nconsole.log(n);\n",
    );
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .arg(fixture.dir.join("index.js"))
        .arg("--report")
        .arg("-o")
        .arg(fixture.dir.join("dist/bundle.js"))
        .output()
        .unwrap();
    assert!(
        ran.status.success(),
        "{}",
        String::from_utf8_lossy(&ran.stderr)
    );
    let stdout = String::from_utf8(ran.stdout).unwrap();
    assert!(stdout.contains("math.js"), "{stdout}");
    assert!(stdout.contains("included"), "{stdout}");
}

#[test]
fn watch_rebuilds_when_an_input_changes() {
    let fixture = Fixture::new();
    fixture.file("index.js", "console.log(\"one\");\n");
    let output = fixture.dir.join("dist/bundle.js");
    let mut child = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .arg(fixture.dir.join("index.js"))
        .arg("-o")
        .arg(&output)
        .arg("--watch")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .unwrap();
    let deadline = Instant::now() + Duration::from_secs(20);
    while Instant::now() < deadline {
        if fs::read_to_string(&output)
            .ok()
            .is_some_and(|code| code.contains("\"one\""))
        {
            break;
        }
        thread::sleep(Duration::from_millis(50));
    }
    thread::sleep(Duration::from_millis(400));
    fixture.file("index.js", "console.log(\"two\");\n");
    let mut saw_two = false;
    while Instant::now() < deadline {
        if fs::read_to_string(&output)
            .ok()
            .is_some_and(|code| code.contains("\"two\""))
        {
            saw_two = true;
            break;
        }
        thread::sleep(Duration::from_millis(50));
    }
    let _ = child.kill();
    let _ = child.wait();
    assert!(
        saw_two,
        "watch mode did not rebuild after the entry changed"
    );
}

#[test]
fn omits_the_runtime_when_one_module_does_not_need_it() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "export const value = 40 + 2;\nconsole.log(value);\n",
    );
    let output =
        bundle(&BundleOptions::new(fixture.dir.join("index.js")).format(Format::Esm)).unwrap();
    for name in [
        "__jsb_externals",
        "__jsb_cache",
        "__jsb_modules",
        "__jsb_define",
        "__jsb_require",
        "__jsb_live",
        "__jsb_interop",
        "__jsb_star",
        "__jsb_dynamic",
        "__jsb_esm",
        "__jsb_wrap",
    ] {
        assert!(!output.code.contains(name), "{name} in {}", output.code);
    }
    assert!(output.code.contains("__jsb_exports"), "{}", output.code);
    assert!(output.code.contains("export default"), "{}", output.code);
    assert_eq!(
        node_source(&fixture.dir, "bundle.mjs", &output.code),
        "42\n"
    );
    let importer = fixture.dir.join("importer.mjs");
    fs::write(
        &importer,
        "import bundle from \"./bundle.mjs\";\nconsole.log(bundle.value);\n",
    )
    .unwrap();
    assert_eq!(
        node_source(
            &fixture.dir,
            "importer.mjs",
            &fs::read_to_string(&importer).unwrap()
        ),
        "42\n42\n"
    );

    fixture.file("side.mjs", "console.log(\"side\");\n");
    let side =
        bundle(&BundleOptions::new(fixture.dir.join("side.mjs")).format(Format::Esm)).unwrap();
    assert!(!side.code.contains("__jsb_exports"), "{}", side.code);
    assert_eq!(
        node_source(&fixture.dir, "side-bundle.mjs", &side.code),
        "side\n"
    );

    fixture.file("plain.js", "console.log(1);\n");
    let plain = bundle(&BundleOptions::new(fixture.dir.join("plain.js"))).unwrap();
    assert!(!plain.code.contains("__jsb_require"), "{}", plain.code);
    assert!(!plain.code.contains("__jsb_cache"), "{}", plain.code);
    assert_eq!(
        node_source(&fixture.dir, "plain-bundle.js", &plain.code),
        "1\n"
    );

    fixture.file("lib.cjs", "module.exports = { n: 7 };\n");
    let legacy = bundle(&BundleOptions::new(fixture.dir.join("lib.cjs"))).unwrap();
    assert!(!legacy.code.contains("__jsb_require"), "{}", legacy.code);
    fs::write(fixture.dir.join("legacy-bundle.js"), &legacy.code).unwrap();
    assert_eq!(
        node_source(
            &fixture.dir,
            "read-legacy.cjs",
            "console.log(require(\"./legacy-bundle.js\").n);\n"
        ),
        "7\n"
    );

    fixture.file("dep.js", "console.log(\"dep\");\n").file(
        "main.js",
        "require(\"./dep.js\");\nconsole.log(\"main\");\n",
    );
    let wrapped = bundle(&BundleOptions::new(fixture.dir.join("main.js"))).unwrap();
    assert!(!wrapped.code.contains("__jsb_exports"), "{}", wrapped.code);
    assert_eq!(
        node_source(&fixture.dir, "wrapped.js", &wrapped.code),
        "dep\nmain\n"
    );
}

#[test]
fn keeps_only_the_runtime_helpers_a_bundle_calls() {
    let fixture = Fixture::new();
    fixture
        .file("math.js", "export function add(a, b) { return a + b; }\n")
        .file(
            "index.js",
            "import { add } from \"./math.js\";\nconsole.log(add(2, 3));\n",
        );
    let output =
        bundle(&BundleOptions::new(fixture.dir.join("index.js")).format(Format::Esm)).unwrap();
    assert!(output.code.contains("__jsb_require"), "{}", output.code);
    assert!(output.code.contains("__jsb_live"), "{}", output.code);
    for name in [
        "__jsb_externals",
        "__jsb_interop",
        "__jsb_star",
        "__jsb_dynamic",
        "__jsb_wrap",
    ] {
        assert!(!output.code.contains(name), "{name} in {}", output.code);
    }
    assert_eq!(node_source(&fixture.dir, "bundle.mjs", &output.code), "5\n");
}

#[test]
fn css_image_urls_are_copied_and_remote_urls_stay() {
    let fixture = Fixture::new();
    fixture
        .file("images/mark.png", "png-bytes")
        .file("images/badge.svg", "<svg id=\"badge\"></svg>\n")
        .file(
            "app.css",
            concat!(
                ".a { background: url(\"./images/mark.png\"); }\n",
                ".b { background: url(./images/badge.svg); }\n",
                ".c { background: url(\"./missing.png\"); }\n",
                ".d { background: url(\"https://example.test/a.png\"); }\n",
                ".e { background: url(\"data:image/png;base64,aaaa\"); }\n",
                "/* url(\"./images/mark.png\") */\n",
            ),
        )
        .file("index.js", "import \"./app.css\";\nconsole.log(\"css\");\n");
    let options = BundleOptions::new(fixture.dir.join("index.js"));
    let output = bundle(&options).unwrap();
    let threaded = bundle(&options.threads(2)).unwrap();
    let css = String::from_utf8(
        output
            .assets
            .iter()
            .find(|asset| asset.name.ends_with(".css"))
            .expect("css")
            .contents
            .clone(),
    )
    .unwrap();
    assert!(css.contains("url(\"./mark.png\")"), "{css}");
    assert!(css.contains("url(\"./badge.svg\")"), "{css}");
    assert!(css.contains("url(\"./missing.png\")"), "{css}");
    assert!(css.contains("https://example.test/a.png"), "{css}");
    assert!(css.contains("data:image/png;base64,aaaa"), "{css}");
    assert!(css.contains("/* url(\"./images/mark.png\") */"), "{css}");
    let png = output
        .assets
        .iter()
        .find(|asset| asset.name == "mark.png")
        .expect("png");
    assert_eq!(png.contents, b"png-bytes");
    let svg = output
        .assets
        .iter()
        .find(|asset| asset.name == "badge.svg")
        .expect("svg");
    assert!(
        std::str::from_utf8(&svg.contents)
            .unwrap()
            .contains("badge"),
        "{}",
        String::from_utf8_lossy(&svg.contents)
    );
    assert_eq!(
        output
            .assets
            .iter()
            .map(|asset| (asset.name.clone(), asset.contents.clone()))
            .collect::<Vec<_>>(),
        threaded
            .assets
            .iter()
            .map(|asset| (asset.name.clone(), asset.contents.clone()))
            .collect::<Vec<_>>()
    );
}
