use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use webbundler::{bundle, BundleOptions, Format, Target};

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
        let dir = std::env::temp_dir().join(format!("webbundler-minbundle-{nanos}-{n}"));
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

fn node_source(dir: &std::path::Path, name: &str, source: &str) -> String {
    let path = dir.join(name);
    fs::write(&path, source).unwrap();
    let output = Command::new("node")
        .arg(&path)
        .current_dir(dir)
        .output()
        .expect("node");
    assert!(
        output.status.success(),
        "node failed\nstdout:\n{}\nstderr:\n{}\nsource:\n{source}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    String::from_utf8(output.stdout).unwrap()
}

fn has_keyword(code: &str, keyword: &str) -> bool {
    code.split(|c: char| !c.is_ascii_alphanumeric() && c != '_' && c != '$')
        .any(|word| word == keyword)
}

fn bundled(fixture: &Fixture, entry: &str, minify: bool) -> String {
    bundle(&BundleOptions::new(fixture.dir.join(entry)).minify(minify))
        .unwrap()
        .code
}

fn same(fixture: &Fixture, entry: &str) {
    let plain = bundled(fixture, entry, false);
    let minified = bundled(fixture, entry, true);
    assert!(
        minified.len() <= plain.len(),
        "minified grew\nplain:\n{plain}\nminified:\n{minified}"
    );
    assert_eq!(
        node_source(&fixture.dir, "bundle.js", &plain),
        node_source(&fixture.dir, "bundle.min.js", &minified),
        "minified:\n{minified}"
    );
}

#[test]
fn reports_a_parse_error_for_the_entry_file() {
    let fixture = Fixture::new();
    fixture.file("index.js", "function (\n");
    let error = bundle(&BundleOptions::new(fixture.dir.join("index.js"))).unwrap_err();
    let message = error.to_string();
    assert!(message.contains("index.js"), "{message}");
}

#[test]
fn minified_modules_match_the_plain_bundle() {
    let fixture = Fixture::new();
    fixture
        .file(
            "math.js",
            "export function add(a, b) { return a + b; }\nexport const base = 10;\n",
        )
        .file(
            "index.js",
            "import { add, base } from \"./math.js\";\nconsole.log(add(base, 5));\n",
        );
    same(&fixture, "index.js");
}

#[test]
fn minified_live_bindings_stay_live() {
    let fixture = Fixture::new();
    fixture
        .file(
            "counter.js",
            "export let value = 1;\nexport function set(next) { value = next; }\n",
        )
        .file(
            "index.js",
            "import { value, set } from \"./counter.js\";\nconsole.log(value);\nset(2);\nconsole.log(value);\n",
        );
    same(&fixture, "index.js");
}

#[test]
fn minified_cycles_match_the_plain_bundle() {
    let fixture = Fixture::new();
    fixture
        .file(
            "a.js",
            "import { fromB } from \"./b.js\";\nexport function fromA(n) { return n > 0 ? fromB(n - 1) : \"a\"; }\n",
        )
        .file(
            "b.js",
            "import { fromA } from \"./a.js\";\nexport function fromB(n) { return n > 0 ? fromA(n - 1) : \"b\"; }\n",
        )
        .file(
            "index.js",
            "import { fromA } from \"./a.js\";\nconsole.log(fromA(4));\n",
        );
    same(&fixture, "index.js");
}

#[test]
fn minified_reexports_json_and_commonjs_match() {
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
    same(&fixture, "index.js");
}

#[test]
fn minified_namespace_and_default_imports_match() {
    let fixture = Fixture::new();
    fixture
        .file(
            "widget.js",
            "export const name = \"widget\";\nexport default function score(n) { return n + 1; }\n",
        )
        .file(
            "index.js",
            "import score, * as widget from \"./widget.js\";\nconsole.log(widget.name + score(2));\n",
        );
    same(&fixture, "index.js");
}

#[test]
fn minified_dynamic_import_matches() {
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
    same(&fixture, "index.js");
}

#[test]
fn minified_top_level_await_matches() {
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
    same(&fixture, "index.js");
}

#[test]
fn minified_side_effect_import_still_runs() {
    let fixture = Fixture::new();
    fixture
        .file("effect.js", "console.log(\"effect-ran\");\nexport {};\n")
        .file(
            "index.js",
            "import \"./effect.js\";\nconsole.log(\"entry\");\n",
        );
    let minified = bundled(&fixture, "index.js", true);
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &minified),
        "effect-ran\nentry\n",
        "{minified}"
    );
}

