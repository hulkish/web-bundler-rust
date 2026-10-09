import { allProducts } from "./products.js";

const stock = new Map(allProducts().map(function (product) {
  return [product.id, product.stock];
}));

export function remaining(id) {
  return stock.get(id);
}

export function take(id, qty) {
  const left = stock.get(id);
  if (left === undefined || left < qty) {
    throw new Error("out of stock: " + id);
  }
  stock.set(id, left - qty);
  return stock.get(id);
}
