// src/entries/dispatch.js
// Entry for the dispatch desk. Shared modules come from boot.js;
// this desk's own modules come from its area folder.
import { boot } from "../shared/boot.js";
import { collect as area } from "../areas/dispatch/index.js";
import { loadPanels } from "../areas/dispatch/loader.js";
import { bridge as bridge002 } from "../bridges/bridge-002.js";
import { bridge as bridge006 } from "../bridges/bridge-006.js";
import { bridge as bridge009 } from "../bridges/bridge-009.js";
import { bridge as bridge012 } from "../bridges/bridge-012.js";
import { bridge as bridge013 } from "../bridges/bridge-013.js";
import { bridge as bridge017 } from "../bridges/bridge-017.js";
import { bridge as bridge021 } from "../bridges/bridge-021.js";
import { bridge as bridge024 } from "../bridges/bridge-024.js";
import { bridge as bridge027 } from "../bridges/bridge-027.js";
import { bridge as bridge028 } from "../bridges/bridge-028.js";
import { bridge as bridge032 } from "../bridges/bridge-032.js";
import { bridge as bridge036 } from "../bridges/bridge-036.js";
import { bridge as bridge039 } from "../bridges/bridge-039.js";
import { bridge as bridge042 } from "../bridges/bridge-042.js";
import { bridge as bridge043 } from "../bridges/bridge-043.js";
import { bridge as bridge047 } from "../bridges/bridge-047.js";
import { bridge as bridge051 } from "../bridges/bridge-051.js";
import { bridge as bridge054 } from "../bridges/bridge-054.js";
import { bridge as bridge057 } from "../bridges/bridge-057.js";
import { bridge as bridge058 } from "../bridges/bridge-058.js";
import { bridge as bridge062 } from "../bridges/bridge-062.js";
import { bridge as bridge066 } from "../bridges/bridge-066.js";
import { bridge as bridge069 } from "../bridges/bridge-069.js";
import { bridge as bridge072 } from "../bridges/bridge-072.js";
import { bridge as bridge073 } from "../bridges/bridge-073.js";
import { bridge as bridge077 } from "../bridges/bridge-077.js";
export async function main(n) {
  const lazy = await loadPanels(n % 18);
  return boot(n) + area(n) + lazy + bridge002(n) + bridge006(n) + bridge009(n) + bridge012(n) + bridge013(n) + bridge017(n) + bridge021(n) + bridge024(n) + bridge027(n) + bridge028(n) + bridge032(n) + bridge036(n) + bridge039(n) + bridge042(n) + bridge043(n) + bridge047(n) + bridge051(n) + bridge054(n) + bridge057(n) + bridge058(n) + bridge062(n) + bridge066(n) + bridge069(n) + bridge072(n) + bridge073(n) + bridge077(n);
}
const total = await main(1);
console.log(total);
export function dispatchEntryLane0(n) {
  const added = 23 + 4;
  const text = "atlas" + "-dispatchEntryLane0";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane1(n) {
  let value = 0;
  try {
    value = 4 + 7;
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
export function dispatchEntryLane2(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(5);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane3(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane4(n) {
  const added = 27 + 8;
  const text = "atlas" + "-dispatchEntryLane4";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane5(n) {
  let value = 0;
  try {
    value = 8 + 11;
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
export function dispatchEntryLane6(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(9);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane7(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane8(n) {
  const added = 31 + 12;
  const text = "atlas" + "-dispatchEntryLane8";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-12);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 3}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane9(n) {
  let value = 0;
  try {
    value = 12 + 15;
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
export function dispatchEntryLane10(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(13);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane11(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane12(n) {
  const added = 35 + 16;
  const text = "atlas" + "-dispatchEntryLane12";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane13(n) {
  let value = 0;
  try {
    value = 16 + 19;
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
export function dispatchEntryLane14(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(17);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane15(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane16(n) {
  const added = 39 + 20;
  const text = "atlas" + "-dispatchEntryLane16";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane17(n) {
  let value = 0;
  try {
    value = 20 + 23;
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
export function dispatchEntryLane18(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(1);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane19(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane20(n) {
  const added = 3 + 24;
  const text = "atlas" + "-dispatchEntryLane20";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-12);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 3}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane21(n) {
  let value = 0;
  try {
    value = 24 + 27;
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
export function dispatchEntryLane22(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(5);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane23(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane24(n) {
  const added = 7 + 3;
  const text = "atlas" + "-dispatchEntryLane24";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane25(n) {
  let value = 0;
  try {
    value = 28 + 31;
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
export function dispatchEntryLane26(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(9);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane27(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane28(n) {
  const added = 11 + 7;
  const text = "atlas" + "-dispatchEntryLane28";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane29(n) {
  let value = 0;
  try {
    value = 32 + 35;
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
export function dispatchEntryLane30(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(13);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane31(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane32(n) {
  const added = 15 + 11;
  const text = "atlas" + "-dispatchEntryLane32";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-12);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 3}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane33(n) {
  let value = 0;
  try {
    value = 36 + 39;
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
export function dispatchEntryLane34(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(17);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane35(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane36(n) {
  const added = 19 + 15;
  const text = "atlas" + "-dispatchEntryLane36";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane37(n) {
  let value = 0;
  try {
    value = 40 + 43;
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
export function dispatchEntryLane38(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(1);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane39(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane40(n) {
  const added = 23 + 19;
  const text = "atlas" + "-dispatchEntryLane40";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane41(n) {
  let value = 0;
  try {
    value = 44 + 47;
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
export function dispatchEntryLane42(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(5);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane43(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane44(n) {
  const added = 27 + 23;
  const text = "atlas" + "-dispatchEntryLane44";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-12);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 3}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane45(n) {
  let value = 0;
  try {
    value = 48 + 1;
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
export function dispatchEntryLane46(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(9);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane47(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane48(n) {
  const added = 31 + 2;
  const text = "atlas" + "-dispatchEntryLane48";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane49(n) {
  let value = 0;
  try {
    value = 2 + 5;
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
export function dispatchEntryLane50(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(13);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane51(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane52(n) {
  const added = 35 + 6;
  const text = "atlas" + "-dispatchEntryLane52";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane53(n) {
  let value = 0;
  try {
    value = 6 + 9;
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
export function dispatchEntryLane54(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(17);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane55(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane56(n) {
  const added = 39 + 10;
  const text = "atlas" + "-dispatchEntryLane56";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-12);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 3}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane57(n) {
  let value = 0;
  try {
    value = 10 + 13;
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
export function dispatchEntryLane58(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(1);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane59(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane60(n) {
  const added = 3 + 14;
  const text = "atlas" + "-dispatchEntryLane60";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane61(n) {
  let value = 0;
  try {
    value = 14 + 17;
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
export function dispatchEntryLane62(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(5);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane63(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane64(n) {
  const added = 7 + 18;
  const text = "atlas" + "-dispatchEntryLane64";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane65(n) {
  let value = 0;
  try {
    value = 18 + 21;
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
export function dispatchEntryLane66(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(9);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane67(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane68(n) {
  const added = 11 + 22;
  const text = "atlas" + "-dispatchEntryLane68";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-12);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 3}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane69(n) {
  let value = 0;
  try {
    value = 22 + 25;
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
export function dispatchEntryLane70(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(13);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane71(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane72(n) {
  const added = 15 + 1;
  const text = "atlas" + "-dispatchEntryLane72";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane73(n) {
  let value = 0;
  try {
    value = 26 + 29;
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
export function dispatchEntryLane74(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(17);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane75(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane76(n) {
  const added = 19 + 5;
  const text = "atlas" + "-dispatchEntryLane76";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane77(n) {
  let value = 0;
  try {
    value = 30 + 33;
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
export function dispatchEntryLane78(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(1);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane79(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane80(n) {
  const added = 23 + 9;
  const text = "atlas" + "-dispatchEntryLane80";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-12);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 3}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane81(n) {
  let value = 0;
  try {
    value = 34 + 37;
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
export function dispatchEntryLane82(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(5);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane83(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane84(n) {
  const added = 27 + 13;
  const text = "atlas" + "-dispatchEntryLane84";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane85(n) {
  let value = 0;
  try {
    value = 38 + 41;
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
export function dispatchEntryLane86(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(9);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane87(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane88(n) {
  const added = 31 + 17;
  const text = "atlas" + "-dispatchEntryLane88";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane89(n) {
  let value = 0;
  try {
    value = 42 + 45;
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
export function dispatchEntryLane90(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(13);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane91(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane92(n) {
  const added = 35 + 21;
  const text = "atlas" + "-dispatchEntryLane92";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-12);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 3}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane93(n) {
  let value = 0;
  try {
    value = 46 + 49;
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
export function dispatchEntryLane94(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(17);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane95(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane96(n) {
  const added = 39 + 25;
  const text = "atlas" + "-dispatchEntryLane96";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane97(n) {
  let value = 0;
  try {
    value = 0 + 3;
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
export function dispatchEntryLane98(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(1);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane99(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane100(n) {
  const added = 3 + 4;
  const text = "atlas" + "-dispatchEntryLane100";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane101(n) {
  let value = 0;
  try {
    value = 4 + 7;
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
export function dispatchEntryLane102(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(5);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane103(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane104(n) {
  const added = 7 + 8;
  const text = "atlas" + "-dispatchEntryLane104";
  const flag = true ? 9 : missing();
  const abs = Math.abs(-12);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 3}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane105(n) {
  let value = 0;
  try {
    value = 8 + 11;
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
export function dispatchEntryLane106(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(9);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane107(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane108(n) {
  const added = 11 + 12;
  const text = "atlas" + "-dispatchEntryLane108";
  const flag = true ? 4 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane109(n) {
  let value = 0;
  try {
    value = 12 + 15;
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
export function dispatchEntryLane110(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(13);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane111(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane112(n) {
  const added = 15 + 16;
  const text = "atlas" + "-dispatchEntryLane112";
  const flag = true ? 8 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane113(n) {
  let value = 0;
  try {
    value = 16 + 19;
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
export function dispatchEntryLane114(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(17);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane115(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane116(n) {
  const added = 19 + 20;
  const text = "atlas" + "-dispatchEntryLane116";
  const flag = true ? 3 : missing();
  const abs = Math.abs(-12);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 3}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane117(n) {
  let value = 0;
  try {
    value = 20 + 23;
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
export function dispatchEntryLane118(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(1);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane119(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane120(n) {
  const added = 23 + 24;
  const text = "atlas" + "-dispatchEntryLane120";
  const flag = true ? 7 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(3, 4, 5);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane121(n) {
  let value = 0;
  try {
    value = 24 + 27;
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
export function dispatchEntryLane122(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(5);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane123(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane124(n) {
  const added = 27 + 3;
  const text = "atlas" + "-dispatchEntryLane124";
  const flag = true ? 2 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(2, 3, 4);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane125(n) {
  let value = 0;
  try {
    value = 28 + 31;
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
export function dispatchEntryLane126(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(9);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane127(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane128(n) {
  const added = 31 + 7;
  const text = "atlas" + "-dispatchEntryLane128";
  const flag = true ? 6 : missing();
  const abs = Math.abs(-12);
  const listed = Array.of(1, 2, 3);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [5, 6, 7][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 3}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane129(n) {
  let value = 0;
  try {
    value = 32 + 35;
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
export function dispatchEntryLane130(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(13);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane131(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane132(n) {
  const added = 35 + 11;
  const text = "atlas" + "-dispatchEntryLane132";
  const flag = true ? 1 : missing();
  const abs = Math.abs(-4);
  const listed = Array.of(0, 1, 2);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [3, 4, 5][1];
  const prop = ({ lane: 3 }).lane;
  const tmpl = `n${4 + 1}`;
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
  const opt = ({ lane: 3 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
export function dispatchEntryLane133(n) {
  let value = 0;
  try {
    value = 36 + 39;
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
export function dispatchEntryLane134(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(17);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function dispatchEntryLane135(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function dispatchEntryLane136(n) {
  const added = 39 + 15;
  const text = "atlas" + "-dispatchEntryLane136";
  const flag = true ? 5 : missing();
  const abs = Math.abs(-8);
  const listed = Array.of(4, 5, 6);
  const key = Object.keys({ a: 1, b: 2 })[0];
  const cell = [1, 2, 3][1];
  const prop = ({ lane: 7 }).lane;
  const tmpl = `n${4 + 2}`;
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
  const opt = ({ lane: 7 })?.lane;
  if (false) { missing(); }
  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;
}
const dispatchEntryLanes = [dispatchEntryLane0, dispatchEntryLane1, dispatchEntryLane2, dispatchEntryLane3, dispatchEntryLane4, dispatchEntryLane5, dispatchEntryLane6, dispatchEntryLane7, dispatchEntryLane8, dispatchEntryLane9, dispatchEntryLane10, dispatchEntryLane11, dispatchEntryLane12, dispatchEntryLane13, dispatchEntryLane14, dispatchEntryLane15, dispatchEntryLane16, dispatchEntryLane17, dispatchEntryLane18, dispatchEntryLane19, dispatchEntryLane20, dispatchEntryLane21, dispatchEntryLane22, dispatchEntryLane23, dispatchEntryLane24, dispatchEntryLane25, dispatchEntryLane26, dispatchEntryLane27, dispatchEntryLane28, dispatchEntryLane29, dispatchEntryLane30, dispatchEntryLane31, dispatchEntryLane32, dispatchEntryLane33, dispatchEntryLane34, dispatchEntryLane35, dispatchEntryLane36, dispatchEntryLane37, dispatchEntryLane38, dispatchEntryLane39, dispatchEntryLane40, dispatchEntryLane41, dispatchEntryLane42, dispatchEntryLane43, dispatchEntryLane44, dispatchEntryLane45, dispatchEntryLane46, dispatchEntryLane47, dispatchEntryLane48, dispatchEntryLane49, dispatchEntryLane50, dispatchEntryLane51, dispatchEntryLane52, dispatchEntryLane53, dispatchEntryLane54, dispatchEntryLane55, dispatchEntryLane56, dispatchEntryLane57, dispatchEntryLane58, dispatchEntryLane59, dispatchEntryLane60, dispatchEntryLane61, dispatchEntryLane62, dispatchEntryLane63, dispatchEntryLane64, dispatchEntryLane65, dispatchEntryLane66, dispatchEntryLane67, dispatchEntryLane68, dispatchEntryLane69, dispatchEntryLane70, dispatchEntryLane71, dispatchEntryLane72, dispatchEntryLane73, dispatchEntryLane74, dispatchEntryLane75, dispatchEntryLane76, dispatchEntryLane77, dispatchEntryLane78, dispatchEntryLane79, dispatchEntryLane80, dispatchEntryLane81, dispatchEntryLane82, dispatchEntryLane83, dispatchEntryLane84, dispatchEntryLane85, dispatchEntryLane86, dispatchEntryLane87, dispatchEntryLane88, dispatchEntryLane89, dispatchEntryLane90, dispatchEntryLane91, dispatchEntryLane92, dispatchEntryLane93, dispatchEntryLane94, dispatchEntryLane95, dispatchEntryLane96, dispatchEntryLane97, dispatchEntryLane98, dispatchEntryLane99, dispatchEntryLane100, dispatchEntryLane101, dispatchEntryLane102, dispatchEntryLane103, dispatchEntryLane104, dispatchEntryLane105, dispatchEntryLane106, dispatchEntryLane107, dispatchEntryLane108, dispatchEntryLane109, dispatchEntryLane110, dispatchEntryLane111, dispatchEntryLane112, dispatchEntryLane113, dispatchEntryLane114, dispatchEntryLane115, dispatchEntryLane116, dispatchEntryLane117, dispatchEntryLane118, dispatchEntryLane119, dispatchEntryLane120, dispatchEntryLane121, dispatchEntryLane122, dispatchEntryLane123, dispatchEntryLane124, dispatchEntryLane125, dispatchEntryLane126, dispatchEntryLane127, dispatchEntryLane128, dispatchEntryLane129, dispatchEntryLane130, dispatchEntryLane131, dispatchEntryLane132, dispatchEntryLane133, dispatchEntryLane134, dispatchEntryLane135, dispatchEntryLane136];
export function collect(n) {
  let total = 0;
  for (const lane of dispatchEntryLanes) total += lane(n);
  return total;
}
