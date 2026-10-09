// src/areas/archive/loader.js
// Dynamic import() of every archive panel. Each call uses a string literal.
export function loadPanels(id) {
  if (id === 0) return import("../../lazy/archive/panel-00.js").then((mod) => mod.panel(id));
  if (id === 1) return import("../../lazy/archive/panel-01.js").then((mod) => mod.panel(id));
  if (id === 2) return import("../../lazy/archive/panel-02.js").then((mod) => mod.panel(id));
  if (id === 3) return import("../../lazy/archive/panel-03.js").then((mod) => mod.panel(id));
  if (id === 4) return import("../../lazy/archive/panel-04.js").then((mod) => mod.panel(id));
  if (id === 5) return import("../../lazy/archive/panel-05.js").then((mod) => mod.panel(id));
  if (id === 6) return import("../../lazy/archive/panel-06.js").then((mod) => mod.panel(id));
  if (id === 7) return import("../../lazy/archive/panel-07.js").then((mod) => mod.panel(id));
  if (id === 8) return import("../../lazy/archive/panel-08.js").then((mod) => mod.panel(id));
  if (id === 9) return import("../../lazy/archive/panel-09.js").then((mod) => mod.panel(id));
  if (id === 10) return import("../../lazy/archive/panel-10.js").then((mod) => mod.panel(id));
  if (id === 11) return import("../../lazy/archive/panel-11.js").then((mod) => mod.panel(id));
  if (id === 12) return import("../../lazy/archive/panel-12.js").then((mod) => mod.panel(id));
  if (id === 13) return import("../../lazy/archive/panel-13.js").then((mod) => mod.panel(id));
  if (id === 14) return import("../../lazy/archive/panel-14.js").then((mod) => mod.panel(id));
  if (id === 15) return import("../../lazy/archive/panel-15.js").then((mod) => mod.panel(id));
  if (id === 16) return import("../../lazy/archive/panel-16.js").then((mod) => mod.panel(id));
  if (id === 17) return import("../../lazy/archive/panel-17.js").then((mod) => mod.panel(id));
  return import("../../lazy/archive/panel-00.js").then((mod) => mod.panel(id));
}
export function archiveLoaderLane0(n) {
  const added = 24 + 25;
  const text = "atlas" + "-archiveLoaderLane0";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":4}');
  const safe = Number.isInteger(14);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane1(n) {
  let value = 0;
  try {
    value = 25 + 28;
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
export function archiveLoaderLane2(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane3(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane4(n) {
  const added = 28 + 4;
  const text = "atlas" + "-archiveLoaderLane4";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":8}');
  const safe = Number.isInteger(3);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane5(n) {
  let value = 0;
  try {
    value = 29 + 32;
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
export function archiveLoaderLane6(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane7(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane8(n) {
  const added = 32 + 8;
  const text = "atlas" + "-archiveLoaderLane8";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":2}');
  const safe = Number.isInteger(7);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane9(n) {
  let value = 0;
  try {
    value = 33 + 36;
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
export function archiveLoaderLane10(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane11(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane12(n) {
  const added = 36 + 12;
  const text = "atlas" + "-archiveLoaderLane12";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":6}');
  const safe = Number.isInteger(11);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane13(n) {
  let value = 0;
  try {
    value = 37 + 40;
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
export function archiveLoaderLane14(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane15(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane16(n) {
  const added = 0 + 16;
  const text = "atlas" + "-archiveLoaderLane16";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":0}');
  const safe = Number.isInteger(0);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane17(n) {
  let value = 0;
  try {
    value = 41 + 44;
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
export function archiveLoaderLane18(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane19(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane20(n) {
  const added = 4 + 20;
  const text = "atlas" + "-archiveLoaderLane20";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":4}');
  const safe = Number.isInteger(4);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane21(n) {
  let value = 0;
  try {
    value = 45 + 48;
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
export function archiveLoaderLane22(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane23(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane24(n) {
  const added = 8 + 24;
  const text = "atlas" + "-archiveLoaderLane24";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":8}');
  const safe = Number.isInteger(8);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane25(n) {
  let value = 0;
  try {
    value = 49 + 2;
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
export function archiveLoaderLane26(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane27(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane28(n) {
  const added = 12 + 3;
  const text = "atlas" + "-archiveLoaderLane28";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":2}');
  const safe = Number.isInteger(12);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane29(n) {
  let value = 0;
  try {
    value = 3 + 6;
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
export function archiveLoaderLane30(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane31(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane32(n) {
  const added = 16 + 7;
  const text = "atlas" + "-archiveLoaderLane32";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":6}');
  const safe = Number.isInteger(1);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane33(n) {
  let value = 0;
  try {
    value = 7 + 10;
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
export function archiveLoaderLane34(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane35(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane36(n) {
  const added = 20 + 11;
  const text = "atlas" + "-archiveLoaderLane36";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":0}');
  const safe = Number.isInteger(5);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane37(n) {
  let value = 0;
  try {
    value = 11 + 14;
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
export function archiveLoaderLane38(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane39(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane40(n) {
  const added = 24 + 15;
  const text = "atlas" + "-archiveLoaderLane40";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":4}');
  const safe = Number.isInteger(9);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane41(n) {
  let value = 0;
  try {
    value = 15 + 18;
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
export function archiveLoaderLane42(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane43(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane44(n) {
  const added = 28 + 19;
  const text = "atlas" + "-archiveLoaderLane44";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":8}');
  const safe = Number.isInteger(13);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane45(n) {
  let value = 0;
  try {
    value = 19 + 22;
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
export function archiveLoaderLane46(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane47(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane48(n) {
  const added = 32 + 23;
  const text = "atlas" + "-archiveLoaderLane48";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":2}');
  const safe = Number.isInteger(2);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane49(n) {
  let value = 0;
  try {
    value = 23 + 26;
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
export function archiveLoaderLane50(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane51(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane52(n) {
  const added = 36 + 2;
  const text = "atlas" + "-archiveLoaderLane52";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":6}');
  const safe = Number.isInteger(6);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane53(n) {
  let value = 0;
  try {
    value = 27 + 30;
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
export function archiveLoaderLane54(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane55(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane56(n) {
  const added = 0 + 6;
  const text = "atlas" + "-archiveLoaderLane56";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":0}');
  const safe = Number.isInteger(10);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane57(n) {
  let value = 0;
  try {
    value = 31 + 34;
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
export function archiveLoaderLane58(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane59(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane60(n) {
  const added = 4 + 10;
  const text = "atlas" + "-archiveLoaderLane60";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":4}');
  const safe = Number.isInteger(14);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane61(n) {
  let value = 0;
  try {
    value = 35 + 38;
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
export function archiveLoaderLane62(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane63(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane64(n) {
  const added = 8 + 14;
  const text = "atlas" + "-archiveLoaderLane64";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":8}');
  const safe = Number.isInteger(3);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane65(n) {
  let value = 0;
  try {
    value = 39 + 42;
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
export function archiveLoaderLane66(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane67(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane68(n) {
  const added = 12 + 18;
  const text = "atlas" + "-archiveLoaderLane68";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":2}');
  const safe = Number.isInteger(7);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane69(n) {
  let value = 0;
  try {
    value = 43 + 46;
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
export function archiveLoaderLane70(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane71(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane72(n) {
  const added = 16 + 22;
  const text = "atlas" + "-archiveLoaderLane72";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":6}');
  const safe = Number.isInteger(11);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane73(n) {
  let value = 0;
  try {
    value = 47 + 0;
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
export function archiveLoaderLane74(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane75(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane76(n) {
  const added = 20 + 1;
  const text = "atlas" + "-archiveLoaderLane76";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":0}');
  const safe = Number.isInteger(0);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane77(n) {
  let value = 0;
  try {
    value = 1 + 4;
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
export function archiveLoaderLane78(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane79(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane80(n) {
  const added = 24 + 5;
  const text = "atlas" + "-archiveLoaderLane80";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":4}');
  const safe = Number.isInteger(4);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane81(n) {
  let value = 0;
  try {
    value = 5 + 8;
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
export function archiveLoaderLane82(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane83(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane84(n) {
  const added = 28 + 9;
  const text = "atlas" + "-archiveLoaderLane84";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":8}');
  const safe = Number.isInteger(8);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane85(n) {
  let value = 0;
  try {
    value = 9 + 12;
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
export function archiveLoaderLane86(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane87(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane88(n) {
  const added = 32 + 13;
  const text = "atlas" + "-archiveLoaderLane88";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":2}');
  const safe = Number.isInteger(12);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane89(n) {
  let value = 0;
  try {
    value = 13 + 16;
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
export function archiveLoaderLane90(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane91(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane92(n) {
  const added = 36 + 17;
  const text = "atlas" + "-archiveLoaderLane92";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":6}');
  const safe = Number.isInteger(1);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane93(n) {
  let value = 0;
  try {
    value = 17 + 20;
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
export function archiveLoaderLane94(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane95(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane96(n) {
  const added = 0 + 21;
  const text = "atlas" + "-archiveLoaderLane96";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":0}');
  const safe = Number.isInteger(5);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane97(n) {
  let value = 0;
  try {
    value = 21 + 24;
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
export function archiveLoaderLane98(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane99(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane100(n) {
  const added = 4 + 25;
  const text = "atlas" + "-archiveLoaderLane100";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":4}');
  const safe = Number.isInteger(9);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane101(n) {
  let value = 0;
  try {
    value = 25 + 28;
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
export function archiveLoaderLane102(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane103(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane104(n) {
  const added = 8 + 4;
  const text = "atlas" + "-archiveLoaderLane104";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":8}');
  const safe = Number.isInteger(13);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane105(n) {
  let value = 0;
  try {
    value = 29 + 32;
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
export function archiveLoaderLane106(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane107(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane108(n) {
  const added = 12 + 8;
  const text = "atlas" + "-archiveLoaderLane108";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":2}');
  const safe = Number.isInteger(2);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane109(n) {
  let value = 0;
  try {
    value = 33 + 36;
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
export function archiveLoaderLane110(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane111(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane112(n) {
  const added = 16 + 12;
  const text = "atlas" + "-archiveLoaderLane112";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":6}');
  const safe = Number.isInteger(6);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane113(n) {
  let value = 0;
  try {
    value = 37 + 40;
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
export function archiveLoaderLane114(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane115(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane116(n) {
  const added = 20 + 16;
  const text = "atlas" + "-archiveLoaderLane116";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":0}');
  const safe = Number.isInteger(10);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane117(n) {
  let value = 0;
  try {
    value = 41 + 44;
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
export function archiveLoaderLane118(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane119(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane120(n) {
  const added = 24 + 20;
  const text = "atlas" + "-archiveLoaderLane120";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":4}');
  const safe = Number.isInteger(14);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane121(n) {
  let value = 0;
  try {
    value = 45 + 48;
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
export function archiveLoaderLane122(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane123(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane124(n) {
  const added = 28 + 24;
  const text = "atlas" + "-archiveLoaderLane124";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":8}');
  const safe = Number.isInteger(3);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane125(n) {
  let value = 0;
  try {
    value = 49 + 2;
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
export function archiveLoaderLane126(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane127(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane128(n) {
  const added = 32 + 3;
  const text = "atlas" + "-archiveLoaderLane128";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":2}');
  const safe = Number.isInteger(7);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane129(n) {
  let value = 0;
  try {
    value = 3 + 6;
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
export function archiveLoaderLane130(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane131(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane132(n) {
  const added = 36 + 7;
  const text = "atlas" + "-archiveLoaderLane132";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":6}');
  const safe = Number.isInteger(11);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane133(n) {
  let value = 0;
  try {
    value = 7 + 10;
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
export function archiveLoaderLane134(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane135(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane136(n) {
  const added = 0 + 11;
  const text = "atlas" + "-archiveLoaderLane136";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":0}');
  const safe = Number.isInteger(0);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane137(n) {
  let value = 0;
  try {
    value = 11 + 14;
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
export function archiveLoaderLane138(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane139(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane140(n) {
  const added = 4 + 15;
  const text = "atlas" + "-archiveLoaderLane140";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":4}');
  const safe = Number.isInteger(4);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane141(n) {
  let value = 0;
  try {
    value = 15 + 18;
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
export function archiveLoaderLane142(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane143(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane144(n) {
  const added = 8 + 19;
  const text = "atlas" + "-archiveLoaderLane144";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":8}');
  const safe = Number.isInteger(8);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane145(n) {
  let value = 0;
  try {
    value = 19 + 22;
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
export function archiveLoaderLane146(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane147(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane148(n) {
  const added = 12 + 23;
  const text = "atlas" + "-archiveLoaderLane148";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":2}');
  const safe = Number.isInteger(12);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane149(n) {
  let value = 0;
  try {
    value = 23 + 26;
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
export function archiveLoaderLane150(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane151(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane152(n) {
  const added = 16 + 2;
  const text = "atlas" + "-archiveLoaderLane152";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":6}');
  const safe = Number.isInteger(1);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane153(n) {
  let value = 0;
  try {
    value = 27 + 30;
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
export function archiveLoaderLane154(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane155(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane156(n) {
  const added = 20 + 6;
  const text = "atlas" + "-archiveLoaderLane156";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":0}');
  const safe = Number.isInteger(5);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane157(n) {
  let value = 0;
  try {
    value = 31 + 34;
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
export function archiveLoaderLane158(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane159(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane160(n) {
  const added = 24 + 10;
  const text = "atlas" + "-archiveLoaderLane160";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":4}');
  const safe = Number.isInteger(9);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane161(n) {
  let value = 0;
  try {
    value = 35 + 38;
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
export function archiveLoaderLane162(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane163(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane164(n) {
  const added = 28 + 14;
  const text = "atlas" + "-archiveLoaderLane164";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":8}');
  const safe = Number.isInteger(13);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane165(n) {
  let value = 0;
  try {
    value = 39 + 42;
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
export function archiveLoaderLane166(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane167(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane168(n) {
  const added = 32 + 18;
  const text = "atlas" + "-archiveLoaderLane168";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":2}');
  const safe = Number.isInteger(2);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane169(n) {
  let value = 0;
  try {
    value = 43 + 46;
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
export function archiveLoaderLane170(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane171(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane172(n) {
  const added = 36 + 22;
  const text = "atlas" + "-archiveLoaderLane172";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":6}');
  const safe = Number.isInteger(6);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane173(n) {
  let value = 0;
  try {
    value = 47 + 0;
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
export function archiveLoaderLane174(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane175(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane176(n) {
  const added = 0 + 1;
  const text = "atlas" + "-archiveLoaderLane176";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":0}');
  const safe = Number.isInteger(10);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane177(n) {
  let value = 0;
  try {
    value = 1 + 4;
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
export function archiveLoaderLane178(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane179(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane180(n) {
  const added = 4 + 5;
  const text = "atlas" + "-archiveLoaderLane180";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":4}');
  const safe = Number.isInteger(14);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane181(n) {
  let value = 0;
  try {
    value = 5 + 8;
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
export function archiveLoaderLane182(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane183(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane184(n) {
  const added = 8 + 9;
  const text = "atlas" + "-archiveLoaderLane184";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":8}');
  const safe = Number.isInteger(3);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane185(n) {
  let value = 0;
  try {
    value = 9 + 12;
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
export function archiveLoaderLane186(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane187(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane188(n) {
  const added = 12 + 13;
  const text = "atlas" + "-archiveLoaderLane188";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":2}');
  const safe = Number.isInteger(7);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane189(n) {
  let value = 0;
  try {
    value = 13 + 16;
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
export function archiveLoaderLane190(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane191(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane192(n) {
  const added = 16 + 17;
  const text = "atlas" + "-archiveLoaderLane192";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":6}');
  const safe = Number.isInteger(11);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane193(n) {
  let value = 0;
  try {
    value = 17 + 20;
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
export function archiveLoaderLane194(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane195(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane196(n) {
  const added = 20 + 21;
  const text = "atlas" + "-archiveLoaderLane196";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-1);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 1}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":0}');
  const safe = Number.isInteger(0);
  const pow = Math.pow(2, 0);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane197(n) {
  let value = 0;
  try {
    value = 21 + 24;
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
export function archiveLoaderLane198(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane199(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane200(n) {
  const added = 24 + 25;
  const text = "atlas" + "-archiveLoaderLane200";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-5);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 0 }).lane;
  const tmpl = `n${1 + 2}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":4}');
  const safe = Number.isInteger(4);
  const pow = Math.pow(2, 4);
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
  const opt = ({ lane: 0 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function archiveLoaderLane201(n) {
  let value = 0;
  try {
    value = 25 + 28;
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
export function archiveLoaderLane202(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveLoaderLane203(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveLoaderLane204(n) {
  const added = 28 + 4;
  const text = "atlas" + "-archiveLoaderLane204";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-9);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 4 }).lane;
  const tmpl = `n${1 + 3}`;
  const kind = typeof [];
  const parsed = JSON.parse('{"ok":true,"n":8}');
  const safe = Number.isInteger(8);
  const pow = Math.pow(2, 2);
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
  const opt = ({ lane: 4 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
const archiveLoaderLanes = [archiveLoaderLane0, archiveLoaderLane1, archiveLoaderLane2, archiveLoaderLane3, archiveLoaderLane4, archiveLoaderLane5, archiveLoaderLane6, archiveLoaderLane7, archiveLoaderLane8, archiveLoaderLane9, archiveLoaderLane10, archiveLoaderLane11, archiveLoaderLane12, archiveLoaderLane13, archiveLoaderLane14, archiveLoaderLane15, archiveLoaderLane16, archiveLoaderLane17, archiveLoaderLane18, archiveLoaderLane19, archiveLoaderLane20, archiveLoaderLane21, archiveLoaderLane22, archiveLoaderLane23, archiveLoaderLane24, archiveLoaderLane25, archiveLoaderLane26, archiveLoaderLane27, archiveLoaderLane28, archiveLoaderLane29, archiveLoaderLane30, archiveLoaderLane31, archiveLoaderLane32, archiveLoaderLane33, archiveLoaderLane34, archiveLoaderLane35, archiveLoaderLane36, archiveLoaderLane37, archiveLoaderLane38, archiveLoaderLane39, archiveLoaderLane40, archiveLoaderLane41, archiveLoaderLane42, archiveLoaderLane43, archiveLoaderLane44, archiveLoaderLane45, archiveLoaderLane46, archiveLoaderLane47, archiveLoaderLane48, archiveLoaderLane49, archiveLoaderLane50, archiveLoaderLane51, archiveLoaderLane52, archiveLoaderLane53, archiveLoaderLane54, archiveLoaderLane55, archiveLoaderLane56, archiveLoaderLane57, archiveLoaderLane58, archiveLoaderLane59, archiveLoaderLane60, archiveLoaderLane61, archiveLoaderLane62, archiveLoaderLane63, archiveLoaderLane64, archiveLoaderLane65, archiveLoaderLane66, archiveLoaderLane67, archiveLoaderLane68, archiveLoaderLane69, archiveLoaderLane70, archiveLoaderLane71, archiveLoaderLane72, archiveLoaderLane73, archiveLoaderLane74, archiveLoaderLane75, archiveLoaderLane76, archiveLoaderLane77, archiveLoaderLane78, archiveLoaderLane79, archiveLoaderLane80, archiveLoaderLane81, archiveLoaderLane82, archiveLoaderLane83, archiveLoaderLane84, archiveLoaderLane85, archiveLoaderLane86, archiveLoaderLane87, archiveLoaderLane88, archiveLoaderLane89, archiveLoaderLane90, archiveLoaderLane91, archiveLoaderLane92, archiveLoaderLane93, archiveLoaderLane94, archiveLoaderLane95, archiveLoaderLane96, archiveLoaderLane97, archiveLoaderLane98, archiveLoaderLane99, archiveLoaderLane100, archiveLoaderLane101, archiveLoaderLane102, archiveLoaderLane103, archiveLoaderLane104, archiveLoaderLane105, archiveLoaderLane106, archiveLoaderLane107, archiveLoaderLane108, archiveLoaderLane109, archiveLoaderLane110, archiveLoaderLane111, archiveLoaderLane112, archiveLoaderLane113, archiveLoaderLane114, archiveLoaderLane115, archiveLoaderLane116, archiveLoaderLane117, archiveLoaderLane118, archiveLoaderLane119, archiveLoaderLane120, archiveLoaderLane121, archiveLoaderLane122, archiveLoaderLane123, archiveLoaderLane124, archiveLoaderLane125, archiveLoaderLane126, archiveLoaderLane127, archiveLoaderLane128, archiveLoaderLane129, archiveLoaderLane130, archiveLoaderLane131, archiveLoaderLane132, archiveLoaderLane133, archiveLoaderLane134, archiveLoaderLane135, archiveLoaderLane136, archiveLoaderLane137, archiveLoaderLane138, archiveLoaderLane139, archiveLoaderLane140, archiveLoaderLane141, archiveLoaderLane142, archiveLoaderLane143, archiveLoaderLane144, archiveLoaderLane145, archiveLoaderLane146, archiveLoaderLane147, archiveLoaderLane148, archiveLoaderLane149, archiveLoaderLane150, archiveLoaderLane151, archiveLoaderLane152, archiveLoaderLane153, archiveLoaderLane154, archiveLoaderLane155, archiveLoaderLane156, archiveLoaderLane157, archiveLoaderLane158, archiveLoaderLane159, archiveLoaderLane160, archiveLoaderLane161, archiveLoaderLane162, archiveLoaderLane163, archiveLoaderLane164, archiveLoaderLane165, archiveLoaderLane166, archiveLoaderLane167, archiveLoaderLane168, archiveLoaderLane169, archiveLoaderLane170, archiveLoaderLane171, archiveLoaderLane172, archiveLoaderLane173, archiveLoaderLane174, archiveLoaderLane175, archiveLoaderLane176, archiveLoaderLane177, archiveLoaderLane178, archiveLoaderLane179, archiveLoaderLane180, archiveLoaderLane181, archiveLoaderLane182, archiveLoaderLane183, archiveLoaderLane184, archiveLoaderLane185, archiveLoaderLane186, archiveLoaderLane187, archiveLoaderLane188, archiveLoaderLane189, archiveLoaderLane190, archiveLoaderLane191, archiveLoaderLane192, archiveLoaderLane193, archiveLoaderLane194, archiveLoaderLane195, archiveLoaderLane196, archiveLoaderLane197, archiveLoaderLane198, archiveLoaderLane199, archiveLoaderLane200, archiveLoaderLane201, archiveLoaderLane202, archiveLoaderLane203, archiveLoaderLane204];
export function collect(n) {
  let total = 0;
  for (const lane of archiveLoaderLanes) total += lane(n);
  return total;
}
