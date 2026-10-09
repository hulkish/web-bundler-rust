import { calibrate, type Named } from "./instruments.ts";
import type { Plate } from "./types.ts";

export function exposureOf(plates: Plate[]): number {
  const named: Named = { label: "calibrator" };
  return calibrate(named.label.length, plates);
}
