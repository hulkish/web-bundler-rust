export class FormulaError extends Error {
  constructor(message) {
    super(message);
    this.name = "FormulaError";
  }
}

export function compound(values) {
  if (!Array.isArray(values) || !values.length) {
    return null;
  }
  let factor = 1;
  for (const value of values) {
    if (typeof value !== "number") {
      return null;
    }
    factor *= 1 + value / 100;
  }
  return round((factor - 1) * 100, 2);
}

export function evaluate(source, scope) {
  const tokens = tokenize(source);
  let index = 0;

  function peek() {
    return tokens[index];
  }

  function consume(kind) {
    const token = peek();
    if (!token || token.kind !== kind) {
      throw new FormulaError(`Expected ${kind}`);
    }
    index += 1;
    return token;
  }

  function parseOr() {
    let left = parseAnd();
    while (peek()?.kind === "or") {
      index += 1;
      const right = parseAnd();
      const prior = left;
      left = () => Boolean(prior()) || Boolean(right());
    }
    return left;
  }

  function parseAnd() {
    let left = parseCmp();
    while (peek()?.kind === "and") {
      index += 1;
      const right = parseCmp();
      const prior = left;
      left = () => Boolean(prior()) && Boolean(right());
    }
    return left;
  }

  function parseCmp() {
    const left = parseAdd();
    const token = peek();
    if (!token || !["gt", "lt", "gte", "lte", "eq", "neq"].includes(token.kind)) {
      return left;
    }
    index += 1;
    const right = parseAdd();
    return () => compare(left(), right(), token.kind);
  }

  function parseAdd() {
    let left = parseMul();
    while (peek() && (peek().kind === "plus" || peek().kind === "minus")) {
      const kind = peek().kind;
      index += 1;
      const right = parseMul();
      const prior = left;
      left = () => {
        const a = prior();
        const b = right();
        return kind === "plus" ? num(a) + num(b) : num(a) - num(b);
      };
    }
    return left;
  }

  function parseMul() {
    let left = parseUnary();
    while (peek() && (peek().kind === "star" || peek().kind === "slash")) {
      const kind = peek().kind;
      index += 1;
      const right = parseUnary();
      const prior = left;
      left = () => {
        const a = num(prior());
        const b = num(right());
        if (kind === "slash" && b === 0) {
          return null;
        }
        return kind === "star" ? a * b : a / b;
      };
    }
    return left;
  }

  function parseUnary() {
    if (peek()?.kind === "minus") {
      index += 1;
      const inner = parseUnary();
      return () => -num(inner());
    }
    return parsePrimary();
  }

  function parsePrimary() {
    const token = peek();
    if (!token) {
      throw new FormulaError("Unexpected end of formula");
    }
    if (token.kind === "number") {
      index += 1;
      return () => token.value;
    }
    if (token.kind === "string") {
      index += 1;
      return () => token.value;
    }
    if (token.kind === "lparen") {
      index += 1;
      const inner = parseOr();
      consume("rparen");
      return inner;
    }
    if (token.kind === "ident") {
      index += 1;
      if (peek()?.kind === "lparen") {
        index += 1;
        const args = [];
        if (peek()?.kind !== "rparen") {
          args.push(parseOr());
          while (peek()?.kind === "comma") {
            index += 1;
            args.push(parseOr());
          }
        }
        consume("rparen");
        const name = token.value;
        return () => call(name, args.map((arg) => arg()), scope);
      }
      const name = token.value;
      return () => resolve(name, scope);
    }
    throw new FormulaError(`Unexpected ${token.kind}`);
  }

  const expression = parseOr();
  if (peek()) {
    throw new FormulaError(`Unexpected ${peek().kind}`);
  }
  const value = expression();
  if (typeof value === "number" && !Number.isFinite(value)) {
    return null;
  }
  return value;
}

