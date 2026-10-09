import "./economy.css";
import { asOf, board, summary } from "./data.js";
import { mountGrid } from "./grid.js";

const lines = [
  `asOf=${asOf}`,
  `unemployment=${summary.unemployment}`,
  `payrollChange=${summary.payrollChange}`,
  `realGdp=${summary.realGdp}`,
  `cpi=${summary.cpi}`,
  `fundsFloor=${summary.fundsFloor}`,
];
console.log(lines.join("\n"));

if (typeof document !== "undefined") {
  const root = document.getElementById("grid");
  if (root) {
    mountGrid(root, board);
  }
}
