// src/areas/ledger/loader.js
// Dynamic import() of every ledger panel. Each call uses a string literal.
export function loadPanels(id) {
  if (id === 0) return import("../../lazy/ledger/panel-00.js").then((mod) => mod.panel(id));
  if (id === 1) return import("../../lazy/ledger/panel-01.js").then((mod) => mod.panel(id));
  if (id === 2) return import("../../lazy/ledger/panel-02.js").then((mod) => mod.panel(id));
  if (id === 3) return import("../../lazy/ledger/panel-03.js").then((mod) => mod.panel(id));
  if (id === 4) return import("../../lazy/ledger/panel-04.js").then((mod) => mod.panel(id));
  if (id === 5) return import("../../lazy/ledger/panel-05.js").then((mod) => mod.panel(id));
  if (id === 6) return import("../../lazy/ledger/panel-06.js").then((mod) => mod.panel(id));
  if (id === 7) return import("../../lazy/ledger/panel-07.js").then((mod) => mod.panel(id));
  if (id === 8) return import("../../lazy/ledger/panel-08.js").then((mod) => mod.panel(id));
  if (id === 9) return import("../../lazy/ledger/panel-09.js").then((mod) => mod.panel(id));
  if (id === 10) return import("../../lazy/ledger/panel-10.js").then((mod) => mod.panel(id));
  if (id === 11) return import("../../lazy/ledger/panel-11.js").then((mod) => mod.panel(id));
  if (id === 12) return import("../../lazy/ledger/panel-12.js").then((mod) => mod.panel(id));
  if (id === 13) return import("../../lazy/ledger/panel-13.js").then((mod) => mod.panel(id));
  if (id === 14) return import("../../lazy/ledger/panel-14.js").then((mod) => mod.panel(id));
  if (id === 15) return import("../../lazy/ledger/panel-15.js").then((mod) => mod.panel(id));
  if (id === 16) return import("../../lazy/ledger/panel-16.js").then((mod) => mod.panel(id));
  if (id === 17) return import("../../lazy/ledger/panel-17.js").then((mod) => mod.panel(id));
  return import("../../lazy/ledger/panel-00.js").then((mod) => mod.panel(id));
}
export function ledgerLoaderLane0(n) {
  const added = 25 + 1;
  const text = "atlas" + "-ledgerLoaderLane0";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(0);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane1(n) {
  let value = 0;
  try {
    value = 26 + 29;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 0;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane2(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane3(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane4(n) {
  const added = 29 + 5;
  const text = "atlas" + "-ledgerLoaderLane4";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(4);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane5(n) {
  let value = 0;
  try {
    value = 30 + 33;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 4;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane6(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane7(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane8(n) {
  const added = 33 + 9;
  const text = "atlas" + "-ledgerLoaderLane8";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(8);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane9(n) {
  let value = 0;
  try {
    value = 34 + 37;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 1;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane10(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane11(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane12(n) {
  const added = 37 + 13;
  const text = "atlas" + "-ledgerLoaderLane12";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(12);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane13(n) {
  let value = 0;
  try {
    value = 38 + 41;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 5;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane14(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane15(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane16(n) {
  const added = 1 + 17;
  const text = "atlas" + "-ledgerLoaderLane16";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":1}');
  const safe = Number.isInteger(1);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane17(n) {
  let value = 0;
  try {
    value = 42 + 45;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 2;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane18(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane19(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane20(n) {
  const added = 5 + 21;
  const text = "atlas" + "-ledgerLoaderLane20";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(5);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane21(n) {
  let value = 0;
  try {
    value = 46 + 49;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 6;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane22(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane23(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane24(n) {
  const added = 9 + 25;
  const text = "atlas" + "-ledgerLoaderLane24";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(9);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane25(n) {
  let value = 0;
  try {
    value = 0 + 3;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 3;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane26(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane27(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane28(n) {
  const added = 13 + 4;
  const text = "atlas" + "-ledgerLoaderLane28";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(13);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane29(n) {
  let value = 0;
  try {
    value = 4 + 7;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 0;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane30(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane31(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane32(n) {
  const added = 17 + 8;
  const text = "atlas" + "-ledgerLoaderLane32";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(2);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane33(n) {
  let value = 0;
  try {
    value = 8 + 11;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 4;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane34(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane35(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane36(n) {
  const added = 21 + 12;
  const text = "atlas" + "-ledgerLoaderLane36";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":1}');
  const safe = Number.isInteger(6);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane37(n) {
  let value = 0;
  try {
    value = 12 + 15;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 1;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane38(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane39(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane40(n) {
  const added = 25 + 16;
  const text = "atlas" + "-ledgerLoaderLane40";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(10);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane41(n) {
  let value = 0;
  try {
    value = 16 + 19;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 5;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane42(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane43(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane44(n) {
  const added = 29 + 20;
  const text = "atlas" + "-ledgerLoaderLane44";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(14);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane45(n) {
  let value = 0;
  try {
    value = 20 + 23;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 2;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane46(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane47(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane48(n) {
  const added = 33 + 24;
  const text = "atlas" + "-ledgerLoaderLane48";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(3);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane49(n) {
  let value = 0;
  try {
    value = 24 + 27;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 6;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane50(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane51(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane52(n) {
  const added = 37 + 3;
  const text = "atlas" + "-ledgerLoaderLane52";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(7);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane53(n) {
  let value = 0;
  try {
    value = 28 + 31;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 3;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane54(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane55(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane56(n) {
  const added = 1 + 7;
  const text = "atlas" + "-ledgerLoaderLane56";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":1}');
  const safe = Number.isInteger(11);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane57(n) {
  let value = 0;
  try {
    value = 32 + 35;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 0;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane58(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane59(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane60(n) {
  const added = 5 + 11;
  const text = "atlas" + "-ledgerLoaderLane60";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(0);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane61(n) {
  let value = 0;
  try {
    value = 36 + 39;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 4;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane62(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane63(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane64(n) {
  const added = 9 + 15;
  const text = "atlas" + "-ledgerLoaderLane64";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(4);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane65(n) {
  let value = 0;
  try {
    value = 40 + 43;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 1;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane66(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane67(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane68(n) {
  const added = 13 + 19;
  const text = "atlas" + "-ledgerLoaderLane68";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(8);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane69(n) {
  let value = 0;
  try {
    value = 44 + 47;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 5;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane70(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane71(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane72(n) {
  const added = 17 + 23;
  const text = "atlas" + "-ledgerLoaderLane72";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(12);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane73(n) {
  let value = 0;
  try {
    value = 48 + 1;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 2;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane74(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane75(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane76(n) {
  const added = 21 + 2;
  const text = "atlas" + "-ledgerLoaderLane76";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":1}');
  const safe = Number.isInteger(1);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane77(n) {
  let value = 0;
  try {
    value = 2 + 5;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 6;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane78(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane79(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane80(n) {
  const added = 25 + 6;
  const text = "atlas" + "-ledgerLoaderLane80";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(5);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane81(n) {
  let value = 0;
  try {
    value = 6 + 9;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 3;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane82(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane83(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane84(n) {
  const added = 29 + 10;
  const text = "atlas" + "-ledgerLoaderLane84";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(9);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane85(n) {
  let value = 0;
  try {
    value = 10 + 13;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 0;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane86(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane87(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane88(n) {
  const added = 33 + 14;
  const text = "atlas" + "-ledgerLoaderLane88";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(13);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane89(n) {
  let value = 0;
  try {
    value = 14 + 17;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 4;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane90(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane91(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane92(n) {
  const added = 37 + 18;
  const text = "atlas" + "-ledgerLoaderLane92";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(2);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane93(n) {
  let value = 0;
  try {
    value = 18 + 21;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 1;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane94(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane95(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane96(n) {
  const added = 1 + 22;
  const text = "atlas" + "-ledgerLoaderLane96";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":1}');
  const safe = Number.isInteger(6);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane97(n) {
  let value = 0;
  try {
    value = 22 + 25;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 5;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane98(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane99(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane100(n) {
  const added = 5 + 1;
  const text = "atlas" + "-ledgerLoaderLane100";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(10);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane101(n) {
  let value = 0;
  try {
    value = 26 + 29;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 2;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane102(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane103(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane104(n) {
  const added = 9 + 5;
  const text = "atlas" + "-ledgerLoaderLane104";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(14);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane105(n) {
  let value = 0;
  try {
    value = 30 + 33;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 6;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane106(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane107(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane108(n) {
  const added = 13 + 9;
  const text = "atlas" + "-ledgerLoaderLane108";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(3);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane109(n) {
  let value = 0;
  try {
    value = 34 + 37;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 3;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane110(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane111(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane112(n) {
  const added = 17 + 13;
  const text = "atlas" + "-ledgerLoaderLane112";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(7);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane113(n) {
  let value = 0;
  try {
    value = 38 + 41;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 0;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane114(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane115(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane116(n) {
  const added = 21 + 17;
  const text = "atlas" + "-ledgerLoaderLane116";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":1}');
  const safe = Number.isInteger(11);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane117(n) {
  let value = 0;
  try {
    value = 42 + 45;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 4;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane118(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane119(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane120(n) {
  const added = 25 + 21;
  const text = "atlas" + "-ledgerLoaderLane120";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(0);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane121(n) {
  let value = 0;
  try {
    value = 46 + 49;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 1;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane122(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane123(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane124(n) {
  const added = 29 + 25;
  const text = "atlas" + "-ledgerLoaderLane124";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(4);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane125(n) {
  let value = 0;
  try {
    value = 0 + 3;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 5;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane126(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane127(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane128(n) {
  const added = 33 + 4;
  const text = "atlas" + "-ledgerLoaderLane128";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(8);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane129(n) {
  let value = 0;
  try {
    value = 4 + 7;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 2;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane130(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane131(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane132(n) {
  const added = 37 + 8;
  const text = "atlas" + "-ledgerLoaderLane132";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(12);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane133(n) {
  let value = 0;
  try {
    value = 8 + 11;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 6;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane134(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane135(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane136(n) {
  const added = 1 + 12;
  const text = "atlas" + "-ledgerLoaderLane136";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":1}');
  const safe = Number.isInteger(1);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane137(n) {
  let value = 0;
  try {
    value = 12 + 15;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 3;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane138(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane139(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane140(n) {
  const added = 5 + 16;
  const text = "atlas" + "-ledgerLoaderLane140";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(5);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane141(n) {
  let value = 0;
  try {
    value = 16 + 19;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 0;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane142(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane143(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane144(n) {
  const added = 9 + 20;
  const text = "atlas" + "-ledgerLoaderLane144";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(9);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane145(n) {
  let value = 0;
  try {
    value = 20 + 23;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 4;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane146(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane147(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane148(n) {
  const added = 13 + 24;
  const text = "atlas" + "-ledgerLoaderLane148";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(13);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane149(n) {
  let value = 0;
  try {
    value = 24 + 27;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 1;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane150(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane151(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane152(n) {
  const added = 17 + 3;
  const text = "atlas" + "-ledgerLoaderLane152";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(2);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane153(n) {
  let value = 0;
  try {
    value = 28 + 31;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 5;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane154(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane155(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane156(n) {
  const added = 21 + 7;
  const text = "atlas" + "-ledgerLoaderLane156";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":1}');
  const safe = Number.isInteger(6);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane157(n) {
  let value = 0;
  try {
    value = 32 + 35;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 2;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane158(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane159(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane160(n) {
  const added = 25 + 11;
  const text = "atlas" + "-ledgerLoaderLane160";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(10);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane161(n) {
  let value = 0;
  try {
    value = 36 + 39;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 6;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane162(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane163(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane164(n) {
  const added = 29 + 15;
  const text = "atlas" + "-ledgerLoaderLane164";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(14);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane165(n) {
  let value = 0;
  try {
    value = 40 + 43;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 3;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane166(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane167(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane168(n) {
  const added = 33 + 19;
  const text = "atlas" + "-ledgerLoaderLane168";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(3);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane169(n) {
  let value = 0;
  try {
    value = 44 + 47;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 0;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane170(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane171(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane172(n) {
  const added = 37 + 23;
  const text = "atlas" + "-ledgerLoaderLane172";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(7);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane173(n) {
  let value = 0;
  try {
    value = 48 + 1;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 4;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane174(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane175(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane176(n) {
  const added = 1 + 2;
  const text = "atlas" + "-ledgerLoaderLane176";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":1}');
  const safe = Number.isInteger(11);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane177(n) {
  let value = 0;
  try {
    value = 2 + 5;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 1;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane178(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane179(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane180(n) {
  const added = 5 + 6;
  const text = "atlas" + "-ledgerLoaderLane180";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(0);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane181(n) {
  let value = 0;
  try {
    value = 6 + 9;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 5;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane182(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane183(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane184(n) {
  const added = 9 + 10;
  const text = "atlas" + "-ledgerLoaderLane184";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(4);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane185(n) {
  let value = 0;
  try {
    value = 10 + 13;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 2;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane186(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane187(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane188(n) {
  const added = 13 + 14;
  const text = "atlas" + "-ledgerLoaderLane188";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(8);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane189(n) {
  let value = 0;
  try {
    value = 14 + 17;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 6;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane190(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane191(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane192(n) {
  const added = 17 + 18;
  const text = "atlas" + "-ledgerLoaderLane192";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(12);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane193(n) {
  let value = 0;
  try {
    value = 18 + 21;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 3;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane194(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane195(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane196(n) {
  const added = 21 + 22;
  const text = "atlas" + "-ledgerLoaderLane196";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":1}');
  const safe = Number.isInteger(1);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane197(n) {
  let value = 0;
  try {
    value = 22 + 25;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 0;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane198(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane199(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane200(n) {
  const added = 25 + 1;
  const text = "atlas" + "-ledgerLoaderLane200";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(5);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane201(n) {
  let value = 0;
  try {
    value = 26 + 29;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 4;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane202(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane203(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane204(n) {
  const added = 29 + 5;
  const text = "atlas" + "-ledgerLoaderLane204";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(9);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane205(n) {
  let value = 0;
  try {
    value = 30 + 33;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 1;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane206(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane207(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane208(n) {
  const added = 33 + 9;
  const text = "atlas" + "-ledgerLoaderLane208";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(13);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane209(n) {
  let value = 0;
  try {
    value = 34 + 37;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 5;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane210(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane211(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane212(n) {
  const added = 37 + 13;
  const text = "atlas" + "-ledgerLoaderLane212";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(2);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane213(n) {
  let value = 0;
  try {
    value = 38 + 41;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 2;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane214(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane215(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane216(n) {
  const added = 1 + 17;
  const text = "atlas" + "-ledgerLoaderLane216";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":1}');
  const safe = Number.isInteger(6);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane217(n) {
  let value = 0;
  try {
    value = 42 + 45;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 6;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane218(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane219(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane220(n) {
  const added = 5 + 21;
  const text = "atlas" + "-ledgerLoaderLane220";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":5}');
  const safe = Number.isInteger(10);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane221(n) {
  let value = 0;
  try {
    value = 46 + 49;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 3;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane222(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane223(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane224(n) {
  const added = 9 + 25;
  const text = "atlas" + "-ledgerLoaderLane224";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-6);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":9}');
  const safe = Number.isInteger(14);
  const pow = Math.pow(2, 5);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (2, 3, 4);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane225(n) {
  let value = 0;
  try {
    value = 0 + 3;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 0;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane226(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane227(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane228(n) {
  const added = 13 + 4;
  const text = "atlas" + "-ledgerLoaderLane228";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-10);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 5 }).lane;
  const tmpl = `n${2 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":3}');
  const safe = Number.isInteger(3);
  const pow = Math.pow(2, 3);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (0, 1, 2);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 5 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function ledgerLoaderLane229(n) {
  let value = 0;
  try {
    value = 4 + 7;
  } catch (error) {
    value = 0;
  }
  switch (1) {
    case 1:
      value += 4;
      break;
    default:
      value += missing();
  }
  const listed = Array.of(value, value + 1);
  return listed[0] + n;
}
export function ledgerLoaderLane230(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerLoaderLane231(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerLoaderLane232(n) {
  const added = 17 + 8;
  const text = "atlas" + "-ledgerLoaderLane232";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-2);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 1 }).lane;
  const tmpl = `n${2 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":7}');
  const safe = Number.isInteger(7);
  const pow = Math.pow(2, 1);
  const dead = false && missing();
  const kept = true || missing();
  const seq = (1, 2, 3);
  const width = [1, 2, 3].length;
  const mapped = [1, 2].map(function (value) { return value + 1; });
  const roll = Math.random();
  const hole = new Array(1);
  const env = process.env.NODE_ENV === "production" ? 1 : missing();
  const lanes = ATLAS_LANES + 1;
  const nil = null ?? 4;
  const zero = 0 ?? missing();
  const opt = ({ lane: 1 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
const ledgerLoaderLanes = [ledgerLoaderLane0, ledgerLoaderLane1, ledgerLoaderLane2, ledgerLoaderLane3, ledgerLoaderLane4, ledgerLoaderLane5, ledgerLoaderLane6, ledgerLoaderLane7, ledgerLoaderLane8, ledgerLoaderLane9, ledgerLoaderLane10, ledgerLoaderLane11, ledgerLoaderLane12, ledgerLoaderLane13, ledgerLoaderLane14, ledgerLoaderLane15, ledgerLoaderLane16, ledgerLoaderLane17, ledgerLoaderLane18, ledgerLoaderLane19, ledgerLoaderLane20, ledgerLoaderLane21, ledgerLoaderLane22, ledgerLoaderLane23, ledgerLoaderLane24, ledgerLoaderLane25, ledgerLoaderLane26, ledgerLoaderLane27, ledgerLoaderLane28, ledgerLoaderLane29, ledgerLoaderLane30, ledgerLoaderLane31, ledgerLoaderLane32, ledgerLoaderLane33, ledgerLoaderLane34, ledgerLoaderLane35, ledgerLoaderLane36, ledgerLoaderLane37, ledgerLoaderLane38, ledgerLoaderLane39, ledgerLoaderLane40, ledgerLoaderLane41, ledgerLoaderLane42, ledgerLoaderLane43, ledgerLoaderLane44, ledgerLoaderLane45, ledgerLoaderLane46, ledgerLoaderLane47, ledgerLoaderLane48, ledgerLoaderLane49, ledgerLoaderLane50, ledgerLoaderLane51, ledgerLoaderLane52, ledgerLoaderLane53, ledgerLoaderLane54, ledgerLoaderLane55, ledgerLoaderLane56, ledgerLoaderLane57, ledgerLoaderLane58, ledgerLoaderLane59, ledgerLoaderLane60, ledgerLoaderLane61, ledgerLoaderLane62, ledgerLoaderLane63, ledgerLoaderLane64, ledgerLoaderLane65, ledgerLoaderLane66, ledgerLoaderLane67, ledgerLoaderLane68, ledgerLoaderLane69, ledgerLoaderLane70, ledgerLoaderLane71, ledgerLoaderLane72, ledgerLoaderLane73, ledgerLoaderLane74, ledgerLoaderLane75, ledgerLoaderLane76, ledgerLoaderLane77, ledgerLoaderLane78, ledgerLoaderLane79, ledgerLoaderLane80, ledgerLoaderLane81, ledgerLoaderLane82, ledgerLoaderLane83, ledgerLoaderLane84, ledgerLoaderLane85, ledgerLoaderLane86, ledgerLoaderLane87, ledgerLoaderLane88, ledgerLoaderLane89, ledgerLoaderLane90, ledgerLoaderLane91, ledgerLoaderLane92, ledgerLoaderLane93, ledgerLoaderLane94, ledgerLoaderLane95, ledgerLoaderLane96, ledgerLoaderLane97, ledgerLoaderLane98, ledgerLoaderLane99, ledgerLoaderLane100, ledgerLoaderLane101, ledgerLoaderLane102, ledgerLoaderLane103, ledgerLoaderLane104, ledgerLoaderLane105, ledgerLoaderLane106, ledgerLoaderLane107, ledgerLoaderLane108, ledgerLoaderLane109, ledgerLoaderLane110, ledgerLoaderLane111, ledgerLoaderLane112, ledgerLoaderLane113, ledgerLoaderLane114, ledgerLoaderLane115, ledgerLoaderLane116, ledgerLoaderLane117, ledgerLoaderLane118, ledgerLoaderLane119, ledgerLoaderLane120, ledgerLoaderLane121, ledgerLoaderLane122, ledgerLoaderLane123, ledgerLoaderLane124, ledgerLoaderLane125, ledgerLoaderLane126, ledgerLoaderLane127, ledgerLoaderLane128, ledgerLoaderLane129, ledgerLoaderLane130, ledgerLoaderLane131, ledgerLoaderLane132, ledgerLoaderLane133, ledgerLoaderLane134, ledgerLoaderLane135, ledgerLoaderLane136, ledgerLoaderLane137, ledgerLoaderLane138, ledgerLoaderLane139, ledgerLoaderLane140, ledgerLoaderLane141, ledgerLoaderLane142, ledgerLoaderLane143, ledgerLoaderLane144, ledgerLoaderLane145, ledgerLoaderLane146, ledgerLoaderLane147, ledgerLoaderLane148, ledgerLoaderLane149, ledgerLoaderLane150, ledgerLoaderLane151, ledgerLoaderLane152, ledgerLoaderLane153, ledgerLoaderLane154, ledgerLoaderLane155, ledgerLoaderLane156, ledgerLoaderLane157, ledgerLoaderLane158, ledgerLoaderLane159, ledgerLoaderLane160, ledgerLoaderLane161, ledgerLoaderLane162, ledgerLoaderLane163, ledgerLoaderLane164, ledgerLoaderLane165, ledgerLoaderLane166, ledgerLoaderLane167, ledgerLoaderLane168, ledgerLoaderLane169, ledgerLoaderLane170, ledgerLoaderLane171, ledgerLoaderLane172, ledgerLoaderLane173, ledgerLoaderLane174, ledgerLoaderLane175, ledgerLoaderLane176, ledgerLoaderLane177, ledgerLoaderLane178, ledgerLoaderLane179, ledgerLoaderLane180, ledgerLoaderLane181, ledgerLoaderLane182, ledgerLoaderLane183, ledgerLoaderLane184, ledgerLoaderLane185, ledgerLoaderLane186, ledgerLoaderLane187, ledgerLoaderLane188, ledgerLoaderLane189, ledgerLoaderLane190, ledgerLoaderLane191, ledgerLoaderLane192, ledgerLoaderLane193, ledgerLoaderLane194, ledgerLoaderLane195, ledgerLoaderLane196, ledgerLoaderLane197, ledgerLoaderLane198, ledgerLoaderLane199, ledgerLoaderLane200, ledgerLoaderLane201, ledgerLoaderLane202, ledgerLoaderLane203, ledgerLoaderLane204, ledgerLoaderLane205, ledgerLoaderLane206, ledgerLoaderLane207, ledgerLoaderLane208, ledgerLoaderLane209, ledgerLoaderLane210, ledgerLoaderLane211, ledgerLoaderLane212, ledgerLoaderLane213, ledgerLoaderLane214, ledgerLoaderLane215, ledgerLoaderLane216, ledgerLoaderLane217, ledgerLoaderLane218, ledgerLoaderLane219, ledgerLoaderLane220, ledgerLoaderLane221, ledgerLoaderLane222, ledgerLoaderLane223, ledgerLoaderLane224, ledgerLoaderLane225, ledgerLoaderLane226, ledgerLoaderLane227, ledgerLoaderLane228, ledgerLoaderLane229, ledgerLoaderLane230, ledgerLoaderLane231, ledgerLoaderLane232];
export function collect(n) {
  let total = 0;
  for (const lane of ledgerLoaderLanes) total += lane(n);
  return total;
}