#[test]
fn minified_bundle_drops_debugger_and_unused_markers() {
    let fixture = Fixture::new();
    fixture
        .file(
            "helper.js",
            "export function unusedMarker() { return \"unused-marker-98765\"; }\nexport function add(a, b) { debugger; return a + b; }\n",
        )
        .file(
            "index.js",
            "import { add } from \"./helper.js\";\nconsole.log(add(20, 22));\n",
        );
    let plain = bundled(&fixture, "index.js", false);
    let minified = bundled(&fixture, "index.js", true);
    assert!(plain.contains("debugger"), "{plain}");
    assert!(!minified.contains("debugger"), "{minified}");
    assert!(!minified.contains("unused-marker-98765"), "{minified}");
    assert!(minified.len() < plain.len(), "{minified}");
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &minified),
        "42\n"
    );
}

#[test]
fn minified_commonjs_keeps_module_exports() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "module.exports = { value: 21 * 2 };\nconsole.log(module.exports.value);\n",
    );
    let minified = bundled(&fixture, "index.js", true);
    assert!(minified.contains("module.exports"), "{minified}");
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &minified),
        "42\n"
    );
}

#[test]
fn minified_source_map_still_points_at_the_original_file() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "export const sourceMapMarker = 1;\nconsole.log(sourceMapMarker);\n",
    );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .minify(true)
            .sourcemap(true),
    )
    .unwrap();
    let map = output.map.expect("source map");
    let json: serde_json::Value = serde_json::from_str(&map).expect("json source map");
    assert_eq!(json["version"], 3);
    assert!(map.contains("index.js"), "{map}");
    assert!(map.contains("sourceMapMarker"), "{map}");
    assert!(output.code.contains("sourceMappingURL="), "{}", output.code);
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &output.code),
        "1\n"
    );
}

#[test]
fn minified_jsx_matches_the_plain_bundle() {
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
            console.log(view(true, ["a"]).includes("yes") ? "jsx" : "missing");
            "#,
        );
    same(&fixture, "index.js");
}

#[test]
fn minified_typescript_matches_the_plain_bundle() {
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
            "import { add, kind } from \"./math.ts\";\nconsole.log(add(2, 3) + kind);\n",
        );
    same(&fixture, "index.ts");
}

#[test]
fn minified_dirname_and_filename_rewrites_match() {
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
    same(&fixture, "index.js");
}

#[test]
fn minified_node_builtin_stays_external_and_package_is_bundled() {
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
            "import fs from \"fs\";\nimport pad from \"left-pad\";\nconsole.log(typeof fs.readFileSync + \":\" + pad(\"ok\"));\n",
        );
    let minified = bundled(&fixture, "index.js", true);
    assert!(
        minified.contains("\"fs\"") || minified.contains("'fs'") || minified.contains("`fs`"),
        "{minified}"
    );
    assert!(minified.contains("pad:"), "{minified}");
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &minified),
        "function:pad:ok\n"
    );
}

#[test]
fn minified_browser_bundle_keeps_the_external_import() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "import value from \"left-pad\";\nexport default value;\n",
    );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .external(["left-pad"])
            .target(Target::Browser)
            .minify(true),
    )
    .unwrap();
    assert!(
        output.code.contains("from\"left-pad\"") || output.code.contains("from \"left-pad\""),
        "{}",
        output.code
    );
    assert!(output.code.contains("left-pad"), "{}", output.code);
}

#[test]
fn minified_css_and_assets_are_still_emitted() {
    let fixture = Fixture::new();
    fixture
        .file("app.css", "body { color: red; }\n")
        .file("logo.svg", "<svg></svg>\n")
        .file(
            "index.js",
            "import \"./app.css\";\nimport logo from \"./logo.svg\";\nconsole.log(logo.endsWith(\".svg\"));\n",
        );
    let output = bundle(&BundleOptions::new(fixture.dir.join("index.js")).minify(true)).unwrap();
    let css = output
        .assets
        .iter()
        .find(|asset| asset.name.ends_with(".css"))
        .expect("css asset");
    let text = std::str::from_utf8(&css.contents).unwrap();
    assert_eq!(text, "body{color:red}");
    assert!(output
        .assets
        .iter()
        .any(|asset| asset.name.ends_with(".svg")));
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &output.code),
        "true\n"
    );
}

#[test]
fn minified_css_keeps_selectors_and_calc() {
    let fixture = Fixture::new();
    fixture
        .file(
            "app.css",
            "/* drop */\n.a .b { color: #ffffff; height: calc(100vh - 3.2rem); }\n.a > .b { margin: 0.50rem; }\n@media screen and (min-width: 30em) { .a { content: \"/* stay */\"; } }\n",
        )
        .file("index.js", "import \"./app.css\";\nconsole.log(\"ok\");\n");
    let output = bundle(&BundleOptions::new(fixture.dir.join("index.js")).minify(true)).unwrap();
    let css = output
        .assets
        .iter()
        .find(|asset| asset.name.ends_with(".css"))
        .expect("css asset");
    let text = std::str::from_utf8(&css.contents).unwrap();
    assert_eq!(
        text,
        ".a .b{color:#fff;height:calc(100vh -3.2rem)}.a>.b{margin:.5rem}@media screen and (min-width:30em){.a{content:\"/* stay */\"}}"
    );
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &output.code),
        "ok\n"
    );
}

