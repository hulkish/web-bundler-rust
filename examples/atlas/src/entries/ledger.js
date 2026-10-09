// src/entries/ledger.js
// Entry for the ledger desk. Shared modules come from boot.js;
// this desk's own modules come from its area folder.
import { boot } from "../shared/boot.js";
import { collect as area } from "../areas/ledger/index.js";
import { loadPanels } from "../areas/ledger/loader.js";
import { bridge as bridge004 } from "../bridges/bridge-004.js";
import { bridge as bridge008 } from "../bridges/bridge-008.js";
import { bridge as bridge011 } from "../bridges/bridge-011.js";
import { bridge as bridge013 } from "../bridges/bridge-013.js";
import { bridge as bridge014 } from "../bridges/bridge-014.js";
import { bridge as bridge019 } from "../bridges/bridge-019.js";
import { bridge as bridge023 } from "../bridges/bridge-023.js";
import { bridge as bridge026 } from "../bridges/bridge-026.js";
import { bridge as bridge028 } from "../bridges/bridge-028.js";
import { bridge as bridge029 } from "../bridges/bridge-029.js";
import { bridge as bridge034 } from "../bridges/bridge-034.js";
import { bridge as bridge038 } from "../bridges/bridge-038.js";
import { bridge as bridge041 } from "../bridges/bridge-041.js";
import { bridge as bridge043 } from "../bridges/bridge-043.js";
import { bridge as bridge044 } from "../bridges/bridge-044.js";
import { bridge as bridge049 } from "../bridges/bridge-049.js";
import { bridge as bridge053 } from "../bridges/bridge-053.js";
import { bridge as bridge056 } from "../bridges/bridge-056.js";
import { bridge as bridge058 } from "../bridges/bridge-058.js";
import { bridge as bridge059 } from "../bridges/bridge-059.js";
import { bridge as bridge064 } from "../bridges/bridge-064.js";
import { bridge as bridge068 } from "../bridges/bridge-068.js";
import { bridge as bridge071 } from "../bridges/bridge-071.js";
import { bridge as bridge073 } from "../bridges/bridge-073.js";
import { bridge as bridge074 } from "../bridges/bridge-074.js";
export async function main(n) {
  const lazy = await loadPanels(n % 18);
  return boot(n) + area(n) + lazy + bridge004(n) + bridge008(n) + bridge011(n) + bridge013(n) + bridge014(n) + bridge019(n) + bridge023(n) + bridge026(n) + bridge028(n) + bridge029(n) + bridge034(n) + bridge038(n) + bridge041(n) + bridge043(n) + bridge044(n) + bridge049(n) + bridge053(n) + bridge056(n) + bridge058(n) + bridge059(n) + bridge064(n) + bridge068(n) + bridge071(n) + bridge073(n) + bridge074(n);
}
const total = await main(1);
console.log(total);
export function ledgerEntryLane0(n) {
  const added = 25 + 6;
  const text = "atlas" + "-ledgerEntryLane0";
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
export function ledgerEntryLane1(n) {
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
export function ledgerEntryLane2(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane3(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane4(n) {
  const added = 29 + 10;
  const text = "atlas" + "-ledgerEntryLane4";
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
export function ledgerEntryLane5(n) {
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
export function ledgerEntryLane6(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane7(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane8(n) {
  const added = 33 + 14;
  const text = "atlas" + "-ledgerEntryLane8";
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
export function ledgerEntryLane9(n) {
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
export function ledgerEntryLane10(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane11(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane12(n) {
  const added = 37 + 18;
  const text = "atlas" + "-ledgerEntryLane12";
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
export function ledgerEntryLane13(n) {
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
export function ledgerEntryLane14(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane15(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane16(n) {
  const added = 1 + 22;
  const text = "atlas" + "-ledgerEntryLane16";
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
export function ledgerEntryLane17(n) {
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
export function ledgerEntryLane18(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane19(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane20(n) {
  const added = 5 + 1;
  const text = "atlas" + "-ledgerEntryLane20";
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
export function ledgerEntryLane21(n) {
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
export function ledgerEntryLane22(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane23(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane24(n) {
  const added = 9 + 5;
  const text = "atlas" + "-ledgerEntryLane24";
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
export function ledgerEntryLane25(n) {
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
export function ledgerEntryLane26(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane27(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane28(n) {
  const added = 13 + 9;
  const text = "atlas" + "-ledgerEntryLane28";
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
export function ledgerEntryLane29(n) {
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
export function ledgerEntryLane30(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane31(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane32(n) {
  const added = 17 + 13;
  const text = "atlas" + "-ledgerEntryLane32";
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
export function ledgerEntryLane33(n) {
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
export function ledgerEntryLane34(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane35(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane36(n) {
  const added = 21 + 17;
  const text = "atlas" + "-ledgerEntryLane36";
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
export function ledgerEntryLane37(n) {
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
export function ledgerEntryLane38(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane39(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane40(n) {
  const added = 25 + 21;
  const text = "atlas" + "-ledgerEntryLane40";
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
export function ledgerEntryLane41(n) {
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
export function ledgerEntryLane42(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane43(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane44(n) {
  const added = 29 + 25;
  const text = "atlas" + "-ledgerEntryLane44";
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
export function ledgerEntryLane45(n) {
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
export function ledgerEntryLane46(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane47(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane48(n) {
  const added = 33 + 4;
  const text = "atlas" + "-ledgerEntryLane48";
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
export function ledgerEntryLane49(n) {
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
export function ledgerEntryLane50(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane51(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane52(n) {
  const added = 37 + 8;
  const text = "atlas" + "-ledgerEntryLane52";
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
export function ledgerEntryLane53(n) {
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
export function ledgerEntryLane54(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane55(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane56(n) {
  const added = 1 + 12;
  const text = "atlas" + "-ledgerEntryLane56";
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
export function ledgerEntryLane57(n) {
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
export function ledgerEntryLane58(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane59(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane60(n) {
  const added = 5 + 16;
  const text = "atlas" + "-ledgerEntryLane60";
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
export function ledgerEntryLane61(n) {
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
export function ledgerEntryLane62(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane63(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane64(n) {
  const added = 9 + 20;
  const text = "atlas" + "-ledgerEntryLane64";
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
export function ledgerEntryLane65(n) {
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
export function ledgerEntryLane66(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane67(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane68(n) {
  const added = 13 + 24;
  const text = "atlas" + "-ledgerEntryLane68";
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
export function ledgerEntryLane69(n) {
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
export function ledgerEntryLane70(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane71(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane72(n) {
  const added = 17 + 3;
  const text = "atlas" + "-ledgerEntryLane72";
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
export function ledgerEntryLane73(n) {
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
export function ledgerEntryLane74(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane75(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane76(n) {
  const added = 21 + 7;
  const text = "atlas" + "-ledgerEntryLane76";
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
export function ledgerEntryLane77(n) {
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
export function ledgerEntryLane78(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane79(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane80(n) {
  const added = 25 + 11;
  const text = "atlas" + "-ledgerEntryLane80";
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
export function ledgerEntryLane81(n) {
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
export function ledgerEntryLane82(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane83(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane84(n) {
  const added = 29 + 15;
  const text = "atlas" + "-ledgerEntryLane84";
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
export function ledgerEntryLane85(n) {
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
export function ledgerEntryLane86(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane87(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane88(n) {
  const added = 33 + 19;
  const text = "atlas" + "-ledgerEntryLane88";
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
export function ledgerEntryLane89(n) {
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
export function ledgerEntryLane90(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane91(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane92(n) {
  const added = 37 + 23;
  const text = "atlas" + "-ledgerEntryLane92";
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
export function ledgerEntryLane93(n) {
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
export function ledgerEntryLane94(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane95(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane96(n) {
  const added = 1 + 2;
  const text = "atlas" + "-ledgerEntryLane96";
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
export function ledgerEntryLane97(n) {
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
export function ledgerEntryLane98(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane99(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane100(n) {
  const added = 5 + 6;
  const text = "atlas" + "-ledgerEntryLane100";
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
export function ledgerEntryLane101(n) {
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
export function ledgerEntryLane102(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane103(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane104(n) {
  const added = 9 + 10;
  const text = "atlas" + "-ledgerEntryLane104";
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
export function ledgerEntryLane105(n) {
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
export function ledgerEntryLane106(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane107(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane108(n) {
  const added = 13 + 14;
  const text = "atlas" + "-ledgerEntryLane108";
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
export function ledgerEntryLane109(n) {
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
export function ledgerEntryLane110(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane111(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane112(n) {
  const added = 17 + 18;
  const text = "atlas" + "-ledgerEntryLane112";
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
export function ledgerEntryLane113(n) {
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
export function ledgerEntryLane114(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane115(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane116(n) {
  const added = 21 + 22;
  const text = "atlas" + "-ledgerEntryLane116";
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
export function ledgerEntryLane117(n) {
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
export function ledgerEntryLane118(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane119(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane120(n) {
  const added = 25 + 1;
  const text = "atlas" + "-ledgerEntryLane120";
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
export function ledgerEntryLane121(n) {
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
export function ledgerEntryLane122(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane123(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane124(n) {
  const added = 29 + 5;
  const text = "atlas" + "-ledgerEntryLane124";
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
export function ledgerEntryLane125(n) {
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
export function ledgerEntryLane126(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane127(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane128(n) {
  const added = 33 + 9;
  const text = "atlas" + "-ledgerEntryLane128";
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
export function ledgerEntryLane129(n) {
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
export function ledgerEntryLane130(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane131(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane132(n) {
  const added = 37 + 13;
  const text = "atlas" + "-ledgerEntryLane132";
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
export function ledgerEntryLane133(n) {
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
export function ledgerEntryLane134(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane135(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane136(n) {
  const added = 1 + 17;
  const text = "atlas" + "-ledgerEntryLane136";
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
export function ledgerEntryLane137(n) {
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
export function ledgerEntryLane138(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane139(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane140(n) {
  const added = 5 + 21;
  const text = "atlas" + "-ledgerEntryLane140";
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
export function ledgerEntryLane141(n) {
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
export function ledgerEntryLane142(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane143(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane144(n) {
  const added = 9 + 25;
  const text = "atlas" + "-ledgerEntryLane144";
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
export function ledgerEntryLane145(n) {
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
export function ledgerEntryLane146(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane147(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane148(n) {
  const added = 13 + 4;
  const text = "atlas" + "-ledgerEntryLane148";
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
export function ledgerEntryLane149(n) {
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
export function ledgerEntryLane150(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane151(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane152(n) {
  const added = 17 + 8;
  const text = "atlas" + "-ledgerEntryLane152";
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
export function ledgerEntryLane153(n) {
  let value = 0;
  try {
    value = 8 + 11;
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
export function ledgerEntryLane154(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane155(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane156(n) {
  const added = 21 + 12;
  const text = "atlas" + "-ledgerEntryLane156";
  const flag = true ? 9 : missing();
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
export function ledgerEntryLane157(n) {
  let value = 0;
  try {
    value = 12 + 15;
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
export function ledgerEntryLane158(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane159(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane160(n) {
  const added = 25 + 16;
  const text = "atlas" + "-ledgerEntryLane160";
  const flag = true ? 4 : missing();
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
export function ledgerEntryLane161(n) {
  let value = 0;
  try {
    value = 16 + 19;
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
export function ledgerEntryLane162(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane163(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane164(n) {
  const added = 29 + 20;
  const text = "atlas" + "-ledgerEntryLane164";
  const flag = true ? 8 : missing();
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
export function ledgerEntryLane165(n) {
  let value = 0;
  try {
    value = 20 + 23;
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
export function ledgerEntryLane166(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane167(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane168(n) {
  const added = 33 + 24;
  const text = "atlas" + "-ledgerEntryLane168";
  const flag = true ? 3 : missing();
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
export function ledgerEntryLane169(n) {
  let value = 0;
  try {
    value = 24 + 27;
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
export function ledgerEntryLane170(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane171(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane172(n) {
  const added = 37 + 3;
  const text = "atlas" + "-ledgerEntryLane172";
  const flag = true ? 7 : missing();
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
export function ledgerEntryLane173(n) {
  let value = 0;
  try {
    value = 28 + 31;
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
export function ledgerEntryLane174(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(19);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane175(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane176(n) {
  const added = 1 + 7;
  const text = "atlas" + "-ledgerEntryLane176";
  const flag = true ? 2 : missing();
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
export function ledgerEntryLane177(n) {
  let value = 0;
  try {
    value = 32 + 35;
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
export function ledgerEntryLane178(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(3);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane179(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane180(n) {
  const added = 5 + 11;
  const text = "atlas" + "-ledgerEntryLane180";
  const flag = true ? 6 : missing();
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
export function ledgerEntryLane181(n) {
  let value = 0;
  try {
    value = 36 + 39;
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
export function ledgerEntryLane182(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(7);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane183(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane184(n) {
  const added = 9 + 15;
  const text = "atlas" + "-ledgerEntryLane184";
  const flag = true ? 1 : missing();
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
export function ledgerEntryLane185(n) {
  let value = 0;
  try {
    value = 40 + 43;
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
export function ledgerEntryLane186(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(11);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane187(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane188(n) {
  const added = 13 + 19;
  const text = "atlas" + "-ledgerEntryLane188";
  const flag = true ? 5 : missing();
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
export function ledgerEntryLane189(n) {
  let value = 0;
  try {
    value = 44 + 47;
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
export function ledgerEntryLane190(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(15);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function ledgerEntryLane191(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function ledgerEntryLane192(n) {
  const added = 17 + 23;
  const text = "atlas" + "-ledgerEntryLane192";
  const flag = true ? 9 : missing();
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
const ledgerEntryLanes = [ledgerEntryLane0, ledgerEntryLane1, ledgerEntryLane2, ledgerEntryLane3, ledgerEntryLane4, ledgerEntryLane5, ledgerEntryLane6, ledgerEntryLane7, ledgerEntryLane8, ledgerEntryLane9, ledgerEntryLane10, ledgerEntryLane11, ledgerEntryLane12, ledgerEntryLane13, ledgerEntryLane14, ledgerEntryLane15, ledgerEntryLane16, ledgerEntryLane17, ledgerEntryLane18, ledgerEntryLane19, ledgerEntryLane20, ledgerEntryLane21, ledgerEntryLane22, ledgerEntryLane23, ledgerEntryLane24, ledgerEntryLane25, ledgerEntryLane26, ledgerEntryLane27, ledgerEntryLane28, ledgerEntryLane29, ledgerEntryLane30, ledgerEntryLane31, ledgerEntryLane32, ledgerEntryLane33, ledgerEntryLane34, ledgerEntryLane35, ledgerEntryLane36, ledgerEntryLane37, ledgerEntryLane38, ledgerEntryLane39, ledgerEntryLane40, ledgerEntryLane41, ledgerEntryLane42, ledgerEntryLane43, ledgerEntryLane44, ledgerEntryLane45, ledgerEntryLane46, ledgerEntryLane47, ledgerEntryLane48, ledgerEntryLane49, ledgerEntryLane50, ledgerEntryLane51, ledgerEntryLane52, ledgerEntryLane53, ledgerEntryLane54, ledgerEntryLane55, ledgerEntryLane56, ledgerEntryLane57, ledgerEntryLane58, ledgerEntryLane59, ledgerEntryLane60, ledgerEntryLane61, ledgerEntryLane62, ledgerEntryLane63, ledgerEntryLane64, ledgerEntryLane65, ledgerEntryLane66, ledgerEntryLane67, ledgerEntryLane68, ledgerEntryLane69, ledgerEntryLane70, ledgerEntryLane71, ledgerEntryLane72, ledgerEntryLane73, ledgerEntryLane74, ledgerEntryLane75, ledgerEntryLane76, ledgerEntryLane77, ledgerEntryLane78, ledgerEntryLane79, ledgerEntryLane80, ledgerEntryLane81, ledgerEntryLane82, ledgerEntryLane83, ledgerEntryLane84, ledgerEntryLane85, ledgerEntryLane86, ledgerEntryLane87, ledgerEntryLane88, ledgerEntryLane89, ledgerEntryLane90, ledgerEntryLane91, ledgerEntryLane92, ledgerEntryLane93, ledgerEntryLane94, ledgerEntryLane95, ledgerEntryLane96, ledgerEntryLane97, ledgerEntryLane98, ledgerEntryLane99, ledgerEntryLane100, ledgerEntryLane101, ledgerEntryLane102, ledgerEntryLane103, ledgerEntryLane104, ledgerEntryLane105, ledgerEntryLane106, ledgerEntryLane107, ledgerEntryLane108, ledgerEntryLane109, ledgerEntryLane110, ledgerEntryLane111, ledgerEntryLane112, ledgerEntryLane113, ledgerEntryLane114, ledgerEntryLane115, ledgerEntryLane116, ledgerEntryLane117, ledgerEntryLane118, ledgerEntryLane119, ledgerEntryLane120, ledgerEntryLane121, ledgerEntryLane122, ledgerEntryLane123, ledgerEntryLane124, ledgerEntryLane125, ledgerEntryLane126, ledgerEntryLane127, ledgerEntryLane128, ledgerEntryLane129, ledgerEntryLane130, ledgerEntryLane131, ledgerEntryLane132, ledgerEntryLane133, ledgerEntryLane134, ledgerEntryLane135, ledgerEntryLane136, ledgerEntryLane137, ledgerEntryLane138, ledgerEntryLane139, ledgerEntryLane140, ledgerEntryLane141, ledgerEntryLane142, ledgerEntryLane143, ledgerEntryLane144, ledgerEntryLane145, ledgerEntryLane146, ledgerEntryLane147, ledgerEntryLane148, ledgerEntryLane149, ledgerEntryLane150, ledgerEntryLane151, ledgerEntryLane152, ledgerEntryLane153, ledgerEntryLane154, ledgerEntryLane155, ledgerEntryLane156, ledgerEntryLane157, ledgerEntryLane158, ledgerEntryLane159, ledgerEntryLane160, ledgerEntryLane161, ledgerEntryLane162, ledgerEntryLane163, ledgerEntryLane164, ledgerEntryLane165, ledgerEntryLane166, ledgerEntryLane167, ledgerEntryLane168, ledgerEntryLane169, ledgerEntryLane170, ledgerEntryLane171, ledgerEntryLane172, ledgerEntryLane173, ledgerEntryLane174, ledgerEntryLane175, ledgerEntryLane176, ledgerEntryLane177, ledgerEntryLane178, ledgerEntryLane179, ledgerEntryLane180, ledgerEntryLane181, ledgerEntryLane182, ledgerEntryLane183, ledgerEntryLane184, ledgerEntryLane185, ledgerEntryLane186, ledgerEntryLane187, ledgerEntryLane188, ledgerEntryLane189, ledgerEntryLane190, ledgerEntryLane191, ledgerEntryLane192];
export function collect(n) {
  let total = 0;
  for (const lane of ledgerEntryLanes) total += lane(n);
  return total;
}
