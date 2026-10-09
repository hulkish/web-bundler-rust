use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use webbundler::{bundle, load_config, BundleOptions, Format, Target};

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
        let dir = std::env::temp_dir().join(format!("webbundler-optimize-{nanos}-{n}"));
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

fn run_code(dir: &std::path::Path, code: &str) -> String {
    let path = dir.join("ran.js");
    fs::write(&path, code).unwrap();
    let output = Command::new("node")
        .arg(&path)
        .current_dir(dir)
        .output()
        .expect("node is required to execute bundled fixtures");
    assert!(
        output.status.success(),
        "node failed\nstdout:\n{}\nstderr:\n{}\ncode:\n{code}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    String::from_utf8(output.stdout).unwrap()
}

const PROGRAM: &str = r#"
const added = 1 + 2 * 3;
const label = "a" + "b";
const templ = `x${1 + 1}y`;
const list = new Array(1, 2, 3);
const empty = new Array();
const box = new Object();
const fromNull = Object(null);
const keys = Object.keys({ a: 1, b: 2, a: 3 });
const parsed = JSON.parse('{"n":4,"items":[1,2]}');
const abs = Math.abs(-5);
const sign = Math.sign(-2);
const low = Math.min(4, 2, 9);
const root = Math.sqrt(16);
const powered = Math.pow(2, 3);
const bits = (6 & 3) | (1 << 3);
const kind = typeof label;
const flag = Array.isArray(list);
const letters = "hi".length;
const num = Number("11");
const word = String(9);
const yes = Boolean(1);
const no = Boolean(0);
const chosen = true ? "yes" : missing();
const skipped = false && missing();
const seq = (0, 7);
const indexed = [9, 8, 7][1];
const effects = [];
function sideEffect() {
  effects.push("side");
  return 1;
}
const named = ({ a: 4, b: sideEffect() }).a;
const value = "len";
const dotted = value["length"];
function pick(x) {
  if (false) return "no";
  if (true) return x === null || x === undefined ? "empty" : "value";
}
function present(x) {
  return x !== null && x !== void 0;
}
function same(x) {
  return x ?? x;
}
let unused = false;
while (false) unused = true;
for (; false;) unused = true;
switch (2) {
  case 1:
    unused = true;
    break;
  case 2:
    break;
  default:
    unused = true;
}
const hidden = (function () {
  const inner = 5;
  return function () { return inner; };
})()();
console.log([
  added,
  label,
  templ,
  list.join("-"),
  empty.length,
  Object.keys(box).length,
  fromNull && 1,
  keys.join(""),
  parsed.n,
  parsed.items.join(""),
  abs,
  sign,
  low,
  root,
  powered,
  bits,
  kind,
  flag,
  letters,
  num,
  word,
  yes,
  no,
  chosen,
  skipped,
  seq,
  indexed,
  named,
  dotted,
  effects.join(""),
  pick(0),
  pick(null),
  present(0),
  present(null),
  same(0),
  same(null),
  unused,
  hidden,
  Math.random() >= 0
].join("|"));
"#;

#[test]
fn optimized_bundle_matches_the_unoptimized_result() {
    let fixture = Fixture::new();
    fixture.file("index.js", PROGRAM);
    let plain = bundle(&BundleOptions::new(fixture.dir.join("index.js"))).unwrap();
    let fast = bundle(&BundleOptions::new(fixture.dir.join("index.js")).optimize(true)).unwrap();
    assert!(plain.code.contains("new Array(1, 2, 3)"), "{}", plain.code);
    assert!(!fast.code.contains("new Array(1, 2, 3)"), "{}", fast.code);
    assert!(
        fast.code.contains("[1,2,3]") || fast.code.contains("[1, 2, 3]"),
        "{}",
        fast.code
    );
    assert_eq!(
        run_code(&fixture.dir, &plain.code),
        run_code(&fixture.dir, &fast.code)
    );
}

#[test]
fn deeper_folds_match_node() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        r#"
function idem(name) { return name && name; }
function prefer(name, other) { return name ? name : other; }
function fallback(name, other) { return name ? other : name; }
const log = [];
function side(n) { log.push(n); return n; }
let loops = 0;
for (let i = 0; i < 0; i = i + 1) loops = loops + 1;
for (var kept = 2; kept < 1; kept = kept + 1) loops = loops + 1;
while ((side(1), false)) side(2);
if ((side(3), false)) side(4); else side(5);
if ((side(6), true)) side(7); else side(8);
do { side(9); } while ((side(10), false));
for (let i = side(11); false;) side(12);
const values = [
  !!!false,
  !!!!true,
  !(1 === 2),
  !(1 !== 1),
  typeof typeof side(13),
  typeof function () { return 1; },
  typeof [],
  typeof {},
  true ? 7 : 7,
  idem("a"),
  idem(""),
  prefer("a", "b"),
  prefer("", "b"),
  fallback("a", "b"),
  fallback("", "b"),
  Math.hypot(3, 4),
  Number.isFinite(8),
  Number.isInteger(8),
  Number.isInteger("8"),
  Number.isSafeInteger(8),
  Number.isNaN(1),
  Number.isNaN("x"),
  Object.is(1, 1),
  Object.is(1, "1"),
  Object.is(null, undefined),
  Array.of(1, 2, 3).join(""),
  Array.of().length,
  String.fromCharCode(65, 66),
  JSON.stringify(1),
  JSON.stringify({ a: 1 }),
  JSON.stringify([1, 2]),
  String(JSON.stringify(undefined)),
  parseInt("42", 10),
  parseFloat("42"),
  Number.parseInt("7", 10),
  isNaN(undefined),
  isNaN(1),
  isFinite(null),
  isFinite(undefined),
  encodeURIComponent("Ab1"),
  decodeURIComponent("Ab 1"),
  ~~4,
  loops,
  kept,
  void void side(14),
  log.join(",")
];
console.log(values.join("|"));
"#,
    );
    let plain = bundle(&BundleOptions::new(fixture.dir.join("index.js"))).unwrap();
    let fast = bundle(&BundleOptions::new(fixture.dir.join("index.js")).optimize(true)).unwrap();
    assert_eq!(
        run_code(&fixture.dir, &plain.code),
        run_code(&fixture.dir, &fast.code),
        "{}",
        fast.code
    );
}

