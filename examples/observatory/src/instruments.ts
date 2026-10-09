import type { Plate } from "./types.ts";

export interface Named {
  label: string;
}

export abstract class Instrument {
  abstract tune(): string;

  family(): string {
    return "glass";
  }
}

export class Scope implements Named {
  readonly label: string;

  constructor(label: string) {
    this.label = label;
  }

  public read(): string {
    return this.label;
  }
}

export class Lens {
  constructor(public power: number) {}

  stop(): number {
    return this.power * 2;
  }
}

export function calibrate(raw: number, plates: Plate[]): number {
  const total = plates.reduce((sum, plate) => sum + plate.exposure, 0);
  return raw + total;
}

export function retiredProbe(raw: number): string {
  return `RETIRED_PROBE:${raw}`;
}

export class SpareLens {
  describe(): string {
    return "SPARE_LENS";
  }
}
