// src/shared/boot.js
// Imported by every entry. Everything it reaches is shared and goes into chunk.js.
import tables from "./tables.json";
import { sheets } from "./styles.js";
import { markUrl } from "./marks.js";
import { collect as shared000 } from "./mod-000.js";
import { collect as shared001 } from "./mod-001.js";
import { collect as shared002 } from "./mod-002.js";
import { collect as shared003 } from "./mod-003.js";
import { collect as shared004 } from "./mod-004.js";
import { collect as shared005 } from "./mod-005.js";
import { collect as shared006 } from "./mod-006.js";
import { collect as shared007 } from "./mod-007.js";
import { collect as shared008 } from "./mod-008.js";
import { collect as shared009 } from "./mod-009.js";
import { collect as shared010 } from "./mod-010.js";
import { collect as shared011 } from "./mod-011.js";
import { collect as shared012 } from "./mod-012.js";
import { collect as shared013 } from "./mod-013.js";
import { collect as shared014 } from "./mod-014.js";
import { collect as shared015 } from "./mod-015.js";
import { collect as shared016 } from "./mod-016.js";
import { collect as shared017 } from "./mod-017.js";
import { collect as shared018 } from "./mod-018.js";
import { collect as shared019 } from "./mod-019.js";
import { collect as shared020 } from "./mod-020.js";
import { collect as shared021 } from "./mod-021.js";
import { collect as shared022 } from "./mod-022.js";
import { collect as shared023 } from "./mod-023.js";
import { collect as shared024 } from "./mod-024.js";
import { collect as shared025 } from "./mod-025.js";
import { collect as shared026 } from "./mod-026.js";
import { collect as shared027 } from "./mod-027.js";
import { collect as shared028 } from "./mod-028.js";
import { collect as shared029 } from "./mod-029.js";
import { collect as shared030 } from "./mod-030.js";
import { collect as shared031 } from "./mod-031.js";
import { collect as shared032 } from "./mod-032.js";
import { collect as shared033 } from "./mod-033.js";
import { collect as shared034 } from "./mod-034.js";
import { collect as shared035 } from "./mod-035.js";
import { collect as shared036 } from "./mod-036.js";
import { collect as shared037 } from "./mod-037.js";
import { collect as shared038 } from "./mod-038.js";
import { collect as shared039 } from "./mod-039.js";
import { collect as shared040 } from "./mod-040.js";
import { collect as shared041 } from "./mod-041.js";
import { collect as shared042 } from "./mod-042.js";
import { collect as shared043 } from "./mod-043.js";
import { collect as shared044 } from "./mod-044.js";
import { collect as shared045 } from "./mod-045.js";
import { collect as shared046 } from "./mod-046.js";
import { collect as shared047 } from "./mod-047.js";
import { collect as shared048 } from "./mod-048.js";
import { collect as shared049 } from "./mod-049.js";
import { collect as shared050 } from "./mod-050.js";
import { collect as shared051 } from "./mod-051.js";
import { collect as shared052 } from "./mod-052.js";
import { collect as shared053 } from "./mod-053.js";
import { collect as shared054 } from "./mod-054.js";
import { collect as shared055 } from "./mod-055.js";
import { collect as shared056 } from "./mod-056.js";
import { collect as shared057 } from "./mod-057.js";
import { collect as shared058 } from "./mod-058.js";
import { collect as shared059 } from "./mod-059.js";
import { collect as shared060 } from "./mod-060.js";
import { collect as shared061 } from "./mod-061.js";
import { collect as shared062 } from "./mod-062.js";
import { collect as shared063 } from "./mod-063.js";
import { collect as shared064 } from "./mod-064.js";
import { collect as shared065 } from "./mod-065.js";
import { collect as shared066 } from "./mod-066.js";
import { collect as shared067 } from "./mod-067.js";
import { collect as shared068 } from "./mod-068.js";
import { collect as shared069 } from "./mod-069.js";
import { collect as shared070 } from "./mod-070.js";
import { collect as shared071 } from "./mod-071.js";
import { collect as shared072 } from "./mod-072.js";
import { collect as shared073 } from "./mod-073.js";
import { collect as shared074 } from "./mod-074.js";
import { collect as shared075 } from "./mod-075.js";
import { collect as shared076 } from "./mod-076.js";
import { collect as shared077 } from "./mod-077.js";
import { collect as shared078 } from "./mod-078.js";
import { collect as shared079 } from "./mod-079.js";
import { collect as shared080 } from "./mod-080.js";
import { collect as shared081 } from "./mod-081.js";
import { collect as shared082 } from "./mod-082.js";
import { collect as shared083 } from "./mod-083.js";
import { collect as shared084 } from "./mod-084.js";
import { collect as shared085 } from "./mod-085.js";
import { collect as shared086 } from "./mod-086.js";
import { collect as shared087 } from "./mod-087.js";
import { collect as shared088 } from "./mod-088.js";
import { collect as shared089 } from "./mod-089.js";
import { collect as shared090 } from "./mod-090.js";
import { collect as shared091 } from "./mod-091.js";
import { collect as shared092 } from "./mod-092.js";
import { collect as shared093 } from "./mod-093.js";
import { collect as shared094 } from "./mod-094.js";
import { collect as shared095 } from "./mod-095.js";
import { collect as shared096 } from "./mod-096.js";
import { collect as shared097 } from "./mod-097.js";
import { collect as shared098 } from "./mod-098.js";
import { collect as shared099 } from "./mod-099.js";
import { collect as shared100 } from "./mod-100.js";
import { collect as shared101 } from "./mod-101.js";
import { collect as shared102 } from "./mod-102.js";
import { collect as shared103 } from "./mod-103.js";
import { collect as shared104 } from "./mod-104.js";
import { collect as shared105 } from "./mod-105.js";
import { collect as shared106 } from "./mod-106.js";
import { collect as shared107 } from "./mod-107.js";
import { collect as shared108 } from "./mod-108.js";
import { collect as shared109 } from "./mod-109.js";
import { collect as shared110 } from "./mod-110.js";
import { collect as shared111 } from "./mod-111.js";
import { collect as shared112 } from "./mod-112.js";
import { collect as shared113 } from "./mod-113.js";
import { collect as shared114 } from "./mod-114.js";
import { collect as shared115 } from "./mod-115.js";
import { collect as shared116 } from "./mod-116.js";
import { collect as shared117 } from "./mod-117.js";
import { collect as shared118 } from "./mod-118.js";
import { collect as shared119 } from "./mod-119.js";
import { collect as shared120 } from "./mod-120.js";
import { collect as shared121 } from "./mod-121.js";
import { collect as shared122 } from "./mod-122.js";
import { collect as shared123 } from "./mod-123.js";
import { collect as shared124 } from "./mod-124.js";
export function boot(n) {
  return shared000(n) + shared001(n) + shared002(n) + shared003(n) + shared004(n) + shared005(n) + shared006(n) + shared007(n) + shared008(n) + shared009(n) + shared010(n) + shared011(n) + shared012(n) + shared013(n) + shared014(n) + shared015(n) + shared016(n) + shared017(n) + shared018(n) + shared019(n) + shared020(n) + shared021(n) + shared022(n) + shared023(n) + shared024(n) + shared025(n) + shared026(n) + shared027(n) + shared028(n) + shared029(n) + shared030(n) + shared031(n) + shared032(n) + shared033(n) + shared034(n) + shared035(n) + shared036(n) + shared037(n) + shared038(n) + shared039(n) + shared040(n) + shared041(n) + shared042(n) + shared043(n) + shared044(n) + shared045(n) + shared046(n) + shared047(n) + shared048(n) + shared049(n) + shared050(n) + shared051(n) + shared052(n) + shared053(n) + shared054(n) + shared055(n) + shared056(n) + shared057(n) + shared058(n) + shared059(n) + shared060(n) + shared061(n) + shared062(n) + shared063(n) + shared064(n) + shared065(n) + shared066(n) + shared067(n) + shared068(n) + shared069(n) + shared070(n) + shared071(n) + shared072(n) + shared073(n) + shared074(n) + shared075(n) + shared076(n) + shared077(n) + shared078(n) + shared079(n) + shared080(n) + shared081(n) + shared082(n) + shared083(n) + shared084(n) + shared085(n) + shared086(n) + shared087(n) + shared088(n) + shared089(n) + shared090(n) + shared091(n) + shared092(n) + shared093(n) + shared094(n) + shared095(n) + shared096(n) + shared097(n) + shared098(n) + shared099(n) + shared100(n) + shared101(n) + shared102(n) + shared103(n) + shared104(n) + shared105(n) + shared106(n) + shared107(n) + shared108(n) + shared109(n) + shared110(n) + shared111(n) + shared112(n) + shared113(n) + shared114(n) + shared115(n) + shared116(n) + shared117(n) + shared118(n) + shared119(n) + shared120(n) + shared121(n) + shared122(n) + shared123(n) + shared124(n) + tables.lanes + sheets + markUrl.length;
}
export function bootLane0(n) {
  const added = 0 + 1;
  const text = "atlas" + "-bootLane0";
  const flag = true ? 5 : missing();
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
export function bootLane1(n) {
  let value = 0;
  try {
    value = 1 + 4;
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
export function bootLane2(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane3(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane4(n) {
  const added = 4 + 5;
  const text = "atlas" + "-bootLane4";
  const flag = true ? 9 : missing();
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
export function bootLane5(n) {
  let value = 0;
  try {
    value = 5 + 8;
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
export function bootLane6(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane7(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane8(n) {
  const added = 8 + 9;
  const text = "atlas" + "-bootLane8";
  const flag = true ? 4 : missing();
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
export function bootLane9(n) {
  let value = 0;
  try {
    value = 9 + 12;
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
export function bootLane10(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane11(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane12(n) {
  const added = 12 + 13;
  const text = "atlas" + "-bootLane12";
  const flag = true ? 8 : missing();
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
export function bootLane13(n) {
  let value = 0;
  try {
    value = 13 + 16;
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
export function bootLane14(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane15(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane16(n) {
  const added = 16 + 17;
  const text = "atlas" + "-bootLane16";
  const flag = true ? 3 : missing();
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
export function bootLane17(n) {
  let value = 0;
  try {
    value = 17 + 20;
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
export function bootLane18(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane19(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane20(n) {
  const added = 20 + 21;
  const text = "atlas" + "-bootLane20";
  const flag = true ? 7 : missing();
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
export function bootLane21(n) {
  let value = 0;
  try {
    value = 21 + 24;
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
export function bootLane22(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane23(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane24(n) {
  const added = 24 + 25;
  const text = "atlas" + "-bootLane24";
  const flag = true ? 2 : missing();
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
export function bootLane25(n) {
  let value = 0;
  try {
    value = 25 + 28;
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
export function bootLane26(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane27(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane28(n) {
  const added = 28 + 4;
  const text = "atlas" + "-bootLane28";
  const flag = true ? 6 : missing();
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
export function bootLane29(n) {
  let value = 0;
  try {
    value = 29 + 32;
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
export function bootLane30(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane31(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane32(n) {
  const added = 32 + 8;
  const text = "atlas" + "-bootLane32";
  const flag = true ? 1 : missing();
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
export function bootLane33(n) {
  let value = 0;
  try {
    value = 33 + 36;
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
export function bootLane34(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane35(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane36(n) {
  const added = 36 + 12;
  const text = "atlas" + "-bootLane36";
  const flag = true ? 5 : missing();
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
export function bootLane37(n) {
  let value = 0;
  try {
    value = 37 + 40;
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
export function bootLane38(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane39(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane40(n) {
  const added = 0 + 16;
  const text = "atlas" + "-bootLane40";
  const flag = true ? 9 : missing();
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
export function bootLane41(n) {
  let value = 0;
  try {
    value = 41 + 44;
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
export function bootLane42(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane43(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane44(n) {
  const added = 4 + 20;
  const text = "atlas" + "-bootLane44";
  const flag = true ? 4 : missing();
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
export function bootLane45(n) {
  let value = 0;
  try {
    value = 45 + 48;
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
export function bootLane46(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane47(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane48(n) {
  const added = 8 + 24;
  const text = "atlas" + "-bootLane48";
  const flag = true ? 8 : missing();
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
export function bootLane49(n) {
  let value = 0;
  try {
    value = 49 + 2;
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
export function bootLane50(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane51(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane52(n) {
  const added = 12 + 3;
  const text = "atlas" + "-bootLane52";
  const flag = true ? 3 : missing();
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
export function bootLane53(n) {
  let value = 0;
  try {
    value = 3 + 6;
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
export function bootLane54(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane55(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane56(n) {
  const added = 16 + 7;
  const text = "atlas" + "-bootLane56";
  const flag = true ? 7 : missing();
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
export function bootLane57(n) {
  let value = 0;
  try {
    value = 7 + 10;
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
export function bootLane58(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane59(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane60(n) {
  const added = 20 + 11;
  const text = "atlas" + "-bootLane60";
  const flag = true ? 2 : missing();
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
export function bootLane61(n) {
  let value = 0;
  try {
    value = 11 + 14;
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
export function bootLane62(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane63(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane64(n) {
  const added = 24 + 15;
  const text = "atlas" + "-bootLane64";
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
export function bootLane65(n) {
  let value = 0;
  try {
    value = 15 + 18;
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
export function bootLane66(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane67(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane68(n) {
  const added = 28 + 19;
  const text = "atlas" + "-bootLane68";
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
export function bootLane69(n) {
  let value = 0;
  try {
    value = 19 + 22;
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
export function bootLane70(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane71(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane72(n) {
  const added = 32 + 23;
  const text = "atlas" + "-bootLane72";
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
export function bootLane73(n) {
  let value = 0;
  try {
    value = 23 + 26;
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
export function bootLane74(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane75(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane76(n) {
  const added = 36 + 2;
  const text = "atlas" + "-bootLane76";
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
export function bootLane77(n) {
  let value = 0;
  try {
    value = 27 + 30;
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
export function bootLane78(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane79(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane80(n) {
  const added = 0 + 6;
  const text = "atlas" + "-bootLane80";
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
export function bootLane81(n) {
  let value = 0;
  try {
    value = 31 + 34;
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
export function bootLane82(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane83(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane84(n) {
  const added = 4 + 10;
  const text = "atlas" + "-bootLane84";
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
export function bootLane85(n) {
  let value = 0;
  try {
    value = 35 + 38;
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
export function bootLane86(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane87(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane88(n) {
  const added = 8 + 14;
  const text = "atlas" + "-bootLane88";
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
export function bootLane89(n) {
  let value = 0;
  try {
    value = 39 + 42;
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
export function bootLane90(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane91(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane92(n) {
  const added = 12 + 18;
  const text = "atlas" + "-bootLane92";
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
export function bootLane93(n) {
  let value = 0;
  try {
    value = 43 + 46;
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
export function bootLane94(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane95(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane96(n) {
  const added = 16 + 22;
  const text = "atlas" + "-bootLane96";
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
export function bootLane97(n) {
  let value = 0;
  try {
    value = 47 + 0;
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
export function bootLane98(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane99(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane100(n) {
  const added = 20 + 1;
  const text = "atlas" + "-bootLane100";
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
export function bootLane101(n) {
  let value = 0;
  try {
    value = 1 + 4;
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
export function bootLane102(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane103(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane104(n) {
  const added = 24 + 5;
  const text = "atlas" + "-bootLane104";
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
export function bootLane105(n) {
  let value = 0;
  try {
    value = 5 + 8;
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
export function bootLane106(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane107(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane108(n) {
  const added = 28 + 9;
  const text = "atlas" + "-bootLane108";
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
export function bootLane109(n) {
  let value = 0;
  try {
    value = 9 + 12;
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
export function bootLane110(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane111(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane112(n) {
  const added = 32 + 13;
  const text = "atlas" + "-bootLane112";
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
export function bootLane113(n) {
  let value = 0;
  try {
    value = 13 + 16;
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
export function bootLane114(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane115(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane116(n) {
  const added = 36 + 17;
  const text = "atlas" + "-bootLane116";
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
export function bootLane117(n) {
  let value = 0;
  try {
    value = 17 + 20;
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
export function bootLane118(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane119(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane120(n) {
  const added = 0 + 21;
  const text = "atlas" + "-bootLane120";
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
export function bootLane121(n) {
  let value = 0;
  try {
    value = 21 + 24;
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
export function bootLane122(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane123(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane124(n) {
  const added = 4 + 25;
  const text = "atlas" + "-bootLane124";
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
export function bootLane125(n) {
  let value = 0;
  try {
    value = 25 + 28;
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
export function bootLane126(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane127(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane128(n) {
  const added = 8 + 4;
  const text = "atlas" + "-bootLane128";
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
export function bootLane129(n) {
  let value = 0;
  try {
    value = 29 + 32;
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
export function bootLane130(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane131(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane132(n) {
  const added = 12 + 8;
  const text = "atlas" + "-bootLane132";
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
export function bootLane133(n) {
  let value = 0;
  try {
    value = 33 + 36;
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
export function bootLane134(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane135(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane136(n) {
  const added = 16 + 12;
  const text = "atlas" + "-bootLane136";
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
export function bootLane137(n) {
  let value = 0;
  try {
    value = 37 + 40;
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
export function bootLane138(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane139(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane140(n) {
  const added = 20 + 16;
  const text = "atlas" + "-bootLane140";
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
export function bootLane141(n) {
  let value = 0;
  try {
    value = 41 + 44;
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
export function bootLane142(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane143(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane144(n) {
  const added = 24 + 20;
  const text = "atlas" + "-bootLane144";
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
export function bootLane145(n) {
  let value = 0;
  try {
    value = 45 + 48;
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
export function bootLane146(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane147(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane148(n) {
  const added = 28 + 24;
  const text = "atlas" + "-bootLane148";
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
export function bootLane149(n) {
  let value = 0;
  try {
    value = 49 + 2;
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
export function bootLane150(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane151(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane152(n) {
  const added = 32 + 3;
  const text = "atlas" + "-bootLane152";
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
export function bootLane153(n) {
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
export function bootLane154(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane155(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane156(n) {
  const added = 36 + 7;
  const text = "atlas" + "-bootLane156";
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
export function bootLane157(n) {
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
export function bootLane158(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane159(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane160(n) {
  const added = 0 + 11;
  const text = "atlas" + "-bootLane160";
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
export function bootLane161(n) {
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
export function bootLane162(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane163(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane164(n) {
  const added = 4 + 15;
  const text = "atlas" + "-bootLane164";
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
export function bootLane165(n) {
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
export function bootLane166(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane167(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane168(n) {
  const added = 8 + 19;
  const text = "atlas" + "-bootLane168";
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
export function bootLane169(n) {
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
export function bootLane170(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane171(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane172(n) {
  const added = 12 + 23;
  const text = "atlas" + "-bootLane172";
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
export function bootLane173(n) {
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
export function bootLane174(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane175(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane176(n) {
  const added = 16 + 2;
  const text = "atlas" + "-bootLane176";
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
export function bootLane177(n) {
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
export function bootLane178(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane179(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane180(n) {
  const added = 20 + 6;
  const text = "atlas" + "-bootLane180";
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
export function bootLane181(n) {
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
export function bootLane182(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane183(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane184(n) {
  const added = 24 + 10;
  const text = "atlas" + "-bootLane184";
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
export function bootLane185(n) {
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
export function bootLane186(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane187(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane188(n) {
  const added = 28 + 14;
  const text = "atlas" + "-bootLane188";
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
export function bootLane189(n) {
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
export function bootLane190(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane191(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane192(n) {
  const added = 32 + 18;
  const text = "atlas" + "-bootLane192";
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
export function bootLane193(n) {
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
export function bootLane194(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane195(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane196(n) {
  const added = 36 + 22;
  const text = "atlas" + "-bootLane196";
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
export function bootLane197(n) {
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
export function bootLane198(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(18);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane199(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane200(n) {
  const added = 0 + 1;
  const text = "atlas" + "-bootLane200";
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
export function bootLane201(n) {
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
export function bootLane202(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(2);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane203(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane204(n) {
  const added = 4 + 5;
  const text = "atlas" + "-bootLane204";
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
export function bootLane205(n) {
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
export function bootLane206(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(6);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane207(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane208(n) {
  const added = 8 + 9;
  const text = "atlas" + "-bootLane208";
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
export function bootLane209(n) {
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
export function bootLane210(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(10);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane211(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane212(n) {
  const added = 12 + 13;
  const text = "atlas" + "-bootLane212";
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
export function bootLane213(n) {
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
export function bootLane214(n) {
  const Math = { abs: function (value) { return value; } };
  const safe = Math.abs(14);
  const roll = globalThis.Math.random();
  const hole = new Array(1);
  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;
}
export function bootLane215(code) {
  return function (value) {
    const folded = 1 + 2;
    return folded + value;
  };
}
export function bootLane216(n) {
  const added = 16 + 17;
  const text = "atlas" + "-bootLane216";
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
export function bootLane217(n) {
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
const bootLanes = [bootLane0, bootLane1, bootLane2, bootLane3, bootLane4, bootLane5, bootLane6, bootLane7, bootLane8, bootLane9, bootLane10, bootLane11, bootLane12, bootLane13, bootLane14, bootLane15, bootLane16, bootLane17, bootLane18, bootLane19, bootLane20, bootLane21, bootLane22, bootLane23, bootLane24, bootLane25, bootLane26, bootLane27, bootLane28, bootLane29, bootLane30, bootLane31, bootLane32, bootLane33, bootLane34, bootLane35, bootLane36, bootLane37, bootLane38, bootLane39, bootLane40, bootLane41, bootLane42, bootLane43, bootLane44, bootLane45, bootLane46, bootLane47, bootLane48, bootLane49, bootLane50, bootLane51, bootLane52, bootLane53, bootLane54, bootLane55, bootLane56, bootLane57, bootLane58, bootLane59, bootLane60, bootLane61, bootLane62, bootLane63, bootLane64, bootLane65, bootLane66, bootLane67, bootLane68, bootLane69, bootLane70, bootLane71, bootLane72, bootLane73, bootLane74, bootLane75, bootLane76, bootLane77, bootLane78, bootLane79, bootLane80, bootLane81, bootLane82, bootLane83, bootLane84, bootLane85, bootLane86, bootLane87, bootLane88, bootLane89, bootLane90, bootLane91, bootLane92, bootLane93, bootLane94, bootLane95, bootLane96, bootLane97, bootLane98, bootLane99, bootLane100, bootLane101, bootLane102, bootLane103, bootLane104, bootLane105, bootLane106, bootLane107, bootLane108, bootLane109, bootLane110, bootLane111, bootLane112, bootLane113, bootLane114, bootLane115, bootLane116, bootLane117, bootLane118, bootLane119, bootLane120, bootLane121, bootLane122, bootLane123, bootLane124, bootLane125, bootLane126, bootLane127, bootLane128, bootLane129, bootLane130, bootLane131, bootLane132, bootLane133, bootLane134, bootLane135, bootLane136, bootLane137, bootLane138, bootLane139, bootLane140, bootLane141, bootLane142, bootLane143, bootLane144, bootLane145, bootLane146, bootLane147, bootLane148, bootLane149, bootLane150, bootLane151, bootLane152, bootLane153, bootLane154, bootLane155, bootLane156, bootLane157, bootLane158, bootLane159, bootLane160, bootLane161, bootLane162, bootLane163, bootLane164, bootLane165, bootLane166, bootLane167, bootLane168, bootLane169, bootLane170, bootLane171, bootLane172, bootLane173, bootLane174, bootLane175, bootLane176, bootLane177, bootLane178, bootLane179, bootLane180, bootLane181, bootLane182, bootLane183, bootLane184, bootLane185, bootLane186, bootLane187, bootLane188, bootLane189, bootLane190, bootLane191, bootLane192, bootLane193, bootLane194, bootLane195, bootLane196, bootLane197, bootLane198, bootLane199, bootLane200, bootLane201, bootLane202, bootLane203, bootLane204, bootLane205, bootLane206, bootLane207, bootLane208, bootLane209, bootLane210, bootLane211, bootLane212, bootLane213, bootLane214, bootLane215, bootLane216, bootLane217];
export function collect(n) {
  let total = 0;
  for (const lane of bootLanes) total += lane(n);
  return total;
}
