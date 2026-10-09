use super::minify;
use std::fs;
use std::process::Command;
use std::sync::atomic::{AtomicU64, Ordering};

fn run(code: &str) -> String {
    run_as(code, "mjs")
}

fn run_as(code: &str, extension: &str) -> String {
    static NEXT: AtomicU64 = AtomicU64::new(0);
    let path = std::env::temp_dir().join(format!(
        "webbundler-min-{}-{}.{extension}",
        std::process::id(),
        NEXT.fetch_add(1, Ordering::Relaxed)
    ));
    fs::write(&path, code).unwrap();
    let output = Command::new("node").arg(&path).output().expect("node");
    let _ = fs::remove_file(&path);
    assert!(
        output.status.success(),
        "node failed\nstdout:\n{}\nstderr:\n{}\nsource:\n{code}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    String::from_utf8(output.stdout).unwrap()
}

fn has_keyword(code: &str, keyword: &str) -> bool {
    code.split(|c: char| !c.is_ascii_alphanumeric() && c != '_' && c != '$')
        .any(|word| word == keyword)
}

fn check(source: &str, expected: &str) {
    assert_eq!(run(source), expected, "original diverged\n{source}");
    let code = minify(source, true, None).unwrap().code;
    assert_eq!(run(&code), expected, "minified diverged\n{code}");
}

fn check_cjs(source: &str, expected: &str) {
    assert_eq!(
        run_as(source, "cjs"),
        expected,
        "original diverged\n{source}"
    );
    let code = minify(source, false, None).unwrap().code;
    assert_eq!(run_as(&code, "cjs"), expected, "minified diverged\n{code}");
}

macro_rules! behavior {
    ($name:ident, $source:expr, $expected:expr) => {
        #[test]
        fn $name() {
            check($source, $expected);
        }
    };
}

macro_rules! behavior_cjs {
    ($name:ident, $source:expr, $expected:expr) => {
        #[test]
        fn $name() {
            check_cjs($source, $expected);
        }
    };
}

#[test]
fn drops_unused_code_debugger_and_pure_calls() {
    let source = r#"
        function unusedMarker() { return "unused-marker-98765"; }
        debugger;
        let seen = 0;
        function bump() { seen += 1; return 1; }
        Math.abs(bump());
        if (false) { console.log("gone-branch-marker"); }
        const folded = 20 + 22;
        console.log(folded);
        console.log(seen);
        console.log(Math.random() < 2);
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(!code.contains("unused-marker-98765"), "{code}");
    assert!(!code.contains("debugger"), "{code}");
    assert!(!code.contains("gone-branch-marker"), "{code}");
    assert!(!code.contains("Math.abs"), "{code}");
    assert!(code.contains("Math.random"), "{code}");
    assert!(code.contains("42"), "{code}");
    assert_eq!(run(&code), "42\n1\ntrue\n");
}

#[test]
fn pools_repeated_strings_and_leaves_import_sources() {
    let source = r#"
        import value from "left-pad";
        console.log(value);
        console.log("architecture-detail-token");
        console.log("architecture-detail-token");
        console.log("architecture-detail-token!");
        console.log("ab");
        console.log("ab");
        console.log("ab");
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(
        code.contains("from\"left-pad\"") || code.contains("from \"left-pad\""),
        "{code}"
    );
    assert_eq!(
        code.matches("architecture-detail-token").count(),
        2,
        "{code}"
    );
    let short = code.matches("\"ab\"").count()
        + code.matches("'ab'").count()
        + code.matches("`ab`").count();
    assert_eq!(short, 3, "{code}");
}

#[test]
fn keeps_module_and_exports_parameters() {
    let source = "function publish(module, exports) { module.exports = exports; }\nconsole.log(typeof publish);\n";
    let code = minify(source, false, None).unwrap().code;
    assert!(code.contains("module"), "{code}");
    assert!(code.contains("exports"), "{code}");
    assert_eq!(run(&code), "function\n");
}

#[test]
fn keeps_a_use_strict_directive() {
    let source = r#"
        function strict() {
            "use strict";
            undeclared = 1;
        }
        try {
            strict();
            console.log("sloppy");
        } catch (error) {
            console.log("strict");
        }
    "#;
    let code = minify(source, false, None).unwrap().code;
    assert_eq!(run_as(&code, "cjs"), "strict\n");
}

#[test]
fn reports_a_parse_error() {
    let Err(error) = minify("function (", true, None) else {
        panic!("expected a parse error");
    };
    assert!(
        error.to_string().contains("minifier could not parse"),
        "{error}"
    );
}

#[test]
fn minifies_an_empty_program() {
    let code = minify("   \n", true, None).unwrap().code;
    assert_eq!(run(&code), "");
}

#[test]
fn writes_a_source_map() {
    let minified = minify(
        "const value = 1;\nconsole.log(value);\n",
        true,
        Some("out.js"),
    )
    .unwrap();
    let map = minified.map.expect("source map");
    let json: serde_json::Value = serde_json::from_str(&map).expect("json source map");
    assert_eq!(json["version"], 3);
    assert!(!json["mappings"].as_str().unwrap_or("").is_empty(), "{map}");
    assert_eq!(run(&minified.code), "1\n");
}

#[test]
fn minifies_nested_three_shader_source() {
    let source = r#"
        const chunk = `
            #define PI 3.141592653589793
            // drop-shader-comment
            #ifndef saturate
            #define saturate( a ) clamp( a, 0.0, 1.0 )
            #endif
            #include <common>
            float pow2( const in float x ) { return x * x; }
            void main() { gl_FragColor = vec4(1.0); }
        `;
        const prose = "Can not resolve #include <" + "fog" + ">";
        const pattern = /^[ \t]*#include +<([\w\d./]+)>/m;
        console.log(chunk.includes("drop-shader-comment") ? "dirty" : "clean");
        console.log(pattern.test(chunk) ? "include" : "missing");
        console.log(chunk.includes("float pow2(const in float x)") ? "fn" : "nofn");
        console.log(prose);
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert_eq!(code.matches("drop-shader-comment").count(), 1, "{code}");
    assert!(code.contains("#include <common>"), "{code}");
    assert_eq!(
        run(&code),
        "clean\ninclude\nfn\nCan not resolve #include <fog>\n"
    );
    let again = minify(&code, true, None).unwrap().code;
    assert_eq!(again, code);
}

#[test]
fn strips_comments_and_keeps_comment_text_inside_strings() {
    let source = "/* drop-me */\n// also-drop\nconsole.log(\"keep /* drop-me */\");\n";
    let code = minify(source, true, None).unwrap().code;
    assert!(!code.contains("also-drop"), "{code}");
    assert_eq!(code.matches("drop-me").count(), 1, "{code}");
    assert_eq!(run(&code), "keep /* drop-me */\n");
}

#[test]
fn removes_constant_dead_branches() {
    let source = r#"
        if (false) { console.log("false-branch"); } else { console.log("else-branch"); }
        if (true) { console.log("true-branch"); } else { console.log("true-else"); }
        console.log(true ? "yes" : "no-branch");
        while (false) { console.log("while-body"); }
        console.log("after");
    "#;
    let code = minify(source, true, None).unwrap().code;
    for marker in ["false-branch", "true-else", "no-branch", "while-body"] {
        assert!(!code.contains(marker), "{marker} in {code}");
    }
    assert_eq!(
        run(&code),
        "else-branch\ntrue-branch\nyes\nafter\n",
        "{code}"
    );
}

#[test]
fn drops_code_after_return_and_keeps_earlier_effects() {
    let source = r#"
        function run() {
            console.log("before");
            return 1;
            console.log("after-return-marker");
        }
        console.log(run());
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(!code.contains("after-return-marker"), "{code}");
    assert_eq!(run(&code), "before\n1\n");
}

#[test]
fn keeps_a_string_that_says_debugger() {
    let source = "debugger;\nconsole.log(\"debugger\");\n";
    let code = minify(source, true, None).unwrap().code;
    assert_eq!(code.matches("debugger").count(), 1, "{code}");
    assert_eq!(run(&code), "debugger\n");
}

#[test]
fn keeps_side_effects_when_the_binding_is_unused() {
    let source = r#"
        let n = 0;
        function effect() { n += 1; return 4; }
        const unused = effect();
        console.log(n);
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert_eq!(run(&code), "1\n", "{code}");
}

#[test]
fn drops_unused_pure_builtin_calls_but_keeps_arguments() {
    let source = r#"
        let n = 0;
        function effect() { n += 1; return []; }
        Array.isArray(effect());
        Object.is(effect(), effect());
        Number.isFinite(effect());
        console.log(n);
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(!code.contains("Array.isArray"), "{code}");
    assert!(!code.contains("Object.is"), "{code}");
    assert!(!code.contains("Number.isFinite"), "{code}");
    assert_eq!(run(&code), "4\n", "{code}");
}

#[test]
fn leaves_property_names_unmangled() {
    let source = r#"
        const box = { longPropertyName: 5, "quoted-key": 2 };
        console.log(box.longPropertyName + box["quoted-key"]);
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(code.contains("longPropertyName"), "{code}");
    assert!(code.contains("quoted-key"), "{code}");
    assert_eq!(run(&code), "7\n");
}

#[test]
fn leaves_free_globals_unmangled() {
    let source = "console.log(typeof console + \":\" + typeof Math + \":\" + typeof JSON);\n";
    let code = minify(source, true, None).unwrap().code;
    assert!(code.contains("console"), "{code}");
    assert!(code.contains("Math"), "{code}");
    assert!(code.contains("JSON"), "{code}");
    assert_eq!(run(&code), "object:object:object\n");
}

#[test]
fn leaves_a_single_long_string_inline() {
    let source = "console.log(\"only-once-architecture-token\");\n";
    let code = minify(source, true, None).unwrap().code;
    assert!(!code.contains("__s"), "{code}");
    assert_eq!(
        code.matches("only-once-architecture-token").count(),
        1,
        "{code}"
    );
}

#[test]
fn pools_each_distinct_repeated_string() {
    let source = r#"
        console.log("alpha-token-unique-value-extra");
        console.log("alpha-token-unique-value-extra");
        console.log("beta-token-unique-value-extra");
        console.log("beta-token-unique-value-extra");
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert_eq!(
        code.matches("alpha-token-unique-value-extra").count(),
        1,
        "{code}"
    );
    assert_eq!(
        code.matches("beta-token-unique-value-extra").count(),
        1,
        "{code}"
    );
    assert_eq!(
        run(&code),
        "alpha-token-unique-value-extra\nalpha-token-unique-value-extra\nbeta-token-unique-value-extra\nbeta-token-unique-value-extra\n"
    );
}

#[test]
fn does_not_pool_a_lone_surrogate_string() {
    let source = "console.log(\"\\uD800\");\nconsole.log(\"\\uD800\");\n";
    let code = minify(source, true, None).unwrap().code;
    assert!(!code.contains("__s"), "{code}");
    assert_eq!(run(source), run(&code), "{code}");
}

#[test]
fn keeps_a_dynamic_import_specifier() {
    let source = "const pending = import(\"very-long-module-specifier-token\");\nvoid pending;\n";
    let code = minify(source, true, None).unwrap().code;
    let quoted = code.contains("\"very-long-module-specifier-token\"")
        || code.contains("'very-long-module-specifier-token'")
        || code.contains("`very-long-module-specifier-token`");
    assert!(quoted, "{code}");
}

#[test]
fn shrinks_a_verbose_program() {
    let source = r#"
        function unusedHelper(value) {
            return value + 1;
        }
        const answer = 20 + 22;
        console.log(answer);
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(code.len() < source.len(), "{code}");
    assert!(!code.contains("unusedHelper"), "{code}");
    assert_eq!(run(&code), "42\n");
}

#[test]
fn a_second_pass_keeps_the_same_result() {
    let source = r#"
        function value(n) { return n + 1; }
        console.log(value(20 + 21));
        console.log("architecture-detail-token");
        console.log("architecture-detail-token");
    "#;
    let once = minify(source, true, None).unwrap().code;
    let twice = minify(&once, true, None).unwrap().code;
    assert_eq!(run(&once), run(&twice), "{twice}");
    assert_eq!(
        run(&twice),
        "42\narchitecture-detail-token\narchitecture-detail-token\n"
    );
}

#[test]
fn keeps_a_hashbang() {
    let source = "#!/usr/bin/env node\nconsole.log(\"hash\");\n";
    let code = minify(source, true, None).unwrap().code;
    assert!(code.starts_with("#!"), "{code}");
    assert_eq!(run(&code), "hash\n");
}

behavior!(
    folds_arithmetic_and_string_addition,
    r#"console.log((1 + 2) * 3 - 4);
       console.log(1 + "2" + 3);
       console.log("5" - 2);
       console.log(+"4" + -1);
       console.log(2 ** 5);
       console.log(7 % 3);
       console.log(1_000 + 2_000);"#,
    "5\n123\n3\n3\n32\n1\n3000\n"
);

behavior!(
    folds_comparisons_and_boolean_logic,
    r#"console.log((true && false) || true);
       console.log(2 < 3 && 3 <= 3 && 4 > 1 && 4 >= 4 && 5 === 5 && 5 !== 4);
       console.log(1 == "1" && 0 == false && null == undefined && 1 !== "1");
       console.log((0 || "or") + ":" + (0 ?? "nullish"));"#,
    "true\ntrue\ntrue\nor:0\n"
);

behavior!(
    preserves_short_circuit_side_effects,
    r#"let n = 0;
       function tick(label) { n += 1; return label; }
       console.log(false && tick("a"));
       console.log(true || tick("b"));
       console.log(null ?? tick("c"));
       console.log(0 ?? tick("d"));
       console.log(n);"#,
    "false\ntrue\nc\n0\n1\n"
);

behavior!(
    preserves_update_and_assignment_operators,
    r#"let n = 1;
       const a = n++;
       const b = ++n;
       console.log(a + "," + b + "," + n);
       n += 3;
       n *= 2;
       n -= 1;
       let c = 0;
       c ||= 4;
       let d = 1;
       d ||= 9;
       let e = null;
       e ??= 5;
       console.log([n, c, d, e].join(","));"#,
    "1,3,3\n11,4,1,5\n"
);

behavior!(
    preserves_bitwise_operators,
    "console.log((5 & 3) + (5 | 2) + (5 ^ 1) + (1 << 3) + (8 >> 1));\n",
    "24\n"
);

behavior!(
    preserves_control_flow,
    r#"let n = 0;
       for (let i = 0; i < 5; i++) {
         if (i % 2 === 0) continue;
         n += i;
       }
       while (n < 6) n += 1;
       do { n += 1; } while (n < 7);
       outer: for (let i = 0; i < 3; i++) {
         for (let j = 0; j < 3; j++) {
           n += 1;
           if (i === 1 && j === 0) break outer;
         }
       }
       console.log(n);"#,
    "11\n"
);

behavior!(
    preserves_switch_fallthrough,
    r#"function word(n) {
         let out = "";
         switch (n) {
           case 1: out += "a";
           case 2: out += "b"; break;
           default: out += "c";
         }
         return out;
       }
       console.log(word(1) + word(2) + word(3));"#,
    "abbc\n"
);

