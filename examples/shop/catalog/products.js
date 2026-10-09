import data from "../data/products.json";

export function allProducts() {
  return data.map(function (row) {
    return { id: row.id, name: row.name, cents: row.cents, stock: row.stock };
  });
}

export function findProduct(id) {
  const row = data.find(function (item) {
    return item.id === id;
  });
  if (!row) {
    throw new Error("unknown product " + id);
  }
  return { id: row.id, name: row.name, cents: row.cents, stock: row.stock };
}
