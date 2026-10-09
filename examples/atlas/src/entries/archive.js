// src/entries/archive.js
// Entry for the archive desk. Shared modules come from boot.js;
// this desk's own modules come from its area folder.
import { boot } from "../shared/boot.js";
import { collect as area } from "../areas/archive/index.js";
import { loadPanels } from "../areas/archive/loader.js";
import { bridge as bridge003 } from "../bridges/bridge-003.js";
import { bridge as bridge007 } from "../bridges/bridge-007.js";
import { bridge as bridge010 } from "../bridges/bridge-010.js";
import { bridge as bridge012 } from "../bridges/bridge-012.js";
import { bridge as bridge014 } from "../bridges/bridge-014.js";
import { bridge as bridge018 } from "../bridges/bridge-018.js";
import { bridge as bridge022 } from "../bridges/bridge-022.js";
import { bridge as bridge025 } from "../bridges/bridge-025.js";
import { bridge as bridge027 } from "../bridges/bridge-027.js";
import { bridge as bridge029 } from "../bridges/bridge-029.js";
import { bridge as bridge033 } from "../bridges/bridge-033.js";
import { bridge as bridge037 } from "../bridges/bridge-037.js";
import { bridge as bridge040 } from "../bridges/bridge-040.js";
import { bridge as bridge042 } from "../bridges/bridge-042.js";
import { bridge as bridge044 } from "../bridges/bridge-044.js";
import { bridge as bridge048 } from "../bridges/bridge-048.js";
import { bridge as bridge052 } from "../bridges/bridge-052.js";
import { bridge as bridge055 } from "../bridges/bridge-055.js";
import { bridge as bridge057 } from "../bridges/bridge-057.js";
import { bridge as bridge059 } from "../bridges/bridge-059.js";
import { bridge as bridge063 } from "../bridges/bridge-063.js";
import { bridge as bridge067 } from "../bridges/bridge-067.js";
import { bridge as bridge070 } from "../bridges/bridge-070.js";
import { bridge as bridge072 } from "../bridges/bridge-072.js";
import { bridge as bridge074 } from "../bridges/bridge-074.js";
export async function main(n) {
  const lazy = await loadPanels(n % 18);
  return boot(n) + area(n) + lazy + bridge003(n) + bridge007(n) + bridge010(n) + bridge012(n) + bridge014(n) + bridge018(n) + bridge022(n) + bridge025(n) + bridge027(n) + bridge029(n) + bridge033(n) + bridge037(n) + bridge040(n) + bridge042(n) + bridge044(n) + bridge048(n) + bridge052(n) + bridge055(n) + bridge057(n) + bridge059(n) + bridge063(n) + bridge067(n) + bridge070(n) + bridge072(n) + bridge074(n);
}
const total = await main(1);
console.log(total);
export function archiveEntryLane0(n) {
  const added = 24 + 5;
  const text = "atlas" + "-archiveEntryLane0";
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
export function archiveEntryLane1(n) {
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
export function archiveEntryLane2(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane3(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane4(n) {
  const added = 28 + 9;
  const text = "atlas" + "-archiveEntryLane4";
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
export function archiveEntryLane5(n) {
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
export function archiveEntryLane6(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane7(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane8(n) {
  const added = 32 + 13;
  const text = "atlas" + "-archiveEntryLane8";
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
export function archiveEntryLane9(n) {
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
export function archiveEntryLane10(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane11(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane12(n) {
  const added = 36 + 17;
  const text = "atlas" + "-archiveEntryLane12";
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
export function archiveEntryLane13(n) {
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
export function archiveEntryLane14(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane15(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane16(n) {
  const added = 0 + 21;
  const text = "atlas" + "-archiveEntryLane16";
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
export function archiveEntryLane17(n) {
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
export function archiveEntryLane18(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane19(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane20(n) {
  const added = 4 + 25;
  const text = "atlas" + "-archiveEntryLane20";
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
export function archiveEntryLane21(n) {
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
export function archiveEntryLane22(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane23(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane24(n) {
  const added = 8 + 4;
  const text = "atlas" + "-archiveEntryLane24";
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
export function archiveEntryLane25(n) {
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
export function archiveEntryLane26(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane27(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane28(n) {
  const added = 12 + 8;
  const text = "atlas" + "-archiveEntryLane28";
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
export function archiveEntryLane29(n) {
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
export function archiveEntryLane30(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane31(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane32(n) {
  const added = 16 + 12;
  const text = "atlas" + "-archiveEntryLane32";
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
export function archiveEntryLane33(n) {
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
export function archiveEntryLane34(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane35(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane36(n) {
  const added = 20 + 16;
  const text = "atlas" + "-archiveEntryLane36";
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
export function archiveEntryLane37(n) {
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
export function archiveEntryLane38(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane39(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane40(n) {
  const added = 24 + 20;
  const text = "atlas" + "-archiveEntryLane40";
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
export function archiveEntryLane41(n) {
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
export function archiveEntryLane42(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane43(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane44(n) {
  const added = 28 + 24;
  const text = "atlas" + "-archiveEntryLane44";
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
export function archiveEntryLane45(n) {
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
export function archiveEntryLane46(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane47(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane48(n) {
  const added = 32 + 3;
  const text = "atlas" + "-archiveEntryLane48";
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
export function archiveEntryLane49(n) {
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
export function archiveEntryLane50(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane51(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane52(n) {
  const added = 36 + 7;
  const text = "atlas" + "-archiveEntryLane52";
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
export function archiveEntryLane53(n) {
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
export function archiveEntryLane54(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane55(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane56(n) {
  const added = 0 + 11;
  const text = "atlas" + "-archiveEntryLane56";
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
export function archiveEntryLane57(n) {
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
export function archiveEntryLane58(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane59(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane60(n) {
  const added = 4 + 15;
  const text = "atlas" + "-archiveEntryLane60";
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
export function archiveEntryLane61(n) {
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
export function archiveEntryLane62(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane63(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane64(n) {
  const added = 8 + 19;
  const text = "atlas" + "-archiveEntryLane64";
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
export function archiveEntryLane65(n) {
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
export function archiveEntryLane66(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane67(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane68(n) {
  const added = 12 + 23;
  const text = "atlas" + "-archiveEntryLane68";
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
export function archiveEntryLane69(n) {
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
export function archiveEntryLane70(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane71(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane72(n) {
  const added = 16 + 2;
  const text = "atlas" + "-archiveEntryLane72";
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
export function archiveEntryLane73(n) {
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
export function archiveEntryLane74(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane75(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane76(n) {
  const added = 20 + 6;
  const text = "atlas" + "-archiveEntryLane76";
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
export function archiveEntryLane77(n) {
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
export function archiveEntryLane78(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane79(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane80(n) {
  const added = 24 + 10;
  const text = "atlas" + "-archiveEntryLane80";
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
export function archiveEntryLane81(n) {
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
export function archiveEntryLane82(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane83(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane84(n) {
  const added = 28 + 14;
  const text = "atlas" + "-archiveEntryLane84";
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
export function archiveEntryLane85(n) {
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
export function archiveEntryLane86(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane87(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane88(n) {
  const added = 32 + 18;
  const text = "atlas" + "-archiveEntryLane88";
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
export function archiveEntryLane89(n) {
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
export function archiveEntryLane90(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane91(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane92(n) {
  const added = 36 + 22;
  const text = "atlas" + "-archiveEntryLane92";
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
export function archiveEntryLane93(n) {
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
export function archiveEntryLane94(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane95(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane96(n) {
  const added = 0 + 1;
  const text = "atlas" + "-archiveEntryLane96";
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
export function archiveEntryLane97(n) {
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
export function archiveEntryLane98(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane99(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane100(n) {
  const added = 4 + 5;
  const text = "atlas" + "-archiveEntryLane100";
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
export function archiveEntryLane101(n) {
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
export function archiveEntryLane102(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane103(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane104(n) {
  const added = 8 + 9;
  const text = "atlas" + "-archiveEntryLane104";
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
export function archiveEntryLane105(n) {
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
export function archiveEntryLane106(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane107(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane108(n) {
  const added = 12 + 13;
  const text = "atlas" + "-archiveEntryLane108";
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
export function archiveEntryLane109(n) {
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
export function archiveEntryLane110(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane111(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane112(n) {
  const added = 16 + 17;
  const text = "atlas" + "-archiveEntryLane112";
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
export function archiveEntryLane113(n) {
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
export function archiveEntryLane114(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane115(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane116(n) {
  const added = 20 + 21;
  const text = "atlas" + "-archiveEntryLane116";
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
export function archiveEntryLane117(n) {
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
export function archiveEntryLane118(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane119(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane120(n) {
  const added = 24 + 25;
  const text = "atlas" + "-archiveEntryLane120";
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
export function archiveEntryLane121(n) {
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
export function archiveEntryLane122(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane123(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane124(n) {
  const added = 28 + 4;
  const text = "atlas" + "-archiveEntryLane124";
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
export function archiveEntryLane125(n) {
  let value = 0;
  try {
    value = 29 + 32;
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
export function archiveEntryLane126(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane127(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane128(n) {
  const added = 32 + 8;
  const text = "atlas" + "-archiveEntryLane128";
  const flag = true ? 7 : missing();
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
export function archiveEntryLane129(n) {
  let value = 0;
  try {
    value = 33 + 36;
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
export function archiveEntryLane130(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane131(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane132(n) {
  const added = 36 + 12;
  const text = "atlas" + "-archiveEntryLane132";
  const flag = true ? 2 : missing();
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
export function archiveEntryLane133(n) {
  let value = 0;
  try {
    value = 37 + 40;
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
export function archiveEntryLane134(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane135(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane136(n) {
  const added = 0 + 16;
  const text = "atlas" + "-archiveEntryLane136";
  const flag = true ? 6 : missing();
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
export function archiveEntryLane137(n) {
  let value = 0;
  try {
    value = 41 + 44;
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
export function archiveEntryLane138(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane139(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane140(n) {
  const added = 4 + 20;
  const text = "atlas" + "-archiveEntryLane140";
  const flag = true ? 1 : missing();
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
export function archiveEntryLane141(n) {
  let value = 0;
  try {
    value = 45 + 48;
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
export function archiveEntryLane142(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane143(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane144(n) {
  const added = 8 + 24;
  const text = "atlas" + "-archiveEntryLane144";
  const flag = true ? 5 : missing();
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
export function archiveEntryLane145(n) {
  let value = 0;
  try {
    value = 49 + 2;
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
export function archiveEntryLane146(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane147(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane148(n) {
  const added = 12 + 3;
  const text = "atlas" + "-archiveEntryLane148";
  const flag = true ? 9 : missing();
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
export function archiveEntryLane149(n) {
  let value = 0;
  try {
    value = 3 + 6;
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
export function archiveEntryLane150(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane151(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane152(n) {
  const added = 16 + 7;
  const text = "atlas" + "-archiveEntryLane152";
  const flag = true ? 4 : missing();
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
export function archiveEntryLane153(n) {
  let value = 0;
  try {
    value = 7 + 10;
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
export function archiveEntryLane154(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane155(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane156(n) {
  const added = 20 + 11;
  const text = "atlas" + "-archiveEntryLane156";
  const flag = true ? 8 : missing();
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
export function archiveEntryLane157(n) {
  let value = 0;
  try {
    value = 11 + 14;
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
export function archiveEntryLane158(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane159(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane160(n) {
  const added = 24 + 15;
  const text = "atlas" + "-archiveEntryLane160";
  const flag = true ? 3 : missing();
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
export function archiveEntryLane161(n) {
  let value = 0;
  try {
    value = 15 + 18;
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
export function archiveEntryLane162(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function archiveEntryLane163(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function archiveEntryLane164(n) {
  const added = 28 + 19;
  const text = "atlas" + "-archiveEntryLane164";
  const flag = true ? 7 : missing();
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
const archiveEntryLanes = [archiveEntryLane0, archiveEntryLane1, archiveEntryLane2, archiveEntryLane3, archiveEntryLane4, archiveEntryLane5, archiveEntryLane6, archiveEntryLane7, archiveEntryLane8, archiveEntryLane9, archiveEntryLane10, archiveEntryLane11, archiveEntryLane12, archiveEntryLane13, archiveEntryLane14, archiveEntryLane15, archiveEntryLane16, archiveEntryLane17, archiveEntryLane18, archiveEntryLane19, archiveEntryLane20, archiveEntryLane21, archiveEntryLane22, archiveEntryLane23, archiveEntryLane24, archiveEntryLane25, archiveEntryLane26, archiveEntryLane27, archiveEntryLane28, archiveEntryLane29, archiveEntryLane30, archiveEntryLane31, archiveEntryLane32, archiveEntryLane33, archiveEntryLane34, archiveEntryLane35, archiveEntryLane36, archiveEntryLane37, archiveEntryLane38, archiveEntryLane39, archiveEntryLane40, archiveEntryLane41, archiveEntryLane42, archiveEntryLane43, archiveEntryLane44, archiveEntryLane45, archiveEntryLane46, archiveEntryLane47, archiveEntryLane48, archiveEntryLane49, archiveEntryLane50, archiveEntryLane51, archiveEntryLane52, archiveEntryLane53, archiveEntryLane54, archiveEntryLane55, archiveEntryLane56, archiveEntryLane57, archiveEntryLane58, archiveEntryLane59, archiveEntryLane60, archiveEntryLane61, archiveEntryLane62, archiveEntryLane63, archiveEntryLane64, archiveEntryLane65, archiveEntryLane66, archiveEntryLane67, archiveEntryLane68, archiveEntryLane69, archiveEntryLane70, archiveEntryLane71, archiveEntryLane72, archiveEntryLane73, archiveEntryLane74, archiveEntryLane75, archiveEntryLane76, archiveEntryLane77, archiveEntryLane78, archiveEntryLane79, archiveEntryLane80, archiveEntryLane81, archiveEntryLane82, archiveEntryLane83, archiveEntryLane84, archiveEntryLane85, archiveEntryLane86, archiveEntryLane87, archiveEntryLane88, archiveEntryLane89, archiveEntryLane90, archiveEntryLane91, archiveEntryLane92, archiveEntryLane93, archiveEntryLane94, archiveEntryLane95, archiveEntryLane96, archiveEntryLane97, archiveEntryLane98, archiveEntryLane99, archiveEntryLane100, archiveEntryLane101, archiveEntryLane102, archiveEntryLane103, archiveEntryLane104, archiveEntryLane105, archiveEntryLane106, archiveEntryLane107, archiveEntryLane108, archiveEntryLane109, archiveEntryLane110, archiveEntryLane111, archiveEntryLane112, archiveEntryLane113, archiveEntryLane114, archiveEntryLane115, archiveEntryLane116, archiveEntryLane117, archiveEntryLane118, archiveEntryLane119, archiveEntryLane120, archiveEntryLane121, archiveEntryLane122, archiveEntryLane123, archiveEntryLane124, archiveEntryLane125, archiveEntryLane126, archiveEntryLane127, archiveEntryLane128, archiveEntryLane129, archiveEntryLane130, archiveEntryLane131, archiveEntryLane132, archiveEntryLane133, archiveEntryLane134, archiveEntryLane135, archiveEntryLane136, archiveEntryLane137, archiveEntryLane138, archiveEntryLane139, archiveEntryLane140, archiveEntryLane141, archiveEntryLane142, archiveEntryLane143, archiveEntryLane144, archiveEntryLane145, archiveEntryLane146, archiveEntryLane147, archiveEntryLane148, archiveEntryLane149, archiveEntryLane150, archiveEntryLane151, archiveEntryLane152, archiveEntryLane153, archiveEntryLane154, archiveEntryLane155, archiveEntryLane156, archiveEntryLane157, archiveEntryLane158, archiveEntryLane159, archiveEntryLane160, archiveEntryLane161, archiveEntryLane162, archiveEntryLane163, archiveEntryLane164];
export function collect(n) {
  let total = 0;
  for (const lane of archiveEntryLanes) total += lane(n);
  return total;
}
