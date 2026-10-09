console.log("is number?", Number.isNaN(1));
console.log("FOO", process.env.FOO);
const effects = [];
const effects2 = [];
function mark(name) {
  effects.push(name);
  effects2.push(name);
  return name;
}
const base = 1 + 2 * 3;
const label = "opt" + "-" + base;
const templ = `n${base}!`;
const parsed = JSON.parse('{"n":4,"items":[1,2]}');
const keys = Object.keys({ a: 1, b: 2, a: 3 });
const list = new Array(1, 2, 3);
const sparse = new Array(4);
const empty = new Object();
const abs = Math.abs(Math.min(-2, -8));
const bits = (6 & 3) | (1 << 3);
const root = Math.sqrt(16);
const kind = typeof label;
const flag = Array.isArray(list);
const notArray = Array.isArray(parsed);
const letters = "hi".length;
const chosen = true ? "yes" : mark("dead-ternary");
const skipped = false && mark("dead-and");
const zero = 0 ?? mark("dead-nullish");
const indexed = [9, effects.push("index"), 7][0];
const named = { a: 4, b: effects.push("prop") }.a;
const text = "len";
const dotted = text["length"];
const rolled = Math.random() >= 0;
function emptyValue(x) {
  return x === null || x === undefined;
}
function present(x) {
  return x !== null && x !== void 0;
}
function same(x) {
  return x ?? x;
}
let unused = false;
while (false) unused = mark("while");
for (; false; mark("for-update")) unused = true;
if (false) {
  var hoisted = 1;
  unused = mark("if");
} else if (!0) {
  unused = false;
}
switch (1 + 0) {
  case 0:
    unused = mark("switch");
    break;
  case 1:
    break;
  default:
    unused = mark("default");
}
const hidden = 5;
function readHidden() {
  return hidden;
}
const box = { hidden };
const readLater = () => later;
let tdz = "missing";
try {
  readLater();
  tdz = "called";
} catch (error) {
  tdz = error.name;
}
const later = 8;
function guarded(value) {
  eval("value = value + 1");
  return value + Math.abs(-1);
}
function shadowed(value) {
  function Math(n) {
    return n;
  }
  return Math(value) + (Math.abs ? 0 : 1);
}
console.log(
  [
    base,
    label,
    templ,
    parsed.n,
    parsed.items.join(""),
    keys.join(""),
    list.join("-"),
    sparse.length,
    Object.keys(empty).length,
    abs,
    bits,
    root,
    kind,
    flag,
    notArray,
    letters,
    chosen,
    skipped,
    zero,
    indexed,
    named,
    dotted,
    rolled,
    emptyValue(null),
    emptyValue(0),
    present(0),
    present(undefined),
    same(0),
    String(same(null)),
    String(hoisted),
    // unused,
    readHidden(),
    box.hidden,
    tdz,
    readLater(),
    guarded(2),
    shadowed(3),
    effects.join("+"),
  ].join("|"),
);