behavior!(
    preserves_try_catch_and_finally,
    r#"let n = 0;
       function run() {
         try { n += 1; throw new Error("x"); }
         catch (e) { n += 1; }
         finally { n += 1; }
       }
       run();
       function value() {
         try { return 1; }
         finally { console.log("fin"); }
       }
       console.log(value());
       try { throw new Error("boom-token"); }
       catch (e) { console.log(e.message); }
       try { throw 1; } catch { console.log("caught"); }
       console.log(n);"#,
    "fin\n1\nboom-token\ncaught\n3\n"
);

behavior!(
    preserves_loop_closures,
    r#"const lets = [];
       for (let i = 0; i < 3; i++) lets.push(() => i);
       const vars = [];
       for (var i = 0; i < 3; i++) vars.push(() => i);
       console.log(lets.map((fn) => fn()).join(","));
       console.log(vars.map((fn) => fn()).join(","));"#,
    "0,1,2\n3,3,3\n"
);

behavior!(
    preserves_temporal_dead_zone,
    r#"let threw = false;
       try { console.log(x); } catch (error) { threw = true; }
       const x = 1;
       console.log(threw + ":" + x);"#,
    "true:1\n"
);

behavior!(
    preserves_functions_closures_and_recursion,
    r#"function outer(n) {
         function inner() { return n + 1; }
         return inner();
       }
       console.log(outer(4));
       console.log((function (n) { return n + 1; })(6));
       function fact(n) { return n < 2 ? 1 : n * fact(n - 1); }
       console.log(fact(5));
       function even(n) { return n === 0 ? true : odd(n - 1); }
       function odd(n) { return n === 0 ? false : even(n - 1); }
       console.log(even(4) && !odd(4));"#,
    "5\n7\n120\ntrue\n"
);

