export enum Band {
  Blue = "blue",
  Red = "red",
}

export enum Rank {
  Plate = 1,
  Film,
}

export interface Spectrum {
  band: Band;
}

export function describe<T extends Spectrum>(row: T): string {
  const band = row.band satisfies Band;
  return band;
}

export function retiredRank(): string {
  return "RETIRED_RANK";
}
