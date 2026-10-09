import { composeStory } from "@storybook/react";
import * as actions from "./components/actions/index.js";
import * as charts from "./components/charts/index.js";
import * as choices from "./components/choices/index.js";
import * as content from "./components/content/index.js";
import * as data from "./components/data/index.js";
import * as feedback from "./components/feedback/index.js";
import * as inputs from "./components/inputs/index.js";
import * as layout from "./components/layout/index.js";
import * as navigation from "./components/navigation/index.js";
import * as overlays from "./components/overlays/index.js";
import * as three from "./components/three/index.js";

export const FAMILIES = [
  { id: "three", title: "Three" },
  { id: "data", title: "Data display" },
  { id: "navigation", title: "Navigation" },
  { id: "inputs", title: "Inputs" },
  { id: "choices", title: "Choices" },
  { id: "actions", title: "Actions" },
  { id: "overlays", title: "Overlays" },
  { id: "feedback", title: "Feedback" },
  { id: "layout", title: "Layout" },
  { id: "charts", title: "Charts" },
  { id: "content", title: "Content" },
];

export const STORIES = ["Resting", "Dense", "Empty", "Alert", "Disabled"];

export const ARG_TYPES = {
  label: { control: "text" },
  tone: { control: "select", options: ["ink", "gold", "sea", "clay"] },
  density: { control: "select", options: ["regular", "dense"] },
  rows: { control: "number", min: 0, max: 24 },
  disabled: { control: "boolean" },
  alert: { control: "boolean" },
  query: { control: "text" },
};

const NAMESPACES = {
  actions: actions,
  charts: charts,
  choices: choices,
  content: content,
  data: data,
  feedback: feedback,
  inputs: inputs,
  layout: layout,
  navigation: navigation,
  overlays: overlays,
  three: three,
};

function adopt(component) {
  const spec = component.spec;
  spec.component = component;
  spec.hay = (spec.id + " " + spec.label + " " + spec.blurb + " " + spec.fieldLabels.join(" ")).toLowerCase();
  return spec;
}

function familyList(namespace) {
  const names = Object.keys(namespace);
  const list = [];
  for (let i = 0; i < names.length; i++) {
    const component = namespace[names[i]];
    if (component && component.spec) list.push(adopt(component));
  }
  list.sort(function (a, b) {
    return a.index - b.index;
  });
  return list;
}

export const COMPONENTS = [];
const grouped = new Map();
for (let f = 0; f < FAMILIES.length; f++) {
  const family = FAMILIES[f];
  const list = familyList(NAMESPACES[family.id]);
  grouped.set(family.id, list);
  for (let i = 0; i < list.length; i++) COMPONENTS.push(list[i]);
}

export const byId = new Map();
for (let i = 0; i < COMPONENTS.length; i++) {
  byId.set(COMPONENTS[i].id, COMPONENTS[i]);
}

export const counts = {
  components: COMPONENTS.length,
  stories: COMPONENTS.length * STORIES.length,
  families: FAMILIES.length,
};

export function familyComponents(familyId) {
  return grouped.get(familyId) || [];
}

export function searchComponents(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  const hits = [];
  for (let i = 0; i < COMPONENTS.length; i++) {
    if (COMPONENTS[i].hay.indexOf(q) !== -1) {
      hits.push(COMPONENTS[i]);
      if (hits.length === 80) break;
    }
  }
  return hits;
}

export function storyArgs(spec, storyName) {
  const args = {
    label: spec.label,
    tone: spec.tone,
    density: "regular",
    rows: spec.rows,
    disabled: false,
    alert: false,
    query: "",
  };
  if (storyName === "Dense") {
    args.density = "dense";
    args.rows = Math.min(24, spec.rows + 6);
  } else if (storyName === "Empty") {
    args.rows = 0;
  } else if (storyName === "Alert") {
    args.alert = true;
  } else if (storyName === "Disabled") {
    args.disabled = true;
  }
  return args;
}

export function describe(spec) {
  return spec.blurb;
}

export function storySource(spec, storyName) {
  const args = storyArgs(spec, storyName);
  return [
    "export default {",
    "  title: " + JSON.stringify(spec.title) + ",",
    "  component: " + spec.displayName + ",",
    "};",
    "",
    "export const " + storyName + " = {",
    "  args: " + JSON.stringify(args, null, 2).replace(/\n/g, "\n  ") + ",",
    "};",
  ].join("\n");
}

const composed = new Map();

export function compose(spec, storyName) {
  const key = spec.id + "/" + storyName;
  const hit = composed.get(key);
  if (hit) return hit;
  const meta = {
    component: spec.component,
    args: storyArgs(spec, storyName),
    argTypes: ARG_TYPES,
    parameters: { layout: storyName === "Dense" ? "fullscreen" : "padded" },
  };
  const story = { name: storyName };
  const Composed = composeStory(story, meta);
  Composed.displayName = spec.displayName + storyName;
  composed.set(key, Composed);
  return Composed;
}

export function composedCount() {
  return composed.size;
}
