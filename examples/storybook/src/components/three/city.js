import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  Fog,
  Group,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  RepeatWrapping,
  SphereGeometry,
  SRGBColorSpace,
} from "three";
import { disposeTree, toneColor } from "./stage.js";

const BLOCK = 18;
const ROAD = 8;
const PITCH = BLOCK + ROAD;
const STREET = (1 << 1) | (1 << 3);
const PARK = 1 << 2;
const ANY = STREET | PARK;

function swell(list) {
  const out = list.slice();
  const color = new Color();
  const target = list.length * 20;
  for (let n = 0; out.length < target; n++) {
    color.set(list[n % list.length]);
    color.offsetHSL((n * 0.137) % 1, ((n % 9) - 4) * 0.09, ((n % 11) - 5) * 0.07);
    out.push("#" + color.getHexString());
  }
  return out;
}

const BRICKS = swell(["#8d4b3c", "#a15a45", "#7c3f34", "#b06a4e", "#965848", "#6e4a3c", "#c4785a", "#4e342e"]);
const HOUSES = swell(["#d36b6b", "#e2c15a", "#6a8fbf", "#7d9a6a", "#c48b6a", "#8d6aa8", "#d08a4c", "#4f7f8f", "#c45c74", "#e8d48b", "#6e8b6a", "#b85c38", "#f2efe6", "#355c7d"]);
const GLASS_TINTS = swell(["#c5d7e4", "#d5e2ea", "#a9c3d4", "#8eafc4", "#e4eef4", "#9fd0c8", "#d7c4b0", "#b9c4de", "#e7d0dc"]);
const WARES = swell(["#6d7370", "#8a8478", "#5e6664", "#9a9284", "#6a5344", "#3e4a55", "#8d6b45"]);
const MODERN = swell(["#f2efe8", "#d5d8dc", "#c8ced4", "#3a4248", "#1f4e89", "#e7e2d6", "#8a3d3d", "#2f3d36"]);
const STONE = swell(["#d9d2c3", "#cfc6b4", "#e6e0d4", "#b7c4b0", "#efe6d4", "#a89880"]);
const AWNINGS = swell(["#c0392b", "#e07a2f", "#1f7a4d", "#1d4e89", "#d4a017", "#7a3e6d", "#0e7c86", "#d64545", "#f2efe6", "#2c3338"]);
const ROOFS = swell(["#6e3a3a", "#3d4a55", "#8a5a32", "#2c3338", "#a33b2b", "#1f4e89", "#6b5b4b", "#c4b7a2"]);
const LEAVES = swell(["#2f7a3a", "#49a14c", "#1f6b32", "#7ea83a", "#c4a24a", "#3e8f7a", "#6aa84f", "#245c30"]);
const CARS = swell(["#d64545", "#e6e8ea", "#1f4e89", "#2f6b4f", "#e0a106", "#6b3fa0", "#c46a2f", "#22262b"]);
const WALLS = BRICKS.concat(HOUSES, MODERN, STONE, WARES);
const STYLES = ["tower", "deco", "modern", "restaurant", "brick", "town", "civic", "church", "plaza", "warehouse", "court", "terrace", "hotel", "stack", "yard"];
const ROLE_COLOR = {
  police: "#2456c9",
  firefighter: "#e4572e",
  criminal: "#6d2430",
  vendor: "#e0a106",
  customer: "#d4654a",
  commuter: "#3e4c5e",
  jogger: "#2faf6e",
  tourist: "#b15ad4",
  worker: "#8d6a3e",
  courier: "#c46a2c",
  gardener: "#2f7a45",
  singer: "#e85d9a",
  dancer: "#f27bb5",
  listener: "#8e6aa8",
  player: "#2f6b4f",
  spectator: "#6a8fbf",
  picnicker: "#d08a4c",
  painter: "#7a5ea8",
  rally: "#c0392b",
  skater: "#1f7a8c",
  photographer: "#3a4248",
  sweeper: "#8a8478",
  guide: "#d4a017",
  student: "#355c7d",
};
const ROLE_SPEED = {
  police: 5.4,
  firefighter: 6.4,
  criminal: 5.8,
  vendor: 0,
  customer: 4.4,
  commuter: 5.5,
  jogger: 7.5,
  tourist: 3.2,
  worker: 5.2,
  courier: 7.4,
  gardener: 2.6,
  singer: 0,
  dancer: 2.2,
  listener: 0,
  player: 6.4,
  spectator: 0,
  picnicker: 0,
  painter: 0,
  rally: 0,
  skater: 9.2,
  photographer: 3,
  sweeper: 2.2,
  guide: 3.4,
  student: 4.6,
};
const GATHERED = {
  singer: "concert",
  dancer: "concert",
  listener: "concert",
  player: "sport",
  spectator: "sport",
  picnicker: "picnic",
  painter: "picnic",
  rally: "rally",
};
const SCRIPTS = {
  criminal: ["case", "watch", "stalk", "close", "snatch", "flee", "alley", "hide", "emerge"],
  courier: ["pickup", "weigh", "carry", "dodge", "drop", "receipt", "return"],
  customer: ["window", "browse", "compare", "queue", "pay", "bag", "leave"],
  tourist: ["arrive", "look", "photo", "read", "wander", "souvenir", "rest"],
  worker: ["commute", "clockin", "shift", "break", "shift", "lunch", "return"],
  skater: ["push", "cruise", "carve", "trick", "recover", "cruise"],
  photographer: ["scout", "seek", "compose", "frame", "check", "relocate"],
  sweeper: ["sweep", "pile", "bin", "sweep", "curb", "rest"],
  guide: ["meet", "walk", "point", "talk", "walk", "quiz", "dismiss"],
  student: ["arrive", "class", "notes", "break", "library", "study", "leave"],
  commuter: ["walk", "wait", "ride", "transfer", "errand", "walk", "ride"],
  firefighter: ["station", "check", "stage", "drill", "rush", "overhaul", "return"],
};
const SHOW = {
  singer: ["sing", "hum", "sing", "bow", "sing", "mingle", "encore"],
  dancer: ["dance", "spin", "pose", "dance", "partner", "pose", "spin"],
  listener: ["listen", "sway", "clap", "listen", "sway", "cheer"],
  player: ["play", "pass", "huddle", "play", "bench", "play", "celebrate"],
  spectator: ["watch", "cheer", "watch", "groan", "watch", "wave"],
  picnicker: ["picnic", "eat", "stroll", "picnic", "toast", "stroll"],
  painter: ["paint", "mix", "stepback", "paint", "detail", "stepback"],
  rally: ["rally", "chant", "march", "rally", "speech", "chant", "march"],
};
const HELI_BODY = { police: "#1d3f86", fire: "#c0392b", medic: "#f7f4ef", news: "#e8eaec" };
const HELI_TRIM = { police: "#f4f7ff", fire: "#f2c14e", medic: "#d7263d", news: "#2456c9" };
const PAL = {
  stone: STONE,
  brick: BRICKS,
  house: HOUSES,
  modern: MODERN,
  ware: WARES,
  glass: GLASS_TINTS,
  roof: ROOFS,
  leaf: LEAVES,
};
// name, district, tiers, shrink, height, width, depth, palette, kind, crown, extras
const FAMILIES = [
  ["pagoda", "sacred", 4, 0.74, 2.3, 1.35, 1.35, "stone", "masonry", "hip", "spire"],
  ["minaret", "sacred", 3, 0.7, 4.2, 0.55, 0.55, "stone", "masonry", "dome", "balcony"],
  ["cloister", "sacred", 1, 1, 3.2, 1.5, 1.2, "stone", "masonry", "hip", "cols court yard"],
  ["chapel", "sacred", 1, 1, 3.6, 0.9, 1.5, "stone", "masonry", "hip", "spire steps clock"],
  ["shrine", "sacred", 2, 0.66, 2.2, 1.1, 1.1, "house", "masonry", "hip", "steps"],
  ["stupa", "sacred", 3, 0.62, 1.8, 1.2, 1.2, "stone", "masonry", "dome", "spire"],
  ["belfry", "sacred", 2, 0.8, 5.5, 0.7, 0.7, "brick", "masonry", "hip", "clock spire frames"],
  ["monastery", "sacred", 2, 0.82, 3.4, 1.6, 1.1, "stone", "masonry", "hip", "court yard wing"],
  ["basilica", "sacred", 1, 1, 4.2, 1.15, 1.7, "stone", "masonry", "hip", "cols dome steps"],
  ["synagogue", "sacred", 1, 1, 3.8, 1.2, 1.3, "stone", "masonry", "dome", "frames steps"],
  ["torii-court", "sacred", 1, 1, 2.6, 1.4, 1.4, "house", "masonry", "hip", "cols yard court"],
  ["oratory", "sacred", 2, 0.7, 3.1, 0.8, 1.2, "brick", "masonry", "hip", "spire frames"],
  ["souk", "market", 1, 1, 2.8, 1.6, 1.15, "house", "masonry", "flat", "awning stall sign"],
  ["arcade", "market", 1, 1, 3.4, 1.7, 0.9, "stone", "masonry", "cornice", "cols awning frames"],
  ["market-hall", "market", 1, 1, 4.2, 1.8, 1.3, "brick", "masonry", "saw", "frames sign"],
  ["bakery", "market", 2, 0.72, 2.6, 0.9, 1.1, "house", "masonry", "hip", "chimney awning sign"],
  ["tea-house", "market", 2, 0.8, 2.4, 1.1, 1.1, "house", "masonry", "hip", "balcony yard awning"],
  ["flower-row", "market", 1, 1, 2.5, 1.5, 0.8, "house", "masonry", "flat", "awning stall"],
  ["book-row", "market", 3, 0.86, 2.8, 0.85, 1.05, "brick", "masonry", "cornice", "frames sign awning"],
  ["spice-court", "market", 1, 1, 2.7, 1.4, 1.4, "house", "masonry", "hip", "court stall awning"],
  ["cloth-hall", "market", 2, 0.78, 3.6, 1.5, 1.05, "brick", "masonry", "hip", "frames cols"],
  ["night-market", "market", 1, 1, 2.4, 1.6, 1.2, "modern", "flat", "flat", "awning stall sign"],
  ["inn", "market", 3, 0.84, 3.2, 1.05, 1.15, "house", "masonry", "hip", "balcony sign steps"],
  ["grocer", "market", 1, 1, 2.6, 1.2, 1, "house", "masonry", "flat", "awning sign stall"],
  ["lecture", "campus", 2, 0.8, 3.8, 1.5, 1.1, "stone", "masonry", "flat", "cols frames steps"],
  ["library", "campus", 3, 0.82, 3.4, 1.3, 1.15, "stone", "masonry", "cornice", "frames cols clock"],
  ["laboratory", "campus", 2, 0.88, 3.6, 1.4, 0.95, "modern", "flat", "flat", "frames antenna chimney"],
  ["dormitory", "campus", 4, 0.9, 2.8, 1.15, 0.8, "brick", "masonry", "flat", "frames balcony"],
  ["quad", "campus", 1, 1, 3.2, 1.6, 1.4, "stone", "masonry", "hip", "court yard cols"],
  ["observatory", "campus", 2, 0.62, 3.2, 1, 1, "stone", "masonry", "dome", "antenna"],
  ["gymnasium", "campus", 1, 1, 3.6, 1.7, 1.15, "brick", "masonry", "saw", "frames"],
  ["greenhouse", "campus", 1, 1, 2.4, 1.5, 1.1, "glass", "glass", "hip", "yard"],
  ["archive", "campus", 3, 0.86, 3, 1.05, 1.05, "stone", "masonry", "cornice", "frames"],
  ["studio", "campus", 2, 0.75, 3.3, 1.2, 1.2, "modern", "flat", "flat", "frames wing"],
  ["theater-school", "campus", 2, 0.7, 4, 1.4, 1.2, "brick", "masonry", "dome", "steps cols"],
  ["union", "campus", 2, 0.84, 3.5, 1.45, 1.1, "modern", "flat", "flat", "awning frames court"],
  ["mill", "works", 3, 0.8, 3.8, 1.1, 1.4, "ware", "masonry", "saw", "chimney"],
  ["silo", "works", 1, 1, 8, 0.55, 0.55, "ware", "masonry", "dome", "chimney"],
  ["foundry", "works", 1, 1, 4.4, 1.7, 1.2, "brick", "masonry", "saw", "chimney crane"],
  ["tank-farm", "works", 1, 1, 3.2, 1.5, 1.3, "ware", "flat", "flat", "chimney"],
  ["gantry", "works", 1, 1, 3.6, 1.6, 1.1, "ware", "masonry", "flat", "crane"],
  ["power-hall", "works", 2, 0.7, 4.6, 1.5, 1.05, "brick", "masonry", "flat", "chimney antenna frames"],
  ["shed-row", "works", 1, 1, 2.8, 1.8, 0.9, "ware", "masonry", "saw", "sign"],
  ["kiln", "works", 2, 0.66, 3.2, 1, 1.3, "brick", "masonry", "hip", "chimney"],
  ["gasometer", "works", 2, 0.9, 4.8, 1.15, 1.15, "ware", "flat", "dome", ""],
  ["water-tower", "works", 2, 0.55, 5.2, 0.7, 0.7, "ware", "masonry", "flat", ""],
  ["substation", "works", 1, 1, 2.6, 1.3, 1, "modern", "flat", "flat", "antenna frames"],
  ["cannery", "works", 2, 0.84, 3.4, 1.6, 1, "brick", "masonry", "saw", "sign chimney"],
  ["lighthouse", "harbor", 3, 0.72, 4.4, 0.6, 0.6, "stone", "masonry", "dome", "lamp"],
  ["boathouse", "harbor", 1, 1, 2.6, 1.5, 0.85, "house", "masonry", "hip", "awning"],
  ["wharf", "harbor", 1, 1, 3.2, 1.8, 0.7, "ware", "masonry", "flat", "crane sign"],
  ["customs", "harbor", 2, 0.8, 3.6, 1.2, 1.1, "stone", "masonry", "cornice", "cols clock steps"],
  ["net-loft", "harbor", 3, 0.86, 2.6, 0.9, 1.2, "house", "masonry", "hip", "balcony"],
  ["ferry-house", "harbor", 1, 1, 3, 1.4, 0.8, "modern", "flat", "flat", "awning sign cols"],
  ["dry-dock", "harbor", 1, 1, 2.4, 1.7, 1.3, "ware", "masonry", "flat", "crane pool"],
  ["beacon", "harbor", 2, 0.6, 5, 0.5, 0.5, "brick", "masonry", "flat", "lamp antenna"],
  ["chandler", "harbor", 2, 0.78, 2.8, 1, 1.15, "house", "masonry", "hip", "awning sign"],
  ["sail-loft", "harbor", 2, 0.9, 3.4, 1.4, 0.75, "ware", "masonry", "saw", "frames"],
  ["lookout", "harbor", 2, 0.64, 3.8, 0.85, 0.85, "stone", "masonry", "hip", "balcony spire"],
  ["lock-house", "harbor", 1, 1, 2.8, 0.9, 1.3, "brick", "masonry", "hip", "pool steps"],
  ["half-timber", "old", 3, 0.9, 2.7, 0.8, 1.05, "house", "masonry", "hip", "frames chimney"],
  ["tower-house", "old", 4, 0.82, 3.2, 0.75, 0.75, "stone", "masonry", "hip", "spire frames"],
  ["gatehouse", "old", 2, 0.7, 3.6, 1.2, 0.7, "brick", "masonry", "hip", "clock arch"],
  ["almshouse", "old", 2, 0.88, 2.8, 1.5, 0.85, "house", "masonry", "hip", "frames chimney"],
  ["weavers", "old", 3, 0.86, 2.9, 0.85, 1.2, "brick", "masonry", "hip", "frames balcony"],
  ["burgher", "old", 3, 0.8, 3.4, 1, 1.05, "stone", "masonry", "cornice", "frames steps"],
  ["guildhall", "old", 2, 0.74, 4, 1.35, 1.15, "stone", "masonry", "hip", "cols clock steps"],
  ["coaching-inn", "old", 2, 0.84, 3.2, 1.4, 1.2, "house", "masonry", "hip", "court awning sign"],
  ["mews", "old", 1, 1, 2.4, 1.6, 0.7, "brick", "masonry", "hip", "frames"],
  ["town-wall", "old", 1, 1, 3.8, 1.5, 0.45, "stone", "masonry", "flat", "spire"],
  ["oriel", "old", 3, 0.84, 3, 0.7, 1, "house", "masonry", "hip", "balcony frames"],
  ["jetty-house", "old", 3, 0.78, 2.6, 0.95, 0.95, "house", "masonry", "hip", "shift chimney"],
  ["museum", "civic", 3, 0.8, 3.6, 1.45, 1.1, "stone", "masonry", "cornice", "cols steps frames"],
  ["courthouse", "civic", 2, 0.72, 4.2, 1.3, 1.2, "stone", "masonry", "dome", "cols steps clock"],
  ["opera", "civic", 2, 0.68, 4.4, 1.4, 1.25, "brick", "masonry", "dome", "cols steps"],
  ["station", "civic", 1, 1, 4.6, 1.9, 0.85, "stone", "masonry", "saw", "clock cols sign"],
  ["hospital", "civic", 4, 0.86, 3, 1.2, 0.9, "modern", "flat", "flat", "frames wing"],
  ["embassy", "civic", 3, 0.8, 3.5, 1.15, 1.1, "stone", "masonry", "cornice", "cols flag steps"],
  ["parliament", "civic", 2, 0.7, 4.8, 1.6, 1.05, "stone", "masonry", "dome", "cols spire clock"],
  ["post", "civic", 2, 0.84, 3.2, 1.1, 1, "brick", "masonry", "flat", "sign frames"],
  ["firehouse", "civic", 2, 0.8, 3.4, 1.25, 1.15, "brick", "masonry", "flat", "sign frames"],
  ["school", "civic", 3, 0.88, 3, 1.4, 0.9, "brick", "masonry", "hip", "frames yard"],
  ["aquarium", "civic", 2, 0.74, 3.4, 1.5, 1.2, "modern", "glass", "dome", "pool"],
  ["planetarium", "civic", 1, 1, 3.2, 1.3, 1.3, "modern", "flat", "dome", "antenna"],
  ["orangery", "garden", 1, 1, 2.8, 1.6, 1, "glass", "glass", "hip", "yard"],
  ["folly", "garden", 2, 0.6, 3.2, 0.7, 0.7, "stone", "masonry", "dome", "cols yard"],
  ["palm-house", "garden", 1, 1, 3.6, 1.4, 1.4, "glass", "glass", "dome", "yard"],
  ["pavilion", "garden", 1, 1, 2.4, 1.3, 1.3, "house", "masonry", "hip", "cols yard court"],
  ["pergola", "garden", 1, 1, 2.2, 1.6, 0.6, "house", "masonry", "flat", "cols yard"],
  ["bandstand", "garden", 1, 1, 2.2, 1.1, 1.1, "house", "masonry", "hip", "cols court"],
  ["bothy", "garden", 1, 1, 2.3, 0.8, 1, "house", "masonry", "hip", "chimney yard"],
  ["summer-house", "garden", 2, 0.7, 2.5, 1.1, 1.1, "house", "masonry", "hip", "balcony yard"],
  ["aviary", "garden", 1, 1, 3, 1.2, 1.2, "modern", "glass", "dome", "yard"],
  ["belvedere", "garden", 2, 0.64, 3.4, 0.9, 0.9, "stone", "masonry", "dome", "balcony yard"],
  ["potting", "garden", 1, 1, 2.2, 1.3, 0.8, "brick", "masonry", "saw", "yard"],
  ["cascade-house", "garden", 2, 0.8, 2.6, 1.2, 0.9, "stone", "masonry", "hip", "pool yard steps"],
  ["needle", "skyline", 4, 0.72, 6.5, 0.7, 0.7, "glass", "glass", "flat", "antenna spire"],
  ["slab", "skyline", 1, 1, 16, 1.1, 0.7, "glass", "glass", "flat", "frames antenna"],
  ["twins", "skyline", 2, 0.92, 12, 0.55, 0.55, "modern", "glass", "flat", "wing antenna"],
  ["setback", "skyline", 5, 0.78, 3.4, 1.3, 1.15, "stone", "masonry", "cornice", "antenna"],
  ["crown-tower", "skyline", 3, 0.7, 6, 0.9, 0.9, "modern", "flat", "dome", "spire antenna"],
  ["ziggurat", "skyline", 5, 0.8, 2.4, 1.45, 1.45, "stone", "masonry", "flat", "steps"],
  ["lantern", "skyline", 3, 0.66, 4.2, 0.8, 0.8, "glass", "glass", "dome", "lamp"],
  ["diagrid", "skyline", 2, 0.8, 10, 0.85, 0.85, "modern", "glass", "flat", "antenna frames"],
  ["bridge-deck", "skyline", 1, 1, 3.2, 1.8, 0.4, "modern", "flat", "flat", "cols"],
  ["campanile", "skyline", 4, 0.86, 4.4, 0.5, 0.5, "brick", "masonry", "hip", "clock spire"],
  ["pinnacle", "skyline", 3, 0.6, 7, 0.65, 0.65, "glass", "glass", "spire", "antenna"],
  ["capitol", "skyline", 2, 0.64, 5, 1.2, 1.2, "stone", "masonry", "dome", "cols steps"],
];
const FAMILY_BOOK = {};
for (let familyIndex = 0; familyIndex < FAMILIES.length; familyIndex++) {
  const district = FAMILIES[familyIndex][1];
  if (!FAMILY_BOOK[district]) FAMILY_BOOK[district] = [];
  FAMILY_BOOK[district].push(FAMILIES[familyIndex]);
}

function makeRand(seed) {
  let value = seed >>> 0;
  return function () {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function snap(value, step) {
  return Math.max(step, Math.round(value / step) * step);
}

function pick(rand, list) {
  return list[Math.floor(rand() * list.length)];
}

function makeFacade(wall, pane) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const g = canvas.getContext("2d");
  g.fillStyle = wall;
  g.fillRect(0, 0, 128, 128);
  g.fillStyle = pane;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) g.fillRect(8 + x * 32, 10 + y * 32, 16, 18);
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
}

function centroid(q) {
  let x = 0;
  let z = 0;
  for (let i = 0; i < q.length; i++) {
    x += q[i].x;
    z += q[i].z;
  }
  return { x: x / q.length, z: z / q.length };
}

function insetQuad(corners, margin) {
  const c = centroid(corners);
  return corners.map(function (p) {
    const dx = c.x - p.x;
    const dz = c.z - p.z;
    const len = Math.hypot(dx, dz) || 1;
    const m = Math.min(margin, len * 0.46);
    return { x: p.x + (dx / len) * m, z: p.z + (dz / len) * m };
  });
}

function inside(x, z, poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const zi = poly[i].z;
    const xj = poly[j].x;
    const zj = poly[j].z;
    const cross = zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / ((zj - zi) || 0.00001) + xi;
    if (cross) hit = !hit;
  }
  return hit;
}

function streetYaw(q) {
  let best = 0;
  let bestLen = -1;
  for (let i = 0; i < q.length; i++) {
    const a = q[i];
    const b = q[(i + 1) % q.length];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = dx * dx + dz * dz;
    if (len > bestLen) {
      bestLen = len;
      best = Math.atan2(-dz, dx);
    }
  }
  return best;
}

function catmull(pts, steps) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        z: 0.5 * (2 * p1.z + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3),
      });
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function curve(a, b, bow) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len = Math.hypot(dx, dz) || 1;
  const cx = (a.x + b.x) / 2 + (-dz / len) * bow;
  const cz = (a.z + b.z) / 2 + (dx / len) * bow;
  const steps = Math.max(8, Math.ceil(len / 1.7));
  const pts = [];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const u = 1 - t;
    pts.push({
      x: u * u * a.x + 2 * u * t * cx + t * t * b.x,
      z: u * u * a.z + 2 * u * t * cz + t * t * b.z,
    });
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z));
  }
  return { pts: pts, cum: cum, len: cum[cum.length - 1] };
}

function offsetPoly(points, dist) {
  const out = [];
  for (let i = 0; i < points.length; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    let tx = next.x - prev.x;
    let tz = next.z - prev.z;
    const mag = Math.hypot(tx, tz) || 1;
    tx /= mag;
    tz /= mag;
    out.push({ x: points[i].x - tz * dist, y: points[i].y || 0, z: points[i].z + tx * dist });
  }
  return out;
}

