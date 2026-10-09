import "./workshop.css";
import "./ui.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { counts } from "./catalog.js";
import { App } from "./shell.jsx";

const lines = [
  "components=" + counts.components,
  "stories=" + counts.stories,
  "families=" + counts.families,
  "renderer=storybook",
];
console.log(lines.join("\n"));

if (typeof document !== "undefined") {
  const root = document.getElementById("app");
  if (root) {
    createRoot(root).render(React.createElement(App));
  }
}