behavior!(
    preserves_parameters_rest_and_destructuring,
    r#"let n = 0;
       function fallback(a = (n += 1)) { return a; }
       function sum(...xs) { return xs.reduce((a, b) => a + b, 0); }
       const { a, b: c } = { a: 1, b: 2 };
       const [d, ...rest] = [3, 4, 5];
       console.log(fallback(5));
       console.log(fallback());
       console.log(n);
       console.log(sum(1, 2, 3));
       console.log([a, c, d, rest.join("")].join(","));"#,
    "5\n1\n1\n6\n1,2,3,45\n"
);

behavior!(
    preserves_objects_arrays_and_property_access,
    r#"const key = "name";
       const box = { [key]: "Ada", ...{ extra: 2 }, a: 1 };
       const copy = { ...box, a: 9 };
       const hole = [1,,3];
       console.log(box.name + copy.a + copy.extra);
       console.log(hole.length + ":" + (1 in hole));
       console.log([1].concat([2, 3]).join(""));
       console.log([3, 1, 2].sort((a, b) => a - b).join(""));
       console.log([1, 2, 3].map((n) => n * 2).filter((n) => n > 2).join("-"));
       console.log(Object.keys({ b: 1, a: 2 }).join(""));
       const removed = { a: 1, b: 2 };
       delete removed.a;
       console.log("a" in removed ? "yes" : "no");"#,
    "Ada92\n3:false\n123\n123\n4-6\nba\nno\n"
);