#[test]
fn minify_is_the_last_pass_after_optimize() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "const label = \"opt\" + \"-\" + (1 + 2 * 3);\nconsole.log(label);\n",
    );
    let optimized =
        bundle(&BundleOptions::new(fixture.dir.join("index.js")).optimize(true)).unwrap();
    let minified = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .optimize(true)
            .minify(true),
    )
    .unwrap();
    let optimized_lines = optimized
        .code
        .lines()
        .filter(|line| !line.starts_with("//#"))
        .count();
    let minified_body = minified
        .code
        .lines()
        .filter(|line| !line.starts_with("//#"))
        .collect::<Vec<_>>()
        .join("\n");
    assert!(optimized_lines > 1, "{}", optimized.code);
    assert!(
        optimized.code.contains("opt-7"),
        "optimize should fold before minify:\n{}",
        optimized.code
    );
    assert!(
        !minified_body.contains('\n'),
        "minify should print the optimized bundle as the final pass:\n{minified_body}"
    );
    assert!(minified_body.contains("opt-7"), "{minified_body}");
    assert!(
        minified_body.len() < optimized.code.len(),
        "{minified_body}"
    );
    assert_eq!(
        run_code(&fixture.dir, &optimized.code),
        run_code(&fixture.dir, &minified.code)
    );
    assert_eq!(run_code(&fixture.dir, &minified.code), "opt-7\n");
}

