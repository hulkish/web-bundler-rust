// src/entries/storefront.js
// Entry for the storefront desk. Shared modules come from boot.js;
// this desk's own modules come from its area folder.
import { boot } from "../shared/boot.js";
import { collect as area } from "../areas/storefront/index.js";
import { loadPanels } from "../areas/storefront/loader.js";
import { bridge as bridge001 } from "../bridges/bridge-001.js";
import { bridge as bridge005 } from "../bridges/bridge-005.js";
import { bridge as bridge009 } from "../bridges/bridge-009.js";
import { bridge as bridge010 } from "../bridges/bridge-010.js";
import { bridge as bridge011 } from "../bridges/bridge-011.js";
import { bridge as bridge016 } from "../bridges/bridge-016.js";
import { bridge as bridge020 } from "../bridges/bridge-020.js";
import { bridge as bridge024 } from "../bridges/bridge-024.js";
import { bridge as bridge025 } from "../bridges/bridge-025.js";
import { bridge as bridge026 } from "../bridges/bridge-026.js";
import { bridge as bridge031 } from "../bridges/bridge-031.js";
import { bridge as bridge035 } from "../bridges/bridge-035.js";
import { bridge as bridge039 } from "../bridges/bridge-039.js";
import { bridge as bridge040 } from "../bridges/bridge-040.js";
import { bridge as bridge041 } from "../bridges/bridge-041.js";
import { bridge as bridge046 } from "../bridges/bridge-046.js";
import { bridge as bridge050 } from "../bridges/bridge-050.js";
import { bridge as bridge054 } from "../bridges/bridge-054.js";
import { bridge as bridge055 } from "../bridges/bridge-055.js";
import { bridge as bridge056 } from "../bridges/bridge-056.js";
import { bridge as bridge061 } from "../bridges/bridge-061.js";
import { bridge as bridge065 } from "../bridges/bridge-065.js";
import { bridge as bridge069 } from "../bridges/bridge-069.js";
import { bridge as bridge070 } from "../bridges/bridge-070.js";
import { bridge as bridge071 } from "../bridges/bridge-071.js";
import { bridge as bridge076 } from "../bridges/bridge-076.js";
export async function main(n) {
  const lazy = await loadPanels(n % 18);
  return boot(n) + area(n) + lazy + bridge001(n) + bridge005(n) + bridge009(n) + bridge010(n) + bridge011(n) + bridge016(n) + bridge020(n) + bridge024(n) + bridge025(n) + bridge026(n) + bridge031(n) + bridge035(n) + bridge039(n) + bridge040(n) + bridge041(n) + bridge046(n) + bridge050(n) + bridge054(n) + bridge055(n) + bridge056(n) + bridge061(n) + bridge065(n) + bridge069(n) + bridge070(n) + bridge071(n) + bridge076(n);
}
const total = await main(1);
console.log(total);
export function storefrontEntryLane0(n) {
  const added = 22 + 3;
  const text = "atlas" + "-storefrontEntryLane0";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane1(n) {
  let value = 0;
  try {
    value = 3 + 6;
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
export function storefrontEntryLane2(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane3(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane4(n) {
  const added = 26 + 7;
  const text = "atlas" + "-storefrontEntryLane4";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane5(n) {
  let value = 0;
  try {
    value = 7 + 10;
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
export function storefrontEntryLane6(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane7(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane8(n) {
  const added = 30 + 11;
  const text = "atlas" + "-storefrontEntryLane8";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane9(n) {
  let value = 0;
  try {
    value = 11 + 14;
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
export function storefrontEntryLane10(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane11(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane12(n) {
  const added = 34 + 15;
  const text = "atlas" + "-storefrontEntryLane12";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane13(n) {
  let value = 0;
  try {
    value = 15 + 18;
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
export function storefrontEntryLane14(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane15(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane16(n) {
  const added = 38 + 19;
  const text = "atlas" + "-storefrontEntryLane16";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane17(n) {
  let value = 0;
  try {
    value = 19 + 22;
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
export function storefrontEntryLane18(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane19(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane20(n) {
  const added = 2 + 23;
  const text = "atlas" + "-storefrontEntryLane20";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane21(n) {
  let value = 0;
  try {
    value = 23 + 26;
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
export function storefrontEntryLane22(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane23(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane24(n) {
  const added = 6 + 2;
  const text = "atlas" + "-storefrontEntryLane24";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane25(n) {
  let value = 0;
  try {
    value = 27 + 30;
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
export function storefrontEntryLane26(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane27(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane28(n) {
  const added = 10 + 6;
  const text = "atlas" + "-storefrontEntryLane28";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane29(n) {
  let value = 0;
  try {
    value = 31 + 34;
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
export function storefrontEntryLane30(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane31(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane32(n) {
  const added = 14 + 10;
  const text = "atlas" + "-storefrontEntryLane32";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane33(n) {
  let value = 0;
  try {
    value = 35 + 38;
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
export function storefrontEntryLane34(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane35(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane36(n) {
  const added = 18 + 14;
  const text = "atlas" + "-storefrontEntryLane36";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane37(n) {
  let value = 0;
  try {
    value = 39 + 42;
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
export function storefrontEntryLane38(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane39(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane40(n) {
  const added = 22 + 18;
  const text = "atlas" + "-storefrontEntryLane40";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane41(n) {
  let value = 0;
  try {
    value = 43 + 46;
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
export function storefrontEntryLane42(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane43(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane44(n) {
  const added = 26 + 22;
  const text = "atlas" + "-storefrontEntryLane44";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane45(n) {
  let value = 0;
  try {
    value = 47 + 0;
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
export function storefrontEntryLane46(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane47(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane48(n) {
  const added = 30 + 1;
  const text = "atlas" + "-storefrontEntryLane48";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane49(n) {
  let value = 0;
  try {
    value = 1 + 4;
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
export function storefrontEntryLane50(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane51(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane52(n) {
  const added = 34 + 5;
  const text = "atlas" + "-storefrontEntryLane52";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane53(n) {
  let value = 0;
  try {
    value = 5 + 8;
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
export function storefrontEntryLane54(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane55(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane56(n) {
  const added = 38 + 9;
  const text = "atlas" + "-storefrontEntryLane56";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane57(n) {
  let value = 0;
  try {
    value = 9 + 12;
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
export function storefrontEntryLane58(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane59(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane60(n) {
  const added = 2 + 13;
  const text = "atlas" + "-storefrontEntryLane60";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane61(n) {
  let value = 0;
  try {
    value = 13 + 16;
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
export function storefrontEntryLane62(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane63(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane64(n) {
  const added = 6 + 17;
  const text = "atlas" + "-storefrontEntryLane64";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane65(n) {
  let value = 0;
  try {
    value = 17 + 20;
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
export function storefrontEntryLane66(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane67(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane68(n) {
  const added = 10 + 21;
  const text = "atlas" + "-storefrontEntryLane68";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane69(n) {
  let value = 0;
  try {
    value = 21 + 24;
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
export function storefrontEntryLane70(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane71(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane72(n) {
  const added = 14 + 25;
  const text = "atlas" + "-storefrontEntryLane72";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane73(n) {
  let value = 0;
  try {
    value = 25 + 28;
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
export function storefrontEntryLane74(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane75(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane76(n) {
  const added = 18 + 4;
  const text = "atlas" + "-storefrontEntryLane76";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane77(n) {
  let value = 0;
  try {
    value = 29 + 32;
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
export function storefrontEntryLane78(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane79(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane80(n) {
  const added = 22 + 8;
  const text = "atlas" + "-storefrontEntryLane80";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane81(n) {
  let value = 0;
  try {
    value = 33 + 36;
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
export function storefrontEntryLane82(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane83(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane84(n) {
  const added = 26 + 12;
  const text = "atlas" + "-storefrontEntryLane84";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane85(n) {
  let value = 0;
  try {
    value = 37 + 40;
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
export function storefrontEntryLane86(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane87(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane88(n) {
  const added = 30 + 16;
  const text = "atlas" + "-storefrontEntryLane88";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane89(n) {
  let value = 0;
  try {
    value = 41 + 44;
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
export function storefrontEntryLane90(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane91(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane92(n) {
  const added = 34 + 20;
  const text = "atlas" + "-storefrontEntryLane92";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane93(n) {
  let value = 0;
  try {
    value = 45 + 48;
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
export function storefrontEntryLane94(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane95(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane96(n) {
  const added = 38 + 24;
  const text = "atlas" + "-storefrontEntryLane96";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane97(n) {
  let value = 0;
  try {
    value = 49 + 2;
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
export function storefrontEntryLane98(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane99(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane100(n) {
  const added = 2 + 3;
  const text = "atlas" + "-storefrontEntryLane100";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane101(n) {
  let value = 0;
  try {
    value = 3 + 6;
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
export function storefrontEntryLane102(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane103(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane104(n) {
  const added = 6 + 7;
  const text = "atlas" + "-storefrontEntryLane104";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane105(n) {
  let value = 0;
  try {
    value = 7 + 10;
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
export function storefrontEntryLane106(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane107(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane108(n) {
  const added = 10 + 11;
  const text = "atlas" + "-storefrontEntryLane108";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane109(n) {
  let value = 0;
  try {
    value = 11 + 14;
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
export function storefrontEntryLane110(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane111(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane112(n) {
  const added = 14 + 15;
  const text = "atlas" + "-storefrontEntryLane112";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane113(n) {
  let value = 0;
  try {
    value = 15 + 18;
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
export function storefrontEntryLane114(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane115(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane116(n) {
  const added = 18 + 19;
  const text = "atlas" + "-storefrontEntryLane116";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane117(n) {
  let value = 0;
  try {
    value = 19 + 22;
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
export function storefrontEntryLane118(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane119(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane120(n) {
  const added = 22 + 23;
  const text = "atlas" + "-storefrontEntryLane120";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane121(n) {
  let value = 0;
  try {
    value = 23 + 26;
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
export function storefrontEntryLane122(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane123(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane124(n) {
  const added = 26 + 2;
  const text = "atlas" + "-storefrontEntryLane124";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane125(n) {
  let value = 0;
  try {
    value = 27 + 30;
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
export function storefrontEntryLane126(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane127(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane128(n) {
  const added = 30 + 6;
  const text = "atlas" + "-storefrontEntryLane128";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane129(n) {
  let value = 0;
  try {
    value = 31 + 34;
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
export function storefrontEntryLane130(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane131(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane132(n) {
  const added = 34 + 10;
  const text = "atlas" + "-storefrontEntryLane132";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane133(n) {
  let value = 0;
  try {
    value = 35 + 38;
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
export function storefrontEntryLane134(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane135(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane136(n) {
  const added = 38 + 14;
  const text = "atlas" + "-storefrontEntryLane136";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane137(n) {
  let value = 0;
  try {
    value = 39 + 42;
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
export function storefrontEntryLane138(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane139(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane140(n) {
  const added = 2 + 18;
  const text = "atlas" + "-storefrontEntryLane140";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane141(n) {
  let value = 0;
  try {
    value = 43 + 46;
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
export function storefrontEntryLane142(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane143(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane144(n) {
  const added = 6 + 22;
  const text = "atlas" + "-storefrontEntryLane144";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane145(n) {
  let value = 0;
  try {
    value = 47 + 0;
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
export function storefrontEntryLane146(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane147(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane148(n) {
  const added = 10 + 1;
  const text = "atlas" + "-storefrontEntryLane148";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane149(n) {
  let value = 0;
  try {
    value = 1 + 4;
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
export function storefrontEntryLane150(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane151(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane152(n) {
  const added = 14 + 5;
  const text = "atlas" + "-storefrontEntryLane152";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane153(n) {
  let value = 0;
  try {
    value = 5 + 8;
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
export function storefrontEntryLane154(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane155(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane156(n) {
  const added = 18 + 9;
  const text = "atlas" + "-storefrontEntryLane156";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane157(n) {
  let value = 0;
  try {
    value = 9 + 12;
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
export function storefrontEntryLane158(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane159(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane160(n) {
  const added = 22 + 13;
  const text = "atlas" + "-storefrontEntryLane160";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane161(n) {
  let value = 0;
  try {
    value = 13 + 16;
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
export function storefrontEntryLane162(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane163(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane164(n) {
  const added = 26 + 17;
  const text = "atlas" + "-storefrontEntryLane164";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane165(n) {
  let value = 0;
  try {
    value = 17 + 20;
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
export function storefrontEntryLane166(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane167(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane168(n) {
  const added = 30 + 21;
  const text = "atlas" + "-storefrontEntryLane168";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane169(n) {
  let value = 0;
  try {
    value = 21 + 24;
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
export function storefrontEntryLane170(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane171(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane172(n) {
  const added = 34 + 25;
  const text = "atlas" + "-storefrontEntryLane172";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane173(n) {
  let value = 0;
  try {
    value = 25 + 28;
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
export function storefrontEntryLane174(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane175(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane176(n) {
  const added = 38 + 4;
  const text = "atlas" + "-storefrontEntryLane176";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane177(n) {
  let value = 0;
  try {
    value = 29 + 32;
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
export function storefrontEntryLane178(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane179(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane180(n) {
  const added = 2 + 8;
  const text = "atlas" + "-storefrontEntryLane180";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane181(n) {
  let value = 0;
  try {
    value = 33 + 36;
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
export function storefrontEntryLane182(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane183(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane184(n) {
  const added = 6 + 12;
  const text = "atlas" + "-storefrontEntryLane184";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane185(n) {
  let value = 0;
  try {
    value = 37 + 40;
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
export function storefrontEntryLane186(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane187(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane188(n) {
  const added = 10 + 16;
  const text = "atlas" + "-storefrontEntryLane188";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane189(n) {
  let value = 0;
  try {
    value = 41 + 44;
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
export function storefrontEntryLane190(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane191(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane192(n) {
  const added = 14 + 20;
  const text = "atlas" + "-storefrontEntryLane192";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane193(n) {
  let value = 0;
  try {
    value = 45 + 48;
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
export function storefrontEntryLane194(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane195(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane196(n) {
  const added = 18 + 24;
  const text = "atlas" + "-storefrontEntryLane196";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane197(n) {
  let value = 0;
  try {
    value = 49 + 2;
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
export function storefrontEntryLane198(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane199(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane200(n) {
  const added = 22 + 3;
  const text = "atlas" + "-storefrontEntryLane200";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane201(n) {
  let value = 0;
  try {
    value = 3 + 6;
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
export function storefrontEntryLane202(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane203(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane204(n) {
  const added = 26 + 7;
  const text = "atlas" + "-storefrontEntryLane204";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane205(n) {
  let value = 0;
  try {
    value = 7 + 10;
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
export function storefrontEntryLane206(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane207(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane208(n) {
  const added = 30 + 11;
  const text = "atlas" + "-storefrontEntryLane208";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane209(n) {
  let value = 0;
  try {
    value = 11 + 14;
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
export function storefrontEntryLane210(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane211(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane212(n) {
  const added = 34 + 15;
  const text = "atlas" + "-storefrontEntryLane212";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane213(n) {
  let value = 0;
  try {
    value = 15 + 18;
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
export function storefrontEntryLane214(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane215(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane216(n) {
  const added = 38 + 19;
  const text = "atlas" + "-storefrontEntryLane216";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane217(n) {
  let value = 0;
  try {
    value = 19 + 22;
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
export function storefrontEntryLane218(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane219(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane220(n) {
  const added = 2 + 23;
  const text = "atlas" + "-storefrontEntryLane220";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane221(n) {
  let value = 0;
  try {
    value = 23 + 26;
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
export function storefrontEntryLane222(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane223(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane224(n) {
  const added = 6 + 2;
  const text = "atlas" + "-storefrontEntryLane224";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane225(n) {
  let value = 0;
  try {
    value = 27 + 30;
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
export function storefrontEntryLane226(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane227(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane228(n) {
  const added = 10 + 6;
  const text = "atlas" + "-storefrontEntryLane228";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane229(n) {
  let value = 0;
  try {
    value = 31 + 34;
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
export function storefrontEntryLane230(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane231(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane232(n) {
  const added = 14 + 10;
  const text = "atlas" + "-storefrontEntryLane232";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane233(n) {
  let value = 0;
  try {
    value = 35 + 38;
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
export function storefrontEntryLane234(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane235(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane236(n) {
  const added = 18 + 14;
  const text = "atlas" + "-storefrontEntryLane236";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane237(n) {
  let value = 0;
  try {
    value = 39 + 42;
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
export function storefrontEntryLane238(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane239(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane240(n) {
  const added = 22 + 18;
  const text = "atlas" + "-storefrontEntryLane240";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane241(n) {
  let value = 0;
  try {
    value = 43 + 46;
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
export function storefrontEntryLane242(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane243(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane244(n) {
  const added = 26 + 22;
  const text = "atlas" + "-storefrontEntryLane244";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane245(n) {
  let value = 0;
  try {
    value = 47 + 0;
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
export function storefrontEntryLane246(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane247(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane248(n) {
  const added = 30 + 1;
  const text = "atlas" + "-storefrontEntryLane248";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane249(n) {
  let value = 0;
  try {
    value = 1 + 4;
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
export function storefrontEntryLane250(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane251(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane252(n) {
  const added = 34 + 5;
  const text = "atlas" + "-storefrontEntryLane252";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane253(n) {
  let value = 0;
  try {
    value = 5 + 8;
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
export function storefrontEntryLane254(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane255(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane256(n) {
  const added = 38 + 9;
  const text = "atlas" + "-storefrontEntryLane256";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane257(n) {
  let value = 0;
  try {
    value = 9 + 12;
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
export function storefrontEntryLane258(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane259(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane260(n) {
  const added = 2 + 13;
  const text = "atlas" + "-storefrontEntryLane260";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane261(n) {
  let value = 0;
  try {
    value = 13 + 16;
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
export function storefrontEntryLane262(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane263(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane264(n) {
  const added = 6 + 17;
  const text = "atlas" + "-storefrontEntryLane264";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane265(n) {
  let value = 0;
  try {
    value = 17 + 20;
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
export function storefrontEntryLane266(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane267(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane268(n) {
  const added = 10 + 21;
  const text = "atlas" + "-storefrontEntryLane268";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane269(n) {
  let value = 0;
  try {
    value = 21 + 24;
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
export function storefrontEntryLane270(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane271(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane272(n) {
  const added = 14 + 25;
  const text = "atlas" + "-storefrontEntryLane272";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane273(n) {
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
export function storefrontEntryLane274(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane275(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane276(n) {
  const added = 18 + 4;
  const text = "atlas" + "-storefrontEntryLane276";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane277(n) {
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
export function storefrontEntryLane278(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane279(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane280(n) {
  const added = 22 + 8;
  const text = "atlas" + "-storefrontEntryLane280";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane281(n) {
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
export function storefrontEntryLane282(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane283(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane284(n) {
  const added = 26 + 12;
  const text = "atlas" + "-storefrontEntryLane284";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane285(n) {
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
export function storefrontEntryLane286(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane287(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane288(n) {
  const added = 30 + 16;
  const text = "atlas" + "-storefrontEntryLane288";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane289(n) {
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
export function storefrontEntryLane290(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane291(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane292(n) {
  const added = 34 + 20;
  const text = "atlas" + "-storefrontEntryLane292";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane293(n) {
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
export function storefrontEntryLane294(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane295(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane296(n) {
  const added = 38 + 24;
  const text = "atlas" + "-storefrontEntryLane296";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane297(n) {
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
export function storefrontEntryLane298(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane299(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane300(n) {
  const added = 2 + 3;
  const text = "atlas" + "-storefrontEntryLane300";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane301(n) {
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
export function storefrontEntryLane302(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane303(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane304(n) {
  const added = 6 + 7;
  const text = "atlas" + "-storefrontEntryLane304";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane305(n) {
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
export function storefrontEntryLane306(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane307(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane308(n) {
  const added = 10 + 11;
  const text = "atlas" + "-storefrontEntryLane308";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane309(n) {
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
export function storefrontEntryLane310(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane311(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane312(n) {
  const added = 14 + 15;
  const text = "atlas" + "-storefrontEntryLane312";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane313(n) {
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
export function storefrontEntryLane314(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane315(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane316(n) {
  const added = 18 + 19;
  const text = "atlas" + "-storefrontEntryLane316";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane317(n) {
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
export function storefrontEntryLane318(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane319(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane320(n) {
  const added = 22 + 23;
  const text = "atlas" + "-storefrontEntryLane320";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane321(n) {
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
export function storefrontEntryLane322(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane323(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane324(n) {
  const added = 26 + 2;
  const text = "atlas" + "-storefrontEntryLane324";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane325(n) {
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
export function storefrontEntryLane326(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane327(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane328(n) {
  const added = 30 + 6;
  const text = "atlas" + "-storefrontEntryLane328";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane329(n) {
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
export function storefrontEntryLane330(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane331(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane332(n) {
  const added = 34 + 10;
  const text = "atlas" + "-storefrontEntryLane332";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane333(n) {
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
export function storefrontEntryLane334(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane335(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane336(n) {
  const added = 38 + 14;
  const text = "atlas" + "-storefrontEntryLane336";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane337(n) {
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
export function storefrontEntryLane338(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane339(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane340(n) {
  const added = 2 + 18;
  const text = "atlas" + "-storefrontEntryLane340";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane341(n) {
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
export function storefrontEntryLane342(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane343(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane344(n) {
  const added = 6 + 22;
  const text = "atlas" + "-storefrontEntryLane344";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane345(n) {
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
export function storefrontEntryLane346(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane347(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane348(n) {
  const added = 10 + 1;
  const text = "atlas" + "-storefrontEntryLane348";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane349(n) {
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
export function storefrontEntryLane350(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane351(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane352(n) {
  const added = 14 + 5;
  const text = "atlas" + "-storefrontEntryLane352";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane353(n) {
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
export function storefrontEntryLane354(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane355(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane356(n) {
  const added = 18 + 9;
  const text = "atlas" + "-storefrontEntryLane356";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane357(n) {
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
export function storefrontEntryLane358(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(0);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane359(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane360(n) {
  const added = 22 + 13;
  const text = "atlas" + "-storefrontEntryLane360";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane361(n) {
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
export function storefrontEntryLane362(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(4);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane363(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane364(n) {
  const added = 26 + 17;
  const text = "atlas" + "-storefrontEntryLane364";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-7);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [0, 1, 2][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 1}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane365(n) {
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
export function storefrontEntryLane366(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(8);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane367(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane368(n) {
  const added = 30 + 21;
  const text = "atlas" + "-storefrontEntryLane368";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-11);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [4, 5, 6][1];
  const prop = ({ lane: 6 }).lane;
  const tmpl = `n${3 + 2}`;
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
  const opt = ({ lane: 6 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane369(n) {
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
export function storefrontEntryLane370(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(12);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane371(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function storefrontEntryLane372(n) {
  const added = 34 + 25;
  const text = "atlas" + "-storefrontEntryLane372";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-3);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [2, 3, 4][1];
  const prop = ({ lane: 2 }).lane;
  const tmpl = `n${3 + 3}`;
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
  const opt = ({ lane: 2 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function storefrontEntryLane373(n) {
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
export function storefrontEntryLane374(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(16);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function storefrontEntryLane375(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
const storefrontEntryLanes = [storefrontEntryLane0, storefrontEntryLane1, storefrontEntryLane2, storefrontEntryLane3, storefrontEntryLane4, storefrontEntryLane5, storefrontEntryLane6, storefrontEntryLane7, storefrontEntryLane8, storefrontEntryLane9, storefrontEntryLane10, storefrontEntryLane11, storefrontEntryLane12, storefrontEntryLane13, storefrontEntryLane14, storefrontEntryLane15, storefrontEntryLane16, storefrontEntryLane17, storefrontEntryLane18, storefrontEntryLane19, storefrontEntryLane20, storefrontEntryLane21, storefrontEntryLane22, storefrontEntryLane23, storefrontEntryLane24, storefrontEntryLane25, storefrontEntryLane26, storefrontEntryLane27, storefrontEntryLane28, storefrontEntryLane29, storefrontEntryLane30, storefrontEntryLane31, storefrontEntryLane32, storefrontEntryLane33, storefrontEntryLane34, storefrontEntryLane35, storefrontEntryLane36, storefrontEntryLane37, storefrontEntryLane38, storefrontEntryLane39, storefrontEntryLane40, storefrontEntryLane41, storefrontEntryLane42, storefrontEntryLane43, storefrontEntryLane44, storefrontEntryLane45, storefrontEntryLane46, storefrontEntryLane47, storefrontEntryLane48, storefrontEntryLane49, storefrontEntryLane50, storefrontEntryLane51, storefrontEntryLane52, storefrontEntryLane53, storefrontEntryLane54, storefrontEntryLane55, storefrontEntryLane56, storefrontEntryLane57, storefrontEntryLane58, storefrontEntryLane59, storefrontEntryLane60, storefrontEntryLane61, storefrontEntryLane62, storefrontEntryLane63, storefrontEntryLane64, storefrontEntryLane65, storefrontEntryLane66, storefrontEntryLane67, storefrontEntryLane68, storefrontEntryLane69, storefrontEntryLane70, storefrontEntryLane71, storefrontEntryLane72, storefrontEntryLane73, storefrontEntryLane74, storefrontEntryLane75, storefrontEntryLane76, storefrontEntryLane77, storefrontEntryLane78, storefrontEntryLane79, storefrontEntryLane80, storefrontEntryLane81, storefrontEntryLane82, storefrontEntryLane83, storefrontEntryLane84, storefrontEntryLane85, storefrontEntryLane86, storefrontEntryLane87, storefrontEntryLane88, storefrontEntryLane89, storefrontEntryLane90, storefrontEntryLane91, storefrontEntryLane92, storefrontEntryLane93, storefrontEntryLane94, storefrontEntryLane95, storefrontEntryLane96, storefrontEntryLane97, storefrontEntryLane98, storefrontEntryLane99, storefrontEntryLane100, storefrontEntryLane101, storefrontEntryLane102, storefrontEntryLane103, storefrontEntryLane104, storefrontEntryLane105, storefrontEntryLane106, storefrontEntryLane107, storefrontEntryLane108, storefrontEntryLane109, storefrontEntryLane110, storefrontEntryLane111, storefrontEntryLane112, storefrontEntryLane113, storefrontEntryLane114, storefrontEntryLane115, storefrontEntryLane116, storefrontEntryLane117, storefrontEntryLane118, storefrontEntryLane119, storefrontEntryLane120, storefrontEntryLane121, storefrontEntryLane122, storefrontEntryLane123, storefrontEntryLane124, storefrontEntryLane125, storefrontEntryLane126, storefrontEntryLane127, storefrontEntryLane128, storefrontEntryLane129, storefrontEntryLane130, storefrontEntryLane131, storefrontEntryLane132, storefrontEntryLane133, storefrontEntryLane134, storefrontEntryLane135, storefrontEntryLane136, storefrontEntryLane137, storefrontEntryLane138, storefrontEntryLane139, storefrontEntryLane140, storefrontEntryLane141, storefrontEntryLane142, storefrontEntryLane143, storefrontEntryLane144, storefrontEntryLane145, storefrontEntryLane146, storefrontEntryLane147, storefrontEntryLane148, storefrontEntryLane149, storefrontEntryLane150, storefrontEntryLane151, storefrontEntryLane152, storefrontEntryLane153, storefrontEntryLane154, storefrontEntryLane155, storefrontEntryLane156, storefrontEntryLane157, storefrontEntryLane158, storefrontEntryLane159, storefrontEntryLane160, storefrontEntryLane161, storefrontEntryLane162, storefrontEntryLane163, storefrontEntryLane164, storefrontEntryLane165, storefrontEntryLane166, storefrontEntryLane167, storefrontEntryLane168, storefrontEntryLane169, storefrontEntryLane170, storefrontEntryLane171, storefrontEntryLane172, storefrontEntryLane173, storefrontEntryLane174, storefrontEntryLane175, storefrontEntryLane176, storefrontEntryLane177, storefrontEntryLane178, storefrontEntryLane179, storefrontEntryLane180, storefrontEntryLane181, storefrontEntryLane182, storefrontEntryLane183, storefrontEntryLane184, storefrontEntryLane185, storefrontEntryLane186, storefrontEntryLane187, storefrontEntryLane188, storefrontEntryLane189, storefrontEntryLane190, storefrontEntryLane191, storefrontEntryLane192, storefrontEntryLane193, storefrontEntryLane194, storefrontEntryLane195, storefrontEntryLane196, storefrontEntryLane197, storefrontEntryLane198, storefrontEntryLane199, storefrontEntryLane200, storefrontEntryLane201, storefrontEntryLane202, storefrontEntryLane203, storefrontEntryLane204, storefrontEntryLane205, storefrontEntryLane206, storefrontEntryLane207, storefrontEntryLane208, storefrontEntryLane209, storefrontEntryLane210, storefrontEntryLane211, storefrontEntryLane212, storefrontEntryLane213, storefrontEntryLane214, storefrontEntryLane215, storefrontEntryLane216, storefrontEntryLane217, storefrontEntryLane218, storefrontEntryLane219, storefrontEntryLane220, storefrontEntryLane221, storefrontEntryLane222, storefrontEntryLane223, storefrontEntryLane224, storefrontEntryLane225, storefrontEntryLane226, storefrontEntryLane227, storefrontEntryLane228, storefrontEntryLane229, storefrontEntryLane230, storefrontEntryLane231, storefrontEntryLane232, storefrontEntryLane233, storefrontEntryLane234, storefrontEntryLane235, storefrontEntryLane236, storefrontEntryLane237, storefrontEntryLane238, storefrontEntryLane239, storefrontEntryLane240, storefrontEntryLane241, storefrontEntryLane242, storefrontEntryLane243, storefrontEntryLane244, storefrontEntryLane245, storefrontEntryLane246, storefrontEntryLane247, storefrontEntryLane248, storefrontEntryLane249, storefrontEntryLane250, storefrontEntryLane251, storefrontEntryLane252, storefrontEntryLane253, storefrontEntryLane254, storefrontEntryLane255, storefrontEntryLane256, storefrontEntryLane257, storefrontEntryLane258, storefrontEntryLane259, storefrontEntryLane260, storefrontEntryLane261, storefrontEntryLane262, storefrontEntryLane263, storefrontEntryLane264, storefrontEntryLane265, storefrontEntryLane266, storefrontEntryLane267, storefrontEntryLane268, storefrontEntryLane269, storefrontEntryLane270, storefrontEntryLane271, storefrontEntryLane272, storefrontEntryLane273, storefrontEntryLane274, storefrontEntryLane275, storefrontEntryLane276, storefrontEntryLane277, storefrontEntryLane278, storefrontEntryLane279, storefrontEntryLane280, storefrontEntryLane281, storefrontEntryLane282, storefrontEntryLane283, storefrontEntryLane284, storefrontEntryLane285, storefrontEntryLane286, storefrontEntryLane287, storefrontEntryLane288, storefrontEntryLane289, storefrontEntryLane290, storefrontEntryLane291, storefrontEntryLane292, storefrontEntryLane293, storefrontEntryLane294, storefrontEntryLane295, storefrontEntryLane296, storefrontEntryLane297, storefrontEntryLane298, storefrontEntryLane299, storefrontEntryLane300, storefrontEntryLane301, storefrontEntryLane302, storefrontEntryLane303, storefrontEntryLane304, storefrontEntryLane305, storefrontEntryLane306, storefrontEntryLane307, storefrontEntryLane308, storefrontEntryLane309, storefrontEntryLane310, storefrontEntryLane311, storefrontEntryLane312, storefrontEntryLane313, storefrontEntryLane314, storefrontEntryLane315, storefrontEntryLane316, storefrontEntryLane317, storefrontEntryLane318, storefrontEntryLane319, storefrontEntryLane320, storefrontEntryLane321, storefrontEntryLane322, storefrontEntryLane323, storefrontEntryLane324, storefrontEntryLane325, storefrontEntryLane326, storefrontEntryLane327, storefrontEntryLane328, storefrontEntryLane329, storefrontEntryLane330, storefrontEntryLane331, storefrontEntryLane332, storefrontEntryLane333, storefrontEntryLane334, storefrontEntryLane335, storefrontEntryLane336, storefrontEntryLane337, storefrontEntryLane338, storefrontEntryLane339, storefrontEntryLane340, storefrontEntryLane341, storefrontEntryLane342, storefrontEntryLane343, storefrontEntryLane344, storefrontEntryLane345, storefrontEntryLane346, storefrontEntryLane347, storefrontEntryLane348, storefrontEntryLane349, storefrontEntryLane350, storefrontEntryLane351, storefrontEntryLane352, storefrontEntryLane353, storefrontEntryLane354, storefrontEntryLane355, storefrontEntryLane356, storefrontEntryLane357, storefrontEntryLane358, storefrontEntryLane359, storefrontEntryLane360, storefrontEntryLane361, storefrontEntryLane362, storefrontEntryLane363, storefrontEntryLane364, storefrontEntryLane365, storefrontEntryLane366, storefrontEntryLane367, storefrontEntryLane368, storefrontEntryLane369, storefrontEntryLane370, storefrontEntryLane371, storefrontEntryLane372, storefrontEntryLane373, storefrontEntryLane374, storefrontEntryLane375];
export function collect(n) {
  let total = 0;
  for (const lane of storefrontEntryLanes) total += lane(n);
  return total;
}
