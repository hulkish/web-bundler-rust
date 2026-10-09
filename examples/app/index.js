import { add, mul } from "./math.js";
import { greet } from "./greet.js";
import data from "./data.json";

const total = mul(add(2, 3), data.factor);
console.log(greet(data.name, total));