#[test]
fn prettify_runs_after_minify_and_keeps_the_sourcemap() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "function classify(value) {\n  if (value) {\n    return value + 1;\n  }\n  return 0;\n}\nconsole.log(classify(globalThis.keep || 40), \"PRETTY_MARK\");\n",
    );
    let options = BundleOptions::new(fixture.dir.join("index.js"))
        .optimize(true)
        .minify(true)
        .sourcemap(true);
    let minified = bundle(&options).unwrap();
    let pretty = bundle(&options.prettify(true)).unwrap();
    let minified_body = minified
        .code
        .lines()
        .filter(|line| !line.starts_with("//#"))
        .collect::<Vec<_>>()
        .join("\n");
    assert!(
        !minified_body.contains("\n  "),
        "minify stays compact when prettify is off:\n{minified_body}"
    );
    assert!(
        pretty.code.contains("\n  "),
        "prettify should indent the minified bundle:\n{}",
        pretty.code
    );
    assert!(pretty.code.contains("PRETTY_MARK"), "{}", pretty.code);
    assert!(
        pretty.code.len() > minified_body.len(),
        "pretty:\n{}\nmin:\n{minified_body}",
        pretty.code
    );
    let map = pretty.map.expect("source map");
    assert_maps_to(
        &map,
        &pretty.code,
        "PRETTY_MARK",
        "index.js",
        6,
        "PRETTY_MARK",
    );
    assert_eq!(run_code(&fixture.dir, &minified.code), "41 PRETTY_MARK\n");
    assert_eq!(run_code(&fixture.dir, &pretty.code), "41 PRETTY_MARK\n");
}

#[test]
fn optimize_with_minify_still_matches_node() {
    let fixture = Fixture::new();
    fixture.file("index.js", PROGRAM);
    let plain = bundle(&BundleOptions::new(fixture.dir.join("index.js"))).unwrap();
    let fast = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .optimize(true)
            .minify(true),
    )
    .unwrap();
    assert_eq!(
        run_code(&fixture.dir, &plain.code),
        run_code(&fixture.dir, &fast.code)
    );
}

#[test]
fn optimize_keeps_esm_and_cjs_results() {
    let fixture = Fixture::new();
    fixture.file(
        "lib.js",
        "export const n = 1 + 2;\nexport function read(x) { return x === null || x === undefined; }\n",
    );
    fixture.file(
        "index.js",
        "import { n, read } from \"./lib.js\";\nconsole.log([n, read(null), read(1)].join(\",\"));\n",
    );
    for format in [Format::Cjs, Format::Esm] {
        let plain = bundle(
            &BundleOptions::new(fixture.dir.join("index.js"))
                .target(Target::Node)
                .format(format),
        )
        .unwrap();
        let fast = bundle(
            &BundleOptions::new(fixture.dir.join("index.js"))
                .target(Target::Node)
                .format(format)
                .optimize(true),
        )
        .unwrap();
        assert_eq!(
            run_code(&fixture.dir, &plain.code),
            run_code(&fixture.dir, &fast.code),
            "{format:?}\n{}",
            fast.code
        );
        assert_eq!(run_code(&fixture.dir, &fast.code), "3,true,false\n");
    }
}

#[test]
fn config_and_cli_control_the_optimize_pass() {
    let fixture = Fixture::new();
    fixture
        .file(
            "index.js",
            "console.log(new Array(1, 2).join(\"-\"), 1 + 2);\n",
        )
        .file(
            "webbundler.config.json",
            "{\"entry\":\"index.js\",\"optimize\":true,\"output\":\"dist/bundle.js\"}\n",
        );
    let config = load_config(&fixture.dir.join("webbundler.config.json")).unwrap();
    assert_eq!(config.optimize, Some(true));
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
    assert!(!code.contains("new Array(1, 2)"), "{code}");
    assert_eq!(run_code(&fixture.dir, &code), "1-2 3\n");

    let off = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&fixture.dir)
        .arg("--no-optimize")
        .output()
        .unwrap();
    assert!(
        off.status.success(),
        "{}",
        String::from_utf8_lossy(&off.stderr)
    );
    let code = fs::read_to_string(fixture.dir.join("dist/bundle.js")).unwrap();
    assert!(code.contains("new Array(1, 2)"), "{code}");

    let flagged = Fixture::new();
    flagged.file(
        "index.js",
        "console.log(new Array(1, 2).join(\"-\"), 1 + 2);\n",
    );
    let ran = Command::new(env!("CARGO_BIN_EXE_webbundler"))
        .current_dir(&flagged.dir)
        .arg("index.js")
        .arg("--optimize")
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
    assert!(!code.contains("new Array(1, 2)"), "{code}");
    assert_eq!(run_code(&flagged.dir, &code), "1-2 3\n");
}

