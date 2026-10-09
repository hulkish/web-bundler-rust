import { getItemCount } from "../cart/cart.js";
import * as money from "../money/index.js";
import tax from "../data/tax.json";

export const BULK_AT = 3;
export const BULK_BPS = 1000;

export function bulkApplies() {
  return getItemCount() >= BULK_AT;
}

export function quote(lines) {
  const subtotal = lines.reduce(function (sum, line) {
    return sum + line.amount();
  }, 0);
  const discount = bulkApplies() ? money.applyBps(subtotal, BULK_BPS) : 0;
  const taxable = subtotal - discount;
  const taxCents = money.applyBps(taxable, tax.bps);
  return {
    region: tax.region,
    count: getItemCount(),
    subtotal: subtotal,
    discount: discount,
    taxCents: taxCents,
    total: taxable + taxCents,
  };
}
