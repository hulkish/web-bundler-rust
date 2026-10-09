import { dollars } from "../money/format.js";

export function renderReceipt(order, stockOf) {
  const rows = order.lines.map(function (line) {
    return line.qty + " x " + line.name + " @ " + dollars(line.cents) + " = " + dollars(line.amount());
  });
  return [
    "Receipt (" + order.region + ")",
  ].concat(rows, [
    "subtotal " + dollars(order.subtotal),
    "discount " + dollars(order.discount),
    "tax " + dollars(order.taxCents),
    "total " + dollars(order.total),
    "items " + order.count,
    "notebook stock " + stockOf("notebook"),
    "pencil stock " + stockOf("pencil"),
  ]).join("\n");
}