fn line_col(source: &str, offset: u32) -> (u32, u32) {
    let offset = offset.min(source.len() as u32) as usize;
    let mut line = 0u32;
    let mut start = 0usize;
    for (index, byte) in source.bytes().enumerate() {
        if index == offset {
            break;
        }
        if byte == b'\n' {
            line += 1;
            start = index + 1;
        }
    }
    (line, (offset - start) as u32)
}

fn mapped_origin(map_json: &str, generated: &str, needle: &str) -> (String, u32, String) {
    let sm = oxc_sourcemap::OwnedSourceMap::from_json_string(map_json)
        .unwrap_or_else(|err| panic!("source map: {err}\n{map_json}"));
    let table = sm.generate_lookup_table();
    let at = generated
        .find(needle)
        .unwrap_or_else(|| panic!("missing {needle} in generated code\n{generated}"));
    let (line, col) = line_col(generated, at as u32);
    let token = sm
        .lookup_token(&table, line, col)
        .unwrap_or_else(|| panic!("no mapping for {needle} at {line}:{col}\n{generated}"));
    let source_id = token
        .get_source_id()
        .unwrap_or_else(|| panic!("{needle} at {line}:{col} is unmapped"));
    let name = sm.get_source(source_id).unwrap().to_string();
    let content = sm.get_source_content(source_id).unwrap_or("");
    let src_line = token.get_src_line();
    let line_text = content
        .lines()
        .nth(src_line as usize)
        .unwrap_or("")
        .to_string();
    (name, src_line, line_text)
}

fn assert_maps_to(
    map_json: &str,
    generated: &str,
    needle: &str,
    file_tail: &str,
    original_line: u32,
    original_snippet: &str,
) {
    let (name, line, text) = mapped_origin(map_json, generated, needle);
    assert!(
        name.ends_with(file_tail),
        "{needle} mapped to {name}, expected {file_tail}\nline {line}: {text}"
    );
    assert_eq!(
        line, original_line,
        "{needle} mapped to {name}:{line} ({text}), expected line {original_line}"
    );
    assert!(
        text.contains(original_snippet),
        "{needle} landed on {name}:{line} ({text}), expected {original_snippet}"
    );
}

#[test]
fn optimize_sourcemap_follows_deletions_and_folds() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "console.log(\"BEFORE\");\nconst gone = 40 + 2;\nfunction stay() { return 1 + 2; }\nconsole.log(stay(), \"AFTER_FOLD\");\n",
    );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .optimize(true)
            .sourcemap(true),
    )
    .unwrap();
    let map = output.map.expect("source map");
    assert!(
        output.code.contains("sourceMappingURL=bundle.js.map"),
        "{}",
        output.code
    );
    assert!(!output.code.contains("40 + 2"), "{}", output.code);
    assert!(output.code.contains("console.log(3,"), "{}", output.code);
    assert!(!output.code.contains("function stay"), "{}", output.code);
    assert!(
        map.contains("40 + 2"),
        "original source missing from map\n{map}"
    );
    assert_maps_to(&map, &output.code, "\"BEFORE\"", "index.js", 0, "BEFORE");
    assert_maps_to(&map, &output.code, "3,", "index.js", 3, "stay()");
    assert_maps_to(
        &map,
        &output.code,
        "\"AFTER_FOLD\"",
        "index.js",
        3,
        "AFTER_FOLD",
    );
    assert_eq!(
        run_code(&fixture.dir, &output.code),
        "BEFORE\n3 AFTER_FOLD\n"
    );
}

