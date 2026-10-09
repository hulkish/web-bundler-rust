import { loadBeacon } from "./report.ts";

if (process.env.NODE_ENV !== "production") {
  console.log("DEV_BEACON_CONSOLE");
}

const report = await loadBeacon();

const lines = [
  `armed=${report.armed}`,
  `mode=${report.mode}`,
  `state=${report.state}`,
  `nights=${report.nights}`,
  `bonus=${report.bonus}`,
  `chain=${report.chain}`,
  `wick=${report.wick}`,
  `here=${report.here}`,
  `there=${report.there}`,
  `meta=${report.meta}`,
  `lamp=${report.lamp.endsWith(".svg") ? "svg" : report.lamp}`,
  `css=${report.css.endsWith(".css") ? "css" : report.css}`,
];

console.log(lines.join("\n"));