behavior!(
    preserves_getters_setters_and_method_this,
    r#"let reads = 0;
       let written = 0;
       const box = {
         get value() { reads += 1; return 7; },
         set value(next) { written = next; },
         n: 3,
         get() { return this.n; }
       };
       console.log(box.value);
       box.value = 9;
       console.log(reads + ":" + written);
       console.log(box.get());
       function add(a, b) { return this.n + a + b; }
       console.log(add.call({ n: 10 }, 1, 2));
       function plus(a) { return this.n + a; }
       console.log(plus.bind({ n: 4 })(5));"#,
    "7\n1:9\n3\n13\n9\n"
);

behavior!(
    preserves_classes_private_fields_and_prototypes,
    r#"class Box {
         #n;
         constructor(n) { this.#n = n; }
         get() { return this.#n; }
         twice() { return this.get() * 2; }
       }
       class Child extends Box {
         twice() { return super.twice() + 1; }
       }
       class Counter { static n = 2; static { Counter.n += 1; } static get() { return Counter.n; } }
       function Legacy(n) { this.n = n; }
       Legacy.prototype.double = function () { return this.n * 2; };
       console.log(new Child(4).twice());
       console.log(Counter.get());
       console.log(new Legacy(3).double());
       class Field { n = 4; get() { return this.n; } }
       console.log(new Field().get());"#,
    "9\n3\n6\n4\n"
);

behavior!(
    preserves_optional_chaining_and_nullish,
    r#"const missing = null;
       const call = null;
       const present = () => 2;
       console.log(missing?.a ?? "none");
       console.log(typeof call?.());
       console.log(present?.());"#,
    "none\nundefined\n2\n"
);

behavior!(
    preserves_templates_regex_and_strings,
    r#"const name = "Ada";
       function tag(strings, value) { return strings[0] + value + strings[1]; }
       console.log(`hi ${name} ${1 + 1}`);
       console.log(tag`a${2}b`);
       console.log(/a.c/.test("abc"));
       console.log("ab".replace(/b/, "c"));
       const re = /a/g;
       re.test("ab");
       console.log(re.lastIndex);
       console.log("héllo".length);
       console.log("🙂".length);
       console.log(" Ab ".trim().toLowerCase());
       console.log("abc"[1]);
       console.log("A".charCodeAt(0));
       console.log("abcdef".slice(1, 4));
       console.log("hello".includes("ell"));
       console.log("7".padStart(3, "0"));
       console.log("ab".repeat(3));
       console.log("a,b,c".split(",").join("|"));
       console.log("Hello".endsWith("lo"));"#,
    "hi Ada 2\na2b\ntrue\nac\n1\n5\n2\nab\nb\n65\nbcd\ntrue\n007\nababab\na|b|c\ntrue\n"
);

behavior!(
    preserves_builtins_and_collections,
    r#"console.log(String(10n * 3n));
       console.log(JSON.parse('{"a":1}').a);
       console.log(Array.isArray([]) + ":" + Array.isArray({}));
       console.log(Math.max(1, 5, 2) + Math.min(3, 1));
       console.log(Number.isInteger(2) && !Number.isInteger(2.5));
       console.log(encodeURIComponent("a b"));
       console.log(Date.UTC(2020, 0, 1));
       const map = new Map([["a", 1]]);
       map.set("b", 2);
       console.log(map.get("a") + map.get("b"));
       console.log([...new Set([1, 1, 2])].join(""));"#,
    "30\n1\ntrue:false\n6\ntrue\na%20b\n1577836800000\n3\n12\n"
);

behavior!(
    preserves_generators_async_and_eval,
    r#"function* nums() { yield 1; yield 2; }
       console.log([...nums()].join(""));
       const value = await Promise.resolve(5);
       console.log(value);
       console.log(eval("1+2"));"#,
    "12\n5\n3\n"
);

behavior!(
    preserves_arguments_and_new_target,
    r#"function pair() { return arguments[0] + arguments[1]; }
       function F() { console.log(new.target === F); }
       console.log(pair(2, 3));
       new F();
       F();"#,
    "5\ntrue\nfalse\n"
);

behavior!(
    preserves_typeof_instanceof_void_and_comma,
    r#"let n = 0;
       console.log(typeof 1);
       console.log(typeof missingName);
       console.log([] instanceof Array);
       console.log((() => {}) instanceof Function);
       console.log("a" in { a: 1 });
       console.log(void (n = 3));
       console.log(n);
       console.log((n = 4, n + 1));"#,
    "number\nundefined\ntrue\ntrue\ntrue\nundefined\n3\n5\n"
);

behavior!(
    preserves_exports,
    r#"export function add(a, b) { return a + b; }
       export const value = 4;
       export default function identity(n) { return n; }
       console.log(add(1, 2) + value);"#,
    "7\n"
);

behavior!(
    preserves_for_of_and_for_in,
    r#"let n = 0;
       for (const x of [1, 2, 3]) n += x;
       let keys = "";
       for (const key in { a: 1, b: 2 }) keys += key;
       console.log(n + keys);"#,
    "6ab\n"
);

behavior_cjs!(
    keeps_commonjs_module_exports,
    r#"module.exports = { n: 21 * 2 };
       console.log(module.exports.n);"#,
    "42\n"
);

behavior_cjs!(
    keeps_the_exports_binding,
    "exports.answer = 7;\nconsole.log(exports.answer);\n",
    "7\n"
);

behavior_cjs!(
    keeps_require_and_file_paths,
    r#"const fs = require("fs");
       console.log(typeof fs.readFileSync);
       console.log(typeof __dirname === "string" && typeof __filename === "string");"#,
    "function\ntrue\n"
);

behavior_cjs!(
    keeps_sloppy_mode_assignment,
    r#"undeclared = 3;
       console.log(undeclared);"#,
    "3\n"
);

fn assert_folded(source: &str, expected: &str, absent: &[&str]) {
    assert_eq!(run(source), expected, "original diverged\n{source}");
    let code = minify(source, true, None).unwrap().code;
    assert_eq!(run(&code), expected, "minified diverged\n{code}");
    for marker in absent {
        assert!(!code.contains(marker), "{marker} remains in {code}");
    }
}

fn assert_folded_cjs(source: &str, expected: &str, absent: &[&str]) {
    assert_eq!(
        run_as(source, "cjs"),
        expected,
        "original diverged\n{source}"
    );
    let code = minify(source, false, None).unwrap().code;
    assert_eq!(run_as(&code, "cjs"), expected, "minified diverged\n{code}");
    for marker in absent {
        assert!(!code.contains(marker), "{marker} remains in {code}");
    }
}

#[test]
fn folds_json_parse_into_property_reads() {
    assert_folded(
        r#"console.log(JSON.parse('{"name":"Ada","n":2}').name + JSON.parse('{"name":"Ada","n":2}').n);"#,
        "Ada2\n",
        &["JSON.parse", "name"],
    );
}

#[test]
fn folds_json_parse_preserves_key_order() {
    assert_folded(
        r#"console.log(Object.keys(JSON.parse('{"b":1,"a":2}')).join(""));"#,
        "ba\n",
        &["JSON.parse"],
    );
}

#[test]
fn folds_json_parse_duplicate_key_keeps_the_last_value() {
    assert_folded(
        r#"const obj = JSON.parse('{"a":1,"b":2,"a":3}');
           console.log(Object.keys(obj).join("") + obj.a);"#,
        "ab3\n",
        &["JSON.parse"],
    );
}

#[test]
fn folds_json_parse_array_index_and_nested_property() {
    assert_folded(
        r#"console.log(JSON.parse("[10,20]")[1]);
           console.log(JSON.parse('[{"n":2}]')[0].n);"#,
        "20\n2\n",
        &["JSON.parse"],
    );
}

#[test]
fn folds_json_parse_decimal_and_own_constructor() {
    assert_folded(
        r#"console.log(JSON.parse('{"n":1.5}').n);
           console.log(JSON.parse('{"constructor":1}').constructor);"#,
        "1.5\n1\n",
        &["JSON.parse", "constructor"],
    );
}

#[test]
fn leaves_json_parse_with_a_reviver() {
    assert_folded(
        r#"let n = 0;
           const value = JSON.parse("1", function () { n += 1; return 5; });
           console.log(value + ":" + (n > 0));"#,
        "5:true\n",
        &[],
    );
}

#[test]
fn leaves_invalid_json_parse() {
    assert_folded(
        r#"let threw = false;
           try { JSON.parse("{"); } catch (e) { threw = true; }
           console.log(threw);"#,
        "true\n",
        &[],
    );
}

#[test]
fn leaves_json_parse_of_proto_keys() {
    assert_folded(
        r#"const obj = JSON.parse('{"__proto__":{"admin":true}}');
           console.log(Object.getPrototypeOf(obj) === Object.prototype);
           console.log(Object.hasOwn(obj, "__proto__"));
           console.log(obj.admin === undefined);
           const nested = JSON.parse('{"user":{"__proto__":{"admin":true}}}');
           console.log(nested.user.admin === undefined);
           console.log(Object.getPrototypeOf(nested.user) === Object.prototype);"#,
        "true\ntrue\ntrue\ntrue\ntrue\n",
        &[],
    );
}

#[test]
fn leaves_json_parse_when_json_is_shadowed() {
    assert_folded(
        r#"function JSON() {}
           JSON.parse = function () { return { name: "no" }; };
           console.log(JSON.parse('{"name":"Ada"}').name);"#,
        "no\n",
        &[],
    );
}

#[test]
fn leaves_json_parse_inside_with() {
    assert_folded_cjs(
        r#"with ({ JSON: { parse: function () { return { n: 9 }; } } }) {
             console.log(JSON.parse('{"n":2}').n);
           }"#,
        "9\n",
        &[],
    );
}