#[test]
fn optimize_sourcemap_keeps_each_module_and_jsx() {
    let fixture = Fixture::new();
    fixture
        .file(
            "lib.js",
            "export const amount = 10 + 5;\nexport function libMark() {\n  return \"FROM_LIB\";\n}\n",
        )
        .file(
            "view.jsx",
            "export function view() {\n  return <b data-fold=\"FOLD_TAG\">{1 + 2}</b>;\n}\nexport function jsxMark() {\n  return \"FROM_JSX\";\n}\n",
        )
        .file(
            "index.js",
            "import { amount, libMark } from \"./lib.js\";\nimport { view, jsxMark } from \"./view.jsx\";\nglobalThis.React = { createElement() { return \"el\"; } };\nconsole.log(amount, libMark(), view(), jsxMark(), \"ENTRY_MARK\");\n",
        );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .optimize(true)
            .sourcemap(true),
    )
    .unwrap();
    let map = output.map.expect("source map");
    assert_maps_to(&map, &output.code, "\"FROM_LIB\"", "lib.js", 2, "FROM_LIB");
    assert_maps_to(&map, &output.code, "\"FOLD_TAG\"", "view.jsx", 1, "1 + 2");
    assert_maps_to(
        &map,
        &output.code,
        "\"FROM_JSX\"",
        "view.jsx",
        4,
        "FROM_JSX",
    );
    assert_maps_to(
        &map,
        &output.code,
        "\"ENTRY_MARK\"",
        "index.js",
        3,
        "ENTRY_MARK",
    );
    assert_eq!(
        run_code(&fixture.dir, &output.code),
        "15 FROM_LIB el FROM_JSX ENTRY_MARK\n"
    );
}

#[test]
fn optimize_and_minify_sourcemap_still_points_at_the_original() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "const gone = 1 + 2;\nconsole.log(\"MIN_MARK\", 8 / 2);\n",
    );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .optimize(true)
            .minify(true)
            .sourcemap(true),
    )
    .unwrap();
    let map = output.map.expect("source map");
    assert!(map.contains("1 + 2"), "{map}");
    assert!(!output.code.contains("1 + 2"), "{}", output.code);
    assert_maps_to(&map, &output.code, "MIN_MARK", "index.js", 1, "MIN_MARK");
    assert_eq!(run_code(&fixture.dir, &output.code), "MIN_MARK 4\n");
}

