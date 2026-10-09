import type { Mode } from "./types.ts";
import legacy from "./station/legacy.cjs";
import { loadStation } from "./station.ts";
import { renderCard } from "./view.tsx";
import "./styles/print.css";
import "optics/theme.css";

declare const OBSERVATORY_BUILD: string;
declare const OBSERVATORY_SHIFT: number;

const mode: Mode = process.env.NODE_ENV as Mode;
const site = process.env.OBSERVATORY_SITE!;

if (process.env.NODE_ENV === "development") {
  console.log("DEV_ONLY_OBSERVATORY");
}

const station = await loadStation();

const lines = [
  `mode=${mode}`,
  `build=${OBSERVATORY_BUILD}`,
  `site=${site}`,
  `shift=${OBSERVATORY_SHIFT}`,
  `band=${station.band}`,
  `rank=${station.rank}`,
  `exposure=${station.exposure}`,
  `nights=${station.nights}`,
  `seeing=${station.seeing}`,
  `cycle=${station.cycle}`,
  `legacy=${legacy.file}:${legacy.dir}:${legacy.note}`,
  `meta=${import.meta.filename.endsWith("index.ts") ? "file" : "bad"}:${import.meta.dirname.endsWith("src") ? "dir" : "bad"}:${import.meta.url.includes("index.ts") ? "url" : "bad"}`,
  `mark=${station.mark.endsWith(".svg") ? "svg" : station.mark}`,
  `plate=${station.plate.endsWith(".png") ? "png" : station.plate}`,
  `css=${station.css.endsWith(".css") ? "css" : station.css}`,
  `focus=${station.focus}`,
  `lens=${station.lens}`,
  `family=${station.family}`,
  `arc=${station.arc}`,
  `card=${renderCard(station.card)}`,
];

console.log(lines.join("\n"));
