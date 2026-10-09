import { fromA } from "./a.ts";

export function fromB(n: number): string {
  return n > 0 ? fromA(n - 1) : "east";
}