#[test]
fn config_optimize_and_sourcemap_write_a_usable_map() {
    let fixture = Fixture::new();
    fixture
        .file(
            "index.js",
            "const gone = 1 + 2;\nconsole.log(\"CFG_MARK\");\n",
        )
        .file(
            "webbundler.config.json",
            "{\"entry\":\"index.js\",\"optimize\":true,\"sourcemap\":true,\"output\":\"dist/bundle.js\"}\n",
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
    let map = fs::read_to_string(fixture.dir.join("dist/bundle.js.map")).unwrap();
    assert!(code.contains("sourceMappingURL=bundle.js.map"), "{code}");
    assert_maps_to(&map, &code, "CFG_MARK", "index.js", 1, "CFG_MARK");
    assert_eq!(run_code(&fixture.dir, &code), "CFG_MARK\n");
}

fn run_status(dir: &std::path::Path, code: &str) -> (bool, String, String) {
    let path = dir.join("ran.js");
    fs::write(&path, code).unwrap();
    let output = Command::new("node")
        .arg(&path)
        .current_dir(dir)
        .output()
        .expect("node is required to execute bundled fixtures");
    (
        output.status.success(),
        String::from_utf8(output.stdout).unwrap(),
        String::from_utf8(output.stderr).unwrap(),
    )
}

fn assert_same_outcome(label: &str, source: &str) {
    let fixture = Fixture::new();
    fixture.file("index.js", source);
    let plain = bundle(&BundleOptions::new(fixture.dir.join("index.js"))).unwrap();
    let fast = bundle(&BundleOptions::new(fixture.dir.join("index.js")).optimize(true)).unwrap();
    let plain_run = run_status(&fixture.dir, &plain.code);
    let fast_run = run_status(&fixture.dir, &fast.code);
    assert_eq!(
        plain_run.0, fast_run.0,
        "{label}\nplain stderr:\n{}\nfast stderr:\n{}\n{}",
        plain_run.2, fast_run.2, fast.code
    );
    assert_eq!(plain_run.1, fast_run.1, "{label}\n{}", fast.code);
    if plain_run.0 {
        assert!(
            fast_run.2.is_empty() || plain_run.2 == fast_run.2,
            "{label}\n{}",
            fast_run.2
        );
    } else {
        assert!(
            fast_run.2.contains("ReferenceError") == plain_run.2.contains("ReferenceError"),
            "{label}\nplain:\n{}\nfast:\n{}",
            plain_run.2,
            fast_run.2
        );
    }
}

#[test]
fn every_logged_outcome_matches_node() {
    let programs = [
        (
            "numbers",
            r#"
            console.log([
              1 + 2 * 3, 8 / 2, (-8) / -2, 7 % 3, (-5) % 2, 2 ** 3,
              1 < 2, 1 === 2, 8 << 1, 1 << 31, (-1) >>> 0, 5 & 3, ~0, !0, void 1, +"4", -"3"
            ].join(","));
            "#,
        ),
        (
            "strings",
            r#"
            console.log(["a" + "b", "a" + 1, `x${1 + 1}y`, "hi".length, "é".length, "" + 1, null + "a", true + "a"].join("|"));
            "#,
        ),
        (
            "logic",
            r#"
            const calls = [];
            function miss(name) { calls.push(name); return name; }
            const chosen = true ? "yes" : miss("no");
            const skipped = false && miss("and");
            const taken = false || "or";
            const empty = null ?? miss("nullish");
            const zero = 0 ?? miss("zero");
            const seq = (calls.push("seq"), 7);
            console.log([chosen, skipped, taken, empty, zero, seq, calls.join("+")].join("|"));
            "#,
        ),
        (
            "arrays and objects",
            r#"
            const effects = [];
            const first = [1, effects.push("a")][0];
            const hole = [1, , 2][1];
            const len = [effects.push("b"), 4].length;
            const prop = ({ a: 1, b: effects.push("c") }).a;
            const keys = Object.keys({ a: 1, b: 2, a: 3 }).join("");
            const parsed = JSON.parse('{"n":4,"items":[1,2]}');
            console.log([first, hole, len, prop, keys, parsed.n, parsed.items.join(""), effects.join("")].join("|"));
            "#,
        ),
        (
            "branches",
            r#"
            let ran = false;
            if (false) { ran = true; }
            if (true) { ran = ran || false; }
            let updates = 0;
            for (; false; updates++) {}
            while (false) { ran = true; }
            do { updates += 0; } while (false);
            let fromSwitch = "";
            switch (1) {
              case 0: fromSwitch = "no"; break;
              case 1: fromSwitch = "yes";
              case 2: fromSwitch += "!"; break;
              default: fromSwitch = "default";
            }
            console.log([ran, updates, fromSwitch].join("|"));
            "#,
        ),
        (
            "consts and closures",
            r#"
            const n = 1 + 2;
            const word = "a" + "b";
            const box = { n };
            function later() { return n; }
            const arrow = () => word;
            console.log([n, word, box.n, later(), arrow()].join("|"));
            "#,
        ),
        (
            "nullish locals",
            r#"
            function empty(x) { return x === null || x === undefined; }
            function present(x) { return x !== null && x !== void 0; }
            function same(x) { return x ?? x; }
            console.log([empty(null), empty(0), present(0), present(undefined), same(0), same(null)].join("|"));
            "#,
        ),
        (
            "hoisted var in a dead branch",
            r#"
            if (false) { var hoisted = 1; }
            console.log(hoisted);
            "#,
        ),
        (
            "dead let does not run",
            r#"
            let ran = false;
            if (false) { let hidden = missing(); ran = true; }
            console.log(ran);
            "#,
        ),
        (
            "temporal dead zone before init",
            r#"
            console.log("start");
            try { console.log(x); } catch (error) { console.log(error.name); }
            const x = 1;
            "#,
        ),
        (
            "closure sees the temporal dead zone",
            r#"
            const read = () => x;
            try { console.log(read()); } catch (error) { console.log(error.name); }
            const x = 1;
            console.log(read());
            "#,
        ),
        (
            "direct eval keeps the local",
            r#"
            function f(value) {
              eval("value = value + 1");
              return value + Math.abs(-1);
            }
            console.log(f(2));
            "#,
        ),
        (
            "shadowed builtin stays a call",
            r#"
            function Math(value) { return value; }
            console.log(Math(Math.abs ? 1 : 2));
            "#,
        ),
    ];
    for (label, source) in programs {
        assert_same_outcome(label, source);
    }
}

#[test]
fn optimize_reduces_bundled_css_before_minify() {
    let fixture = Fixture::new();
    fixture
        .file(
            "app.css",
            "/*! keep */\n.a { color: red; color: blue; }\n.a { margin: 0px; }\n.empty { }\n.b { color: green; }\n",
        )
        .file(
            "index.js",
            "import \"./app.css\";\nconsole.log(\"ok\");\n",
        );
    let plain = bundle(&BundleOptions::new(fixture.dir.join("index.js"))).unwrap();
    let fast = bundle(&BundleOptions::new(fixture.dir.join("index.js")).optimize(true)).unwrap();
    let minified = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .optimize(true)
            .minify(true),
    )
    .unwrap();
    let plain_css = css_text(&plain);
    let fast_css = css_text(&fast);
    let min_css = css_text(&minified);
    assert!(plain_css.contains("color: red"), "{plain_css}");
    assert!(plain_css.contains(".empty"), "{plain_css}");
    assert!(fast_css.contains("/*! keep */"), "{fast_css}");
    assert!(fast_css.contains("color: blue"), "{fast_css}");
    assert!(fast_css.contains("margin: 0;"), "{fast_css}");
    assert!(fast_css.contains(".b"), "{fast_css}");
    assert!(!fast_css.contains("color: red"), "{fast_css}");
    assert!(!fast_css.contains(".empty"), "{fast_css}");
    assert_eq!(fast_css.matches(".a").count(), 1, "{fast_css}");
    assert!(!min_css.contains("color: red"), "{min_css}");
    assert!(min_css.contains("color:blue"), "{min_css}");
    assert!(min_css.contains("margin:0"), "{min_css}");
    assert!(!min_css.contains("0px"), "{min_css}");
    assert!(!min_css.contains('\n'), "{min_css}");
    assert_eq!(run_code(&fixture.dir, &fast.code), "ok\n");
    let pretty = bundle(&BundleOptions::new(fixture.dir.join("index.js")).prettify(true)).unwrap();
    let pretty_css = css_text(&pretty);
    assert!(pretty_css.contains("/*! keep */"), "{pretty_css}");
    assert!(pretty_css.contains("\n  color: red;"), "{pretty_css}");
    assert!(pretty_css.contains("\n  color: blue;"), "{pretty_css}");
    let both = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .optimize(true)
            .minify(true)
            .prettify(true),
    )
    .unwrap();
    let both_css = css_text(&both);
    assert!(both_css.contains('\n'), "{both_css}");
    assert!(both_css.contains("color: blue;"), "{both_css}");
    assert!(both_css.contains("margin: 0;"), "{both_css}");
    assert!(!both_css.contains("color: red"), "{both_css}");
    assert!(!both_css.contains(".empty"), "{both_css}");
}