#[test]
fn leaves_object_prototype_methods() {
    assert_folded(
        r#"console.log(typeof JSON.parse('{"a":1}').toString);
           console.log(({ a: 1 }).toString());"#,
        "function\n[object Object]\n",
        &[],
    );
}

#[test]
fn folds_object_literal_properties() {
    assert_folded(
        r#"console.log(({ answer: 40 + 2 }).answer);
           console.log(({ a: { b: 7 } }).a.b);
           console.log(({ 0: "z" })[0]);
           console.log(({ "a-b": 4 })["a-b"]);
           console.log(({ a: 1, a: 9 }).a);"#,
        "42\n7\nz\n4\n9\n",
        &["answer", "a-b"],
    );
}

#[test]
fn leaves_proto_object_literal_on_the_prototype() {
    assert_folded(
        "console.log(({ __proto__: { admin: true } }).admin);\n",
        "true\n",
        &[],
    );
}

#[test]
fn folds_array_join() {
    assert_folded(
        r#"console.log(["a", "b", "c"].join("-"));
           console.log([1, null, void 0, true].join("|"));
           console.log([1, 2].join());"#,
        "a-b-c\n1|||true\n1,2\n",
        &["join"],
    );
}

#[test]
fn leaves_array_holes_in_join() {
    assert_folded(
        r#"console.log([1,,3].join(","));
           console.log([1].concat([2,,4]).join(","));"#,
        "1,,3\n1,2,,4\n",
        &[],
    );
}