function tokenize(source) {
  const tokens = [];
  const pattern = /\s+|&&|\|\||>=|<=|==|!=|[+*/()<>,]|-|"[^"]*"|[A-Za-z_][A-Za-z0-9_]*|\d+(?:\.\d+)?/y;
  let cursor = 0;
  while (cursor < source.length) {
    pattern.lastIndex = cursor;
    const match = pattern.exec(source);
    if (!match || match.index !== cursor) {
      throw new FormulaError(`Cannot read "${source.slice(cursor, cursor + 12)}"`);
    }
    const text = match[0];
    cursor = pattern.lastIndex;
    if (/^\s+$/.test(text)) {
      continue;
    }
    tokens.push(tokenFor(text));
  }
  return tokens;
}

function tokenFor(text) {
  if (text === "&&") return { kind: "and" };
  if (text === "||") return { kind: "or" };
  if (text === ">=") return { kind: "gte" };
  if (text === "<=") return { kind: "lte" };
  if (text === "==") return { kind: "eq" };
  if (text === "!=") return { kind: "neq" };
  if (text === ">") return { kind: "gt" };
  if (text === "<") return { kind: "lt" };
  if (text === "+") return { kind: "plus" };
  if (text === "-") return { kind: "minus" };
  if (text === "*") return { kind: "star" };
  if (text === "/") return { kind: "slash" };
  if (text === "(") return { kind: "lparen" };
  if (text === ")") return { kind: "rparen" };
  if (text === ",") return { kind: "comma" };
  if (text.startsWith('"')) return { kind: "string", value: text.slice(1, -1) };
  if (/^\d/.test(text)) return { kind: "number", value: Number(text) };
  return { kind: "ident", value: text };
}

function resolve(name, scope) {
  if (name === "true") return true;
  if (name === "false") return false;
  if (!scope || !(name in scope.row)) {
    throw new FormulaError(`Unknown field ${name}`);
  }
  return scope.row[name];
}

function call(name, args, scope) {
  if (name === "abs") return Math.abs(num(one(args, name)));
  if (name === "min") return Math.min(...args.map(num));
  if (name === "max") return Math.max(...args.map(num));
  if (name === "round") return round(num(args[0]), args.length > 1 ? num(args[1]) : 0);
  if (name === "pct") {
    const whole = num(args[1]);
    if (whole === 0) return null;
    return (num(args[0]) / whole) * 100;
  }
  if (name === "compound") {
    return compound(args.length ? args : scope.row.spark);
  }
  if (name === "lookup") {
    if (!scope.lookup) {
      throw new FormulaError("lookup is unavailable");
    }
    return scope.lookup(String(args[0]), String(args[1]), args[2], String(args[3]));
  }
  throw new FormulaError(`Unknown function ${name}`);
}

function one(args, name) {
  if (args.length !== 1) {
    throw new FormulaError(`${name} expects one argument`);
  }
  return args[0];
}

function num(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new FormulaError("Expected a number");
  }
  return value;
}

function compare(left, right, kind) {
  if (kind === "eq") return left === right;
  if (kind === "neq") return left !== right;
  const a = num(left);
  const b = num(right);
  if (kind === "gt") return a > b;
  if (kind === "lt") return a < b;
  if (kind === "gte") return a >= b;
  return a <= b;
}

function round(value, digits) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

const direct = typeof process !== "undefined" && process.argv[1] && process.argv[1].endsWith("formula.js");
if (direct) {
  const scope = {
    row: { year: 27.4, aug: 3.9, basket: "Energy", spark: [0.8, 21.2, 5.4, 7, -9.7, -2.9, 3.9] },
    lookup(_sheet, _key, _value, field) {
      return field === "year" ? 27.4 : null;
    },
  };
  const checks = [
    ["1+2*3", 7],
    ["year - aug", 23.5],
    ["abs(aug - year)", 23.5],
    ['basket == "Energy" && year > 20', true],
    ["pct(1, 4)", 25],
    ["round(compound(), 1)", round(compound(scope.row.spark), 1)],
    ['lookup("prices", "series", "Gasoline (all types)", "year")', 27.4],
  ];
  for (const [source, expected] of checks) {
    const actual = evaluate(source, scope);
    if (actual !== expected) {
      throw new Error(`${source} => ${actual}, expected ${expected}`);
    }
  }
  console.log("formula ok", compound(scope.row.spark));
}