#[test]
fn esm_output_drops_strict_and_promotes_var_after_optimize() {
    let source = "\"use strict\";\nvar extra = globalThis.keep || 2;\nextra = extra + 1;\nvar total = 0;\nfor (var i = 0; i < 3; i++) total = total + i;\nconsole.log(extra, total, \"use strict\", \"ESM_SHAPE\");\n";
    let fixture = Fixture::new();
    fixture.file("index.js", source);
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .format(Format::Esm)
            .optimize(true),
    )
    .unwrap();
    assert!(!strict_directive(&output.code), "{}", output.code);
    assert!(output.code.contains("\"use strict\""), "{}", output.code);
    assert!(output.code.contains("let extra"), "{}", output.code);
    assert!(output.code.contains("for (var i"), "{}", output.code);
    assert!(!output.code.contains("var extra"), "{}", output.code);
    assert!(!output.code.contains("var total"), "{}", output.code);
    assert_eq!(
        run_mjs(&fixture.dir, &output.code),
        "3 3 use strict ESM_SHAPE\n"
    );
}

#[test]
fn esm_output_keeps_the_shape_when_minified_after_optimize() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "\"use strict\";\nvar extra = globalThis.keep || 2;\nextra = extra + 1;\nconsole.log(extra, \"use strict\");\n",
    );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .format(Format::Esm)
            .optimize(true)
            .minify(true),
    )
    .unwrap();
    assert!(!strict_directive(&output.code), "{}", output.code);
    assert!(output.code.contains("use strict"), "{}", output.code);
    assert!(
        !output.code.contains("var extra") && !output.code.contains("var "),
        "{}",
        output.code
    );
    assert_eq!(run_mjs(&fixture.dir, &output.code), "3 use strict\n");
}

