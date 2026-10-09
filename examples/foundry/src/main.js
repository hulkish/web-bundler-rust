import "./foundry.css";
import { REVISION } from "three";
import catalog from "./catalog.json";
import { glass } from "./scenes/glass.js";
import { loom } from "./scenes/loom.js";
import { orrery } from "./scenes/orrery.js";
import { yard } from "./scenes/yard.js";
import { createStage } from "./stage.js";

const builders = {
  orrery: orrery,
  yard: yard,
  glass: glass,
  loom: loom,
};

const lines = [
  "scenes=" + catalog.length,
  "revision=" + REVISION,
  "renderer=three",
];
console.log(lines.join("\n"));

function sceneId() {
  if (typeof location === "undefined") return catalog[0].id;
  const id = location.hash.replace(/^#/, "");
  for (let i = 0; i < catalog.length; i++) {
    if (catalog[i].id === id) return id;
  }
  return catalog[0].id;
}

function mount() {
  const root = document.getElementById("app");
  if (!root) return;
  root.innerHTML = "";
  const shell = document.createElement("div");
  shell.className = "foundry";
  const mast = document.createElement("header");
  mast.className = "mast";
  const titles = document.createElement("div");
  titles.innerHTML = "<p class=\"eyebrow\">Three " + REVISION + "</p><h1>Foundry</h1>";
  const buttons = document.createElement("div");
  buttons.className = "scenes";
  const blurb = document.createElement("p");
  blurb.className = "blurb";
  const stageHost = document.createElement("div");
  stageHost.className = "stage";
  const canvas = document.createElement("canvas");
  canvas.id = "view";
  stageHost.appendChild(canvas);
  const meta = document.createElement("p");
  meta.className = "meta";
  mast.appendChild(titles);
  mast.appendChild(buttons);
  shell.appendChild(mast);
  shell.appendChild(blurb);
  shell.appendChild(stageHost);
  shell.appendChild(meta);
  root.appendChild(shell);

  const stage = createStage(canvas);
  const buttonFor = {};
  for (let i = 0; i < catalog.length; i++) {
    const spec = catalog[i];
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = spec.title;
    button.addEventListener("click", function () { open(spec.id); });
    buttons.appendChild(button);
    buttonFor[spec.id] = button;
  }

  function open(id) {
    const spec = catalog.filter(function (item) { return item.id === id; })[0] || catalog[0];
    const names = Object.keys(buttonFor);
    for (let i = 0; i < names.length; i++) {
      buttonFor[names[i]].setAttribute("aria-pressed", names[i] === spec.id ? "true" : "false");
    }
    blurb.textContent = spec.blurb;
    document.title = spec.title + " · Foundry";
    if (typeof history !== "undefined") history.replaceState(null, "", "#" + spec.id);
    stage.show(builders[spec.id]);
    const info = stage.renderer.info.render;
    meta.textContent = "Three r" + REVISION + " · " + info.triangles + " triangles · " + info.calls + " draw calls";
  }

  window.addEventListener("resize", stage.resize);
  window.addEventListener("hashchange", function () { open(sceneId()); });
  stage.start();
  open(sceneId());
}

if (typeof document !== "undefined") mount();
