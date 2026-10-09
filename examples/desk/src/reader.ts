import css from "./styles/page.css";
import { loadReader } from "./reader/report.ts";

const report = await loadReader();

const lines = [
  "role=reader",
  `edition=${report.edition}`,
  `copies=${report.copies}`,
  `mode=${report.mode}`,
  `stamp=${report.stamp}`,
  `title=${report.title}`,
  `line=${report.line}`,
  `css=${css.endsWith(".css") ? "css" : css}`,
  `ink=${report.ink}`,
  `preface=${report.preface}`,
  `margin=${report.margin}`,
];

console.log(lines.join("\n"));
