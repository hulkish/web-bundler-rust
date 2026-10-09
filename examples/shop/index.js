// Checkout simulation.
// cart.js and pricing/quote.js import each other. Bulk discount turns on
// once the live itemCount export reaches 3. Catalog data is JSON.
import { findProduct, remaining } from "./catalog";
import { add, checkout, itemCount } from "./cart/index.js";
import { renderReceipt } from "./receipt";

const before = itemCount;
add(findProduct("notebook"), 2);
add(findProduct("pencil"), 1);
console.log("before " + before);
console.log(renderReceipt(checkout(), remaining));
console.log("live " + itemCount);
