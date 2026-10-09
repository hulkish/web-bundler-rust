import { fromB } from "./b.ts";

export function fromA(n: number): string {
  return n > 0 ? fromB(n - 1) : "west";
}