#[test]
fn esm_factory_runtime_is_lexical_and_a_cjs_bundle_keeps_strict() {
    let fixture = Fixture::new();
    fixture
        .file("shared.js", "export function shared() { return \"shared\"; }\n")
        .file(
            "index.js",
            "import { shared } from \"./shared.js\";\n\"use strict\";\nvar n = 1;\nconsole.log(shared(), n, \"use strict\");\n",
        );
    let esm = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .format(Format::Esm)
            .optimize(true),
    )
    .unwrap();
    assert!(!strict_directive(&esm.code), "{}", esm.code);
    assert!(!esm.code.contains("var __jsb"), "{}", esm.code);
    assert!(!esm.code.contains("var n"), "{}", esm.code);
    assert_eq!(run_mjs(&fixture.dir, &esm.code), "shared 1 use strict\n");

    let cjs = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .format(Format::Cjs)
            .optimize(true),
    )
    .unwrap();
    assert!(strict_directive(&cjs.code), "{}", cjs.code);
    assert!(
        cjs.code.contains("var n") || cjs.code.contains("var "),
        "{}",
        cjs.code
    );
    assert_eq!(run_code(&fixture.dir, &cjs.code), "shared 1 use strict\n");
}

#[test]
fn esm_const_rewrite_keeps_the_sourcemap_on_the_marker() {
    let fixture = Fixture::new();
    fixture.file(
        "index.js",
        "\"use strict\";\nvar label = globalThis.keep || 1;\nconsole.log(label, \"SHAPE_MARK\");\n",
    );
    let output = bundle(
        &BundleOptions::new(fixture.dir.join("index.js"))
            .format(Format::Esm)
            .optimize(true)
            .sourcemap(true),
    )
    .unwrap();
    let map = output.map.expect("source map");
    assert!(output.code.contains("const label"), "{}", output.code);
    assert!(!strict_directive(&output.code), "{}", output.code);
    assert_maps_to(
        &map,
        &output.code,
        "SHAPE_MARK",
        "index.js",
        2,
        "SHAPE_MARK",
    );
    assert_eq!(run_mjs(&fixture.dir, &output.code), "1 SHAPE_MARK\n");
}

fn strict_directive(code: &str) -> bool {
    code.lines().any(|line| {
        let line = line.trim();
        line == "\"use strict\";" || line == "'use strict';"
    })
}

fn run_mjs(dir: &std::path::Path, code: &str) -> String {
    let path = dir.join("ran.mjs");
    fs::write(&path, code).unwrap();
    let output = Command::new("node")
        .arg(&path)
        .current_dir(dir)
        .output()
        .expect("node is required to execute bundled fixtures");
    assert!(
        output.status.success(),
        "node failed\nstdout:\n{}\nstderr:\n{}\ncode:\n{code}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    String::from_utf8(output.stdout).unwrap()
}

fn css_text(output: &webbundler::BundleOutput) -> String {
    let css = output
        .assets
        .iter()
        .find(|asset| asset.name.ends_with(".css"))
        .expect("css");
    String::from_utf8(css.contents.clone()).unwrap()
}
