// src/entries/warehouse.js
// Entry for the warehouse desk. Shared modules come from boot.js;
// this desk's own modules come from its area folder.
import { boot } from "../shared/boot.js";
import { collect as area } from "../areas/warehouse/index.js";
import { loadPanels } from "../areas/warehouse/loader.js";
import { bridge as bridge000 } from "../bridges/bridge-000.js";
import { bridge as bridge005 } from "../bridges/bridge-005.js";
import { bridge as bridge006 } from "../bridges/bridge-006.js";
import { bridge as bridge007 } from "../bridges/bridge-007.js";
import { bridge as bridge008 } from "../bridges/bridge-008.js";
import { bridge as bridge015 } from "../bridges/bridge-015.js";
import { bridge as bridge020 } from "../bridges/bridge-020.js";
import { bridge as bridge021 } from "../bridges/bridge-021.js";
import { bridge as bridge022 } from "../bridges/bridge-022.js";
import { bridge as bridge023 } from "../bridges/bridge-023.js";
import { bridge as bridge030 } from "../bridges/bridge-030.js";
import { bridge as bridge035 } from "../bridges/bridge-035.js";
import { bridge as bridge036 } from "../bridges/bridge-036.js";
import { bridge as bridge037 } from "../bridges/bridge-037.js";
import { bridge as bridge038 } from "../bridges/bridge-038.js";
import { bridge as bridge045 } from "../bridges/bridge-045.js";
import { bridge as bridge050 } from "../bridges/bridge-050.js";
import { bridge as bridge051 } from "../bridges/bridge-051.js";
import { bridge as bridge052 } from "../bridges/bridge-052.js";
import { bridge as bridge053 } from "../bridges/bridge-053.js";
import { bridge as bridge060 } from "../bridges/bridge-060.js";
import { bridge as bridge065 } from "../bridges/bridge-065.js";
import { bridge as bridge066 } from "../bridges/bridge-066.js";
import { bridge as bridge067 } from "../bridges/bridge-067.js";
import { bridge as bridge068 } from "../bridges/bridge-068.js";
import { bridge as bridge075 } from "../bridges/bridge-075.js";
export async function main(n) {
  const lazy = await loadPanels(n % 18);
  return boot(n) + area(n) + lazy + bridge000(n) + bridge005(n) + bridge006(n) + bridge007(n) + bridge008(n) + bridge015(n) + bridge020(n) + bridge021(n) + bridge022(n) + bridge023(n) + bridge030(n) + bridge035(n) + bridge036(n) + bridge037(n) + bridge038(n) + bridge045(n) + bridge050(n) + bridge051(n) + bridge052(n) + bridge053(n) + bridge060(n) + bridge065(n) + bridge066(n) + bridge067(n) + bridge068(n) + bridge075(n);
}
const total = await main(1);
console.log(total);
export function warehouseEntryLane0(n) {
  const added = 21 + 2;
  const text = "atlas" + "-warehouseEntryLane0";
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
export function warehouseEntryLane1(n) {
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
export function warehouseEntryLane2(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function warehouseEntryLane3(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function warehouseEntryLane4(n) {
  const added = 25 + 6;
  const text = "atlas" + "-warehouseEntryLane4";
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
export function warehouseEntryLane5(n) {
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
export function warehouseEntryLane6(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function warehouseEntryLane7(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function warehouseEntryLane8(n) {
  const added = 29 + 10;
  const text = "atlas" + "-warehouseEntryLane8";
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
export function warehouseEntryLane9(n) {
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
export function warehouseEntryLane10(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function warehouseEntryLane11(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function warehouseEntryLane12(n) {
  const added = 33 + 14;
  const text = "atlas" + "-warehouseEntryLane12";
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
export function warehouseEntryLane13(n) {
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
export function warehouseEntryLane14(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function warehouseEntryLane15(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function warehouseEntryLane16(n) {
  const added = 37 + 18;
  const text = "atlas" + "-warehouseEntryLane16";
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
export function warehouseEntryLane17(n) {
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
export function warehouseEntryLane18(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function warehouseEntryLane19(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function warehouseEntryLane20(n) {
  const added = 1 + 22;
  const text = "atlas" + "-warehouseEntryLane20";
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
export function warehouseEntryLane21(n) {
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
export function warehouseEntryLane22(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function warehouseEntryLane23(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function warehouseEntryLane24(n) {
  const added = 5 + 1;
  const text = "atlas" + "-warehouseEntryLane24";
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
export function warehouseEntryLane25(n) {
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
export function warehouseEntryLane26(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function warehouseEntryLane27(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function warehouseEntryLane28(n) {
  const added = 9 + 5;
  const text = "atlas" + "-warehouseEntryLane28";
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
export function warehouseEntryLane29(n) {
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
export function warehouseEntryLane30(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function warehouseEntryLane31(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function warehouseEntryLane32(n) {
  const added = 13 + 9;
  const text = "atlas" + "-warehouseEntryLane32";
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
export function warehouseEntryLane33(n) {
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
export function warehouseEntryLane34(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function warehouseEntryLane35(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function warehouseEntryLane36(n) {
  const added = 17 + 13;
  const text = "atlas" + "-warehouseEntryLane36";
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
const warehouseEntryLanes = [warehouseEntryLane0, warehouseEntryLane1, warehouseEntryLane2, warehouseEntryLane3, warehouseEntryLane4, warehouseEntryLane5, warehouseEntryLane6, warehouseEntryLane7, warehouseEntryLane8, warehouseEntryLane9, warehouseEntryLane10, warehouseEntryLane11, warehouseEntryLane12, warehouseEntryLane13, warehouseEntryLane14, warehouseEntryLane15, warehouseEntryLane16, warehouseEntryLane17, warehouseEntryLane18, warehouseEntryLane19, warehouseEntryLane20, warehouseEntryLane21, warehouseEntryLane22, warehouseEntryLane23, warehouseEntryLane24, warehouseEntryLane25, warehouseEntryLane26, warehouseEntryLane27, warehouseEntryLane28, warehouseEntryLane29, warehouseEntryLane30, warehouseEntryLane31, warehouseEntryLane32, warehouseEntryLane33, warehouseEntryLane34, warehouseEntryLane35, warehouseEntryLane36];
export function collect(n) {
  let total = 0;
  for (const lane of warehouseEntryLanes) total += lane(n);
  return total;
}