#[test]
fn folds_array_slice_concat_at_and_length() {
    assert_folded(
        r#"console.log([1, 2, 3, 4].slice(1, -1).join(""));
           console.log([1].concat([2, 3], 4).join(""));
           console.log([1, 2, 3].at(-1));
           console.log([1, 2, 3].length);
           console.log([9, 8][1]);
           console.log([9][3] === undefined);
           console.log([9][-1] === undefined);"#,
        "23\n1234\n3\n3\n8\ntrue\ntrue\n",
        &["slice", "concat", ".at"],
    );
}

#[test]
fn folds_array_includes_and_index_of() {
    assert_folded(
        r#"console.log([1, 2, 3].includes(2));
           console.log([1, 2, 3].includes(4));
           console.log([1, 2, 1].indexOf(1));
           console.log(["a", "b"].indexOf("c"));
           console.log([null].includes(null));
           console.log([void 0].indexOf(void 0));"#,
        "true\nfalse\n0\n-1\ntrue\n0\n",
        &["includes", "indexOf"],
    );
}

#[test]
fn leaves_index_of_from_index_and_extra_join_argument() {
    assert_folded(
        r#"let n = 0;
           console.log([1, 2, 1].indexOf(1, 1));
           console.log(["a"].join("-", n += 1));
           console.log(n);"#,
        "2\na\n1\n",
        &[],
    );
}

