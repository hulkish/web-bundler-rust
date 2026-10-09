import css from "./styles/page.css";
import { loadEditor } from "./editor/report.ts";

if (process.env.NODE_ENV === "development") {
  console.log("DESK_DEV_ONLY");
}

const report = loadEditor();

const lines = [
  "role=editor",
  `edition=${report.edition}`,
  `copies=${report.copies}`,
  `mode=${report.mode}`,
  `stamp=${report.stamp}`,
  `title=${report.title}`,
  `line=${report.line}`,
  `css=${css.endsWith(".css") ? "css" : css}`,
  `ink=${report.ink}`,
  `draft=${report.draft}`,
];

console.log(lines.join("\n"));