#[test]
fn minified_shared_chunks_still_run() {
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
            .entries([fixture.dir.join("a.js"), fixture.dir.join("b.js")])
            .minify(true),
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
fn minified_define_removes_the_dead_branch() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "if (process.env.NODE_ENV !== \"production\") { console.log(\"dev-only-marker\"); }\nconsole.log(\"prod\");\n",
    );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .define("process.env.NODE_ENV", "\"production\"")
            .minify(true),
    )
    .unwrap();
    assert!(!output.code.contains("dev-only-marker"), "{}", output.code);
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &output.code),
        "prod\n"
    );
}

#[test]
fn minified_side_effect_free_package_drops_the_unused_file() {
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
            "index.js",
            "import { used } from \"ui\";\nconsole.log(used());\n",
        );
    let output = bundle(&BundleOptions::new(fixture.dir.join("index.js")).minify(true)).unwrap();
    assert!(
        !output.code.contains("unused-side-effect"),
        "{}",
        output.code
    );
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &output.code),
        "used\n"
    );
}

#[test]
fn minified_output_strips_a_plain_comment() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "/* drop-comment-token */\nconsole.log(1 + 2);\n",
    );
    let output = bundle(&BundleOptions::new(fixture.dir.join("index.js")).minify(true)).unwrap();
    assert!(
        !output.code.contains("drop-comment-token"),
        "{}",
        output.code
    );
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &output.code),
        "3\n"
    );
}

#[test]
fn minified_class_across_modules_matches() {
    let fixture = Fixture::new();
    fixture
        .file(
            "box.js",
            "export class Box { constructor(n) { this.n = n; } twice() { return this.n * 2; } }\n",
        )
        .file(
            "index.js",
            "import { Box } from \"./box.js\";\nconsole.log(new Box(6).twice());\n",
        );
    same(&fixture, "index.js");
}

#[test]
fn minified_bundle_folds_json_parse_and_array_methods() {
    let fixture = Fixture::new();
    fixture
        .file(
            "data.js",
            r#"export function label() {
                 return JSON.parse('{"name":"Ada","n":2}').name + JSON.parse('{"name":"Ada","n":2}').n;
               }
               export function joined() {
                 return ["a", "b", "c"].join("-");
               }"#,
        )
        .file(
            "index.js",
            "import { label, joined } from \"./data.js\";\nconsole.log(label() + joined());\n",
        );
    let minified = bundled(&fixture, "index.js", true);
    assert!(!minified.contains("JSON.parse"), "{minified}");
    assert!(!minified.contains(".join("), "{minified}");
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &minified),
        "Ada2a-b-c\n"
    );
}

#[test]
fn minified_bundle_keeps_a_shadowed_json_parse() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        r#"function JSON() {}
           JSON.parse = function () { return { name: "no" }; };
           console.log(JSON.parse('{"name":"Ada"}').name);
        "#,
    );
    let minified = bundled(&fixture, "index.js", true);
    assert_eq!(
        node_source(&fixture.dir, "bundle.min.js", &minified),
        "no\n",
        "{minified}"
    );
}

#[test]
fn minified_esm_bundle_keeps_lexical_declarations() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        r#"const label = "architecture-detail-token";
           let extra = 1;
           extra += 1;
           console.log(label + extra);
        "#,
    );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .format(Format::Esm)
            .minify(true),
    )
    .unwrap();
    assert!(!has_keyword(&output.code, "var"), "{}", output.code);
    assert!(has_keyword(&output.code, "let"), "{}", output.code);
    fs::write(fixture.dir.join("bundle.mjs"), &output.code).unwrap();
    let ran = Command::new("node")
        .arg(fixture.dir.join("bundle.mjs"))
        .current_dir(&fixture.dir)
        .output()
        .expect("node");
    assert!(
        ran.status.success(),
        "stderr:\n{}\nsource:\n{}",
        String::from_utf8_lossy(&ran.stderr),
        output.code
    );
    assert_eq!(
        String::from_utf8(ran.stdout).unwrap(),
        "architecture-detail-token2\n"
    );
}

#[test]
fn minified_esm_format_can_require_a_node_builtin() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "import fs from \"fs\";\nconsole.log(typeof fs.readFileSync);\n",
    );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .format(Format::Esm)
            .minify(true),
    )
    .unwrap();
    fs::write(fixture.dir.join("bundle.mjs"), &output.code).unwrap();
    let ran = Command::new("node")
        .arg(fixture.dir.join("bundle.mjs"))
        .current_dir(&fixture.dir)
        .output()
        .expect("node");
    assert!(
        ran.status.success(),
        "stderr:\n{}\nsource:\n{}",
        String::from_utf8_lossy(&ran.stderr),
        output.code
    );
    assert_eq!(String::from_utf8(ran.stdout).unwrap(), "function\n");
}