#[test]
fn folds_string_repeat_pad_split_and_search() {
    assert_folded(
        r#"console.log("ab".repeat(3));
           console.log("ab".repeat(0));
           console.log("é".repeat(2));
           console.log("7".padStart(3, "0"));
           console.log("x".padStart(6, "ab"));
           console.log("7".padEnd(3, "0"));
           console.log("x".padEnd(6, "ab"));
           console.log("a,b,c".split(",").join("|"));
           console.log("ab".split("").join("|"));
           console.log("a,b,c".split(",", 2).join(""));
           console.log("a🙂b".split("🙂").join(","));
           console.log("Hello".endsWith("lo"));
           console.log("Hello".includes("x"));
           console.log("é".endsWith("é"));"#,
        "ababab\n\néé\n007\nababax\n700\nxababa\na|b|c\na|b\nab\na,b\ntrue\nfalse\ntrue\n",
        &[
            "repeat", "padStart", "padEnd", "split", "endsWith", "includes",
        ],
    );
}

#[test]
fn leaves_string_search_positions_and_negative_repeat() {
    assert_folded(
        r#"console.log("hello".endsWith("ell", 4));
           console.log("hello".includes("h", 1));
           console.log("a".repeat(1.5));
           let threw = false;
           try { "ab".repeat(-1); } catch (e) { threw = true; }
           console.log(threw);"#,
        "true\nfalse\na\ntrue\n",
        &[],
    );
}

#[test]
fn folds_string_at_index_and_length() {
    assert_folded(
        r#"console.log("abc".at(-1));
           console.log("abc"[1]);
           console.log("abc"["0"]);
           console.log("abc".length);
           console.log("🙂".length);
           console.log("héllo".length);
           console.log("abc"[5] === undefined);
           console.log("abc"[-1] === undefined);"#,
        "c\nb\na\n3\n2\n5\ntrue\ntrue\n",
        &[".at", ".length"],
    );
}

#[test]
fn leaves_non_ascii_indexes_and_empty_splits() {
    assert_folded(
        r#"console.log("🙂".at(0) === "🙂");
           console.log("🙂".split("").length);
           console.log(["a", "b"][1.5] === undefined);"#,
        "false\n2\ntrue\n",
        &[],
    );
}

#[test]
fn folds_templates_of_string_parts() {
    assert_folded(
        r#"console.log(`pre${"mid"}post`);
           console.log(`${"a"}${"b"}`);
           console.log(`line
           break`);"#,
        "premidpost\nab\nline\n           break\n",
        &[],
    );
}

#[test]
fn folded_string_template_drops_the_substitution() {
    let source = r#"console.log(`pre${"mid"}post`);"#;
    let code = minify(source, true, None).unwrap().code;
    assert!(!code.contains("${"), "{code}");
    assert_eq!(run(&code), "premidpost\n");
}

