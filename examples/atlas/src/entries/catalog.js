// src/entries/catalog.js
// Entry for the catalog desk. Shared modules come from boot.js;
// this desk's own modules come from its area folder.
import { boot } from "../shared/boot.js";
import { collect as area } from "../areas/catalog/index.js";
import { loadPanels } from "../areas/catalog/loader.js";
import { bridge as bridge000 } from "../bridges/bridge-000.js";
import { bridge as bridge001 } from "../bridges/bridge-001.js";
import { bridge as bridge002 } from "../bridges/bridge-002.js";
import { bridge as bridge003 } from "../bridges/bridge-003.js";
import { bridge as bridge004 } from "../bridges/bridge-004.js";
import { bridge as bridge015 } from "../bridges/bridge-015.js";
import { bridge as bridge016 } from "../bridges/bridge-016.js";
import { bridge as bridge017 } from "../bridges/bridge-017.js";
import { bridge as bridge018 } from "../bridges/bridge-018.js";
import { bridge as bridge019 } from "../bridges/bridge-019.js";
import { bridge as bridge030 } from "../bridges/bridge-030.js";
import { bridge as bridge031 } from "../bridges/bridge-031.js";
import { bridge as bridge032 } from "../bridges/bridge-032.js";
import { bridge as bridge033 } from "../bridges/bridge-033.js";
import { bridge as bridge034 } from "../bridges/bridge-034.js";
import { bridge as bridge045 } from "../bridges/bridge-045.js";
import { bridge as bridge046 } from "../bridges/bridge-046.js";
import { bridge as bridge047 } from "../bridges/bridge-047.js";
import { bridge as bridge048 } from "../bridges/bridge-048.js";
import { bridge as bridge049 } from "../bridges/bridge-049.js";
import { bridge as bridge060 } from "../bridges/bridge-060.js";
import { bridge as bridge061 } from "../bridges/bridge-061.js";
import { bridge as bridge062 } from "../bridges/bridge-062.js";
import { bridge as bridge063 } from "../bridges/bridge-063.js";
import { bridge as bridge064 } from "../bridges/bridge-064.js";
import { bridge as bridge075 } from "../bridges/bridge-075.js";
import { bridge as bridge076 } from "../bridges/bridge-076.js";
import { bridge as bridge077 } from "../bridges/bridge-077.js";
export async function main(n) {
  const lazy = await loadPanels(n % 18);
  return boot(n) + area(n) + lazy + bridge000(n) + bridge001(n) + bridge002(n) + bridge003(n) + bridge004(n) + bridge015(n) + bridge016(n) + bridge017(n) + bridge018(n) + bridge019(n) + bridge030(n) + bridge031(n) + bridge032(n) + bridge033(n) + bridge034(n) + bridge045(n) + bridge046(n) + bridge047(n) + bridge048(n) + bridge049(n) + bridge060(n) + bridge061(n) + bridge062(n) + bridge063(n) + bridge064(n) + bridge075(n) + bridge076(n) + bridge077(n);
}
const total = await main(1);
console.log(total);
export function catalogEntryLane0(n) {
  const added = 20 + 1;
  const text = "atlas" + "-catalogEntryLane0";
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
export function catalogEntryLane1(n) {
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
export function catalogEntryLane2(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane3(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane4(n) {
  const added = 24 + 5;
  const text = "atlas" + "-catalogEntryLane4";
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
export function catalogEntryLane5(n) {
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
export function catalogEntryLane6(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane7(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane8(n) {
  const added = 28 + 9;
  const text = "atlas" + "-catalogEntryLane8";
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
export function catalogEntryLane9(n) {
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
export function catalogEntryLane10(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane11(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane12(n) {
  const added = 32 + 13;
  const text = "atlas" + "-catalogEntryLane12";
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
export function catalogEntryLane13(n) {
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
export function catalogEntryLane14(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane15(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane16(n) {
  const added = 36 + 17;
  const text = "atlas" + "-catalogEntryLane16";
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
export function catalogEntryLane17(n) {
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
export function catalogEntryLane18(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane19(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane20(n) {
  const added = 0 + 21;
  const text = "atlas" + "-catalogEntryLane20";
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
export function catalogEntryLane21(n) {
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
export function catalogEntryLane22(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane23(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane24(n) {
  const added = 4 + 25;
  const text = "atlas" + "-catalogEntryLane24";
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
export function catalogEntryLane25(n) {
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
export function catalogEntryLane26(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane27(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane28(n) {
  const added = 8 + 4;
  const text = "atlas" + "-catalogEntryLane28";
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
export function catalogEntryLane29(n) {
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
export function catalogEntryLane30(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane31(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane32(n) {
  const added = 12 + 8;
  const text = "atlas" + "-catalogEntryLane32";
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
export function catalogEntryLane33(n) {
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
export function catalogEntryLane34(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane35(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane36(n) {
  const added = 16 + 12;
  const text = "atlas" + "-catalogEntryLane36";
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
export function catalogEntryLane37(n) {
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
export function catalogEntryLane38(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane39(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane40(n) {
  const added = 20 + 16;
  const text = "atlas" + "-catalogEntryLane40";
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
export function catalogEntryLane41(n) {
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
export function catalogEntryLane42(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane43(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane44(n) {
  const added = 24 + 20;
  const text = "atlas" + "-catalogEntryLane44";
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
export function catalogEntryLane45(n) {
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
export function catalogEntryLane46(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane47(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane48(n) {
  const added = 28 + 24;
  const text = "atlas" + "-catalogEntryLane48";
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
export function catalogEntryLane49(n) {
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
export function catalogEntryLane50(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function catalogEntryLane51(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function catalogEntryLane52(n) {
  const added = 32 + 3;
  const text = "atlas" + "-catalogEntryLane52";
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
const catalogEntryLanes = [catalogEntryLane0, catalogEntryLane1, catalogEntryLane2, catalogEntryLane3, catalogEntryLane4, catalogEntryLane5, catalogEntryLane6, catalogEntryLane7, catalogEntryLane8, catalogEntryLane9, catalogEntryLane10, catalogEntryLane11, catalogEntryLane12, catalogEntryLane13, catalogEntryLane14, catalogEntryLane15, catalogEntryLane16, catalogEntryLane17, catalogEntryLane18, catalogEntryLane19, catalogEntryLane20, catalogEntryLane21, catalogEntryLane22, catalogEntryLane23, catalogEntryLane24, catalogEntryLane25, catalogEntryLane26, catalogEntryLane27, catalogEntryLane28, catalogEntryLane29, catalogEntryLane30, catalogEntryLane31, catalogEntryLane32, catalogEntryLane33, catalogEntryLane34, catalogEntryLane35, catalogEntryLane36, catalogEntryLane37, catalogEntryLane38, catalogEntryLane39, catalogEntryLane40, catalogEntryLane41, catalogEntryLane42, catalogEntryLane43, catalogEntryLane44, catalogEntryLane45, catalogEntryLane46, catalogEntryLane47, catalogEntryLane48, catalogEntryLane49, catalogEntryLane50, catalogEntryLane51, catalogEntryLane52];
export function collect(n) {
  let total = 0;
  for (const lane of catalogEntryLanes) total += lane(n);
  return total;
}