function addRibbon(ribbon, points, half, y) {
  if (!points || points.length < 2) return;
  const base = ribbon.pos.length / 3;
  for (let i = 0; i < points.length; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    let tx = next.x - prev.x;
    let tz = next.z - prev.z;
    const mag = Math.hypot(tx, tz) || 1;
    tx /= mag;
    tz /= mag;
    const ox = -tz * half;
    const oz = tx * half;
    const gy = (points[i].y || 0) + y;
    ribbon.pos.push(points[i].x + ox, gy, points[i].z + oz);
    ribbon.pos.push(points[i].x - ox, gy, points[i].z - oz);
  }
  for (let i = 0; i < points.length - 1; i++) {
    const a = base + i * 2;
    ribbon.idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
}

function spansOf(points, wetAt) {
  const out = [];
  let run = [];
  let flag = null;
  for (let i = 0; i < points.length; i++) {
    const next = wetAt(points[i]);
    if (flag === null || next === flag) {
      run.push(points[i]);
      flag = next;
    } else {
      run.push(points[i]);
      if (run.length > 1) out.push({ wet: flag, pts: run });
      run = [points[i]];
      flag = next;
    }
  }
  if (run.length > 1) out.push({ wet: flag, pts: run });
  return out;
}

export function city(stage, props) {
  const rows = Math.max(1, props.rows | 0);
  const span = Math.max(12, Math.min(16, 10 + Math.floor(rows / 4)));
  const side = Math.max(8, Math.round(span * 2.5));
  const size = side * PITCH + ROAD;
  const rand = makeRand((Math.random() * 0x100000000) ^ (side * 917) ^ (rows * 131));
  const peopleCount = Math.max(4200, Math.min(9000, Math.round(side * side * 7)));
  const carCount = Math.max(320, Math.min(760, side * 8));
  const busCount = Math.max(40, Math.min(72, Math.round(side * 0.75)));
  const ambulanceCount = Math.max(14, Math.min(24, Math.round(side * 0.24)));
  const policeCarCount = Math.max(20, Math.min(36, Math.round(side * 0.38)));
  const fireTruckCount = Math.max(14, Math.min(24, Math.round(side * 0.24)));
  const heliCount = Math.max(8, Math.min(14, 6 + Math.floor(span / 2)));
  const fireCount = Math.max(12, Math.min(20, Math.round(side * 0.2)));
  const root = new Group();
  const cells = Math.ceil(size);
  const mask = new Uint8Array(cells * cells);
  const wet = new Uint8Array(cells * cells);
  const WATER = 0.55;
  const hills = [];
  const hillCount = 4 + irand(3);
  for (let h = 0; h < hillCount; h++) {
    hills.push({
      x: rand() * size,
      z: rand() * size,
      r: 150 + rand() * 160,
      h: 7 + rand() * 13,
    });
  }
  const ridge = {
    x: size * (0.22 + rand() * 0.56),
    z: size * (0.22 + rand() * 0.56),
    ang: rand() * Math.PI,
    len: size * (0.4 + rand() * 0.35),
    h: 6 + rand() * 10,
    w: 48 + rand() * 50,
  };
  const coast = rand() * Math.PI * 2;
  const slopeAmp = 5 + rand() * 7;
  const riverCtrl = [];
  let riverX = size * (0.3 + rand() * 0.4);
  for (let s = 0; s <= 8; s++) {
    riverCtrl.push({ x: riverX, z: (s / 8) * size });
    riverX += (rand() - 0.5) * (size * 0.055);
    riverX = Math.max(size * 0.12, Math.min(size * 0.88, riverX));
  }
  const riverPts = catmull(riverCtrl, 12);
  const pads = [];
  const padBins = new Map();
  function rememberPad(x, z, y, r) {
    const pad = { x: x, z: z, y: y, r: r };
    pads.push(pad);
    const key = ((x / 48) | 0) + "," + ((z / 48) | 0);
    let list = padBins.get(key);
    if (!list) {
      list = [];
      padBins.set(key, list);
    }
    list.push(pad);
  }
  function distToSeg(x, z, a, b) {
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len2 = dx * dx + dz * dz || 1;
    let t = ((x - a.x) * dx + (z - a.z) * dz) / len2;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
    return Math.hypot(a.x + dx * t - x, a.z + dz * t - z);
  }
  function riverDist(x, z) {
    let best = 1e9;
    for (let i = 1; i < riverPts.length; i++) {
      const d = distToSeg(x, z, riverPts[i - 1], riverPts[i]);
      if (d < best) best = d;
    }
    return best;
  }
  function elev(x, z) {
    let h = 0.8;
    for (let i = 0; i < hills.length; i++) {
      const hill = hills[i];
      const d = Math.hypot(x - hill.x, z - hill.z) / hill.r;
      if (d >= 1) continue;
      const s = 1 - d;
      h += hill.h * s * s * (3 - 2 * s);
    }
    const dx = x - ridge.x;
    const dz = z - ridge.z;
    const along = dx * Math.cos(ridge.ang) + dz * Math.sin(ridge.ang);
    const across = -dx * Math.sin(ridge.ang) + dz * Math.cos(ridge.ang);
    const halfLen = ridge.len * 0.5;
    if (Math.abs(along) < halfLen) {
      const ad = Math.abs(across) / ridge.w;
      if (ad < 1) {
        const s = 1 - ad;
        const taper = 1 - Math.abs(along) / halfLen;
        h += ridge.h * s * s * taper;
      }
    }
    const shore = Math.cos(coast) * (x / size) + Math.sin(coast) * (z / size);
    h += shore * slopeAmp;
    h += Math.sin(x * 0.018 + coast) * Math.cos(z * 0.015) * 1.8;
    h += Math.sin(x * 0.006 + z * 0.008) * 2.8;
    const valley = Math.min(1, riverDist(x, z) / 78);
    const carve = valley * valley * (3 - 2 * valley);
    h = Math.max(0.35, h) * (0.74 + 0.26 * carve);
    return h < 0 ? 0 : h;
  }
  function terrace(x, z, h) {
    const cx = (x / 48) | 0;
    const cz = (z / 48) | 0;
    let best = h;
    let bestW = 0;
    for (let gz = -1; gz <= 1; gz++) {
      for (let gx = -1; gx <= 1; gx++) {
        const list = padBins.get(cx + gx + "," + (cz + gz));
        if (!list) continue;
        for (let i = 0; i < list.length; i++) {
          const pad = list[i];
          const d = Math.hypot(x - pad.x, z - pad.z);
          const skirt = 4.5;
          if (d >= pad.r + skirt) continue;
          let w = 1;
          if (d > pad.r) {
            const t = 1 - (d - pad.r) / skirt;
            w = t * t * (3 - 2 * t);
          }
          if (w > bestW) {
            bestW = w;
            best = h * (1 - w) + pad.y * w;
          }
        }
      }
    }
    return best;
  }
  const WATER_HALF = 5.6;
  function grade(points, deck) {
    for (let i = 0; i < points.length; i++) {
      points[i].y = elev(points[i].x, points[i].z);
      points[i].bridge = false;
    }
  }
  function gradeRoad(points) {
    for (let i = 0; i < points.length; i++) {
      points[i].y = elev(points[i].x, points[i].z);
      points[i].bridge = false;
    }
  }
  function addTerrain() {
    const seg = Math.max(48, side * 3);
    const stride = seg + 1;
    const pos = new Float32Array(stride * stride * 3);
    const col = new Float32Array(stride * stride * 3);
    const idx = [];
    const sand = new Color("#c6a56e");
    const grass = new Color("#4f7a34");
    const loam = new Color("#7a5a38");
    const rock = new Color("#8e978c");
    const tint = new Color();
    let cursor = 0;
    for (let j = 0; j <= seg; j++) {
      for (let i = 0; i <= seg; i++) {
        const x = (i / seg) * size;
        const z = (j / seg) * size;
        const wetHere = isWet(x, z);
        let h = terrace(x, z, elev(x, z));
        if (wetHere) h -= 0.55;
        pos[cursor] = x;
        pos[cursor + 1] = h;
        pos[cursor + 2] = z;
        const high = Math.max(0, Math.min(1, (h - 0.8) / 12));
        tint.copy(sand).lerp(grass, high * 0.58);
        if (wetHere || riverDist(x, z) < 12) tint.lerp(loam, wetHere ? 0.55 : 0.22);
        if (h > 14) tint.lerp(rock, Math.min(0.45, (h - 14) / 20));
        col[cursor] = tint.r;
        col[cursor + 1] = tint.g;
        col[cursor + 2] = tint.b;
        cursor += 3;
      }
    }
    for (let j = 0; j < seg; j++) {
      for (let i = 0; i < seg; i++) {
        const a = j * stride + i;
        idx.push(a, a + stride, a + 1, a + 1, a + stride, a + stride + 1);
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("color", new BufferAttribute(col, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    root.add(new Mesh(geo, new MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 })));
  }
  const n = side + 1;
  const ipt = new Array(n * n);
  const parkAt = new Uint8Array(side * side);
  let parkI = 0;
  let parkJ = 0;
  let parkW = 0;
  let parkH = 0;
  let hasPark = false;
  const footprints = [];
  const bleeds = [];
  const doorMarks = [];
  const alleyPoints = [];
  const plazaSpots = [];
  const loopRings = [];
  const treeSpots = [];
  const scaled = [];
  const spires = [];
  const rounds = [];
  const canopies = [];
  const boxBuckets = new Map();
  const geoCache = new Map();
  const facadeMap = makeFacade("#ffffff", "#1b2430");
  const glassMap = makeFacade("#e7eef3", "#8eafc2");
  const masonryMat = new MeshStandardMaterial({ color: "#ffffff", map: facadeMap, roughness: 0.86 });
  const glassMat = new MeshStandardMaterial({ color: "#ffffff", map: glassMap, roughness: 0.28, metalness: 0.55 });
  const flatMat = new MeshStandardMaterial({ color: "#ffffff", roughness: 0.8 });
  const accent = new Color(toneColor(props.tone));
  const waterColor = new Color("#1d6f96").lerp(accent, 0.2);

  function range(a, b) {
    return a + rand() * (b - a);
  }
  function irand(count) {
    return Math.floor(rand() * count);
  }
  function chance(p) {
    return rand() < p;
  }
  function wallColor(list) {
    if (chance(0.62)) {
      const hue = new Color();
      hue.setHSL(rand(), 0.16 + rand() * 0.74, 0.24 + rand() * 0.52);
      return "#" + hue.getHexString();
    }
    return chance(0.84) ? pick(rand, WALLS) : pick(rand, list);
  }
  function personColor(role) {
    const color = new Color(ROLE_COLOR[role] || "#8a8478");
    const marked = role === "police" || role === "firefighter" || role === "criminal";
    if (!marked) color.offsetHSL(rand(), (rand() - 0.5) * 0.45, (rand() - 0.5) * 0.32);
    else color.offsetHSL((rand() - 0.5) * 0.1, (rand() - 0.5) * 0.28, (rand() - 0.5) * 0.2);
    return "#" + color.getHexString();
  }
  function varyFamily(family) {
    const next = family.slice();
    const keys = ["stone", "brick", "house", "modern", "ware", "glass"];
    const kinds = ["masonry", "glass", "flat"];
    const crowns = ["hip", "flat", "cornice", "dome", "saw", "spire"];
    const extras = ["spire", "balcony", "cols", "awning", "frames", "stall", "sign", "chimney", "antenna", "yard", "court", "pool", "clock", "lamp", "flag", "wing", "crane", "steps", "shift", "arch"];
    next[2] = 1 + irand(chance(0.18) ? 6 : 4);
    next[3] = 0.4 + rand() * 0.55;
    next[4] = Math.min(14, Math.max(1.1, family[4] * (0.22 + rand() * 2.8)));
    next[5] = Math.min(1.9, Math.max(0.22, family[5] * (0.28 + rand() * 2.3)));
    next[6] = Math.min(1.9, Math.max(0.22, family[6] * (0.28 + rand() * 2.3)));
    if (chance(0.4)) {
      const swap = next[5];
      next[5] = next[6];
      next[6] = swap;
    }
    next[7] = keys[irand(keys.length)];
    if (chance(0.72)) next[8] = kinds[irand(kinds.length)];
    next[9] = crowns[irand(crowns.length)];
    let flags = chance(0.25) ? "" : family[10] || "";
    const add = 3 + irand(7);
    for (let bit = 0; bit < add; bit++) {
      const extra = extras[irand(extras.length)];
      if (flags.indexOf(extra) < 0) flags += " " + extra;
    }
    next[10] = flags;
    return next;
  }
  function nid(i, j) {
    return j * n + i;
  }
  function allows(x, z, ok) {
    const ix = Math.floor(x);
    const iz = Math.floor(z);
    if (ix < 0 || iz < 0 || ix >= cells || iz >= cells) return false;
    const value = mask[iz * cells + ix];
    return value !== 0 && (ok & (1 << value)) !== 0;
  }
  function isWet(x, z) {
    const ix = Math.floor(x);
    const iz = Math.floor(z);
    if (ix < 0 || iz < 0 || ix >= cells || iz >= cells) return false;
    return wet[iz * cells + ix] === 1;
  }
  function fill(x0, z0, x1, z1, value) {
    let xa = Math.floor(Math.min(x0, x1));
    let xb = Math.floor(Math.max(x0, x1) - 0.0001);
    let za = Math.floor(Math.min(z0, z1));
    let zb = Math.floor(Math.max(z0, z1) - 0.0001);
    if (xa < 0) xa = 0;
    if (za < 0) za = 0;
    if (xb >= cells) xb = cells - 1;
    if (zb >= cells) zb = cells - 1;
    for (let z = za; z <= zb; z++) {
      const row = z * cells;
      for (let x = xa; x <= xb; x++) mask[row + x] = value;
    }
  }
  function fillCircle(cx, cz, radius, value, into) {
    const grid = into || mask;
    const r2 = radius * radius;
    const xa = Math.max(0, Math.floor(cx - radius));
    const xb = Math.min(cells - 1, Math.floor(cx + radius));
    const za = Math.max(0, Math.floor(cz - radius));
    const zb = Math.min(cells - 1, Math.floor(cz + radius));
    for (let z = za; z <= zb; z++) {
      for (let x = xa; x <= xb; x++) {
        const dx = x + 0.5 - cx;
        const dz = z + 0.5 - cz;
        if (dx * dx + dz * dz <= r2) grid[z * cells + x] = value;
      }
    }
  }
  function carveCenter(cx, cz, radius) {
    const r2 = radius * radius;
    const xa = Math.max(0, Math.floor(cx - radius));
    const xb = Math.min(cells - 1, Math.floor(cx + radius));
    const za = Math.max(0, Math.floor(cz - radius));
    const zb = Math.min(cells - 1, Math.floor(cz + radius));
    for (let z = za; z <= zb; z++) {
      for (let x = xa; x <= xb; x++) {
        const dx = x + 0.5 - cx;
        const dz = z + 0.5 - cz;
        if (dx * dx + dz * dz > r2) continue;
        const k = z * cells + x;
        if (mask[k] === 1) mask[k] = 0;
      }
    }
  }
  function fillPoly(poly, value) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (let i = 0; i < poly.length; i++) {
      minX = Math.min(minX, poly[i].x);
      maxX = Math.max(maxX, poly[i].x);
      minZ = Math.min(minZ, poly[i].z);
      maxZ = Math.max(maxZ, poly[i].z);
    }
    const xa = Math.max(0, Math.floor(minX));
    const xb = Math.min(cells - 1, Math.floor(maxX));
    const za = Math.max(0, Math.floor(minZ));
    const zb = Math.min(cells - 1, Math.floor(maxZ));
    for (let z = za; z <= zb; z++) {
      for (let x = xa; x <= xb; x++) {
        if (!inside(x + 0.5, z + 0.5, poly)) continue;
        const k = z * cells + x;
        if (mask[k] === 0 && !wet[k]) mask[k] = value;
      }
    }
  }
  function bleedToStreet(x, z) {
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2;
      const cs = Math.cos(ang);
      const sn = Math.sin(ang);
      for (let s = 1; s <= 14; s++) {
        const ix = Math.floor(x + cs * s);
        const iz = Math.floor(z + sn * s);
        if (ix < 0 || iz < 0 || ix >= cells || iz >= cells) break;
        const k = iz * cells + ix;
        if (wet[k] || mask[k] === 4 || mask[k] === 2) break;
        if (mask[k] === 1 || mask[k] === 3) break;
        if (mask[k] === 0) mask[k] = 1;
      }
    }
  }

  function boxGeo(w, h, d) {
    const key = w + "x" + h + "x" + d;
    let geo = geoCache.get(key);
    if (geo) return geo;
    geo = new BoxGeometry(w, h, d);
    const uv = geo.attributes.uv;
    const rx = w / 2.4;
    const ry = h / 2.6;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * rx, uv.getY(i) * ry);
    geoCache.set(key, geo);
    return geo;
  }
  function addBox(kind, w, h, d, x, y, z, color, ry) {
    w = snap(w, 0.5);
    h = snap(h, 0.5);
    d = snap(d, 0.5);
    const geo = boxGeo(w, h, d);
    const key = kind + ":" + w + "x" + h + "x" + d;
    let bucket = boxBuckets.get(key);
    if (!bucket) {
      bucket = { geo: geo, kind: kind, items: [] };
      boxBuckets.set(key, bucket);
    }
    bucket.items.push({ x: x, y: y, z: z, color: color, ry: ry || 0, sx: 1, sy: 1, sz: 1 });
  }
  function addScaled(x, y, z, sx, sy, sz, color, ry) {
    scaled.push({ x: x, y: y, z: z, sx: sx, sy: sy, sz: sz, color: color, ry: ry || 0 });
  }
  function addTree(x, z, scale, tint) {
    const h = 1.5 * scale;
    rounds.push({ x: x, y: h * 0.5, z: z, sx: 0.11 * scale, sy: h, sz: 0.11 * scale, color: "#6b4e32", ry: 0 });
    canopies.push({
      x: x,
      y: h + 0.55 * scale,
      z: z,
      sx: 0.7 * scale,
      sy: 0.62 * scale,
      sz: 0.7 * scale,
      color: tint,
      ry: 0,
    });
  }
  function addPine(x, z, scale) {
    const h = 1.7 * scale;
    rounds.push({ x: x, y: h * 0.28, z: z, sx: 0.07 * scale, sy: h * 0.55, sz: 0.07 * scale, color: "#5a4030", ry: 0 });
    spires.push({
      x: x,
      y: h * 0.72,
      z: z,
      sx: 0.48 * scale,
      sy: h,
      sz: 0.48 * scale,
      color: pick(rand, ["#1f6b32", "#245c30", "#2f7a3a"]),
      ry: rand() * 1.2,
    });
  }
  function snapshot() {
    const boxes = new Map();
    for (const [key, bucket] of boxBuckets) boxes.set(key, bucket.items.length);
    return { spires: spires.length, rounds: rounds.length, canopies: canopies.length, scaled: scaled.length, boxes: boxes };
  }
  function liftSince(mark, dy) {
    if (!dy) return;
    for (let i = mark.spires; i < spires.length; i++) spires[i].y += dy;
    for (let i = mark.rounds; i < rounds.length; i++) rounds[i].y += dy;
    for (let i = mark.canopies; i < canopies.length; i++) canopies[i].y += dy;
    for (let i = mark.scaled; i < scaled.length; i++) scaled[i].y += dy;
    for (const [key, bucket] of boxBuckets) {
      const from = mark.boxes.has(key) ? mark.boxes.get(key) : 0;
      for (let i = from; i < bucket.items.length; i++) bucket.items[i].y += dy;
    }
  }
  function seatPlant(x, z, pine, scale, tint) {
    const mark = snapshot();
    if (pine) addPine(x, z, scale);
    else addTree(x, z, scale, tint);
    liftSince(mark, elev(x, z));
  }

  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const x = i * PITCH + ROAD * 0.5;
      const z = j * PITCH + ROAD * 0.5;
      ipt[nid(i, j)] = { x: x, z: z, y: elev(x, z) };
    }
  }

  const AVE = 3;
  const CROSS = 4;
  parkW = side >= 36 ? AVE * 3 : AVE * 2;
  parkH = side >= 36 ? CROSS * 4 : CROSS * 3;
  let riverMid = 0;
  for (let i = 0; i < riverPts.length; i++) riverMid += riverPts[i].x;
  riverMid /= riverPts.length;
  function parkFits(i0, j0) {
    if (i0 < AVE || j0 < CROSS) return false;
    if (i0 + parkW > side - AVE || j0 + parkH > side - CROSS) return false;
    const probe = [
      ipt[nid(i0, j0)],
      ipt[nid(i0 + parkW, j0)],
      ipt[nid(i0 + parkW, j0 + parkH)],
      ipt[nid(i0, j0 + parkH)],
      ipt[nid(i0 + ((parkW / 2) | 0), j0 + ((parkH / 2) | 0))],
    ];
    for (let k = 0; k < probe.length; k++) {
      if (riverDist(probe[k].x, probe[k].z) < WATER_HALF + 16) return false;
    }
    return true;
  }
  const iWest = AVE;
  const iEast = Math.floor((side - AVE - parkW) / AVE) * AVE;
  const iTry = [riverMid > size * 0.5 ? iWest : iEast, iWest, iEast, AVE * 2];
  const jMid = Math.round(((side - parkH) * 0.5) / CROSS) * CROSS;
  const jTry = [jMid, jMid - CROSS, jMid + CROSS, CROSS * 2];
  for (let a = 0; a < iTry.length && !hasPark; a++) {
    for (let b = 0; b < jTry.length && !hasPark; b++) {
      if (!parkFits(iTry[a], jTry[b])) continue;
      parkI = iTry[a];
      parkJ = jTry[b];
      hasPark = true;
    }
  }
  if (hasPark) {
    for (let j = parkJ; j < parkJ + parkH; j++) {
      for (let i = parkI; i < parkI + parkW; i++) parkAt[i + j * side] = 1;
    }
  }
  function inParkH(i, j) {
    if (!hasPark) return false;
    return j > parkJ && j < parkJ + parkH && i >= parkI && i < parkI + parkW;
  }
  function inParkV(i, j) {
    if (!hasPark) return false;
    return i > parkI && i < parkI + parkW && j >= parkJ && j < parkJ + parkH;
  }

  const edges = [];
  const cellRoads = Array.from({ length: side * side }, function () {
    return [];
  });
  const nodeHalf = new Float32Array(n * n);
  const nodeUse = new Uint8Array(n * n);

  function touchCell(i, j, edge) {
    if (i < 0 || j < 0 || i >= side || j >= side) return;
    cellRoads[i + j * side].push(edge);
  }
  function postedLimit(spec) {
    if (spec.foot) return 4;
    if (spec.parkway) return 20 + rand() * 4;
    if (spec.avenue) return 18 + rand() * 6;
    if (spec.alley) return 7 + rand() * 2;
    if (spec.border) return 22 + rand() * 6;
    if (spec.twoWay) return 16 + rand() * 4;
    return 11 + rand() * 3;
  }
  function pushEdge(i0, j0, i1, j1, spec, built) {
    if (!built) built = curve(ipt[nid(i0, j0)], ipt[nid(i1, j1)], spec.bow || 0);
    if (built.len < 2) return;
    const edge = {
      i0: i0,
      j0: j0,
      i1: i1,
      j1: j1,
      pts: built.pts,
      cum: built.cum,
      len: built.len,
      bow: spec.bow || 0,
      half: spec.half,
      twoWay: spec.twoWay,
      forward: spec.forward,
      alley: spec.alley,
      drive: spec.drive,
      foot: spec.foot,
      border: spec.border,
      arched: !!spec.arched,
      limit: postedLimit(spec),
    };
    edges.push(edge);
    nodeUse[nid(i0, j0)] = 1;
    nodeUse[nid(i1, j1)] = 1;
    nodeHalf[nid(i0, j0)] = Math.max(nodeHalf[nid(i0, j0)], edge.half);
    nodeHalf[nid(i1, j1)] = Math.max(nodeHalf[nid(i1, j1)], edge.half);
    if (i0 + 1 === i1 && j0 === j1) {
      touchCell(i0, j0, edge);
      touchCell(i0, j0 - 1, edge);
    } else if (j0 + 1 === j1 && i0 === i1) {
      touchCell(i0, j0, edge);
      touchCell(i0 - 1, j0, edge);
    }
  }

  function riverTangent(x, z) {
    let best = 1e9;
    let tx = 0;
    let tz = 1;
    let rx = x;
    let rz = z;
    for (let i = 1; i < riverPts.length; i++) {
      const a = riverPts[i - 1];
      const b = riverPts[i];
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len2 = dx * dx + dz * dz || 1;
      let t = ((x - a.x) * dx + (z - a.z) * dz) / len2;
      if (t < 0) t = 0;
      else if (t > 1) t = 1;
      const px = a.x + dx * t;
      const pz = a.z + dz * t;
      const dist = Math.hypot(px - x, pz - z);
      if (dist < best) {
        best = dist;
        const mag = Math.hypot(dx, dz) || 1;
        tx = dx / mag;
        tz = dz / mag;
        rx = px;
        rz = pz;
      }
    }
    if (tz < 0) {
      tx = -tx;
      tz = -tz;
    }
    return { x: rx, z: rz, tx: tx, tz: tz, dist: best };
  }
  function bankSide(x, z) {
    const hit = riverTangent(x, z);
    return (x - hit.x) * -hit.tz + (z - hit.z) * hit.tx;
  }
  function hitsRiver(pts, pad) {
    for (let i = 0; i < pts.length; i++) {
      if (riverDist(pts[i].x, pts[i].z) < pad) return true;
    }
    return false;
  }
  function polyBuilt(pts) {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) {
      cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z));
    }
    return { pts: pts, cum: cum, len: cum[cum.length - 1] || 0 };
  }
  function marchBank(x, z, nx, nz, pad) {
    let px = x;
    let pz = z;
    for (let s = 0; s < 70; s++) {
      px += nx * 1.35;
      pz += nz * 1.35;
      if (px < 4 || pz < 4 || px > size - 4 || pz > size - 4) return null;
      if (riverDist(px, pz) >= pad) return { x: px, z: pz };
    }
    return null;
  }
  function linePts(from, to, bridge, yOf) {
    const dist = Math.hypot(to.x - from.x, to.z - from.z);
    const steps = Math.max(1, Math.ceil(dist / 1.7));
    const out = [];
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = from.x + (to.x - from.x) * t;
      const z = from.z + (to.z - from.z) * t;
      out.push({ x: x, z: z, y: yOf(x, z, t), bridge: bridge });
    }
    return out;
  }
  function layBridge(j, iWest, iEast) {
    const west = ipt[nid(iWest, j)];
    const east = ipt[nid(iEast, j)];
    let best = null;
    const samples = Math.max(8, Math.ceil(Math.hypot(east.x - west.x, east.z - west.z) / 2));
    for (let s = 0; s <= samples; s++) {
      const t = s / samples;
      const x = west.x + (east.x - west.x) * t;
      const z = west.z + (east.z - west.z) * t;
      const d = riverDist(x, z);
      if (!best || d < best.d) best = { x: x, z: z, d: d };
    }
    if (!best || best.d > WATER_HALF) return;
    const hit = riverTangent(best.x, best.z);
    const pad = WATER_HALF + 4.8;
    const left = marchBank(hit.x, hit.z, -hit.tz, hit.tx, pad);
    const right = marchBank(hit.x, hit.z, hit.tz, -hit.tx, pad);
    if (!left || !right) return;
    const leftIsWest = Math.hypot(left.x - west.x, left.z - west.z) <= Math.hypot(right.x - west.x, right.z - west.z);
    const abutW = leftIsWest ? left : right;
    const abutE = leftIsWest ? right : left;
    const y0 = elev(abutW.x, abutW.z);
    const y1 = elev(abutE.x, abutE.z);
    const bed = elev(hit.x, hit.z);
    const rise = Math.max(6.8, bed + 8.6 - (y0 + y1) * 0.5);
    const approachW = linePts(west, abutW, false, function (x, z) {
      return elev(x, z);
    });
    const arch = linePts(abutW, abutE, true, function (x, z, t) {
      return y0 * (1 - t) + y1 * t + Math.sin(Math.PI * t) * rise;
    });
    const approachE = linePts(abutE, east, false, function (x, z) {
      return elev(x, z);
    });
    const pts = approachW.slice(0, -1).concat(arch, approachE.slice(1));
    const ax = abutE.x - abutW.x;
    const az = abutE.z - abutW.z;
    const am = Math.hypot(ax, az) || 1;
    const along = Math.abs((ax / am) * hit.tx + (az / am) * hit.tz);
    if (along > 0.2) return;
    pushEdge(
      iWest,
      j,
      iEast,
      j,
      {
        bow: 0,
        half: 3.25,
        twoWay: true,
        forward: true,
        alley: false,
        drive: true,
        foot: false,
        border: false,
        avenue: false,
        parkway: false,
        arched: true,
      },
      polyBuilt(pts)
    );
  }
  function reindexRoads() {
    for (let i = 0; i < cellRoads.length; i++) cellRoads[i].length = 0;
    nodeUse.fill(0);
    nodeHalf.fill(0);
    for (let e = 0; e < edges.length; e++) {
      const edge = edges[e];
      const a = nid(edge.i0, edge.j0);
      const b = nid(edge.i1, edge.j1);
      nodeUse[a] = 1;
      nodeUse[b] = 1;
      nodeHalf[a] = Math.max(nodeHalf[a], edge.half);
      nodeHalf[b] = Math.max(nodeHalf[b], edge.half);
      const step = Math.max(1, Math.floor(edge.pts.length / 14));
      for (let k = 0; k < edge.pts.length; k += step) {
        const i = Math.floor((edge.pts[k].x - ROAD * 0.5) / PITCH);
        const j = Math.floor((edge.pts[k].z - ROAD * 0.5) / PITCH);
        touchCell(i, j, edge);
        touchCell(i - 1, j, edge);
        touchCell(i, j - 1, edge);
        touchCell(i - 1, j - 1, edge);
      }
    }
  }

  for (let j = 0; j < n; j++) {
    for (let i = 0; i < side; i++) {
      if (inParkH(i, j)) continue;
      const border = j === 0 || j === side;
      const cross = !border && j % CROSS === 0;
      pushEdge(i, j, i + 1, j, {
        bow: 0,
        half: border ? 2.85 : cross ? 3.15 : 2.2,
        twoWay: cross,
        forward: border ? j === 0 : cross ? true : j % 2 === 0,
        alley: false,
        drive: true,
        foot: false,
        border: border,
        avenue: false,
        parkway: false,
      });
    }
  }
  for (let i = 0; i < n; i++) {
    const border = i === 0 || i === side;
    if (!border && i % AVE !== 0) continue;
    const aveIndex = border ? 0 : (i / AVE) | 0;
    const twoWay = !border && aveIndex % 4 === 0;
    for (let j = 0; j < side; j++) {
      if (inParkV(i, j)) continue;
      pushEdge(i, j, i, j + 1, {
        bow: 0,
        half: border ? 2.85 : twoWay ? 3.5 : 3.2,
        twoWay: twoWay,
        forward: border ? i === side : twoWay ? true : aveIndex % 2 === 0,
        alley: false,
        drive: true,
        foot: false,
        border: border,
        avenue: !border,
        parkway: false,
      });
    }
  }
  for (let bi = 1, bj = 2; bi < side - 1 && bj < side - 1; ) {
    const ni = bi + 1;
    const nj = bj + 1;
    const cell = bi + bj * side;
    if (!parkAt[cell]) {
      pushEdge(bi, bj, ni, nj, {
        bow: 0,
        half: 3.05,
        twoWay: true,
        forward: true,
        alley: false,
        drive: true,
        foot: false,
        border: false,
        avenue: true,
        parkway: false,
      });
    }
    bi = ni;
    bj = nj;
  }

  const keptRoads = [];
  for (let e = 0; e < edges.length; e++) {
    if (hitsRiver(edges[e].pts, WATER_HALF + 2.4)) continue;
    keptRoads.push(edges[e]);
  }
  edges.length = 0;
  for (let e = 0; e < keptRoads.length; e++) edges.push(keptRoads[e]);

  const bridgeRows = [];
  function takeBridgeRow(zFrac) {
    let j = Math.round((zFrac * side) / CROSS) * CROSS;
    if (j < CROSS) j = CROSS;
    const cap = Math.floor((side - CROSS) / CROSS) * CROSS;
    if (j > cap) j = cap;
    if (bridgeRows.indexOf(j) >= 0) j += CROSS;
    if (j <= 0 || j >= side || bridgeRows.indexOf(j) >= 0) return;
    bridgeRows.push(j);
  }
  takeBridgeRow(0.25);
  takeBridgeRow(0.5);
  takeBridgeRow(0.75);
  for (let r = 0; r < bridgeRows.length; r++) {
    const j = bridgeRows[r];
    let west = -1;
    let east = -1;
    let westD = 1e9;
    let eastD = 1e9;
    for (let i = 0; i <= side; i++) {
      const p = ipt[nid(i, j)];
      const d = riverDist(p.x, p.z);
      if (d < WATER_HALF + 3.1) continue;
      const s = bankSide(p.x, p.z);
      if (s >= 0 && d < westD) {
        westD = d;
        west = i;
      }
      if (s < 0 && d < eastD) {
        eastD = d;
        east = i;
      }
    }
    if (west < 0 || east < 0 || west === east) continue;
    const i0 = west < east ? west : east;
    const i1 = west < east ? east : west;
    if (i1 - i0 > 3) continue;
    if (bankSide(ipt[nid(i0, j)].x, ipt[nid(i0, j)].z) * bankSide(ipt[nid(i1, j)].x, ipt[nid(i1, j)].z) >= 0) continue;
    const spanKept = [];
    for (let e = 0; e < edges.length; e++) {
      const edge = edges[e];
      if (edge.j0 === j && edge.j1 === j && Math.min(edge.i0, edge.i1) >= i0 && Math.max(edge.i0, edge.i1) <= i1) continue;
      spanKept.push(edge);
    }
    edges.length = 0;
    for (let e = 0; e < spanKept.length; e++) edges.push(spanKept[e]);
    layBridge(j, i0, i1);
  }

  function nearestBankNode(x, z, sign) {
    let best = -1;
    let bestD = 28 * 28;
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        if (hasPark && i > parkI && i < parkI + parkW && j > parkJ && j < parkJ + parkH) continue;
        const p = ipt[nid(i, j)];
        const dx = p.x - x;
        const dz = p.z - z;
        const d2 = dx * dx + dz * dz;
        if (d2 >= bestD) continue;
        if (riverDist(p.x, p.z) < WATER_HALF + 3.4) continue;
        if (bankSide(p.x, p.z) * sign <= 0) continue;
        bestD = d2;
        best = nid(i, j);
      }
    }
    return best;
  }
  function addShore(sign) {
    const samples = [];
    const reach = WATER_HALF + 7.6;
    for (let i = 0; i < riverPts.length; i += 3) {
      const hit = riverTangent(riverPts[i].x, riverPts[i].z);
      const ox = -hit.tz * sign;
      const oz = hit.tx * sign;
      let x = hit.x + ox * reach;
      let z = hit.z + oz * reach;
      for (let guard = 0; guard < 10 && riverDist(x, z) < WATER_HALF + 6.4; guard++) {
        x += ox * 1.4;
        z += oz * 1.4;
      }
      if (x < 6 || z < 6 || x > size - 6 || z > size - 6) continue;
      if (riverDist(x, z) < WATER_HALF + 5.8) continue;
      if (hasPark) {
        const ci = Math.floor((x - ROAD * 0.5) / PITCH);
        const cj = Math.floor((z - ROAD * 0.5) / PITCH);
        if (ci >= parkI && cj >= parkJ && ci < parkI + parkW && cj < parkJ + parkH) continue;
      }
      samples.push({ x: x, z: z });
    }
    const seen = new Set();
    let prev = -1;
    let mid = [];
    function emit(na, nb, pts) {
      if (na < 0 || nb < 0 || na === nb || !pts.length) return;
      if (bankSide(ipt[na].x, ipt[na].z) * bankSide(ipt[nb].x, ipt[nb].z) <= 0) return;
      const key = na < nb ? na + ":" + nb : nb + ":" + na;
      if (seen.has(key)) return;
      const chain = [];
      const a = ipt[na];
      const b = ipt[nb];
      if (Math.hypot(a.x - pts[0].x, a.z - pts[0].z) < 16) chain.push({ x: a.x, z: a.z });
      for (let i = 0; i < pts.length; i++) chain.push(pts[i]);
      const tail = pts[pts.length - 1];
      if (Math.hypot(b.x - tail.x, b.z - tail.z) < 16) chain.push({ x: b.x, z: b.z });
      if (chain.length < 2) return;
      if (hitsRiver(chain, WATER_HALF + 1.2)) return;
      seen.add(key);
      pushEdge(
        na % n,
        (na / n) | 0,
        nb % n,
        (nb / n) | 0,
        {
          bow: 0,
          half: 2.55,
          twoWay: true,
          forward: true,
          alley: false,
          drive: true,
          foot: false,
          border: false,
          avenue: false,
          parkway: true,
          arched: false,
        },
        polyBuilt(chain)
      );
    }
    for (let i = 0; i < samples.length; i++) {
      const node = nearestBankNode(samples[i].x, samples[i].z, sign);
      if (node < 0) {
        prev = -1;
        mid = [];
        continue;
      }
      if (prev < 0) {
        prev = node;
        mid = [samples[i]];
        continue;
      }
      if (node === prev) {
        mid.push(samples[i]);
        continue;
      }
      emit(prev, node, mid.concat([samples[i]]));
      prev = node;
      mid = [samples[i]];
    }
  }
  addShore(1);
  addShore(-1);
  reindexRoads();

  const out = Array.from({ length: n * n }, function () {
    return [];
  });
  function rebuildOut() {
    for (let i = 0; i < out.length; i++) out[i].length = 0;
    for (let e = 0; e < edges.length; e++) {
      const edge = edges[e];
      if (!edge.drive) continue;
      if (edge.twoWay || edge.forward) out[nid(edge.i0, edge.j0)].push({ e: e, dir: 1 });
      if (edge.twoWay || !edge.forward) out[nid(edge.i1, edge.j1)].push({ e: e, dir: -1 });
    }
  }
  function ensureFlow() {
    const touch = Array.from({ length: n * n }, function () {
      return [];
    });
    for (let e = 0; e < edges.length; e++) {
      if (!edges[e].drive) continue;
      touch[nid(edges[e].i0, edges[e].j0)].push(e);
      touch[nid(edges[e].i1, edges[e].j1)].push(e);
    }
    rebuildOut();
    for (let pass = 0; pass < 3; pass++) {
      let changed = false;
      for (let node = 0; node < touch.length; node++) {
        if (!touch[node].length || out[node].length) continue;
        edges[touch[node][0]].twoWay = true;
        changed = true;
      }
      if (!changed) break;
      rebuildOut();
    }
  }
  ensureFlow();

  for (let i = 0; i < riverPts.length; i++) {
    riverPts[i].y = Math.max(0.2, elev(riverPts[i].x, riverPts[i].z) - 0.12);
    const next = riverPts[Math.min(riverPts.length - 1, i + 1)];
    const dist = Math.hypot(next.x - riverPts[i].x, next.z - riverPts[i].z);
    const steps = Math.max(1, Math.ceil(dist / 2));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      fillCircle(riverPts[i].x + (next.x - riverPts[i].x) * t, riverPts[i].z + (next.z - riverPts[i].z) * t, WATER_HALF, 1, wet);
    }
  }

  const walkR = { pos: [], idx: [] };
  const driveR = { pos: [], idx: [] };
  const oneR = { pos: [], idx: [] };
  const alleyR = { pos: [], idx: [] };
  const bridgeR = { pos: [], idx: [] };
  const railR = { pos: [], idx: [] };
  const waterR = { pos: [], idx: [] };
  const parkR = { pos: [], idx: [] };
  const pathR = { pos: [], idx: [] };

  addRibbon(waterR, riverPts, 4.4, 0.04);

  for (let e = 0; e < edges.length; e++) {
    const edge = edges[e];
    if (!edge.arched) gradeRoad(edge.pts);
    let bridged = false;
    for (let i = 0; i < edge.pts.length; i++) if (edge.pts[i].bridge) bridged = true;
    if (bridged && edge.limit) edge.limit *= 0.78;
    for (let i = 0; i < edge.pts.length; i++) edge.pts[i].limit = edge.limit || 14;
    for (let i = 0; i < edge.pts.length; i++) {
      const p = edge.pts[i];
      if (edge.foot) {
        fillCircle(p.x, p.z, 1.05, p.bridge ? 3 : 1);
        continue;
      }
      if (p.bridge) fillCircle(p.x, p.z, edge.half + 1.55, 3);
      else {
        fillCircle(p.x, p.z, edge.half + 1.55, 1);
        carveCenter(p.x, p.z, Math.max(0.8, edge.half - 0.35));
      }
    }
    const parts = spansOf(edge.pts, function (p) {
      return !!p.bridge;
    });
    if (edge.foot) {
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.wet) {
          addRibbon(bridgeR, part.pts, 1.15, 0.22);
          addRibbon(railR, offsetPoly(part.pts, 0.7), 0.07, 0.85);
          addRibbon(railR, offsetPoly(part.pts, -0.7), 0.07, 0.85);
          for (let k = 1; k < part.pts.length - 1; k += 3) {
            const p = part.pts[k];
            if (riverDist(p.x, p.z) > WATER_HALF + 0.4) continue;
            const bed = elev(p.x, p.z) - 0.35;
            const ph = Math.max(1.2, p.y - bed);
            rounds.push({ x: p.x, y: bed + ph / 2, z: p.z, sx: 0.28, sy: ph, sz: 0.28, color: "#d9e0e6", ry: 0 });
          }
        } else addRibbon(pathR, part.pts, 0.75, 0.055);
      }
      continue;
    }
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.wet) {
        addRibbon(bridgeR, part.pts, edge.half + 1.25, 0.28);
        addRibbon(railR, offsetPoly(part.pts, edge.half + 0.2), 0.1, 0.95);
        addRibbon(railR, offsetPoly(part.pts, -(edge.half + 0.2)), 0.1, 0.95);
        for (let k = 1; k < part.pts.length - 1; k += 4) {
          const p = part.pts[k];
          if (riverDist(p.x, p.z) > WATER_HALF + 0.4) continue;
          const bed = elev(p.x, p.z) - 0.35;
          const ph = Math.max(1.4, p.y - bed);
          const prev = part.pts[k - 1];
          const tx = p.x - prev.x;
          const tz = p.z - prev.z;
          const mag = Math.hypot(tx, tz) || 1;
          const ox = (-tz / mag) * edge.half * 0.55;
          const oz = (tx / mag) * edge.half * 0.55;
          rounds.push({ x: p.x + ox, y: bed + ph / 2, z: p.z + oz, sx: 0.38, sy: ph, sz: 0.38, color: "#d9e0e6", ry: 0 });
          rounds.push({ x: p.x - ox, y: bed + ph / 2, z: p.z - oz, sx: 0.38, sy: ph, sz: 0.38, color: "#d9e0e6", ry: 0 });
        }
      } else {
        addRibbon(walkR, part.pts, edge.half + 1.45, 0.04);
        addRibbon(edge.alley ? alleyR : edge.twoWay ? driveR : oneR, part.pts, edge.half, 0.075);
      }
    }
    if (!edge.twoWay) {
      for (let i = 2; i < edge.pts.length - 2; i += 4) {
        const p = edge.pts[i];
        const q = edge.pts[Math.min(edge.pts.length - 1, i + 1)];
        let tx = q.x - p.x;
        let tz = q.z - p.z;
        if (!edge.forward) {
          tx = -tx;
          tz = -tz;
        }
        const heading = Math.atan2(-tz, tx);
        const y = (p.y || 0) + 0.1;
        const c = Math.cos(heading);
        const s = Math.sin(heading);
        addScaled(p.x, y, p.z, 1.05, 0.045, 0.26, "#f3d35a", heading);
        addScaled(p.x + c * 0.62, y + 0.006, p.z - s * 0.62, 0.38, 0.045, 0.62, "#f3d35a", heading);
      }
    } else {
      for (let i = 2; i < edge.pts.length - 1; i += 3) {
        const p = edge.pts[i];
        const q = edge.pts[Math.min(edge.pts.length - 1, i + 1)];
        const heading = Math.atan2(-(q.z - p.z), q.x - p.x);
        addScaled(p.x, (p.y || 0) + 0.1, p.z, 0.7, 0.04, 0.16, "#e7eef2", heading);
      }
    }
    if (!edge.alley && edge.pts.length > 8) {
      for (let k = 0; k < 2; k++) {
        const i = k === 0 ? 4 : edge.pts.length - 5;
        const p = edge.pts[i];
        const q = edge.pts[i + 1];
        if (isWet(p.x, p.z)) continue;
        let tx = q.x - p.x;
        let tz = q.z - p.z;
        const mag = Math.hypot(tx, tz) || 1;
        tx /= mag;
        tz /= mag;
        const lx = p.x - tz * (edge.half + 0.4);
        const lz = p.z + tx * (edge.half + 0.4);
        rounds.push({ x: lx, y: (p.y || 0) + 1.7, z: lz, sx: 0.045, sy: 3.4, sz: 0.045, color: "#2a3038", ry: 0 });
        addScaled(lx, (p.y || 0) + 3.45, lz, 0.62, 0.06, 0.16, "#f7f1df", Math.atan2(-tz, tx));
      }
    }
  }

  for (let node = 0; node < nodeUse.length; node++) {
    if (!nodeUse[node]) continue;
    const p = ipt[node];
    fillCircle(p.x, p.z, nodeHalf[node] + 1.25, isWet(p.x, p.z) ? 3 : 1);
  }

  const parks = [];
  if (hasPark) {
    const raw = [ipt[nid(parkI, parkJ)], ipt[nid(parkI + parkW, parkJ)], ipt[nid(parkI + parkW, parkJ + parkH)], ipt[nid(parkI, parkJ + parkH)]];
    const c = centroid(raw);
    const quad = insetQuad(raw, 7);
    const span = Math.min(Math.hypot(quad[1].x - quad[0].x, quad[1].z - quad[0].z), Math.hypot(quad[3].x - quad[0].x, quad[3].z - quad[0].z));
    parks.push({ i: parkI, j: parkJ, quad: quad, cx: c.x, cz: c.z, span: span, hasPond: false });
  }
  const parkGoal = 12 + Math.floor(side / 5);
  for (let attempt = 0; attempt < parkGoal * 6 && parks.length < parkGoal; attempt++) {
    const i = irand(side);
    const j = irand(side);
    if (parkAt[i + j * side]) continue;
    const raw = [ipt[nid(i, j)], ipt[nid(i + 1, j)], ipt[nid(i + 1, j + 1)], ipt[nid(i, j + 1)]];
    const c = centroid(raw);
    if (isWet(c.x, c.z)) continue;
    const quad = insetQuad(raw, 8.2);
    parkAt[i + j * side] = 1;
    const span = Math.min(Math.hypot(quad[1].x - quad[0].x, quad[1].z - quad[0].z), Math.hypot(quad[3].x - quad[0].x, quad[3].z - quad[0].z));
    parks.push({ i: i, j: j, quad: quad, cx: c.x, cz: c.z, span: span, hasPond: false });
  }
  if (!parks.length) {
    const raw = [ipt[nid(1, 1)], ipt[nid(2, 1)], ipt[nid(2, 2)], ipt[nid(1, 2)]];
    const c = centroid(raw);
    const quad = insetQuad(raw, 8.2);
    parkAt[1 + side] = 1;
    parks.push({ i: 1, j: 1, quad: quad, cx: c.x, cz: c.z, span: 10, hasPond: false });
  }
  for (let i = 0; i < parks.length; i++) {
    const park = parks[i];
    fillPoly(park.quad, 2);
    const base = parkR.pos.length / 3;
    const quad = park.quad;
    for (let k = 0; k < 4; k++) parkR.pos.push(quad[k].x, elev(quad[k].x, quad[k].z) + 0.06, quad[k].z);
    parkR.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
    const bowed = curve(quad[0], quad[2], (rand() - 0.5) * 3);
    grade(bowed.pts, false);
    addRibbon(pathR, bowed.pts, 0.55, 0.07);
    if (park.span > 40) {
      const south = { x: (quad[0].x + quad[1].x) / 2, z: (quad[0].z + quad[1].z) / 2 };
      const north = { x: (quad[3].x + quad[2].x) / 2, z: (quad[3].z + quad[2].z) / 2 };
      const west = { x: (quad[0].x + quad[3].x) / 2, z: (quad[0].z + quad[3].z) / 2 };
      const east = { x: (quad[1].x + quad[2].x) / 2, z: (quad[1].z + quad[2].z) / 2 };
      const mall = curve(south, north, 0);
      grade(mall.pts, false);
      addRibbon(pathR, mall.pts, 0.95, 0.07);
      const cross = curve(west, east, 0);
      grade(cross.pts, false);
      addRibbon(pathR, cross.pts, 0.7, 0.07);
    }
    for (let f = 0; f < 3; f++) {
      const t = rand();
      const u = rand();
      const fx = quad[0].x * (1 - t) * (1 - u) + quad[1].x * t * (1 - u) + quad[3].x * (1 - t) * u + quad[2].x * t * u;
      const fz = quad[0].z * (1 - t) * (1 - u) + quad[1].z * t * (1 - u) + quad[3].z * (1 - t) * u + quad[2].z * t * u;
      addScaled(
        fx,
        elev(fx, fz) + 0.1,
        fz,
        0.8 + rand(),
        0.05,
        0.8 + rand(),
        pick(rand, ["#d64545", "#e2c15a", "#f4efe4", "#c45c74", "#7ea83a"]),
        rand() * 3
      );
    }
    const ring = quad.map(function (p) {
      const x = park.cx + (p.x - park.cx) * 0.62;
      const z = park.cz + (p.z - park.cz) * 0.62;
      return { x: x, y: elev(x, z), z: z };
    });
    loopRings.push(ring);
  }

  let pond = null;
  if (parks.length && chance(0.3)) {
    let best = parks[0];
    for (let i = 1; i < parks.length; i++) if (parks[i].span > best.span) best = parks[i];
    if (best.span > 7) {
      const radius = 1.65 + rand() * 0.85;
      pond = { x: best.cx, z: best.cz, r: radius };
      best.hasPond = true;
      const r2 = radius * radius;
      const xa = Math.max(0, Math.floor(best.cx - radius));
      const xb = Math.min(cells - 1, Math.floor(best.cx + radius));
      const za = Math.max(0, Math.floor(best.cz - radius));
      const zb = Math.min(cells - 1, Math.floor(best.cz + radius));
      for (let z = za; z <= zb; z++) {
        for (let x = xa; x <= xb; x++) {
          const dx = x + 0.5 - best.cx;
          const dz = z + 0.5 - best.cz;
          if (dx * dx + dz * dz <= r2 && mask[z * cells + x] === 2) mask[z * cells + x] = 0;
        }
      }
      const disc = new Mesh(
        new CylinderGeometry(radius, radius, 0.08, 28),
        new MeshStandardMaterial({ color: "#163e66", roughness: 0.18, metalness: 0.4 })
      );
      disc.position.set(best.cx, elev(best.cx, best.cz) + 0.08, best.cz);
      root.add(disc);
      const ring = [];
      for (let a = 0; a < 10; a++) {
        const ang = (a / 10) * Math.PI * 2;
        const x = best.cx + Math.cos(ang) * (radius + 1.65);
        const z = best.cz + Math.sin(ang) * (radius + 1.65);
        ring.push({ x: x, y: elev(x, z), z: z });
      }
      loopRings.push(ring);
    }
  }

  let bx = 0;
  let bz = 0;
  let byaw = 0;
  let bhalf = 4;
  let lotQuad = null;

  function world(lx, lz) {
    const c = Math.cos(byaw);
    const s = Math.sin(byaw);
    return { x: bx + lx * c + lz * s, z: bz - lx * s + lz * c };
  }
  function orn(w, h, d, lx, y, lz, color) {
    const p = world(lx, lz);
    addScaled(p.x, y, p.z, w, h, d, color, byaw);
  }
  function roadClear(x, z, w, d, yaw) {
    const c = Math.abs(Math.cos(yaw));
    const s = Math.abs(Math.sin(yaw));
    const hw = (w / 2) * c + (d / 2) * s + 0.2;
    const hd = (w / 2) * s + (d / 2) * c + 0.2;
    const samples = [
      [x, z],
      [x - hw, z - hd],
      [x + hw, z - hd],
      [x - hw, z + hd],
      [x + hw, z + hd],
    ];
    for (let i = 0; i < samples.length; i++) {
      const ix = Math.floor(samples[i][0]);
      const iz = Math.floor(samples[i][1]);
      if (ix < 0 || iz < 0 || ix >= cells || iz >= cells) return false;
      const k = iz * cells + ix;
      if (wet[k]) return false;
      if (mask[k] === 1 || mask[k] === 3 || mask[k] === 2) return false;
    }
    return true;
  }
  function footprintOf(x, z, w, d, yaw) {
    const c = Math.abs(Math.cos(yaw));
    const s = Math.abs(Math.sin(yaw));
    const hw = (w / 2) * c + (d / 2) * s;
    const hd = (w / 2) * s + (d / 2) * c;
    footprints.push({ x0: x - hw, z0: z - hd, x1: x + hw, z1: z + hd });
  }
  function mass(kind, w, h, d, lx, base, lz, color) {
    w = snap(Math.max(0.5, w), 0.5);
    h = snap(Math.max(0.5, h), 0.5);
    d = snap(Math.max(0.5, d), 0.5);
    const p = world(lx, lz);
    if (base < 0.35 && !roadClear(p.x, p.z, w, d, byaw)) {
      w = snap(Math.max(1, w * 0.64), 0.5);
      d = snap(Math.max(1, d * 0.64), 0.5);
      if (!roadClear(p.x, p.z, w, d, byaw)) return null;
    }
    addBox(kind, w, h, d, p.x, base + h / 2, p.z, color, byaw);
    if (base < 0.35) footprintOf(p.x, p.z, w, d, byaw);
    return { w: w, h: h, d: d };
  }
  function hip(w, h, d, lx, base, lz, color) {
    const p = world(lx, lz);
    const r = Math.max(w, d) * 0.58;
    spires.push({
      x: p.x,
      y: base + h / 2,
      z: p.z,
      sx: r,
      sy: h,
      sz: r,
      color: color,
      ry: byaw + Math.PI / 4,
    });
  }
  function pillar(h, lx, lz, color, radius) {
    const p = world(lx, lz);
    rounds.push({ x: p.x, y: h / 2, z: p.z, sx: radius || 0.16, sy: h, sz: radius || 0.16, color: color, ry: 0 });
  }
  function dome(r, lx, base, lz, color) {
    const p = world(lx, lz);
    canopies.push({ x: p.x, y: base + r * 0.32, z: p.z, sx: r, sy: r * 0.62, sz: r, color: color, ry: 0 });
  }
  function cornice(w, d, y, color) {
    orn(w + 0.45, 0.28, d + 0.45, 0, y, 0, color);
  }
  function parapet(w, d, y) {
    orn(w, 0.55, 0.16, 0, y + 0.28, d / 2, "#e4ddd0");
    orn(w, 0.55, 0.16, 0, y + 0.28, -d / 2, "#e4ddd0");
    orn(0.16, 0.55, d, w / 2, y + 0.28, 0, "#e4ddd0");
    orn(0.16, 0.55, d, -w / 2, y + 0.28, 0, "#e4ddd0");
  }
  function frames(w, h, d, base) {
    const cols = Math.max(2, Math.min(4, Math.floor(w / 1.8)));
    const rowCount = Math.max(2, Math.min(6, Math.floor(h / 2.6)));
    for (let r = 0; r < rowCount; r++) {
      for (let c = 0; c < cols; c++) {
        const lx = -w / 2 + (c + 0.5) * (w / cols);
        const y = base + 1.35 + r * ((h - 1.8) / rowCount);
        orn(0.62, 0.82, 0.14, lx, y, d / 2 + 0.08, "#15202b");
      }
    }
  }
  function curtain(w, h, d, base) {
    const rowCount = Math.min(8, Math.max(3, Math.floor(h / 4.4)));
    for (let r = 0; r < rowCount; r++) {
      const y = base + 1.5 + r * ((h - 2.2) / rowCount);
      orn(w * 0.9, 0.62, 0.1, 0, y, d / 2 + 0.07, "#c5d5df");
      orn(w * 0.9, 0.62, 0.1, 0, y, -d / 2 - 0.07, "#8eafc2");
    }
    orn(0.16, h * 0.86, 0.12, -w * 0.28, base + h * 0.5, d / 2 + 0.1, "#243038");
    orn(0.16, h * 0.86, 0.12, w * 0.24, base + h * 0.5, d / 2 + 0.1, "#243038");
  }
  function balconies(w, h, d, base) {
    const rowCount = Math.min(6, Math.max(2, Math.floor(h / 3.4)));
    for (let r = 0; r < rowCount; r++) {
      const y = base + 2 + r * ((h - 2.4) / rowCount);
      orn(w * 0.78, 0.1, 0.62, 0, y, d / 2 + 0.32, "#e6e0d4");
      orn(w * 0.78, 0.32, 0.08, 0, y + 0.24, d / 2 + 0.58, "#2c3338");
    }
  }
  function steps(w, d, count) {
    for (let i = 0; i < count; i++) {
      orn(w + i * 0.35, 0.16, 0.48, 0, 0.1 + (count - i) * 0.12, d / 2 + 0.4 + i * 0.46, "#e6e0d4");
    }
  }
  function antenna(lx, y, lz, h) {
    orn(0.1, h, 0.1, lx, y + h / 2, lz, pick(rand, ["#d64545", "#e8e6e1", "#243038"]));
  }
  function openLot() {
    if (lotQuad) fillPoly(lotQuad, 1);
    bleeds.push({ x: bx, z: bz });
  }
  function clearance(x, z, list) {
    let best = 99;
    for (let i = 0; i < list.length; i++) {
      const edge = list[i];
      const pts = edge.pts;
      for (let k = 0; k < pts.length; k += 2) {
        const d = Math.hypot(pts[k].x - x, pts[k].z - z) - edge.half - 1.25;
        if (d < best) best = d;
      }
    }
    return best;
  }

  function placeTower(dist) {
    const w = Math.min(bhalf * 1.05, 3.6 + rand() * 2.8);
    const d = Math.min(bhalf * 1.05, 3.6 + rand() * 2.8);
    const podiumH = 2.8 + rand() * 1.8;
    const podium = mass("masonry", w + 2.2, podiumH, d + 2, 0, 0, 0, wallColor(STONE));
    if (podium) {
      cornice(podium.w, podium.d, podiumH, "#e6d3a8");
      const cols = 4;
      for (let c = 0; c < cols; c++) {
        pillar(podiumH, -podium.w / 2 + (c + 0.5) * (podium.w / cols), podium.d / 2 + 0.12, "#efe8dc", 0.14);
      }
      orn(podium.w * 0.62, 0.1, 1.15, 0, podiumH - 0.15, podium.d / 2 + 0.7, pick(rand, AWNINGS));
    }
    const h = (dist < side * 0.22 && chance(0.55) ? 34 : 14) + rand() * 26;
    const base = podium ? podiumH : 0;
    const shaft = mass("glass", w, h, d, 0, base, 0, pick(rand, GLASS_TINTS));
    if (!shaft) return;
    curtain(shaft.w, shaft.h, shaft.d, base);
    cornice(shaft.w, shaft.d, base + shaft.h, "#243038");
    const crownH = 2 + rand() * 1.4;
    mass("flat", shaft.w * 0.62, crownH, shaft.d * 0.62, 0, base + shaft.h, 0, pick(rand, ["#2c3338", "#1b2836", "#4a3428"]));
    const top = base + shaft.h + crownH;
    antenna(0, top, 0, 2.2 + rand() * 4);
    if (chance(0.5)) antenna(shaft.w * 0.22, top, shaft.d * 0.1, 1.4 + rand() * 2);
    if (chance(0.42) && bhalf > 4.2) {
      const ww = Math.min(bhalf * 0.7, 2.8 + rand() * 1.6);
      const wing = mass("glass", ww, 8 + rand() * 14, ww, bhalf * 0.32, 0, -bhalf * 0.18, pick(rand, GLASS_TINTS));
      if (wing && shaft) {
        orn(Math.abs(bhalf * 0.32) + ww, 0.4, 0.8, bhalf * 0.16, base + Math.min(shaft.h, wing.h) * 0.55, 0, "#d5dbe0");
      }
    }
    openLot();
  }

  function placeDeco() {
    let y = 0;
    let w = Math.min(bhalf * 1.35, 5.5 + rand() * 3);
    let d = Math.min(bhalf * 1.25, 5 + rand() * 2.5);
    const tone = pick(rand, ["#e6d3a8", "#f0e2bf", "#d8b48a", "#efe6d2"]);
    const stepsN = 3 + irand(2);
    for (let s = 0; s < stepsN; s++) {
      const h = s === 0 ? 4 + rand() * 5 : 2.6 + rand() * 3.2;
      const built = mass("masonry", w, h, d, 0, y, 0, s === stepsN - 1 ? "#f4efe4" : tone);
      if (!built) break;
      cornice(built.w, built.d, y + h, s % 2 ? "#c4a574" : "#f7f1e4");
      if (s === 0) frames(built.w, h, built.d, y);
      y += h;
      w = Math.max(2.2, w * (0.62 + rand() * 0.12));
      d = Math.max(2.2, d * (0.62 + rand() * 0.12));
    }
    orn(0.28, y * 0.92, 0.2, -w * 0.35, y * 0.48, d * 0.55, "#c4a574");
    orn(0.28, y * 0.92, 0.2, w * 0.35, y * 0.48, d * 0.55, "#c4a574");
    pillar(y * 0.35, -w * 0.8, d * 0.2, tone, 0.35);
    pillar(y * 0.35, w * 0.8, d * 0.2, tone, 0.35);
    antenna(0, y, 0, 2 + rand() * 3);
  }

  function placeModern() {
    const w = Math.min(bhalf * 1.4, 5 + rand() * 4);
    const d = Math.min(bhalf * 1.15, 3.5 + rand() * 3);
    const h = 6 + rand() * 16;
    const built = mass("flat", w, h, d, 0, 0, 0, wallColor(MODERN));
    if (!built) return;
    const fins = 4 + irand(3);
    for (let i = 0; i < fins; i++) {
      const y = 1.2 + i * ((h - 1.5) / fins);
      orn(built.w + 0.8, 0.16, built.d + 0.35, 0, y, 0, pick(rand, ["#2c3338", "#c45c38", "#1f4e89", "#e7e2d6"]));
    }
    for (let c = 0; c < 4; c++) pillar(Math.min(3.2, h * 0.35), -built.w / 2 + (c + 0.5) * (built.w / 4), 0, "#d9d3c6", 0.18);
    if (chance(0.6)) {
      const ww = 2.4 + rand() * 2.2;
      const wing = mass("glass", ww, 4 + rand() * 8, ww, bhalf * 0.28, 2.2, bhalf * 0.1, pick(rand, GLASS_TINTS));
      if (wing) frames(wing.w, wing.h, wing.d, 2.2);
    }
    parapet(built.w, built.d, h);
    if (chance(0.4)) antenna(built.w * 0.2, h + 0.6, 0, 2 + rand() * 2);
  }

  function placeWarehouse() {
    const w = Math.min(bhalf * 1.7, 7 + rand() * 4);
    const d = Math.min(bhalf * 1.35, 4.5 + rand() * 2.5);
    const h = 2.8 + rand() * 2.4;
    const built = mass("masonry", w, h, d, 0, 0, 0, wallColor(WARES));
    if (!built) return;
    orn(built.w * 1.04, 0.22, built.d * 1.04, 0, h + 0.12, 0, pick(rand, ROOFS));
    const teeth = Math.max(3, Math.floor(built.w / 1.8));
    for (let i = 0; i < teeth; i++) {
      const lx = -built.w / 2 + (i + 0.5) * (built.w / teeth);
      orn(0.22, 1.35, built.d * 0.92, lx, h + 0.85, 0, pick(rand, ROOFS));
    }
    orn(built.w * 0.7, 0.45, 1.3, 0, 0.35, built.d / 2 + 0.7, "#6b5344");
    for (let i = 0; i < 3; i++) {
      orn(0.9, 1.3, 0.1, -built.w * 0.28 + i * built.w * 0.28, 0.8, built.d / 2 + 0.08, "#1b140f");
    }
    if (chance(0.55)) {
      rounds.push({
        x: world(built.w * 0.32, -built.d * 0.1).x,
        y: h + 1.5,
        z: world(built.w * 0.32, -built.d * 0.1).z,
        sx: 0.28,
        sy: 3,
        sz: 0.28,
        color: "#5c6568",
        ry: 0,
      });
    }
  }

  function placeCivic() {
    const w = Math.min(bhalf * 1.5, 6 + rand() * 3);
    const d = Math.min(bhalf * 1.3, 5 + rand() * 2.4);
    const h = 3.4 + rand() * 2.6;
    const built = mass("masonry", w, h, d, 0, 0, 0, wallColor(STONE));
    if (!built) return;
    steps(built.w * 0.7, built.d, 4);
    const cols = 4 + irand(2);
    for (let c = 0; c < cols; c++) {
      pillar(h, -built.w / 2 + (c + 0.5) * (built.w / cols), built.d / 2 + 0.2, "#f4efe4", 0.16);
    }
    orn(built.w * 1.05, 0.35, 1.1, 0, h + 0.15, built.d / 2 + 0.15, "#efe6d2");
    hip(built.w * 1.02, 1.4, built.d * 1.02, 0, h, 0, pick(rand, ROOFS));
    if (chance(0.5)) dome(Math.min(built.w, built.d) * 0.28, 0, h + 0.4, 0, pick(rand, ["#d9d2c3", "#8eafc4", "#e6d3a8"]));
    if (chance(0.55)) {
      mass("masonry", 2.4 + rand(), h * 0.8, built.d * 0.7, -built.w * 0.55, 0, 0, wallColor(STONE));
      mass("masonry", 2.4 + rand(), h * 0.75, built.d * 0.65, built.w * 0.55, 0, 0, wallColor(STONE));
    }
    openLot();
  }

  function placeChurch() {
    const w = Math.min(bhalf * 1.15, 4 + rand() * 2);
    const d = Math.min(bhalf * 1.6, 6 + rand() * 3);
    const h = 3.6 + rand() * 2.2;
    const built = mass("masonry", w, h, d, 0, 0, 0, wallColor(STONE));
    if (!built) return;
    hip(built.w, 1.6 + rand() * 0.8, built.d, 0, h, 0, pick(rand, ROOFS));
    mass("masonry", built.w * 1.15, h * 0.85, built.d * 0.38, 0, 0, 0, wallColor(STONE));
    for (let i = 0; i < 4; i++) {
      const lz = -built.d * 0.32 + i * (built.d * 0.2);
      orn(0.35, h * 0.75, 0.45, built.w / 2 + 0.15, h * 0.35, lz, "#d9d2c3");
      orn(0.35, h * 0.75, 0.45, -built.w / 2 - 0.15, h * 0.35, lz, "#d9d2c3");
      orn(0.28, 1.4, 0.1, built.w / 2 + 0.02, h * 0.55, lz, "#24384a");
    }
    const towerW = Math.min(2.4, built.w * 0.55);
    const towerH = 5 + rand() * 6;
    const tower = mass("masonry", towerW, towerH, towerW, 0, 0, built.d * 0.28, wallColor(STONE));
    if (tower) {
      orn(tower.w * 0.55, tower.w * 0.55, 0.12, 0, towerH * 0.62, built.d * 0.28 + tower.d / 2 + 0.08, "#1b140f");
      orn(tower.w * 0.28, tower.w * 0.28, 0.14, 0, towerH * 0.62, built.d * 0.28 + tower.d / 2 + 0.12, "#f4efe4");
      hip(tower.w * 0.9, 1.2, tower.w * 0.9, 0, towerH, built.d * 0.28, pick(rand, ROOFS));
      const spireH = 4 + rand() * 7;
      spires.push({
        x: world(0, built.d * 0.28).x,
        y: towerH + 1.2 + spireH / 2,
        z: world(0, built.d * 0.28).z,
        sx: 0.45,
        sy: spireH,
        sz: 0.45,
        color: pick(rand, STONE),
        ry: byaw,
      });
    }
    const apse = world(0, -built.d * 0.42);
    rounds.push({ x: apse.x, y: h * 0.4, z: apse.z, sx: built.w * 0.28, sy: h * 0.8, sz: built.w * 0.28, color: pick(rand, STONE), ry: 0 });
    steps(built.w * 0.45, built.d, 3);
    orn(0.7, 1.3, 0.1, 0, 0.7, built.d / 2 + 0.08, "#241810");
  }

  function placeTown() {
    const span = bhalf * 1.65;
    const count = span > 8 ? 3 + irand(3) : 2 + irand(2);
    const gap = 0.32 + rand() * 0.25;
    const houseD = Math.min(bhalf * 1.15, 3.6 + rand() * 1.8);
    const houseW = Math.max(2.1, (span - gap * (count - 1)) / count);
    for (let i = 0; i < count; i++) {
      const lx = -span / 2 + houseW / 2 + i * (houseW + gap);
      const h = 3 + rand() * 3.8;
      const built = mass("masonry", houseW * (0.82 + rand() * 0.12), h, houseD * (0.85 + rand() * 0.15), lx, 0, 0, wallColor(HOUSES));
      if (!built) continue;
      hip(built.w, 1.35 + rand() * 1.1, built.d, lx, h, 0, pick(rand, ROOFS));
      orn(0.26, 0.9 + rand() * 0.8, 0.26, lx + built.w * 0.28, h + 1.15, built.d * 0.12, pick(rand, ["#6b5344", "#8a5a32", "#3e342c"]));
      orn(0.48, 0.95, 0.1, lx - built.w * 0.12, 1.35, built.d / 2 + 0.08, "#15202b");
      orn(0.48, 0.7, 0.1, lx + built.w * 0.16, 2.2, built.d / 2 + 0.08, "#15202b");
      orn(0.62, 0.85, 0.32, lx + built.w * 0.18, 1.7, built.d / 2 + 0.22, pick(rand, GLASS_TINTS));
      orn(0.7, 0.12, 0.45, lx, 0.1, built.d / 2 + 0.32, "#cfc6b4");
      orn(0.5, 1.15, 0.08, lx, 0.65, built.d / 2 + 0.06, "#241810");
      if (i > 0) alleyPoints.push(world(lx - (houseW + gap) / 2, 0));
    }
  }

  function placeBrick() {
    const count = 1 + irand(3);
    for (let n = 0; n < count; n++) {
      const w = Math.min(bhalf * 1.1, 3.5 + rand() * 2.5);
      const d = Math.min(bhalf * 1.1, 3.5 + rand() * 2.5);
      const h = 5 + rand() * 12;
      const lx = (n - (count - 1) / 2) * bhalf * 0.55;
      const lz = (rand() - 0.5) * bhalf * 0.3;
      const built = mass("masonry", w, h, d, lx, 0, lz, wallColor(BRICKS));
      if (!built) continue;
      frames(built.w, Math.min(h, 14), built.d, 0);
      balconies(built.w, Math.min(h, 14), built.d, 0);
      cornice(built.w, built.d, h, pick(rand, ROOFS));
      parapet(built.w, built.d, h + 0.2);
      orn(built.w * 0.96, 0.9, 0.16, lx, 0.7, lz + built.d / 2 + 0.08, "#1b140f");
      orn(built.w * 0.7, 0.1, 0.9, lx, 2.05, lz + built.d / 2 + 0.45, pick(rand, AWNINGS));
      if (chance(0.4)) {
        const p = world(lx + built.w * 0.22, lz);
        rounds.push({ x: p.x, y: h + 1.1, z: p.z, sx: 0.38, sy: 1.5, sz: 0.38, color: "#8a8478", ry: 0 });
        hip(0.9, 0.7, 0.9, lx + built.w * 0.22, h + 1.8, lz, "#5c6568");
      }
    }
  }

  function placeShops() {
    const w = Math.min(bhalf * 1.35, 4.5 + rand() * 3);
    const d = Math.min(bhalf * 1.15, 3.6 + rand() * 2);
    const h = 2.6 + rand() * 2.2;
    const built = mass("masonry", w, h, d, 0, 0, 0, wallColor(HOUSES));
    if (!built) return;
    orn(built.w * 0.92, 0.1, 1.25, 0, h - 0.05, built.d / 2 + 0.55, pick(rand, AWNINGS));
    orn(1.5, 0.7, 0.12, 0, h + 0.7, built.d / 2 + 0.15, pick(rand, AWNINGS));
    orn(0.6, 1.15, 0.08, 0, 0.65, built.d / 2 + 0.06, "#241810");
    frames(built.w, h, built.d, 0);
    doorMarks.push(world(0, built.d / 2 + 1.5));
    const tables = 2 + irand(3);
    for (let t = 0; t < tables; t++) {
      const lx = -built.w * 0.35 + t * (built.w * 0.7 / tables);
      orn(0.65, 0.08, 0.65, lx, 0.72, built.d / 2 + 1.45, "#f4efe4");
      dome(0.38, lx, 0.85, built.d / 2 + 1.45, pick(rand, AWNINGS));
    }
    orn(0.7, 0.45, 0.7, -built.w * 0.35, 0.3, built.d / 2 + 1.2, "#6b5344");
    if (chance(0.5)) {
      mass("masonry", built.w * 0.72, 2.2, built.d * 0.72, 0, h, 0, wallColor(BRICKS));
      parapet(built.w * 0.72, built.d * 0.72, h + 2.2);
    }
  }

  function placePlaza() {
    openLot();
    const trees = 3 + irand(5);
    for (let i = 0; i < trees; i++) {
      const p = world((rand() - 0.5) * bhalf * 1.1, (rand() - 0.5) * bhalf * 1.1);
      if (chance(0.25)) addPine(p.x, p.z, 0.55 + rand() * 0.6);
      else addTree(p.x, p.z, 0.45 + rand() * 0.75, pick(rand, LEAVES));
    }
    mass("flat", 1.6 + rand(), 2.2 + rand(), 1.6 + rand(), bhalf * 0.22, 0, -bhalf * 0.12, pick(rand, AWNINGS));
    orn(1.3, 0.38, 0.4, -bhalf * 0.25, 0.32, bhalf * 0.15, "#6b5344");
    orn(1.3, 0.38, 0.4, bhalf * 0.18, 0.32, -bhalf * 0.05, "#6b5344");
    if (chance(0.45)) {
      for (let c = 0; c < 4; c++) pillar(2.2, Math.cos((c / 4) * Math.PI * 2) * 1.1, Math.sin((c / 4) * Math.PI * 2) * 1.1, "#efe8dc", 0.1);
      hip(2.4, 1.1, 2.4, 0, 2.2, 0, pick(rand, ROOFS));
    }
    plazaSpots.push({ x: bx, z: bz });
  }

  function placeCourt() {
    const s = Math.min(bhalf * 0.95, 4.2);
    const t = Math.max(1.6, s * 0.42);
    const h = 3.2 + rand() * 4;
    const color = wallColor(BRICKS);
    mass("masonry", s * 1.7, h, t, 0, 0, -s + t / 2, color);
    mass("masonry", s * 1.7, h * (0.8 + rand() * 0.3), t, 0, 0, s - t / 2, wallColor(HOUSES));
    mass("masonry", t, h * 0.9, s * 1.2, -s + t / 2, 0, 0, wallColor(STONE));
    mass("masonry", t, h * 0.75, s * 1.2, s - t / 2, 0, 0, wallColor(MODERN));
    hip(s * 1.7, 1.1, t, 0, h, -s + t / 2, pick(rand, ROOFS));
    const tree = world((rand() - 0.5) * s * 0.3, (rand() - 0.5) * s * 0.3);
    addTree(tree.x, tree.z, 0.7 + rand() * 0.4, pick(rand, LEAVES));
    orn(0.8, 0.35, 0.8, 0, 0.25, 0, "#d9d2c3");
    openLot();
    plazaSpots.push({ x: bx, z: bz });
  }

  function placeTerrace() {
    let y = 0;
    let w = Math.min(bhalf * 1.6, 6 + rand() * 2);
    let d = Math.min(bhalf * 1.45, 5.5 + rand() * 2);
    const color = wallColor(MODERN);
    for (let i = 0; i < 4; i++) {
      const h = 2 + rand() * 1.5;
      const built = mass(i % 2 ? "flat" : "masonry", w, h, d, (rand() - 0.5) * 0.4, y, (rand() - 0.5) * 0.4, i === 0 ? color : wallColor(STONE));
      if (!built) break;
      orn(built.w * 0.82, 0.1, built.d * 0.82, 0, y + h + 0.08, 0, pick(rand, LEAVES));
      orn(0.7, 0.15, 1.4, built.w * 0.15, y + h * 0.5, built.d / 2 + 0.2, "#cfc6b4");
      y += h;
      w *= 0.7 + rand() * 0.08;
      d *= 0.7 + rand() * 0.08;
    }
  }

  function placeHotel() {
    const w = Math.min(bhalf * 1.25, 4 + rand() * 2.5);
    const d = Math.min(bhalf * 1.15, 3.4 + rand() * 2);
    const h = 12 + rand() * 18;
    const built = mass("flat", w, h, d, 0, 0, 0, wallColor(MODERN));
    if (!built) return;
    frames(built.w, Math.min(h, 16), built.d, 0);
    const shelves = Math.min(8, Math.floor(h / 2.6));
    for (let r = 0; r < shelves; r++) {
      const y = 2.2 + r * ((h - 3) / shelves);
      orn(built.w * 1.04, 0.1, 0.58, 0, y, built.d / 2 + 0.28, "#e7e2d6");
    }
    orn(built.w * 0.7, 0.14, 1.5, 0, 2.4, built.d / 2 + 0.8, pick(rand, AWNINGS));
    orn(1.8, 0.8, 0.12, 0, h + 1.1, built.d / 2 + 0.1, pick(rand, AWNINGS));
    mass("flat", built.w * 0.45, 2, built.d * 0.45, built.w * 0.15, h, 0, "#2c3338");
    orn(built.w * 0.55, 0.12, built.d * 0.4, -built.w * 0.1, h + 0.2, 0, "#1d6f96");
    parapet(built.w, built.d, h);
    steps(built.w * 0.4, built.d, 3);
    doorMarks.push(world(0, built.d / 2 + 1.6));
  }

  function placeStack() {
    const count = 3 + irand(4);
    let y = 0;
    let w = Math.min(bhalf * 1.4, 4 + rand() * 3);
    let d = Math.min(bhalf * 1.3, 3.5 + rand() * 2.5);
    for (let i = 0; i < count; i++) {
      const h = 2.4 + rand() * (i === 0 ? 5 : 3.5);
      const ox = (rand() - 0.5) * bhalf * 0.35;
      const oz = (rand() - 0.5) * bhalf * 0.35;
      const built = mass(i % 3 === 0 ? "glass" : "masonry", w, h, d, ox, y, oz, wallColor(i % 2 ? BRICKS : HOUSES));
      if (!built) break;
      if (chance(0.55)) hip(built.w, 0.9 + rand() * 0.8, built.d, ox, y + h, oz, pick(rand, ROOFS));
      if (i === 0) frames(built.w, h, built.d, y);
      y += h * (0.78 + rand() * 0.16);
      w = Math.max(1.8, w * (0.68 + rand() * 0.16));
      d = Math.max(1.8, d * (0.68 + rand() * 0.16));
    }
    for (let k = 0; k < 4; k++) {
      orn(1.05, 0.1, 0.55, -bhalf * 0.72, 1.1 + k * 1.7, k % 2 ? 0.35 : -0.35, "#4a4038");
    }
    antenna((rand() - 0.5) * 0.4, y, 0, 1.5 + rand() * 2.5);
  }

  function placeYard() {
    const span = bhalf * 1.3;
    orn(span * 2, 0.45, 0.14, 0, 0.35, span, "#6b5344");
    orn(span * 2, 0.45, 0.14, 0, 0.35, -span, "#6b5344");
    orn(0.14, 0.45, span * 2, span, 0.35, 0, "#6b5344");
    orn(0.14, 0.45, span * 2, -span, 0.35, 0, "#6b5344");
    mass("masonry", 2.4 + rand(), 2.4, 2.2 + rand(), -span * 0.25, 0, -span * 0.15, wallColor(WARES));
    const boxes = 2 + irand(3);
    for (let i = 0; i < boxes; i++) {
      mass("flat", 1.4 + rand(), 1.1 + rand(), 2.4 + rand() * 0.6, span * 0.15 + i * 0.2, 0, span * 0.2 - i * 0.8, pick(rand, ["#c0392b", "#1f4e89", "#2f6b4f", "#e0a106", "#6d7370"]));
    }
    pillar(4 + rand() * 3, span * 0.35, -span * 0.35, "#c5ccd1", 0.12);
    orn(3.2, 0.16, 0.16, span * 0.05, 4.2, -span * 0.35, "#e6e8ea");
    orn(0.08, 1.4, 0.08, -span * 0.15, 3.4, -span * 0.35, "#2c3338");
  }

  function placeFamily(family) {
    const tiers = family[2];
    const shrink = family[3];
    const h0 = family[4];
    const pal = PAL[family[7]] || HOUSES;
    const kind = family[8];
    const crowns = ["hip", "flat", "cornice", "dome", "saw", "spire"];
    let crown = family[9];
    if (chance(0.8)) crown = crowns[irand(crowns.length)];
    const flags = family[10] || "";
    const u = Math.min(bhalf * 0.95, 4.8);
    const shape = rand();
    if (shape < 0.16) {
      const homes = 2 + irand(4);
      const gap = 0.15 + rand() * 0.25;
      const houseW = Math.max(1.2, (u * 1.8 - gap * (homes - 1)) / homes);
      for (let home = 0; home < homes; home++) {
        const h = 2.1 + rand() * (chance(0.22) ? 9 : 4.5);
        const d = Math.max(1.3, u * (0.5 + rand() * 0.75));
        const lx = -((homes - 1) * (houseW + gap)) / 2 + home * (houseW + gap);
        const kind = chance(0.22) ? "glass" : "masonry";
        const built = mass(kind, houseW * (0.82 + rand() * 0.28), h, d, lx, 0, (rand() - 0.5) * 0.4, kind === "glass" ? pick(rand, GLASS_TINTS) : wallColor(WALLS));
        if (!built) continue;
        const roof = crowns[irand(crowns.length)];
        if (roof === "dome") dome(Math.min(built.w, built.d) * 0.42, lx, h, 0, pick(rand, ROOFS));
        else if (roof === "spire") {
          const p = world(lx, 0);
          spires.push({ x: p.x, y: h + 1.8, z: p.z, sx: 0.22, sy: 2.4 + rand() * 3, sz: 0.22, color: pick(rand, STONE), ry: byaw });
        } else if (roof === "flat") parapet(built.w, built.d, h);
        else if (roof === "cornice") cornice(built.w, built.d, h, pick(rand, STONE));
        else hip(built.w * 1.04, 0.4 + rand() * 0.9, built.d * 1.04, lx, h, 0, pick(rand, ROOFS));
      }
      return;
    }
    if (shape < 0.28) {
      const h1 = 2.2 + rand() * 8;
      const h2 = 2.2 + rand() * 9;
      const wing = mass(chance(0.3) ? "glass" : "masonry", u * (0.45 + rand() * 0.25), h2, u * (0.9 + rand() * 0.4), -u * 0.42, 0, 0, wallColor(WALLS));
      const bar = mass("masonry", u * (1.1 + rand() * 0.35), h1, u * (0.4 + rand() * 0.25), 0, 0, u * 0.32, wallColor(WALLS));
      if (shape < 0.23) mass(chance(0.25) ? "flat" : "masonry", u * 0.42, 2 + rand() * 5, u * 0.95, u * 0.42, 0, 0, wallColor(WALLS));
      if (bar && chance(0.7)) hip(bar.w, 0.45 + rand() * 0.7, bar.d, 0, h1, u * 0.32, pick(rand, ROOFS));
      if (wing && chance(0.55)) hip(wing.w, 0.4 + rand() * 0.6, wing.d, -u * 0.42, h2, 0, pick(rand, ROOFS));
      return;
    }
    if (shape < 0.38) {
      const pw = Math.max(2.2, u * (1.15 + rand() * 0.4));
      const pd = Math.max(2, u * (1 + rand() * 0.35));
      const ph = 1.5 + rand() * 2.4;
      mass(chance(0.35) ? "flat" : "masonry", pw, ph, pd, 0, 0, 0, wallColor(STONE));
      const towers = 1 + irand(3);
      for (let tower = 0; tower < towers; tower++) {
        const tw = Math.max(1.15, pw * (0.24 + rand() * 0.2));
        const th = 3.5 + rand() * 13;
        const ox = (tower - (towers - 1) / 2) * pw * 0.34;
        const glass = chance(0.5);
        const built = mass(glass ? "glass" : "masonry", tw, th, tw * (0.65 + rand() * 0.55), ox, ph, (rand() - 0.5) * pd * 0.18, glass ? pick(rand, GLASS_TINTS) : wallColor(WALLS));
        if (!built || !chance(0.45)) continue;
        const p = world(ox, 0);
        spires.push({ x: p.x, y: ph + th + 1.5, z: p.z, sx: 0.2, sy: 2 + rand() * 3.2, sz: 0.2, color: pick(rand, STONE), ry: byaw });
      }
      return;
    }
    if (shape < 0.46) {
      const rad = Math.max(1.05, u * (0.32 + rand() * 0.38));
      const h = 2.8 + rand() * 12;
      const lx = (rand() - 0.5) * u * 0.15;
      const lz = (rand() - 0.5) * u * 0.15;
      const p = world(lx, lz);
      rounds.push({ x: p.x, y: h / 2, z: p.z, sx: rad, sy: h, sz: rad, color: wallColor(WALLS), ry: rand() });
      if (chance(0.6)) dome(rad * 0.92, lx, h, lz, pick(rand, ROOFS));
      if (chance(0.4)) {
        const h2 = 2 + rand() * 5;
        const q = world(u * 0.5, (rand() - 0.5) * u * 0.25);
        rounds.push({ x: q.x, y: h2 / 2, z: q.z, sx: rad * 0.55, sy: h2, sz: rad * 0.55, color: wallColor(WALLS), ry: 0 });
      }
      return;
    }
    let y = 0;
    let w = Math.max(1.4, u * family[5]);
    let d = Math.max(1.4, u * family[6]);
    let top = null;
    for (let tier = 0; tier < tiers; tier++) {
      if (y > 30) break;
      const roof = chance(0.74) ? crowns[irand(crowns.length)] : crown;
      const h = Math.min(12, h0 * (tier === 0 ? 1 : 0.4 + rand() * 1.05) * (0.32 + rand() * 2.15));
      const shove = flags.indexOf("shift") >= 0 ? 0.55 : 0.18;
      const ox = (rand() - 0.5) * u * shove;
      const oz = (rand() - 0.5) * u * shove * 0.75;
      w = Math.max(1.05, Math.min(u * 1.45, w * (0.8 + rand() * 0.4)));
      d = Math.max(1.05, Math.min(u * 1.45, d * (0.8 + rand() * 0.4)));
      const tierKind = chance(0.42) ? (chance(0.5) ? "glass" : chance(0.5) ? "flat" : "masonry") : kind;
      const built = mass(tierKind, w, h, d, ox, y, oz, tierKind === "glass" ? pick(rand, GLASS_TINTS) : wallColor(chance(0.55) ? WALLS : pal));
      if (!built) break;
      top = { built: built, y: y, h: h, ox: ox, oz: oz };
      if (roof === "hip" || (roof === "step" && tier === tiers - 1)) hip(built.w * 1.04, 0.7 + rand() * 0.8, built.d * 1.04, ox, y + h, oz, pick(rand, ROOFS));
      if (roof === "cornice") cornice(built.w, built.d, y + h, pick(rand, STONE));
      if (roof === "flat" && tier === tiers - 1) parapet(built.w, built.d, y + h);
      if (roof === "saw" && tier === tiers - 1) {
        const teeth = Math.max(3, Math.floor(built.w / 1.4));
        for (let tooth = 0; tooth < teeth; tooth++) {
          const lx = ox - built.w / 2 + (tooth + 0.5) * (built.w / teeth);
          orn(0.18, 1.1, built.d * 0.9, lx, y + h + 0.55, oz, pick(rand, ROOFS));
        }
      }
      if (roof === "dome" && tier === tiers - 1) dome(Math.min(built.w, built.d) * 0.42, ox, y + h, oz, pick(rand, ROOFS));
      if (roof === "spire" && tier === tiers - 1) {
        const p = world(ox, oz);
        spires.push({ x: p.x, y: y + h + 2.4, z: p.z, sx: 0.32, sy: 4 + rand() * 4, sz: 0.32, color: pick(rand, STONE), ry: byaw });
      }
      if (flags.indexOf("frames") >= 0 && h > 2.4 && tier < 2) frames(built.w, Math.min(h, 10), built.d, y);
      if (flags.indexOf("balcony") >= 0 && tier > 0) balconies(built.w, h, built.d, y);
      if (flags.indexOf("cols") >= 0 && tier === 0) {
        const cols = 3 + irand(3);
        for (let col = 0; col < cols; col++) pillar(Math.min(h, 4.2), ox - built.w / 2 + (col + 0.5) * (built.w / cols), oz + built.d / 2 + 0.16, "#f4efe4", 0.12);
      }
      if (flags.indexOf("awning") >= 0 && tier === 0) orn(built.w * 0.8, 0.1, 1.05, ox, Math.min(2.4, h * 0.72), oz + built.d / 2 + 0.5, pick(rand, AWNINGS));
      if (flags.indexOf("arch") >= 0 && tier === 0) orn(built.w * 0.35, h * 0.55, 0.2, ox, h * 0.3, oz + built.d / 2 + 0.08, "#1b140f");
      y += h;
      if (roof === "hip") y += 0.45;
      w = Math.max(1.05, w * shrink);
      d = Math.max(1.05, d * shrink);
    }
    if (!top) return;
    if (flags.indexOf("spire") >= 0 && crown !== "spire") {
      const p = world(top.ox, top.oz);
      spires.push({ x: p.x, y: y + 2, z: p.z, sx: 0.28, sy: 3 + rand() * 4, sz: 0.28, color: pick(rand, STONE), ry: byaw });
    }
    if (flags.indexOf("antenna") >= 0) antenna(top.ox, y, top.oz, 1.6 + rand() * 3);
    if (flags.indexOf("steps") >= 0) steps(Math.max(1.2, top.built.w * 0.45), top.built.d, 3);
    if (flags.indexOf("chimney") >= 0) orn(0.4, 2.2 + rand(), 0.4, top.ox + top.built.w * 0.28, y + 1, top.oz, "#5c4034");
    if (flags.indexOf("wing") >= 0) mass(kind, Math.max(1.4, u * 0.5), h0 * 0.75, Math.max(1.4, u * 0.65), u * 0.55, 0, 0, wallColor(pal));
    if (flags.indexOf("crane") >= 0) {
      pillar(6 + rand() * 3, u * 0.35, -u * 0.2, "#c5ccd1", 0.1);
      orn(3.2, 0.12, 0.12, u * 0.05, 6, -u * 0.2, "#e6e8ea");
    }
    if (flags.indexOf("stall") >= 0) {
      for (let stall = 0; stall < 3; stall++) orn(0.85, 0.85, 0.85, -u * 0.7 + stall * 0.75, 0.5, u * 0.62, pick(rand, AWNINGS));
    }
    if (flags.indexOf("yard") >= 0) {
      const p = world((rand() - 0.5) * u * 0.35, (rand() - 0.5) * u * 0.35);
      if (chance(0.35)) addPine(p.x, p.z, 0.45 + rand() * 0.4);
      else addTree(p.x, p.z, 0.4 + rand() * 0.45, pick(rand, LEAVES));
    }
    if (flags.indexOf("court") >= 0) openLot();
    if (flags.indexOf("pool") >= 0) orn(u * 0.7, 0.08, u * 0.42, 0, 0.1, -u * 0.15, "#1d6f96");
    if (flags.indexOf("clock") >= 0) orn(0.7, 0.7, 0.1, top.ox, top.y + top.h * 0.62, top.oz + top.built.d / 2 + 0.1, "#f4efe4");
    if (flags.indexOf("sign") >= 0) orn(1.35, 0.4, 0.08, top.ox, Math.min(y, 2.6), top.oz + top.built.d / 2 + 0.16, pick(rand, AWNINGS));
    if (flags.indexOf("lamp") >= 0) {
      const p = world(top.ox, top.oz);
      canopies.push({ x: p.x, y: y + 0.35, z: p.z, sx: 0.28, sy: 0.28, sz: 0.28, color: "#fff4d2", ry: 0 });
    }
    if (flags.indexOf("flag") >= 0) orn(0.08, 2.4, 0.08, top.ox + top.built.w * 0.2, y + 1.2, top.oz, "#2c3338");
  }

  function placeSpread() {
    const savedX = bx;
    const savedZ = bz;
    const savedHalf = bhalf;
    const count = 2 + irand(3);
    for (let n = 0; n < count; n++) {
      bx = savedX + (rand() - 0.5) * savedHalf * 0.75;
      bz = savedZ + (rand() - 0.5) * savedHalf * 0.75;
      bhalf = Math.max(2.05, savedHalf * (0.32 + rand() * 0.18));
      const family = varyFamily(FAMILIES[irand(FAMILIES.length)]);
      family[2] = 1 + irand(3);
      family[4] = Math.min(8, Math.max(1.3, family[4] * (0.3 + rand() * 0.55)));
      placeFamily(family);
    }
    bx = savedX;
    bz = savedZ;
    bhalf = savedHalf;
  }

  function placeGarden() {
    const span = bhalf * 1.15;
    orn(span * 2, 0.4, 0.12, 0, 0.28, span, "#6b5344");
    orn(span * 2, 0.4, 0.12, 0, 0.28, -span, "#6b5344");
    orn(0.12, 0.4, span * 2, span, 0.28, 0, "#6b5344");
    orn(0.12, 0.4, span * 2, -span, 0.28, 0, "#6b5344");
    mass("masonry", 2, 2.1, 2.2, span * 0.3, 0, -span * 0.2, wallColor(WARES));
    for (let t = 0; t < 3; t++) {
      const p = world((rand() - 0.5) * span * 0.8, (rand() - 0.5) * span * 0.8);
      if (chance(0.3)) addPine(p.x, p.z, 0.55 + rand() * 0.5);
      else addTree(p.x, p.z, 0.5 + rand() * 0.6, pick(rand, LEAVES));
    }
  }

  function districtOf(i, j, x, z) {
    for (let sample = 0; sample < 8; sample++) {
      const ang = (sample / 8) * Math.PI * 2;
      if (isWet(x + Math.cos(ang) * 12, z + Math.sin(ang) * 12)) return "harbor";
    }
    const dx = (i + 0.5) / side - 0.5;
    const dz = (j + 0.5) / side - 0.5;
    if (Math.hypot(dx, dz) < 0.04 + rand() * 0.3) return "skyline";
    const sectors = ["market", "sacred", "campus", "works", "old", "garden", "civic", "harbor"];
    const ang = Math.atan2(dz, dx) + (rand() - 0.5) * Math.PI * 1.6;
    return sectors[Math.floor(((ang + Math.PI) / (Math.PI * 2)) * sectors.length) % sectors.length];
  }

  function chooseStyle(dist) {
    if (chance(0.92)) return STYLES[irand(STYLES.length)];
    const downtown = dist < side * (0.2 + rand() * 0.26);
    const weights = downtown
      ? [["tower", 18], ["hotel", 14], ["deco", 12], ["modern", 12], ["stack", 10], ["brick", 10], ["restaurant", 10], ["civic", 8], ["church", 7], ["court", 6], ["plaza", 6], ["terrace", 5], ["warehouse", 4], ["town", 4], ["yard", 2]]
      : [["town", 16], ["stack", 12], ["brick", 12], ["restaurant", 11], ["warehouse", 10], ["yard", 8], ["court", 8], ["terrace", 8], ["hotel", 7], ["modern", 7], ["plaza", 8], ["church", 6], ["civic", 5], ["deco", 4], ["tower", 4]];
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i][1];
    let roll = rand() * total;
    for (let i = 0; i < weights.length; i++) {
      roll -= weights[i][1];
      if (roll <= 0) return weights[i][0];
    }
    return weights[weights.length - 1][0];
  }

  for (let j = 0; j < side; j++) {
    for (let i = 0; i < side; i++) {
      if (parkAt[i + j * side]) continue;
      const raw = [ipt[nid(i, j)], ipt[nid(i + 1, j)], ipt[nid(i + 1, j + 1)], ipt[nid(i, j + 1)]];
      const c = centroid(raw);
      if (isWet(c.x, c.z)) continue;
      const half = Math.min(6.5, clearance(c.x, c.z, cellRoads[i + j * side]));
      if (half < 2.1) continue;
      bx = c.x;
      bz = c.z;
      bhalf = half;
      byaw = streetYaw(raw) + (chance(0.5) ? Math.PI : 0) + (rand() - 0.5) * 0.08;
      lotQuad = insetQuad(raw, 4.2 + rand() * 3.6);
      const dx = i - (side - 1) / 2;
      const dz = j - (side - 1) / 2;
      const dist = Math.hypot(dx, dz);
      bx += (rand() - 0.5) * half * 0.08;
      bz += (rand() - 0.5) * half * 0.08;
      const mark = snapshot();
      const lotRoll = rand();
      if (lotRoll < 0.07) placeGarden();
      else if (lotRoll < 0.44) placeSpread();
      else if (lotRoll < 0.8) {
        const local = FAMILY_BOOK[districtOf(i, j, c.x, c.z)];
        const pool = chance(0.9) || !local ? FAMILIES : local;
        placeFamily(varyFamily(pool[irand(pool.length)]));
      } else {
          const style = chooseStyle(dist);
          if (style === "tower") placeTower(dist);
          else if (style === "deco") placeDeco();
          else if (style === "modern") placeModern();
          else if (style === "warehouse") placeWarehouse();
          else if (style === "civic") placeCivic();
          else if (style === "church") placeChurch();
          else if (style === "town") placeTown();
          else if (style === "restaurant") placeShops();
          else if (style === "plaza") placePlaza();
          else if (style === "court") placeCourt();
          else if (style === "terrace") placeTerrace();
          else if (style === "hotel") placeHotel();
          else if (style === "stack") placeStack();
          else if (style === "yard") placeYard();
          else placeBrick();
      }
      const py = elev(c.x, c.z);
      rememberPad(c.x, c.z, py, Math.max(3.2, half * 0.8));
      liftSince(mark, py);
    }
  }
  addTerrain();

  for (let i = 0; i < footprints.length; i++) {
    const box = footprints[i];
    fill(box.x0, box.z0, box.x1, box.z1, 4);
  }
  for (let i = 0; i < bleeds.length; i++) bleedToStreet(bleeds[i].x, bleeds[i].z);

  for (let r = 0; r < parks.length; r++) {
    const park = parks[r];
    for (let t = 0; t < 8; t++) {
      const u = rand();
      const v = rand();
      const x = park.quad[0].x * (1 - u) * (1 - v) + park.quad[1].x * u * (1 - v) + park.quad[3].x * (1 - u) * v + park.quad[2].x * u * v;
      const z = park.quad[0].z * (1 - u) * (1 - v) + park.quad[1].z * u * (1 - v) + park.quad[3].z * (1 - u) * v + park.quad[2].z * u * v;
      if (pond && Math.hypot(x - pond.x, z - pond.z) < pond.r + 1.3) continue;
      const ix = Math.floor(x);
      const iz = Math.floor(z);
      if (ix < 0 || iz < 0 || ix >= cells || iz >= cells) continue;
      if (mask[iz * cells + ix] !== 2) continue;
      if (chance(0.2)) seatPlant(x, z, true, 0.55 + rand() * 0.9);
      else seatPlant(x, z, false, 0.5 + rand() * 1.05, pick(rand, LEAVES));
    }
  }

  function ribbonMesh(ribbon, material) {
    if (ribbon.idx.length < 3) return;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(new Float32Array(ribbon.pos), 3));
    geo.setIndex(ribbon.idx);
    geo.computeVertexNormals();
    root.add(new Mesh(geo, material));
  }
  const ribbonMat = function (color, rough) {
    return new MeshStandardMaterial({ color: color, roughness: rough, metalness: 0, side: DoubleSide });
  };
  ribbonMesh(waterR, new MeshStandardMaterial({ color: waterColor, roughness: 0.22, metalness: 0.35, side: DoubleSide }));
  ribbonMesh(parkR, ribbonMat("#3f8a45", 1));
  ribbonMesh(walkR, ribbonMat("#c4bbae", 1));
  ribbonMesh(pathR, ribbonMat("#c2b496", 1));
  ribbonMesh(driveR, ribbonMat("#3e4650", 0.96));
  ribbonMesh(oneR, ribbonMat("#5a4a3c", 0.96));
  ribbonMesh(alleyR, ribbonMat("#2a3036", 1));
  ribbonMesh(bridgeR, ribbonMat("#d5dbe0", 0.75));
  ribbonMesh(railR, ribbonMat("#efe8dc", 0.7));

  const points = [];
  const adj = [];
  const BIN = 32;
  const nearBins = new Map();
  function binOf(x, z) {
    return ((x / BIN) | 0) + 8000 + "," + (((z / BIN) | 0) + 8000);
  }
  function addNode(x, z, isPark, y) {
    const index = points.length;
    points.push({ x: x, z: z, y: y == null ? elev(x, z) : y, park: !!isPark });
    adj.push([]);
    const key = binOf(x, z);
    let list = nearBins.get(key);
    if (!list) {
      list = [];
      nearBins.set(key, list);
    }
    list.push(index);
    return index;
  }
  function clearLine(x0, z0, x1, z1, ok) {
    const dist = Math.hypot(x1 - x0, z1 - z0);
    const steps = Math.max(1, Math.ceil(dist / 0.75));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      if (!allows(x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, ok)) return false;
    }
    return true;
  }
  function link(a, b, ok, parkEdge) {
    if (a === b || a < 0 || b < 0) return;
    if (!clearLine(points[a].x, points[a].z, points[b].x, points[b].z, ok)) return;
    for (let i = 0; i < adj[a].length; i++) if (adj[a][i].n === b) return;
    adj[a].push({ n: b, park: parkEdge });
    adj[b].push({ n: a, park: parkEdge });
  }
  function sampleSeg(edge, s, dir) {
    let d = dir > 0 ? s : edge.len - s;
    if (d < 0) d = 0;
    if (d > edge.len) d = edge.len;
    let i = 1;
    while (i < edge.cum.length - 1 && edge.cum[i] < d) i++;
    const span = edge.cum[i] - edge.cum[i - 1] || 1;
    const t = (d - edge.cum[i - 1]) / span;
    const x = edge.pts[i - 1].x + (edge.pts[i].x - edge.pts[i - 1].x) * t;
    const z = edge.pts[i - 1].z + (edge.pts[i].z - edge.pts[i - 1].z) * t;
    const y = (edge.pts[i - 1].y || 0) + ((edge.pts[i].y || 0) - (edge.pts[i - 1].y || 0)) * t;
    let tx = edge.pts[i].x - edge.pts[i - 1].x;
    let tz = edge.pts[i].z - edge.pts[i - 1].z;
    const mag = Math.hypot(tx, tz) || 1;
    tx = (tx / mag) * dir;
    tz = (tz / mag) * dir;
    return { x: x, y: y, z: z, tx: tx, tz: tz };
  }

  const buckets = new Map();
  function tag(index, nodeId) {
    let list = buckets.get(nodeId);
    if (!list) {
      list = [];
      buckets.set(nodeId, list);
    }
    list.push(index);
  }
  const alleyNodes = [];
  for (let e = 0; e < edges.length; e++) {
    const edge = edges[e];
    const step = edge.foot ? 4.5 : 6.5;
    let prevL = -1;
    let prevR = -1;
    for (let dist = 0; dist <= edge.len; dist += step) {
      const at = Math.min(dist, edge.len);
      const p = sampleSeg(edge, at, 1);
      const end = at < 0.8 ? nid(edge.i0, edge.j0) : edge.len - at < 0.8 ? nid(edge.i1, edge.j1) : -1;
      if (edge.foot) {
        if (!allows(p.x, p.z, STREET)) {
          prevL = -1;
          continue;
        }
        const index = addNode(p.x, p.z, false, p.y);
        if (end >= 0) tag(index, end);
        if (prevL >= 0) link(prevL, index, STREET, false);
        prevL = index;
        if (end >= 0 || chance(0.4)) alleyNodes.push(index);
        continue;
      }
      const off = edge.half + 0.85;
      const lx = p.x - p.tz * off;
      const lz = p.z + p.tx * off;
      const rx = p.x + p.tz * off;
      const rz = p.z - p.tx * off;
      if (allows(lx, lz, STREET)) {
        const index = addNode(lx, lz, false, p.y);
        if (end >= 0) tag(index, end);
        if (prevL >= 0) link(prevL, index, STREET, false);
        prevL = index;
        if (edge.alley && chance(0.5)) alleyNodes.push(index);
        treeSpots.push({ x: p.x - p.tz * (off + 1.45), z: p.z + p.tx * (off + 1.45) });
      } else prevL = -1;
      if (allows(rx, rz, STREET)) {
        const index = addNode(rx, rz, false, p.y);
        if (end >= 0) tag(index, end);
        if (prevR >= 0) link(prevR, index, STREET, false);
        prevR = index;
        if (edge.alley && chance(0.5)) alleyNodes.push(index);
        treeSpots.push({ x: p.x + p.tz * (off + 1.45), z: p.z - p.tx * (off + 1.45) });
      } else prevR = -1;
    }
  }
  for (const group of buckets.values()) {
    for (let a = 0; a < group.length; a++) {
      for (let b = a + 1; b < group.length; b++) link(group[a], group[b], STREET, false);
    }
  }
  const gridCount = points.length;

  function closest(x, z, streetOnly, limit) {
    const cap = limit || points.length;
    const cx = (x / BIN) | 0;
    const cz = (z / BIN) | 0;
    let best = -1;
    let bestD = Infinity;
    for (let ring = 0; ring <= 4; ring++) {
      for (let dz = -ring; dz <= ring; dz++) {
        for (let dx = -ring; dx <= ring; dx++) {
          if (ring !== 0 && Math.abs(dx) !== ring && Math.abs(dz) !== ring) continue;
          const list = nearBins.get(cx + dx + 8000 + "," + (cz + dz + 8000));
          if (!list) continue;
          for (let k = 0; k < list.length; k++) {
            const i = list[k];
            if (i >= cap) continue;
            if (!adj[i].length && i < gridCount) continue;
            if (streetOnly && points[i].park) continue;
            const p = points[i];
            const ddx = p.x - x;
            const ddz = p.z - z;
            const d = ddx * ddx + ddz * ddz;
            if (d < bestD) {
              bestD = d;
              best = i;
            }
          }
        }
      }
      if (best >= 0 && ring >= 1) return best;
    }
    if (best >= 0) return best;
    for (let i = 0; i < cap; i++) {
      if (!adj[i].length && i < gridCount) continue;
      if (streetOnly && points[i].park) continue;
      const p = points[i];
      const ddx = p.x - x;
      const ddz = p.z - z;
      const d = ddx * ddx + ddz * ddz;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  }
  let routeStamp = new Uint32Array(points.length);
  let routePrev = new Int32Array(points.length);
  let routeGen = 1;
  function route(start, goal, allowPark) {
    if (start < 0 || goal < 0) return null;
    if (start === goal) return [points[start]];
    if (routeStamp.length < points.length) {
      routeStamp = new Uint32Array(points.length);
      routePrev = new Int32Array(points.length);
      routeGen = 1;
    }
    routeGen += 1;
    if (routeGen === 0xffffffff) {
      routeStamp.fill(0);
      routeGen = 1;
    }
    const queue = [start];
    routeStamp[start] = routeGen;
    routePrev[start] = start;
    for (let qi = 0; qi < queue.length; qi++) {
      const cur = queue[qi];
      if (cur === goal) break;
      const next = adj[cur];
      for (let i = 0; i < next.length; i++) {
        if (next[i].park && !allowPark) continue;
        const m = next[i].n;
        if (routeStamp[m] === routeGen) continue;
        routeStamp[m] = routeGen;
        routePrev[m] = cur;
        queue.push(m);
      }
    }
    if (routeStamp[goal] !== routeGen) return null;
    const path = [];
    let cur = goal;
    while (cur !== start) {
      path.push(points[cur]);
      cur = routePrev[cur];
      if (cur < 0) return null;
    }
    path.push(points[start]);
    path.reverse();
    return path;
  }
  function connectExtra(x, z, ok, parkEdge, parkNode) {
    if (!allows(x, z, ok)) return -1;
    const index = addNode(x, z, parkNode);
    const near = closest(x, z, !parkNode, gridCount);
    if (near >= 0) link(index, near, ok, parkEdge);
    return index;
  }

  const doorNodes = [];
  for (let i = 0; i < doorMarks.length; i++) {
    const node = closest(doorMarks[i].x, doorMarks[i].z, true, gridCount);
    if (node >= 0) doorNodes.push(node);
  }
  for (let i = 0; i < alleyPoints.length; i++) {
    const node = closest(alleyPoints[i].x, alleyPoints[i].z, true, gridCount);
    if (node >= 0) alleyNodes.push(node);
  }
  const plazaNodes = [];
  for (let i = 0; i < plazaSpots.length; i++) {
    const spot = plazaSpots[i];
    const index = connectExtra(spot.x, spot.z, STREET, false, false);
    if (index >= 0 && adj[index].length) plazaNodes.push(index);
  }
  const loops = [];
  for (let r = 0; r < loopRings.length; r++) {
    const ring = loopRings[r];
    let ok = true;
    for (let i = 0; i < ring.length; i++) if (!allows(ring[i].x, ring[i].z, PARK)) ok = false;
    if (!ok) continue;
    loops.push(ring);
    let prev = -1;
    let first = -1;
    for (let i = 0; i < ring.length; i++) {
      const node = addNode(ring[i].x, ring[i].z, true);
      if (first < 0) first = node;
      if (prev >= 0) link(prev, node, PARK, true);
      prev = node;
    }
    if (prev >= 0 && first >= 0) link(prev, first, PARK, true);
    const gate = closest(ring[0].x, ring[0].z, true, gridCount);
    if (gate >= 0) link(first, gate, ANY, true);
  }

  for (let i = 0; i < treeSpots.length; i++) {
    if (chance(0.62)) continue;
    const spot = treeSpots[i];
    const ix = Math.floor(spot.x);
    const iz = Math.floor(spot.z);
    if (ix < 1 || iz < 1 || ix >= cells - 1 || iz >= cells - 1) continue;
    const k = iz * cells + ix;
    if (wet[k]) continue;
    if (mask[k] !== 0 && mask[k] !== 2) continue;
    if (chance(0.28)) seatPlant(spot.x, spot.z, true, 0.4 + rand() * 0.7);
    else seatPlant(spot.x, spot.z, false, 0.4 + rand() * 0.85, pick(rand, LEAVES));
  }

  const streets = [];
  for (let i = 0; i < points.length; i++) {
    if (adj[i].length && !points[i].park) streets.push(i);
  }

  const dummy = new Object3D();
  const tint = new Color();
  function commit(geo, material, items, dynamic) {
    if (!items.length) return null;
    const mesh = new InstancedMesh(geo, material, items.length);
    if (dynamic) mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      dummy.position.set(item.x, item.y, item.z);
      dummy.rotation.set(0, item.ry || 0, 0);
      dummy.scale.set(item.sx || 1, item.sy || 1, item.sz || 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, tint.set(item.color));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    root.add(mesh);
    return mesh;
  }
  for (const bucket of boxBuckets.values()) {
    const material = bucket.kind === "glass" ? glassMat : bucket.kind === "flat" ? flatMat : masonryMat;
    commit(bucket.geo, material, bucket.items, false);
  }
  commit(new BoxGeometry(1, 1, 1), flatMat, scaled, false);
  commit(new ConeGeometry(1, 1, 4), flatMat, spires, false);
  commit(new CylinderGeometry(1, 1, 1, 8), flatMat, rounds, false);
  commit(new SphereGeometry(1, 8, 6), flatMat, canopies, false);

  let fountain = null;
  if (pond) {
    fountain = new Group();
    const base = new Mesh(new CylinderGeometry(0.55, 0.7, 0.35, 12), new MeshStandardMaterial({ color: "#d9d3c6", roughness: 0.75 }));
    base.position.y = 0.25;
    const jet = new Mesh(new CylinderGeometry(0.08, 0.16, 0.9, 8), new MeshStandardMaterial({ color: waterColor, roughness: 0.2, metalness: 0.3 }));
    jet.position.y = 0.7;
    fountain.add(base);
    fountain.add(jet);
    fountain.position.set(pond.x, elev(pond.x, pond.z) + 0.12, pond.z);
    fountain.userData.baseY = fountain.position.y;
    root.add(fountain);
  }

  function poseOn(edge, dir, s, lane) {
    const p = sampleSeg(edge, s, dir);
    return {
      x: p.x + p.tz * lane,
      y: p.y || 0,
      z: p.z - p.tx * lane,
      heading: Math.atan2(-p.tz, p.tx),
    };
  }
  function chooseTurn(node, fromEdge) {
    const options = out[node];
    if (!options.length) return null;
    const start = Math.floor(rand() * options.length);
    for (let k = 0; k < options.length; k++) {
      const choice = options[(start + k) % options.length];
      if (choice.e !== fromEdge || options.length === 1) return choice;
    }
    return options[0];
  }
  const drive = [];
  for (let e = 0; e < edges.length; e++) if (edges[e].drive) drive.push(e);
  const cars = [];
  for (let i = 0; i < carCount; i++) {
    const e = drive[i % drive.length];
    const edge = edges[e];
    const dir = edge.twoWay ? (chance(0.5) ? 1 : -1) : edge.forward ? 1 : -1;
    let lane = 0;
    if (edge.alley) lane = 0;
    else if (edge.twoWay) lane = 0.95;
    else lane = chance(0.5) ? 0.58 : -0.58;
    cars.push({ e: e, dir: dir, s: rand() * edge.len, cruise: 12 + rand() * 12, speed: 12, color: pick(rand, CARS), lane: lane });
  }
  function roadPace(preferred, edge) {
    const cap = edge && edge.limit ? edge.limit : 14;
    return Math.min(preferred, cap);
  }
  function stepCar(car, dt) {
    let time = dt;
    for (let guard = 0; guard < 8 && time > 0.0001; guard++) {
      const edge = edges[car.e];
      const pace = roadPace(car.cruise, edge);
      car.speed = pace;
      const room = edge.len - car.s;
      const need = pace > 0 ? room / pace : time;
      if (need > time) {
        car.s += pace * time;
        return;
      }
      time -= Math.max(0, need);
      const node = car.dir > 0 ? nid(edge.i1, edge.j1) : nid(edge.i0, edge.j0);
      const next = chooseTurn(node, car.e);
      if (!next) {
        car.dir = -car.dir;
        car.s = 0;
        return;
      }
      car.e = next.e;
      car.dir = next.dir;
      car.s = 0;
      const hopped = edges[car.e];
      if (hopped.alley) car.lane = 0;
      else if (hopped.twoWay) car.lane = 0.95;
      else if (Math.abs(car.lane) < 0.2) car.lane = 0.58;
    }
  }

  const liveNodes = [];
  for (let i = 0; i < out.length; i++) if (out[i].length) liveNodes.push(i);
  function busChoices(node) {
    const all = out[node];
    const wide = [];
    for (let i = 0; i < all.length; i++) if (!edges[all[i].e].alley) wide.push(all[i]);
    return wide.length ? wide : all;
  }
  function walkBus(startNode) {
    const route = [];
    let node = startNode;
    let prevE = -1;
    for (let hop = 0; hop < 6; hop++) {
      const options = busChoices(node);
      if (!options.length) break;
      let choice = options[irand(options.length)];
      if (options.length > 1 && choice.e === prevE) choice = options[(irand(options.length) + 1) % options.length];
      route.push(choice);
      prevE = choice.e;
      const edge = edges[choice.e];
      node = choice.dir > 0 ? nid(edge.i1, edge.j1) : nid(edge.i0, edge.j0);
    }
    return route;
  }
  const buses = [];
  const stopNodes = [];
  for (let i = 0; i < busCount && liveNodes.length; i++) {
    const route = walkBus(liveNodes[irand(liveNodes.length)]);
    if (route.length < 2) continue;
    const bus = {
      route: route,
      hop: irand(route.length),
      s: rand() * edges[route[0].e].len * 0.7,
      wait: rand() * 0.4,
      arrived: false,
      speed: 8 + rand() * 2.5,
      x: 0,
      z: 0,
      heading: 0,
      lane: 0.7,
      color: pick(rand, ["#e2b33a", "#f4f6f8", "#1f4e89", "#b33939", "#2f6b4f", "#6b3fa0"]),
    };
    const pose = poseOn(edges[route[bus.hop].e], route[bus.hop].dir, bus.s, bus.lane);
    bus.x = pose.x;
    bus.y = pose.y;
    bus.z = pose.z;
    bus.heading = pose.heading;
    buses.push(bus);
    for (let h = 0; h < route.length; h++) {
      const edge = edges[route[h].e];
      const end = poseOn(edge, route[h].dir, edge.len, 0);
      const node = closest(end.x, end.z, true, gridCount);
      if (node >= 0) stopNodes.push(node);
    }
  }
  function poseBus(bus) {
    const hop = bus.route[bus.hop];
    const edge = edges[hop.e];
    const pose = poseOn(edge, hop.dir, Math.min(bus.s, edge.len), bus.lane);
    bus.x = pose.x;
    bus.y = pose.y;
    bus.z = pose.z;
    bus.heading = pose.heading;
  }
  function stepBus(bus, dt) {
    bus.arrived = false;
    if (bus.wait > 0) {
      bus.wait -= dt;
      poseBus(bus);
      return;
    }
    const hop = bus.route[bus.hop];
    const edge = edges[hop.e];
    const pace = roadPace(bus.speed, edge) * 0.85;
    bus.s += pace * dt;
    if (bus.s >= edge.len) {
      bus.wait = 1.15;
      bus.arrived = true;
      bus.hop = (bus.hop + 1) % bus.route.length;
      bus.s = 0;
    }
    poseBus(bus);
  }

  function appendEdge(path, edge, dir) {
    if (dir > 0) {
      for (let i = 0; i < edge.pts.length; i++) path.push(edge.pts[i]);
    } else {
      for (let i = edge.pts.length - 1; i >= 0; i--) path.push(edge.pts[i]);
    }
  }
  function roadRoute(start, goal) {
    const prev = new Int32Array(n * n);
    const prevEdge = new Int32Array(n * n);
    const prevDir = new Int8Array(n * n);
    prev.fill(-1);
    const queue = [start];
    prev[start] = start;
    for (let qi = 0; qi < queue.length; qi++) {
      const cur = queue[qi];
      if (cur === goal) break;
      const next = out[cur];
      for (let i = 0; i < next.length; i++) {
        const edge = edges[next[i].e];
        const dest = next[i].dir > 0 ? nid(edge.i1, edge.j1) : nid(edge.i0, edge.j0);
        if (prev[dest] !== -1) continue;
        prev[dest] = cur;
        prevEdge[dest] = next[i].e;
        prevDir[dest] = next[i].dir;
        queue.push(dest);
      }
    }
    if (prev[goal] === -1) return null;
    const nodes = [];
    let cur = goal;
    while (cur !== start) {
      nodes.push(cur);
      cur = prev[cur];
      if (cur < 0) return null;
    }
    nodes.reverse();
    const path = [ipt[start]];
    let walked = start;
    for (let i = 0; i < nodes.length; i++) {
      appendEdge(path, edges[prevEdge[nodes[i]]], prevDir[nodes[i]]);
      walked = nodes[i];
    }
    if (walked !== goal) return null;
    return path;
  }
  function planAmb(fromNode) {
    for (let t = 0; t < 8; t++) {
      const goal = liveNodes[irand(liveNodes.length)];
      if (goal === fromNode) continue;
      const path = roadRoute(fromNode, goal);
      if (path && path.length > 1) return path;
    }
    return [ipt[fromNode]];
  }
  function closestNode(x, z) {
    let best = liveNodes[0];
    let bestD = Infinity;
    for (let i = 0; i < liveNodes.length; i++) {
      const p = ipt[liveNodes[i]];
      const d = (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z);
      if (d < bestD) {
        bestD = d;
        best = liveNodes[i];
      }
    }
    return best;
  }
  const ambulances = [];
  for (let i = 0; i < ambulanceCount && liveNodes.length; i++) {
    const start = liveNodes[irand(liveNodes.length)];
    const path = planAmb(start);
    ambulances.push({
      x: path[0].x,
      y: path[0].y || 0,
      z: path[0].z,
      path: path,
      cursor: path.length > 1 ? 1 : 0,
      wait: 0,
      speed: 18 + rand() * 5,
      cruise: 18 + rand() * 5,
      heading: 0,
    });
  }
  function followPath(unit, dt) {
    const path = unit.path;
    if (!path || !path.length) return true;
    const target = path[Math.min(unit.cursor, path.length - 1)];
    const dx = target.x - unit.x;
    const dz = target.z - unit.z;
    const dy = (target.y || 0) - (unit.y || 0);
    const dist = Math.hypot(dx, dz);
    if (dist < 0.6) {
      unit.x = target.x;
      unit.y = target.y || 0;
      unit.z = target.z;
      unit.cursor += 1;
      return unit.cursor >= path.length;
    }
    const cap = target.limit || 16;
    const pace = Math.min(unit.cruise || unit.speed, cap);
    const step = Math.min(dist, pace * dt);
    unit.heading = Math.atan2(-dz, dx);
    unit.x += (dx / dist) * step;
    unit.y = (unit.y || 0) + (dy / dist) * step;
    unit.z += (dz / dist) * step;
    return false;
  }
  function stepAmbulance(amb, dt) {
    if (amb.wait > 0) {
      amb.wait -= dt;
      if (amb.wait <= 0) {
        const start = closestNode(amb.x, amb.z);
        amb.path = planAmb(start);
        amb.cursor = amb.path.length > 1 ? 1 : 0;
        amb.x = amb.path[0].x;
        amb.y = amb.path[0].y || 0;
        amb.z = amb.path[0].z;
      }
      return;
    }
    if (followPath(amb, dt)) amb.wait = 2.2;
  }
  function aimService(unit, goal) {
    const start = closestNode(unit.x, unit.z);
    const end = closestNode(goal.x, goal.z);
    const path = start === end ? [ipt[start]] : roadRoute(start, end);
    if (!path || !path.length) return;
    unit.path = path;
    unit.cursor = 0;
  }
  function stepService(unit, dt, goal) {
    if (unit.wait > 0) {
      unit.wait -= dt;
      return;
    }
    unit.cool -= dt;
    if (unit.cool <= 0) {
      if (goal) aimService(unit, goal);
      else {
        const start = closestNode(unit.x, unit.z);
        unit.path = planAmb(start);
        unit.cursor = unit.path.length > 1 ? 1 : 0;
        unit.x = unit.path[0].x;
        unit.y = unit.path[0].y || 0;
        unit.z = unit.path[0].z;
      }
      unit.cool = goal ? 1.5 : 3.2;
    }
    if (followPath(unit, dt)) unit.wait = goal ? 0.7 : 1.5;
  }
  function spawnRoadUnit(speed) {
    const start = liveNodes[irand(liveNodes.length)];
    const path = planAmb(start);
    return {
      x: path[0].x,
      y: path[0].y || 0,
      z: path[0].z,
      path: path,
      cursor: path.length > 1 ? 1 : 0,
      wait: 0,
      cool: rand() * 1.2,
      speed: speed,
      cruise: speed,
      heading: 0,
    };
  }
  const policeCars = [];
  for (let i = 0; i < policeCarCount && liveNodes.length; i++) policeCars.push(spawnRoadUnit(16 + rand() * 4));
  const fireTrucks = [];
  for (let i = 0; i < fireTruckCount && liveNodes.length; i++) fireTrucks.push(spawnRoadUnit(13 + rand() * 3));
  function plantFire() {
    const pool = doorNodes.length ? doorNodes : streets;
    const spot = points[pool[irand(pool.length)]];
    return { x: spot.x, y: spot.y || elev(spot.x, spot.z), z: spot.z, heat: 0.45 + rand() * 0.55 };
  }
  const fires = [];
  for (let i = 0; i < fireCount && (doorNodes.length || streets.length); i++) fires.push(plantFire());
  function nearestFire(x, z) {
    let best = null;
    let bestD = Infinity;
    for (let i = 0; i < fires.length; i++) {
      const fire = fires[i];
      const d = (fire.x - x) * (fire.x - x) + (fire.z - z) * (fire.z - z);
      if (d < bestD) {
        bestD = d;
        best = fire;
      }
    }
    return best;
  }
  function heliCircuit(index) {
    const pts = [];
    const turns = 5;
    const radius = size * (0.22 + (index % 3) * 0.07);
    const cx = size * (0.32 + (index % 4) * 0.08);
    const cz = size * (0.3 + ((index + 1) % 4) * 0.08);
    for (let k = 0; k < turns; k++) {
      const angle = (k / turns) * Math.PI * 2 + index * 0.7;
      pts.push({
        x: cx + Math.cos(angle) * radius,
        z: cz + Math.sin(angle) * radius * 0.82,
        y: 160 + (k % 3) * 12 + rand() * 8,
      });
    }
    return pts;
  }
  const helis = [];
  const heliKinds = ["police", "fire", "medic", "news", "police", "fire"];
  for (let i = 0; i < heliCount; i++) {
    const kind = heliKinds[i % heliKinds.length];
    const path = heliCircuit(i);
    helis.push({
      kind: kind,
      path: path,
      cursor: 0,
      x: path[0].x,
      y: path[0].y,
      z: path[0].z,
      heading: 0,
      bank: 0,
      rotor: rand() * Math.PI,
      orbit: rand() * Math.PI * 2,
      speed: 26 + rand() * 10,
      body: HELI_BODY[kind],
      trim: HELI_TRIM[kind],
    });
  }
  function stepHeli(heli, dt, crook) {
    let tx = 0;
    let tz = 0;
    let ty = 80;
    let orbiting = false;
    if (heli.kind === "police" && crook) {
      heli.orbit += dt * 0.65;
      tx = crook.x + Math.cos(heli.orbit) * 18;
      tz = crook.z + Math.sin(heli.orbit) * 18;
      ty = 58;
      orbiting = true;
    } else if (heli.kind === "fire" && fires.length) {
      const fire = fires[heli.cursor % fires.length];
      heli.orbit += dt * 0.45;
      tx = fire.x + Math.cos(heli.orbit) * 22;
      tz = fire.z + Math.sin(heli.orbit) * 22;
      ty = 64;
      if (heli.orbit > Math.PI * 6) {
        heli.orbit = 0;
        heli.cursor = (heli.cursor + 1) % fires.length;
      }
    } else {
      const wp = heli.path[heli.cursor % heli.path.length];
      tx = wp.x;
      tz = wp.z;
      ty = wp.y;
    }
    const dx = tx - heli.x;
    const dz = tz - heli.z;
    const dist = Math.hypot(dx, dz) || 0.0001;
    const step = Math.min(dist, heli.speed * dt);
    const nextHeading = Math.atan2(-dz, dx);
    let turn = nextHeading - heli.heading;
    while (turn > Math.PI) turn -= Math.PI * 2;
    while (turn < -Math.PI) turn += Math.PI * 2;
    heli.bank += (Math.max(-0.45, Math.min(0.45, -turn * 1.4)) - heli.bank) * Math.min(1, dt * 3);
    heli.heading = nextHeading;
    heli.x += (dx / dist) * step;
    heli.z += (dz / dist) * step;
    heli.y += (ty - heli.y) * Math.min(1, dt * 0.7);
    heli.rotor += dt * (orbiting ? 22 : 16);
    if (!orbiting && heli.kind !== "fire" && dist < 2) heli.cursor = (heli.cursor + 1) % heli.path.length;
  }

  function placeholderPeople(count) {
    const items = [];
    for (let i = 0; i < count; i++) items.push({ x: 0, y: 0, z: 0, sx: 1, sy: 1, sz: 1, color: "#ffffff", ry: 0 });
    return items;
  }
  function carsAsItems(list, y, color) {
    const items = [];
    for (let i = 0; i < list.length; i++) items.push({ x: 0, y: y, z: 0, sx: 1, sy: 1, sz: 1, color: color || list[i].color, ry: 0 });
    return items;
  }
  function busesAsItems(list, y, color) {
    const items = [];
    for (let i = 0; i < list.length; i++) items.push({ x: 0, y: y, z: 0, sx: 1, sy: 1, sz: 1, color: color || list[i].color, ry: 0 });
    return items;
  }
  function ambulancesAsItems(list, y, color) {
    const items = [];
    for (let i = 0; i < list.length; i++) items.push({ x: 0, y: y, z: 0, sx: 1, sy: 1, sz: 1, color: color, ry: 0 });
    return items;
  }

  const bodyMesh = commit(new BoxGeometry(0.46, 0.95, 0.28), flatMat, placeholderPeople(peopleCount), true);
  const headMesh = commit(new SphereGeometry(0.16, 8, 6), flatMat, placeholderPeople(peopleCount), true);
  const carMesh = commit(new BoxGeometry(2.35, 0.62, 1.15), flatMat, carsAsItems(cars, 0.42), true);
  const cabinMesh = commit(new BoxGeometry(1.15, 0.42, 1.02), flatMat, carsAsItems(cars, 0.86, "#243040"), true);
  const busMesh = commit(new BoxGeometry(6.6, 1.7, 1.55), flatMat, busesAsItems(buses, 1.05), true);
  const busGlass = commit(new BoxGeometry(4.4, 0.7, 1.62), flatMat, busesAsItems(buses, 1.35, "#1d3348"), true);
  const ambMesh = commit(new BoxGeometry(3.3, 1.35, 1.35), flatMat, ambulancesAsItems(ambulances, 0.85, "#f4f6f8"), true);
  const ambStripe = commit(new BoxGeometry(3.32, 0.28, 1.38), flatMat, ambulancesAsItems(ambulances, 1.05, "#d7263d"), true);
  const ambLightL = commit(
    new SphereGeometry(0.16, 8, 6),
    new MeshStandardMaterial({ color: "#ffffff", emissive: "#ff2a2a", emissiveIntensity: 2 }),
    ambulancesAsItems(ambulances, 1.6, "#ff2a2a"),
    true
  );
  const ambLightR = commit(
    new SphereGeometry(0.16, 8, 6),
    new MeshStandardMaterial({ color: "#ffffff", emissive: "#f4f7ff", emissiveIntensity: 1.4 }),
    ambulancesAsItems(ambulances, 1.6, "#f4f7ff"),
    true
  );
  function paintList(list, y, colorOf) {
    const items = [];
    for (let i = 0; i < list.length; i++) {
      const color = typeof colorOf === "function" ? colorOf(list[i]) : colorOf;
      items.push({ x: 0, y: y, z: 0, sx: 1, sy: 1, sz: 1, color: color, ry: 0 });
    }
    return items;
  }
  const policeCarMesh = commit(new BoxGeometry(2.7, 0.7, 1.25), flatMat, paintList(policeCars, 0.48, "#1d3f86"), true);
  const policeCabin = commit(new BoxGeometry(1.2, 0.42, 1.08), flatMat, paintList(policeCars, 0.92, "#d5e4f5"), true);
  const policeBar = commit(
    new BoxGeometry(0.7, 0.16, 0.42),
    new MeshStandardMaterial({ color: "#ffffff", emissive: "#3d7eff", emissiveIntensity: 1.6 }),
    paintList(policeCars, 1.22, "#3d7eff"),
    true
  );
  const policeLamp = commit(
    new SphereGeometry(0.12, 8, 6),
    new MeshStandardMaterial({ color: "#ffffff", emissive: "#ff3b3b", emissiveIntensity: 2 }),
    paintList(policeCars, 1.28, "#ff3b3b"),
    true
  );
  const truckMesh = commit(new BoxGeometry(4.4, 1.45, 1.5), flatMat, paintList(fireTrucks, 0.9, "#c0392b"), true);
  const truckCab = commit(new BoxGeometry(1.35, 1.15, 1.42), flatMat, paintList(fireTrucks, 0.85, "#f4f6f8"), true);
  const truckLadder = commit(new BoxGeometry(2.6, 0.12, 0.7), flatMat, paintList(fireTrucks, 1.7, "#d9d3c6"), true);
  const truckLamp = commit(
    new SphereGeometry(0.14, 8, 6),
    new MeshStandardMaterial({ color: "#ffffff", emissive: "#ffb020", emissiveIntensity: 2 }),
    paintList(fireTrucks, 1.55, "#ffb020"),
    true
  );
  const heliBody = commit(new BoxGeometry(3.5, 0.82, 1.2), flatMat, paintList(helis, 0, function (heli) { return heli.body; }), true);
  const heliCabin = commit(new BoxGeometry(1.45, 0.55, 1.05), flatMat, paintList(helis, 0.15, "#b9d4e6"), true);
  const heliTail = commit(new BoxGeometry(2.4, 0.22, 0.28), flatMat, paintList(helis, 0.1, function (heli) { return heli.trim; }), true);
  const heliRotor = commit(new BoxGeometry(5.4, 0.06, 0.22), flatMat, paintList(helis, 0.7, "#2c3338"), true);
  const heliRotorB = commit(new BoxGeometry(0.22, 0.06, 5.4), flatMat, paintList(helis, 0.7, "#2c3338"), true);
  const heliTailRotor = commit(new BoxGeometry(0.08, 0.7, 0.1), flatMat, paintList(helis, 0.15, "#2c3338"), true);
  const heliLamp = commit(
    new SphereGeometry(0.16, 8, 6),
    new MeshStandardMaterial({ color: "#ffffff", emissive: "#ff3b3b", emissiveIntensity: 1.8 }),
    paintList(helis, 0.5, "#ff3b3b"),
    true
  );
  const heliBeam = commit(
    new ConeGeometry(3.2, 18, 8),
    new MeshStandardMaterial({ color: "#fff4d2", emissive: "#ffe7a3", emissiveIntensity: 0.45, transparent: true, opacity: 0.22, depthWrite: false }),
    paintList(helis, -8, "#fff4d2"),
    true
  );
  const flameMat = new MeshStandardMaterial({ color: "#ffffff", emissive: "#ff6a1a", emissiveIntensity: 1.6, roughness: 0.4 });
  const coreMat = new MeshStandardMaterial({ color: "#ffffff", emissive: "#ffe08a", emissiveIntensity: 2.1, roughness: 0.3 });
  const flameMesh = commit(new ConeGeometry(0.7, 1.8, 6), flameMat, paintList(fires, 0.9, "#ff7a22"), true);
  const coreMesh = commit(new ConeGeometry(0.32, 1.2, 5), coreMat, paintList(fires, 0.7, "#fff1b8"), true);
  const scorchMesh = commit(new CylinderGeometry(0.9, 1.05, 0.08, 8), flatMat, paintList(fires, 0.06, "#2a2420"), true);
  const policeCap = commit(new BoxGeometry(0.32, 0.08, 0.32), flatMat, placeholderPeople(peopleCount), true);
  const fireHelmet = commit(new SphereGeometry(0.18, 8, 6), flatMat, placeholderPeople(peopleCount), true);
  const hoodMesh = commit(new BoxGeometry(0.28, 0.16, 0.28), flatMat, placeholderPeople(peopleCount), true);
  const satchelMesh = commit(new BoxGeometry(0.18, 0.16, 0.1), flatMat, placeholderPeople(peopleCount), true);
  const brimMesh = commit(new BoxGeometry(0.36, 0.04, 0.36), flatMat, placeholderPeople(peopleCount), true);
  const propMesh = commit(new SphereGeometry(0.1, 6, 5), flatMat, placeholderPeople(peopleCount), true);

  function send(agent, x, z) {
    const streetOnly = agent.role !== "tourist";
    const start = closest(agent.x, agent.z, streetOnly);
    const goal = closest(x, z, streetOnly);
    const path = route(start, goal, agent.role === "tourist");
    if (!path || !path.length) return;
    agent.path = path;
    agent.cursor = path.length > 1 ? 1 : 0;
  }
  function nearbyGoal(x, z) {
    const bx = (x / BIN) | 0;
    const bz = (z / BIN) | 0;
    const hop = 1 + irand(3);
    const list = nearBins.get(bx + irand(hop * 2 + 1) - hop + 8000 + "," + (bz + irand(hop * 2 + 1) - hop + 8000));
    if (list && list.length) return points[list[irand(list.length)]];
    if (!streets.length) return null;
    return points[streets[irand(streets.length)]];
  }
  function dutyFor(role) {
    if (role === "police") return chance(0.46) ? "hunt" : chance(0.28) ? "post" : "patrol";
    if (role === "criminal") return chance(0.48) ? "lurk" : "snatch";
    if (role === "courier") return "deliver";
    if (role === "gardener") return "tend";
    if (role === "customer") return "shop";
    if (role === "tourist") return "sightsee";
    if (role === "worker") return "shift";
    if (role === "vendor") return "stall";
    if (role === "jogger") return "lap";
    if (role === "firefighter") return "respond";
    if (role === "commuter") return "ride";
    if (role === "singer") return "sing";
    if (role === "dancer") return "dance";
    if (role === "listener") return "listen";
    if (role === "player") return "play";
    if (role === "spectator") return "watch";
    if (role === "picnicker") return "picnic";
    if (role === "painter") return "paint";
    if (role === "rally") return "rally";
    if (role === "skater") return "skate";
    if (role === "photographer") return "snap";
    if (role === "sweeper") return "sweep";
    if (role === "guide") return "lead";
    if (role === "student") return "study";
    return "wander";
  }
  const venues = { concert: [], sport: [], picnic: [], rally: [] };
  function pushVenue(kind, x, z) {
    venues[kind].push({ kind: kind, x: x, z: z, y: elev(x, z), slots: 0 });
  }
  for (let v = 0; v < parks.length; v++) {
    const park = parks[v];
    const kinds = ["sport", "concert", "picnic", "rally"];
    pushVenue(kinds[v % kinds.length], park.cx, park.cz);
  }
  for (let v = 0; v < plazaSpots.length; v++) {
    const spot = plazaSpots[v];
    pushVenue(v % 2 ? "rally" : "concert", spot.x, spot.z);
  }
  if (!venues.sport.length && streets.length) {
    const seed = points[streets[0]];
    pushVenue("sport", seed.x, seed.z);
    pushVenue("concert", seed.x + 6, seed.z);
    pushVenue("picnic", seed.x, seed.z + 6);
    pushVenue("rally", seed.x + 6, seed.z + 6);
  }
  function takeVenue(kind) {
    const list = venues[kind] && venues[kind].length ? venues[kind] : venues.picnic.length ? venues.picnic : venues.concert;
    if (!list || !list.length) return null;
    let best = list[0];
    for (let i = 1; i < list.length; i++) if (list[i].slots < best.slots) best = list[i];
    best.slots += 1;
    return best;
  }
  function goalFor(agent) {
    if (agent.role === "firefighter" && fires.length) {
      const fire = fires[agent.beat % fires.length];
      return { x: fire.x, z: fire.z };
    }
    return nearbyGoal(agent.x, agent.z);
  }

  const agents = [];
  function addAgents(role, count) {
    const room = peopleCount - agents.length;
    if (room <= 0 || !streets.length) return;
    count = Math.min(count, room);
    for (let i = 0; i < count; i++) {
      let x = points[streets[0]].x;
      let z = points[streets[0]].z;
      let y = points[streets[0]].y || 0;
      let venue = null;
      let ox = 0;
      let oz = 0;
      let ang = 0;
      const gatherKind = GATHERED[role];
      if (gatherKind) venue = takeVenue(gatherKind);
      if (venue) {
        const slot = venue.slots;
        ang = slot * 2.399;
        let rad = 2.6 + (slot % 8) * 0.5;
        if (role === "singer") rad = 0.3 + (slot % 4) * 0.26;
        else if (role === "player") rad = 0.7 + (slot % 6) * 0.35;
        else if (role === "dancer") rad = 1.7 + (slot % 5) * 0.32;
        ox = Math.cos(ang) * rad;
        oz = Math.sin(ang) * rad;
        x = venue.x + ox;
        z = venue.z + oz;
        y = venue.y;
      }
      const doorish = role === "vendor" || role === "courier" || role === "worker" || role === "customer";
      const alleyish = role === "criminal";
      if (doorish && doorNodes.length) {
        const door = points[doorNodes[i % doorNodes.length]];
        x = door.x;
        z = door.z;
        y = door.y || 0;
      } else if ((role === "jogger" || role === "gardener") && loops.length) {
        const loop = loops[i % loops.length];
        x = loop[0].x;
        z = loop[0].z;
        y = loop[0].y || elev(x, z);
      } else if (!venue && alleyish && alleyNodes.length) {
        const alley = points[alleyNodes[i % alleyNodes.length]];
        x = alley.x;
        z = alley.z;
        y = alley.y || 0;
      } else if (!venue) {
        const node = streets[irand(streets.length)];
        x = points[node].x;
        z = points[node].z;
        y = points[node].y || 0;
      }
      const agent = {
        role: role,
        x: x,
        y: y,
        z: z,
        path: [{ x: x, y: y, z: z }],
        cursor: 0,
        wait: 0,
        speed: ROLE_SPEED[role],
        heading: 0,
        hidden: false,
        riding: -1,
        stopsLeft: 0,
        cool: rand(),
        beat: i,
        loop: (role === "jogger" || role === "gardener") && loops.length > 0,
        fleeing: false,
        duty: dutyFor(role),
        target: null,
        gathered: !!venue,
        venue: venue,
        ox: ox,
        oz: oz,
        span: role === "player" ? 2.6 : 1.2,
        face: ang,
        phase: ang,
        color: personColor(role),
        script: SCRIPTS[role] || null,
        step: 0,
        act: dutyFor(role),
      };
      if (venue) agent.loop = false;
      if (agent.loop) {
        agent.path = loops[i % loops.length];
        agent.cursor = 1 % agent.path.length;
      } else if (agent.script && role !== "vendor") {
        beginPhase(agent);
      } else if (role !== "vendor") {
        const goal = goalFor(agent);
        if (goal) send(agent, goal.x, goal.z);
      }
      agents.push(agent);
    }
  }
  const roster = [
    ["police", 0.055],
    ["firefighter", 0.028],
    ["criminal", 0.04],
    ["vendor", 0.018],
    ["jogger", 0.07],
    ["customer", 0.07],
    ["tourist", 0.045],
    ["worker", 0.04],
    ["courier", 0.032],
    ["gardener", 0.028],
    ["singer", 0.024],
    ["dancer", 0.04],
    ["listener", 0.05],
    ["player", 0.034],
    ["spectator", 0.06],
    ["picnicker", 0.04],
    ["painter", 0.018],
    ["rally", 0.04],
    ["skater", 0.03],
    ["photographer", 0.018],
    ["sweeper", 0.02],
    ["guide", 0.018],
    ["student", 0.05],
  ];
  let seated = 0;
  for (let r = 0; r < roster.length; r++) {
    const room = peopleCount - seated;
    if (room <= 0) break;
    const n = Math.min(room, Math.max(16, Math.floor(peopleCount * roster[r][1])));
    addAgents(roster[r][0], n);
    seated += n;
  }
  if (seated < peopleCount) addAgents("commuter", peopleCount - seated);
  if (bodyMesh && headMesh) {
    for (let i = 0; i < agents.length && i < peopleCount; i++) {
      bodyMesh.setColorAt(i, tint.set(agents[i].color));
      headMesh.setColorAt(i, tint.set("#e0b090"));
      if (policeCap) policeCap.setColorAt(i, tint.set("#1d3f86"));
      if (fireHelmet) fireHelmet.setColorAt(i, tint.set("#f2c14e"));
      if (hoodMesh) hoodMesh.setColorAt(i, tint.set("#241016"));
      if (satchelMesh) satchelMesh.setColorAt(i, tint.set("#c4a574"));
      if (brimMesh) brimMesh.setColorAt(i, tint.set("#f4efe4"));
      if (propMesh) propMesh.setColorAt(i, tint.set(agents[i].role === "player" ? "#f4f6f8" : "#2c3338"));
    }
    bodyMesh.instanceColor.needsUpdate = true;
    headMesh.instanceColor.needsUpdate = true;
    bodyMesh.count = agents.length;
    headMesh.count = agents.length;
    if (policeCap) {
      policeCap.instanceColor.needsUpdate = true;
      policeCap.count = agents.length;
    }
    if (fireHelmet) {
      fireHelmet.instanceColor.needsUpdate = true;
      fireHelmet.count = agents.length;
    }
    if (hoodMesh) {
      hoodMesh.instanceColor.needsUpdate = true;
      hoodMesh.count = agents.length;
    }
    if (satchelMesh) {
      satchelMesh.instanceColor.needsUpdate = true;
      satchelMesh.count = agents.length;
    }
    if (brimMesh) {
      brimMesh.instanceColor.needsUpdate = true;
      brimMesh.count = agents.length;
    }
    if (propMesh) {
      propMesh.instanceColor.needsUpdate = true;
      propMesh.count = agents.length;
    }
  }

  let cops = [];
  let crooks = [];
  let crew = [];
  let marks = [];
  let fleeing = [];
  function rebuildRoles() {
    cops = [];
    crooks = [];
    crew = [];
    marks = [];
    fleeing = [];
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      if (other.hidden) continue;
      if (other.role === "police") cops.push(other);
      else if (other.role === "criminal") {
        crooks.push(other);
        if (other.fleeing || other.duty === "flee") fleeing.push(other);
      } else if (other.role === "firefighter") crew.push(other);
      else if (other.role === "customer" || other.role === "tourist") marks.push(other);
    }
  }
  function nearestList(x, z, list, limit) {
    let best = null;
    let bestD = limit * limit;
    for (let i = 0; i < list.length; i++) {
      const other = list[i];
      const dx = other.x - x;
      const dz = other.z - z;
      const d = dx * dx + dz * dz;
      if (d < bestD) {
        bestD = d;
        best = other;
      }
    }
    return best;
  }
  function nearestRole(agent, role, limit) {
    const list = role === "police" ? cops : role === "firefighter" ? crew : crooks;
    return nearestList(agent.x, agent.z, list, limit);
  }
  function arrive(agent) {
    if (agent.role === "criminal" && agent.duty === "caught") {
      agent.duty = "lurk";
      agent.act = "hide";
      agent.fleeing = false;
      agent.speed = ROLE_SPEED.criminal;
      agent.wait = 0.3;
      return;
    }
    const act = agent.act;
    if (act === "shift" || act === "talk" || act === "class") agent.wait = 5.5;
    else if (act === "hide" || act === "frame" || act === "photo" || act === "queue") agent.wait = 3.1;
    else if (act === "trick" || act === "bin" || act === "stretch" || act === "rest") agent.wait = 1.5;
    else if (act === "ride") agent.wait = 8;
    else if (act === "drop" || act === "browse") agent.wait = 0.8;
    else if (agent.role === "customer") agent.wait = 1.1;
    else if (agent.role === "courier") agent.wait = 0.35;
    else if (agent.role === "firefighter") agent.wait = 0.8;
    else if (agent.duty === "post") agent.wait = 2.4;
    else agent.wait = 0.45;
  }
  function catchCrook(cop, crook) {
    crook.duty = "caught";
    crook.fleeing = false;
    crook.speed = 0;
    crook.wait = 4.4;
    crook.target = null;
    cop.wait = 1.5;
    cop.speed = ROLE_SPEED.police;
    cop.target = null;
    cop.cool = 1.2;
  }
  function pickCrook(hunter) {
    let best = null;
    let bestD = Infinity;
    for (let i = 0; i < crooks.length; i++) {
      const crook = crooks[i];
      if (crook.hidden || crook.duty === "caught") continue;
      const dx = crook.x - hunter.x;
      const dz = crook.z - hunter.z;
      let d = dx * dx + dz * dz;
      if (crook.fleeing || crook.duty === "snatch") d *= 0.35;
      if (d < bestD) {
        bestD = d;
        best = crook;
      }
    }
    return best;
  }
  function stepCriminal(agent, dt) {
    if (agent.duty === "caught") {
      agent.speed = 0;
      agent.fleeing = false;
      if (agent.wait <= 0) {
        agent.duty = "lurk";
        agent.speed = ROLE_SPEED.criminal;
        agent.wait = 0.25;
        const pool = alleyNodes.length ? alleyNodes : streets;
        const spot = points[pool[irand(pool.length)]];
        if (spot) send(agent, spot.x, spot.z);
      }
      return;
    }
    agent.scan = (agent.scan || 0) - dt;
    let cop = agent.threat || null;
    if (agent.scan <= 0) {
      cop = nearestRole(agent, "police", agent.duty === "flee" ? 52 : 16);
      agent.threat = cop;
      agent.scan = 0.5;
    }
    if (cop) {
      agent.duty = "flee";
      agent.fleeing = true;
      agent.speed = 9.4;
      if (agent.cool <= 0) {
        agent.cool = 0.5;
        agent.wait = 0;
        retarget(agent);
      }
      return;
    }
    agent.fleeing = false;
    if (agent.act === "flee" || agent.duty === "flee") {
      agent.act = "hide";
      agent.speed = ROLE_SPEED.criminal;
      agent.wait = 2.6;
    }
  }
  function stepPolice(agent, dt) {
    if (agent.duty === "hunt") {
      let crook = agent.target;
      if (!crook || crook.hidden || crook.role !== "criminal" || crook.duty === "caught") crook = pickCrook(agent);
      agent.target = crook;
      if (crook && agent.cool <= 0) {
        agent.speed = 8.8;
        agent.wait = 0;
        agent.cool = 0.4;
        send(agent, crook.x, crook.z);
      }
      if (crook && !crook.hidden) {
        const dx = crook.x - agent.x;
        const dz = crook.z - agent.z;
        if (dx * dx + dz * dz < 2.4) catchCrook(agent, crook);
      }
      return;
    }
    const reach = agent.duty === "post" ? 18 : 28;
    agent.scan = (agent.scan || 0) - dt;
    let crook = agent.threat || null;
    if (agent.scan <= 0) {
      crook = nearestRole(agent, "criminal", reach);
      agent.threat = crook;
      agent.scan = 0.55;
    }
    if (crook && crook.duty !== "caught" && agent.cool <= 0) {
      agent.speed = 8.2;
      agent.wait = 0;
      agent.cool = 0.55;
      send(agent, crook.x, crook.z);
      const dx = crook.x - agent.x;
      const dz = crook.z - agent.z;
      if (dx * dx + dz * dz < 2.4) catchCrook(agent, crook);
    } else if (!crook) agent.speed = ROLE_SPEED.police;
  }
  function stepErrand(agent) {
    if (agent.cool > 0 || !doorNodes.length) return;
    const door = points[doorNodes[irand(doorNodes.length)]];
    agent.cool = agent.duty === "deliver" ? 1.05 : agent.duty === "shop" ? 2.6 : 2.1;
    agent.wait = 0;
    send(agent, door.x, door.z);
  }
  function showAct(role, now) {
    const list = SHOW[role];
    if (!list) return "watch";
    const period = role === "player" || role === "dancer" ? 5.5 : 7.5;
    return list[Math.floor(now / 1000 / period) % list.length];
  }
  function beginPhase(agent) {
    const script = agent.script;
    if (!script || !script.length) return;
    const phase = script[agent.step % script.length];
    agent.step += 1;
    agent.act = phase;
    agent.speed = ROLE_SPEED[agent.role] || 4;
    if (phase === "cruise" || phase === "flee") agent.speed = 9.2;
    if (phase === "sweep" || phase === "case" || phase === "stalk") agent.speed = 3.1;
    if (phase === "shift" || phase === "talk" || phase === "queue" || phase === "hide" || phase === "frame" || phase === "photo" || phase === "trick" || phase === "bin" || phase === "ride") {
      agent.wait = phase === "shift" || phase === "talk" ? 5.2 : phase === "ride" ? 7 : phase === "hide" ? 3.2 : 1.8;
      return;
    }
    let spot = null;
    if (phase === "pickup" || phase === "browse" || phase === "commute" || phase === "library" || phase === "stage" || phase === "drop") {
      if (doorNodes.length) spot = points[doorNodes[(agent.beat + agent.step) % doorNodes.length]];
    } else if (phase === "case" || phase === "flee") {
      const pool = alleyNodes.length ? alleyNodes : streets;
      spot = points[pool[irand(pool.length)]];
    } else if (phase === "stalk" || phase === "snatch") {
      const mark = marks.length ? marks[agent.beat % marks.length] : null;
      if (mark) spot = mark;
    } else if (phase === "seek" && venues.concert.length) {
      spot = venues.concert[agent.beat % venues.concert.length];
    } else if (phase === "lunch" || phase === "look" || phase === "walk" || phase === "class" || phase === "break") {
      if (plazaSpots.length) spot = plazaSpots[agent.beat % plazaSpots.length];
      else if (parks.length) {
        const park = parks[agent.beat % parks.length];
        spot = { x: park.cx, z: park.cz };
      }
    } else if (phase === "rush" && fires.length) {
      spot = fires[agent.beat % fires.length];
    } else {
      spot = nearbyGoal(agent.x, agent.z);
    }
    if (!spot) spot = nearbyGoal(agent.x, agent.z);
    if (spot) send(agent, spot.x, spot.z);
  }
  function stepGathered(agent, dt, now) {
    const venue = agent.venue;
    if (!venue) return;
    const act = showAct(agent.role, now);
    agent.act = act;
    const t = now / 1000;
    if (act === "play") {
      const swing = Math.sin(t * 1.7 + agent.phase);
      agent.x = venue.x + agent.ox + swing * agent.span;
      agent.z = venue.z + agent.oz + Math.cos(t * 0.8 + agent.phase) * 0.35;
      agent.heading = swing >= 0 ? agent.face : agent.face + Math.PI;
    } else if (act === "huddle") {
      agent.x = venue.x + agent.ox * 0.15;
      agent.z = venue.z + agent.oz * 0.15;
      agent.heading = Math.atan2(agent.oz, agent.ox);
    } else if (act === "bench") {
      agent.x = venue.x + agent.ox * 1.8;
      agent.z = venue.z + agent.oz * 1.8;
      agent.heading = Math.atan2(venue.z - agent.z, venue.x - agent.x);
    } else if (act === "dance" || act === "spin") {
      agent.phase += dt * (act === "spin" ? 2.8 : 1.35);
      const rad = act === "spin" ? 1.15 : 1.7 + (agent.beat % 5) * 0.28;
      agent.x = venue.x + Math.cos(agent.phase) * rad;
      agent.z = venue.z + Math.sin(agent.phase) * rad;
      agent.heading = agent.phase + Math.PI / 2;
    } else if (act === "pose" || act === "bow") {
      agent.x = venue.x + agent.ox;
      agent.z = venue.z + agent.oz;
      agent.heading = Math.atan2(venue.z - agent.z, venue.x - agent.x);
    } else if (act === "mingle") {
      agent.x = venue.x + agent.ox * 3.2;
      agent.z = venue.z + agent.oz * 3.2;
      agent.heading = Math.atan2(Math.sin(t + agent.phase), Math.cos(t * 0.7 + agent.phase));
    } else if (act === "stroll" || act === "march") {
      const spin = t * (act === "march" ? 0.45 : 0.25) + agent.phase;
      const rad = act === "march" ? 3.4 : 1.8;
      agent.x = venue.x + Math.cos(spin) * rad;
      agent.z = venue.z + Math.sin(spin) * rad;
      agent.heading = spin + Math.PI / 2;
    } else if (act === "stepback") {
      agent.x = venue.x + agent.ox * 1.65;
      agent.z = venue.z + agent.oz * 1.65;
      agent.heading = Math.atan2(venue.z - agent.z, venue.x - agent.x);
    } else if (act === "sway") {
      agent.x = venue.x + agent.ox;
      agent.z = venue.z + agent.oz;
      agent.heading = Math.atan2(venue.z - agent.z, venue.x - agent.x) + Math.sin(t * 2 + agent.phase) * 0.6;
    } else {
      agent.x = venue.x + agent.ox;
      agent.z = venue.z + agent.oz;
      agent.heading = Math.atan2(venue.z - agent.z, venue.x - agent.x);
    }
    agent.y = elev(agent.x, agent.z);
  }
  function stepSightsee(agent) {
    if (agent.cool > 0) return;
    agent.cool = 2.5;
    if (plazaSpots.length && chance(0.55)) {
      const spot = plazaSpots[irand(plazaSpots.length)];
      send(agent, spot.x, spot.z);
      return;
    }
    const goal = nearbyGoal(agent.x, agent.z);
    if (goal) send(agent, goal.x, goal.z);
  }
  function retarget(agent) {
    if (agent.duty === "caught" || agent.gathered) return;
    if (agent.role === "criminal" && agent.fleeing) {
      const cop = nearestRole(agent, "police", 40);
      let best = null;
      let bestD = -1;
      const pool = alleyNodes.length ? alleyNodes : streets;
      for (let nTry = 0; nTry < 10; nTry++) {
        const spot = points[pool[irand(pool.length)]];
        const dx = cop ? spot.x - cop.x : rand();
        const dz = cop ? spot.z - cop.z : rand();
        const d = dx * dx + dz * dz;
        if (d > bestD) {
          bestD = d;
          best = spot;
        }
      }
      if (best) send(agent, best.x, best.z);
      return;
    }
    if (agent.script) {
      beginPhase(agent);
      return;
    }
    const goal = goalFor(agent);
    if (goal) send(agent, goal.x, goal.z);
  }
  function advance(agent, dt) {
    const path = agent.path;
    if (!path || !path.length) return;
    const target = path[Math.min(agent.cursor, path.length - 1)];
    const dx = target.x - agent.x;
    const dz = target.z - agent.z;
    const dy = (target.y || 0) - (agent.y || 0);
    const dist = Math.hypot(dx, dz);
    if (dist < 0.4) {
      agent.x = target.x;
      agent.y = target.y || 0;
      agent.z = target.z;
      agent.cursor += 1;
      if (agent.cursor >= path.length) {
        if (agent.loop) agent.cursor = 0;
        else arrive(agent);
      }
      return;
    }
    const step = Math.min(dist, agent.speed * dt);
    const nx = agent.x + (dx / dist) * step;
    const nz = agent.z + (dz / dist) * step;
    const ok = agent.role === "jogger" ? PARK : agent.role === "tourist" ? ANY : STREET;
    if (!allows(nx, nz, ok)) {
      if (!agent.loop) arrive(agent);
      return;
    }
    agent.heading = Math.atan2(-dz, dx);
    agent.x = nx;
    agent.y = (agent.y || 0) + (dy / dist) * step;
    agent.z = nz;
  }

  function writePose(mesh, index, x, y, z, heading, hidden, ox, oz) {
    if (!mesh) return;
    const c = Math.cos(heading);
    const s = Math.sin(heading);
    dummy.rotation.order = "XYZ";
    dummy.position.set(x + c * ox + s * oz, y, z - s * ox + c * oz);
    dummy.rotation.set(0, heading, 0);
    const scale = hidden ? 0.001 : 1;
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  }
  function writeBank(mesh, index, x, y, z, heading, bank, ox, oy, oz) {
    if (!mesh) return;
    const c = Math.cos(heading);
    const s = Math.sin(heading);
    dummy.rotation.order = "YXZ";
    dummy.position.set(x + c * ox + s * oz, y + oy, z - s * ox + c * oz);
    dummy.rotation.set(0, heading, bank);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  }
  function writeSpin(mesh, index, x, y, z, spin) {
    if (!mesh) return;
    dummy.rotation.order = "XYZ";
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, spin, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  }
  function writeBeam(mesh, index, x, y, z, show) {
    if (!mesh) return;
    dummy.rotation.order = "XYZ";
    dummy.position.set(x, y, z);
    dummy.rotation.set(Math.PI, 0, 0);
    const scale = show ? 1 : 0.001;
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  }
  function writeFlame(mesh, index, x, y, z, sx, sy, spin) {
    if (!mesh) return;
    dummy.rotation.order = "XYZ";
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, spin, 0);
    dummy.scale.set(sx, sy, sx);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  }

  root.add(new HemisphereLight("#d7ecff", "#8a7a62", 0.85));
  const sun = new DirectionalLight("#fff2d8", 1.25);
  sun.position.set(size * 0.15, size * 0.7, size * 0.05);
  root.add(sun);
  stage.scene.add(root);
  stage.scene.background = new Color("#9ec8e6");
  stage.scene.fog = new Fog("#c5dff0", size * 0.45, size * 2.5);
  stage.camera.fov = 48;
  stage.camera.near = 0.2;
  stage.camera.far = size * 6;
  const lookX = size * 0.48;
  const lookZ = size * 0.46;
  const camX = lookX - size * 0.2;
  const camZ = lookZ + size * 0.28;
  let peak = 8;
  for (let gy = 0; gy < 8; gy++) {
    for (let gx = 0; gx < 8; gx++) peak = Math.max(peak, elev((gx / 7) * size, (gy / 7) * size));
  }
  stage.camera.position.set(camX, peak + size * 0.09, camZ);
  stage.controls.target.set(lookX, peak * 0.22, lookZ);
  stage.controls.enableZoom = true;
  stage.controls.zoomSpeed = 1.35;
  stage.controls.zoomToCursor = true;
  stage.controls.enablePan = true;
  stage.controls.minDistance = 1.4;
  stage.controls.maxDistance = size * 2.8;
  stage.controls.maxPolarAngle = Math.PI * 0.495;
  stage.camera.updateProjectionMatrix();

  const clouds = [];
  const puffGeo = new SphereGeometry(1, 8, 6);
  const puffMat = new MeshStandardMaterial({ color: "#f7f9fc", roughness: 1, transparent: true, opacity: 0.16, depthWrite: false, fog: false });
  for (let i = 0; i < 16; i++) {
    const bank = new Group();
    const puffs = 2 + irand(2);
    const scale = 10 + rand() * 18;
    for (let puff = 0; puff < puffs; puff++) {
      const mesh = new Mesh(puffGeo, puffMat);
      mesh.scale.set(scale * (0.7 + rand() * 0.8), scale * (0.28 + rand() * 0.18), scale * (0.55 + rand() * 0.6));
      mesh.position.set((rand() - 0.5) * scale * 1.5, (rand() - 0.5) * scale * 0.2, (rand() - 0.5) * scale * 1.1);
      bank.add(mesh);
    }
    const x = rand() * size;
    const z = rand() * size;
    const y = peak + size * (0.055 + rand() * 0.04);
    bank.position.set(x, y, z);
    root.add(bank);
    clouds.push({ mesh: bank, x: x, z: z, y: y, speed: 6 + rand() * 10, sway: rand() * Math.PI * 2 });
  }

  const flyKeys = { w: false, a: false, s: false, d: false, q: false, e: false, shift: false };
  const flyVel = { x: 0, y: 0, z: 0 };
  const flyFrom = { x: 0, y: 0, z: 0 };
  let flySig = "";
  let flyT = 1;
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) * (-2 * t + 2)) / 2;
  }
  function onFlyKey(event) {
    const el = event.target;
    const tag = el && el.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (el && el.isContentEditable)) return;
    const name = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    let bit = null;
    if (name === "w" || name === "a" || name === "s" || name === "d" || name === "q" || name === "e") bit = name;
    else if (name === "Shift") bit = "shift";
    if (!bit) return;
    flyKeys[bit] = event.type === "keydown";
    if (bit !== "shift") event.preventDefault();
  }
  window.addEventListener("keydown", onFlyKey);
  window.addEventListener("keyup", onFlyKey);
  function flyCamera(dt) {
    const forward = (flyKeys.w ? 1 : 0) - (flyKeys.s ? 1 : 0);
    const strafe = (flyKeys.d ? 1 : 0) - (flyKeys.a ? 1 : 0);
    const lift = (flyKeys.e ? 1 : 0) - (flyKeys.q ? 1 : 0);
    const cam = stage.camera;
    const target = stage.controls.target;
    let lx = target.x - cam.position.x;
    let ly = target.y - cam.position.y;
    let lz = target.z - cam.position.z;
    const llen = Math.hypot(lx, ly, lz) || 1;
    lx /= llen;
    ly /= llen;
    lz /= llen;
    let rx = -lz;
    let rz = lx;
    const rlen = Math.hypot(rx, rz) || 1;
    rx /= rlen;
    rz /= rlen;
    const mag = Math.hypot(forward, strafe, lift) || 1;
    const moving = forward !== 0 || strafe !== 0 || lift !== 0;
    const pace = Math.max(56, size * 0.2) * (flyKeys.shift ? 3.2 : 1);
    const wishX = moving ? ((lx * forward + rx * strafe) / mag) * pace : 0;
    const wishY = moving ? ((ly * forward + lift) / mag) * pace : 0;
    const wishZ = moving ? ((lz * forward + rz * strafe) / mag) * pace : 0;
    const sig = forward + "," + strafe + "," + lift + "," + (flyKeys.shift ? 1 : 0);
    if (sig !== flySig) {
      flyFrom.x = flyVel.x;
      flyFrom.y = flyVel.y;
      flyFrom.z = flyVel.z;
      flyT = 0;
      flySig = sig;
    }
    flyT = Math.min(1, flyT + dt / 0.45);
    const blend = easeInOut(flyT);
    flyVel.x = flyFrom.x + (wishX - flyFrom.x) * blend;
    flyVel.y = flyFrom.y + (wishY - flyFrom.y) * blend;
    flyVel.z = flyFrom.z + (wishZ - flyFrom.z) * blend;
    if (flyVel.x * flyVel.x + flyVel.y * flyVel.y + flyVel.z * flyVel.z < 0.04) return;
    const mx = flyVel.x * dt;
    const my = flyVel.y * dt;
    const mz = flyVel.z * dt;
    cam.position.x += mx;
    cam.position.y += my;
    cam.position.z += mz;
    target.x += mx;
    target.y += my;
    target.z += mz;
    const floorY = elev(cam.position.x, cam.position.z) + 1.8;
    if (cam.position.y < floorY) {
      const rise = floorY - cam.position.y;
      cam.position.y += rise;
      target.y += rise;
    }
    const ceiling = size * 0.9;
    if (cam.position.y > ceiling) {
      const drop = cam.position.y - ceiling;
      cam.position.y -= drop;
      target.y -= drop;
    }
  }

  const redMat = ambLightL ? ambLightL.material : null;
  const whiteMat = ambLightR ? ambLightR.material : null;
  let last = performance.now();

  return {
    tick: function () {
      const now = performance.now();
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      flyCamera(dt);
      if (fountain) fountain.position.y = (fountain.userData.baseY || 0.12) + Math.sin(now / 280) * 0.08;
      for (let i = 0; i < clouds.length; i++) {
        const cloud = clouds[i];
        cloud.x += cloud.speed * dt;
        if (cloud.x > size + 90) cloud.x = -90;
        cloud.mesh.position.x = cloud.x;
        cloud.mesh.position.y = cloud.y + Math.sin(now / 1600 + cloud.sway) * 1.4;
      }
      const flash = Math.floor(now / 110) % 2 === 0;
      if (redMat) redMat.emissiveIntensity = flash ? 3.2 : 0.15;
      if (whiteMat) whiteMat.emissiveIntensity = flash ? 0.15 : 2.6;
      if (policeLamp) policeLamp.material.emissiveIntensity = flash ? 2.8 : 0.2;
      if (truckLamp) truckLamp.material.emissiveIntensity = flash ? 0.25 : 2.4;
      if (heliLamp) heliLamp.material.emissiveIntensity = flash ? 2.6 : 0.35;
      rebuildRoles();
      let spotlight = null;
      for (let i = 0; i < crooks.length; i++) {
        if (crooks[i].fleeing) {
          spotlight = crooks[i];
          break;
        }
      }
      for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        stepCar(car, dt);
        const pose = poseOn(edges[car.e], car.dir, car.s, car.lane);
        writePose(carMesh, i, pose.x, pose.y + 0.42, pose.z, pose.heading, false, 0, 0);
        writePose(cabinMesh, i, pose.x, pose.y + 0.86, pose.z, pose.heading, false, -0.08, 0);
      }
      for (let i = 0; i < buses.length; i++) {
        const bus = buses[i];
        stepBus(bus, dt);
        writePose(busMesh, i, bus.x, (bus.y || 0) + 1.05, bus.z, bus.heading, false, 0, 0);
        writePose(busGlass, i, bus.x, (bus.y || 0) + 1.35, bus.z, bus.heading, false, 0.2, 0);
      }
      for (let i = 0; i < ambulances.length; i++) {
        const amb = ambulances[i];
        stepAmbulance(amb, dt);
        writePose(ambMesh, i, amb.x, (amb.y || 0) + 0.85, amb.z, amb.heading, false, 0, 0);
        writePose(ambStripe, i, amb.x, (amb.y || 0) + 1.05, amb.z, amb.heading, false, 0, 0);
        writePose(ambLightL, i, amb.x, (amb.y || 0) + 1.62, amb.z, amb.heading, false, 0.15, -0.38);
        writePose(ambLightR, i, amb.x, (amb.y || 0) + 1.62, amb.z, amb.heading, false, 0.15, 0.38);
      }
      for (let i = 0; i < policeCars.length; i++) {
        const car = policeCars[i];
        const quarry = nearestList(car.x, car.z, fleeing.length ? fleeing : crooks, 340);
        stepService(car, dt, quarry);
        writePose(policeCarMesh, i, car.x, (car.y || 0) + 0.48, car.z, car.heading, false, 0, 0);
        writePose(policeCabin, i, car.x, (car.y || 0) + 0.92, car.z, car.heading, false, 0.15, 0);
        writePose(policeBar, i, car.x, (car.y || 0) + 1.22, car.z, car.heading, false, 0.05, 0);
        writePose(policeLamp, i, car.x, (car.y || 0) + 1.28, car.z, car.heading, false, 0.05, flash ? 0.22 : -0.22);
      }
      for (let i = 0; i < fireTrucks.length; i++) {
        const truck = fireTrucks[i];
        stepService(truck, dt, nearestFire(truck.x, truck.z));
        writePose(truckMesh, i, truck.x, (truck.y || 0) + 0.9, truck.z, truck.heading, false, -0.4, 0);
        writePose(truckCab, i, truck.x, (truck.y || 0) + 0.85, truck.z, truck.heading, false, 1.15, 0);
        writePose(truckLadder, i, truck.x, (truck.y || 0) + 1.7, truck.z, truck.heading, false, -0.55, 0);
        writePose(truckLamp, i, truck.x, (truck.y || 0) + 1.55, truck.z, truck.heading, false, 1.15, 0);
      }
      for (let i = 0; i < helis.length; i++) {
        const heli = helis[i];
        const chase = heli.kind === "police" ? spotlight : null;
        stepHeli(heli, dt, chase);
        writeBank(heliBody, i, heli.x, heli.y, heli.z, heli.heading, heli.bank, 0, 0, 0);
        writeBank(heliCabin, i, heli.x, heli.y, heli.z, heli.heading, heli.bank, 0.55, 0.12, 0);
        writeBank(heliTail, i, heli.x, heli.y, heli.z, heli.heading, heli.bank, -2.15, 0.08, 0);
        writeSpin(heliRotor, i, heli.x, heli.y + 0.62, heli.z, heli.rotor);
        writeSpin(heliRotorB, i, heli.x, heli.y + 0.66, heli.z, heli.rotor);
        const hc = Math.cos(heli.heading);
        const hs = Math.sin(heli.heading);
        writeSpin(heliTailRotor, i, heli.x - hc * 3.15, heli.y + 0.16, heli.z + hs * 3.15, heli.rotor * 2.4);
        writeBank(heliLamp, i, heli.x, heli.y, heli.z, heli.heading, heli.bank, 1.5, -0.2, 0);
        writeBeam(heliBeam, i, heli.x, heli.y - 1, heli.z, heli.kind === "police");
      }
      for (let i = 0; i < fires.length; i++) {
        const fire = fires[i];
        let hands = 0;
        for (let c = 0; c < crew.length; c++) {
          const dx = crew[c].x - fire.x;
          const dz = crew[c].z - fire.z;
          if (dx * dx + dz * dz < 64) hands += 1;
        }
        if (hands >= 2) fire.heat -= dt * (0.06 + hands * 0.018);
        else fire.heat += dt * 0.012;
        if (fire.heat > 1) fire.heat = 1;
        if (fire.heat <= 0.05) {
          const next = plantFire();
          fire.x = next.x;
          fire.y = next.y;
          fire.z = next.z;
          fire.heat = next.heat;
        }
        const flicker = 0.75 + Math.sin(now / 90 + i) * 0.2;
        const sy = Math.max(0.15, fire.heat * flicker);
        const gy = fire.y || 0;
        writeFlame(flameMesh, i, fire.x, gy + 0.2 + sy * 0.9, fire.z, 0.45 + fire.heat * 0.7, sy, now / 400 + i);
        writeFlame(coreMesh, i, fire.x, gy + 0.15 + sy * 0.7, fire.z, 0.35 + fire.heat * 0.3, sy * 0.85, now / 260);
        writeFlame(scorchMesh, i, fire.x, gy + 0.05, fire.z, 0.7 + fire.heat, 1, 0);
      }
      for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        if (agent.gathered) {
          stepGathered(agent, dt, now);
        } else if (agent.riding >= 0) {
          const bus = buses[agent.riding];
          agent.x = bus.x;
          agent.y = bus.y || 0;
          agent.z = bus.z;
          agent.hidden = true;
          if (bus && bus.arrived) {
            agent.stopsLeft -= 1;
            if (agent.stopsLeft <= 0) {
              const offsets = [
                [0, -3.2],
                [0, 3.2],
                [1.6, -3.2],
                [-1.6, 3.2],
              ];
              const c = Math.cos(bus.heading);
              const s = Math.sin(bus.heading);
              let placed = false;
              for (let o = 0; o < offsets.length; o++) {
                const nx = bus.x + c * offsets[o][0] + s * offsets[o][1];
                const nz = bus.z - s * offsets[o][0] + c * offsets[o][1];
                if (!allows(nx, nz, STREET)) continue;
                agent.x = nx;
                agent.y = bus.y || 0;
                agent.z = nz;
                placed = true;
                break;
              }
              if (placed) {
                agent.hidden = false;
                agent.riding = -1;
                agent.wait = 0.2;
              } else agent.stopsLeft = 1;
            }
          }
        } else if (agent.role !== "vendor" && !agent.loop) {
          agent.cool -= dt;
          if (agent.role === "criminal") stepCriminal(agent, dt);
          else if (agent.role === "police") stepPolice(agent, dt);
          else if (agent.role === "firefighter" && fires.length && agent.cool <= 0) {
            const fire = fires[agent.beat % fires.length];
            const dx = fire.x - agent.x;
            const dz = fire.z - agent.z;
            if (dx * dx + dz * dz > 12) {
              agent.speed = ROLE_SPEED.firefighter;
              agent.wait = 0;
              send(agent, fire.x, fire.z);
            }
            agent.cool = 2.2;
          } else if (agent.role === "commuter" && agent.wait > 0 && agent.riding < 0) {
            for (let b = 0; b < buses.length; b++) {
              const bus = buses[b];
              if (bus.wait <= 0) continue;
              const dx = bus.x - agent.x;
              const dz = bus.z - agent.z;
              if (dx * dx + dz * dz > 48) continue;
              agent.riding = b;
              agent.hidden = true;
              agent.stopsLeft = 2 + (i % 3);
              agent.wait = 0;
              break;
            }
          }
          if (agent.riding < 0) {
            if (agent.wait > 0) {
              agent.wait -= dt;
              if (agent.wait <= 0) retarget(agent);
            } else advance(agent, dt);
          }
        } else if (agent.loop) {
          if (agent.role === "jogger") {
            const tempo = Math.floor(now / 7000 + agent.beat) % 3;
            agent.speed = tempo === 1 ? 9.2 : tempo === 2 ? 4.1 : 6.4;
            agent.act = tempo === 1 ? "sprint" : tempo === 2 ? "recover" : "jog";
          } else if (agent.role === "gardener") {
            const tempo = Math.floor(now / 9000 + agent.beat) % 2;
            agent.speed = tempo ? 1.5 : 3;
            agent.act = tempo ? "rest" : "tend";
          }
          advance(agent, dt);
        }
        const performing = agent.act === "dance" || agent.act === "spin" || agent.act === "play" || agent.act === "sing" || agent.act === "clap" || agent.act === "cheer" || agent.act === "chant" || agent.act === "sprint";
        const working = agent.role === "vendor" || agent.act === "caught" || agent.act === "paint" || agent.act === "picnic" || agent.act === "pose" || agent.act === "bow" || agent.act === "frame" || (agent.role === "firefighter" && agent.wait > 0);
        const rushing = agent.fleeing || agent.act === "cruise" || agent.act === "deliver" || agent.act === "jog" || agent.role === "skater";
        const bob = performing ? Math.abs(Math.sin(now / 120 + agent.phase)) * 0.16 : working ? Math.sin(now / 220 + i) * 0.05 : rushing ? Math.abs(Math.sin(now / 90 + i)) * 0.08 : 0;
        const py = agent.y || 0;
        writePose(bodyMesh, i, agent.x, py + 0.62 + bob, agent.z, agent.heading, agent.hidden, 0, 0);
        writePose(headMesh, i, agent.x, py + 1.22 + bob, agent.z, agent.heading, agent.hidden, 0, 0);
        writePose(policeCap, i, agent.x, py + 1.38 + bob, agent.z, agent.heading, agent.hidden || agent.role !== "police", 0.04, 0);
        writePose(fireHelmet, i, agent.x, py + 1.34 + bob, agent.z, agent.heading, agent.hidden || agent.role !== "firefighter", 0, 0);
        writePose(hoodMesh, i, agent.x, py + 1.3 + bob, agent.z, agent.heading, agent.hidden || agent.role !== "criminal", 0, 0);
        writePose(satchelMesh, i, agent.x, py + 0.72 + bob, agent.z, agent.heading, agent.hidden || (agent.role !== "courier" && agent.role !== "worker"), -0.02, 0.18);
        const brimmed = agent.role === "tourist" || agent.role === "painter" || agent.role === "picnicker" || agent.role === "spectator";
        writePose(brimMesh, i, agent.x, py + 1.36 + bob, agent.z, agent.heading, agent.hidden || !brimmed, 0.06, 0);
        const prop = agent.role === "player" ? Math.sin(now / 160 + i) * 0.4 : 0;
        writePose(propMesh, i, agent.x, py + (agent.role === "singer" ? 1.05 : 0.35) + bob, agent.z, agent.heading, agent.hidden || (agent.role !== "singer" && agent.role !== "player"), prop, 0.22);
      }
      if (bodyMesh) bodyMesh.instanceMatrix.needsUpdate = true;
      if (headMesh) headMesh.instanceMatrix.needsUpdate = true;
      if (carMesh) carMesh.instanceMatrix.needsUpdate = true;
      if (cabinMesh) cabinMesh.instanceMatrix.needsUpdate = true;
      if (busMesh) busMesh.instanceMatrix.needsUpdate = true;
      if (busGlass) busGlass.instanceMatrix.needsUpdate = true;
      if (ambMesh) ambMesh.instanceMatrix.needsUpdate = true;
      if (ambStripe) ambStripe.instanceMatrix.needsUpdate = true;
      if (ambLightL) ambLightL.instanceMatrix.needsUpdate = true;
      if (ambLightR) ambLightR.instanceMatrix.needsUpdate = true;
      if (policeCarMesh) policeCarMesh.instanceMatrix.needsUpdate = true;
      if (policeCabin) policeCabin.instanceMatrix.needsUpdate = true;
      if (policeBar) policeBar.instanceMatrix.needsUpdate = true;
      if (policeLamp) policeLamp.instanceMatrix.needsUpdate = true;
      if (truckMesh) truckMesh.instanceMatrix.needsUpdate = true;
      if (truckCab) truckCab.instanceMatrix.needsUpdate = true;
      if (truckLadder) truckLadder.instanceMatrix.needsUpdate = true;
      if (truckLamp) truckLamp.instanceMatrix.needsUpdate = true;
      if (heliBody) heliBody.instanceMatrix.needsUpdate = true;
      if (heliCabin) heliCabin.instanceMatrix.needsUpdate = true;
      if (heliTail) heliTail.instanceMatrix.needsUpdate = true;
      if (heliRotor) heliRotor.instanceMatrix.needsUpdate = true;
      if (heliRotorB) heliRotorB.instanceMatrix.needsUpdate = true;
      if (heliTailRotor) heliTailRotor.instanceMatrix.needsUpdate = true;
      if (heliLamp) heliLamp.instanceMatrix.needsUpdate = true;
      if (heliBeam) heliBeam.instanceMatrix.needsUpdate = true;
      if (flameMesh) flameMesh.instanceMatrix.needsUpdate = true;
      if (coreMesh) coreMesh.instanceMatrix.needsUpdate = true;
      if (scorchMesh) scorchMesh.instanceMatrix.needsUpdate = true;
      if (policeCap) policeCap.instanceMatrix.needsUpdate = true;
      if (fireHelmet) fireHelmet.instanceMatrix.needsUpdate = true;
      if (hoodMesh) hoodMesh.instanceMatrix.needsUpdate = true;
      if (satchelMesh) satchelMesh.instanceMatrix.needsUpdate = true;
      if (brimMesh) brimMesh.instanceMatrix.needsUpdate = true;
      if (propMesh) propMesh.instanceMatrix.needsUpdate = true;
    },
    dispose: function () {
      window.removeEventListener("keydown", onFlyKey);
      window.removeEventListener("keyup", onFlyKey);
      disposeTree(root);
      facadeMap.dispose();
      glassMap.dispose();
      stage.scene.fog = null;
    },
  };
}
