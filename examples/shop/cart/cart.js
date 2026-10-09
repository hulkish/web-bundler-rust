import { take } from "../catalog/inventory.js";
import { summarize } from "../pricing/index.js";
import { Line } from "./line.js";

// Live export. Importers see updates without re-reading the cart.
export let itemCount = 0;

const lines = [];

export function getItemCount() {
  return itemCount;
}

export function add(product, qty) {
  take(product.id, qty);
  itemCount += qty;
  const line = new Line(product, qty);
  lines.push(line);
  return line;
}

export function checkout() {
  const summary = summarize(lines);
  return {
    lines: lines.slice(),
    region: summary.region,
    count: summary.count,
    subtotal: summary.subtotal,
    discount: summary.discount,
    taxCents: summary.taxCents,
    total: summary.total,
  };
}
