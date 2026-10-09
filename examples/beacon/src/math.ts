export enum State {
  Dark = 0,
  Lit,
}

export function sumNights(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function retiredMath(): string {
  return "RETIRED_MATH";
}