#[test]
fn folds_safe_integer_arithmetic_and_concatenation() {
    assert_folded(
        r#"console.log(8 / 2);
           console.log(10 / -2);
           console.log((-10) / -2);
           console.log(7 % 3);
           console.log(-5 % 2);
           console.log(20 + 22);
           console.log(1 + "2" + 3);
           console.log(null + "a");
           console.log(true + "1");
           console.log(true + 1);
           console.log(null + 4);
           console.log(9 / 2);"#,
        "4\n-5\n5\n1\n-1\n42\n123\nnulla\ntrue1\n2\n4\n4.5\n",
        &[],
    );
}

#[test]
fn esm_uses_const_for_bindings_that_are_never_written() {
    let source = r#"
        var label = { text: "ok" };
        function read() { return label.text; }
        console.log(read());
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(has_keyword(&code, "const"), "{code}");
    assert!(!has_keyword(&code, "var"), "{code}");
    assert_eq!(run(&code), "ok\n", "{code}");
}

#[test]
fn esm_uses_let_for_bindings_that_are_written() {
    let source = r#"
        var extra = 1;
        extra += 1;
        console.log(extra);
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(has_keyword(&code, "let"), "{code}");
    assert!(!has_keyword(&code, "var"), "{code}");
    assert!(!has_keyword(&code, "const"), "{code}");
    assert_eq!(run(&code), "2\n");
}

#[test]
fn esm_pools_repeated_strings_with_const() {
    let source = r#"
        console.log("architecture-detail-token-extra");
        console.log("architecture-detail-token-extra");
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(code.contains("__s"), "{code}");
    assert!(has_keyword(&code, "const"), "{code}");
    assert!(!has_keyword(&code, "var"), "{code}");
    assert_eq!(
        run(&code),
        "architecture-detail-token-extra\narchitecture-detail-token-extra\n"
    );
}

#[test]
fn esm_keeps_var_when_a_binding_is_used_before_initialization() {
    let source = r#"
        console.log(value);
        var value = 1;
        console.log(value);
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(has_keyword(&code, "var"), "{code}");
    assert_eq!(run(&code), "undefined\n1\n", "{code}");
}

#[test]
fn esm_keeps_var_when_a_hoisted_function_runs_before_initialization() {
    let source = r#"
        console.log(read());
        var value = 1;
        function read() { return value; }
        console.log(read());
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(has_keyword(&code, "var"), "{code}");
    assert_eq!(run(&code), "undefined\n1\n", "{code}");
}

#[test]
fn esm_keeps_var_for_loop_closures() {
    let source = r#"
        const vars = [];
        for (var i = 0; i < 3; i++) vars.push(() => i);
        console.log(vars.map((fn) => fn()).join(","));
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(
        code.contains("for(var") || code.contains("for (var"),
        "{code}"
    );
    assert_eq!(run(&code), "3,3,3\n", "{code}");
}

#[test]
fn esm_keeps_var_declared_inside_a_nested_block() {
    let source = r#"
        function read(flag) {
          var outside = flag;
          if (flag) {
            var inside = 2;
          }
          return outside + inside;
        }
        console.log(read(1));
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert_eq!(run(&code), "3\n", "{code}");
}

#[test]
fn esm_keeps_var_in_a_switch_so_later_cases_can_read_it() {
    let source = r#"
        function read(n) {
          switch (n) {
            case 1:
              var value = 2;
              break;
            default:
              return value;
          }
          return value;
        }
        console.log(read(0) + ":" + read(1));
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert_eq!(run(&code), "undefined:2\n", "{code}");
}

#[test]
fn esm_keeps_var_when_direct_eval_can_assign_it() {
    let source = r#"
        var value = 1;
        eval("value = 2");
        console.log(value);
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(has_keyword(&code, "var"), "{code}");
    assert!(!has_keyword(&code, "const"), "{code}");
    assert_eq!(run(&code), "2\n", "{code}");
}

#[test]
fn esm_const_allows_property_writes() {
    let source = r#"
        var box = { n: 1 };
        box.n = 2;
        console.log(box.n);
    "#;
    let code = minify(source, true, None).unwrap().code;
    assert!(has_keyword(&code, "const"), "{code}");
    assert!(!has_keyword(&code, "var"), "{code}");
    assert_eq!(run(&code), "2\n", "{code}");
}

#[test]
fn cjs_keeps_var_declarations() {
    let source = "var value = 1;\neval(\"value = 2\");\nconsole.log(value);\n";
    let code = minify(source, false, None).unwrap().code;
    assert!(has_keyword(&code, "var"), "{code}");
    assert_eq!(run_as(&code, "cjs"), "2\n", "{code}");
}

#[test]
fn folds_chained_literal_methods() {
    assert_folded(
        r#"console.log("a,b".split(",").join("|"));
           console.log(JSON.parse('{"answer":40}').answer + 2);
           console.log([1, 2, 3].slice(1).concat([4]).join(""));"#,
        "a|b\n42\n234\n",
        &["split", "join", "JSON.parse", "slice", "concat", "answer"],
    );
}
