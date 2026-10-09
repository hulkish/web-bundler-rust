export class Line {
  constructor(product, qty) {
    this.id = product.id;
    this.name = product.name;
    this.cents = product.cents;
    this.qty = qty;
  }

  amount() {
    return this.cents * this.qty;
  }
}
