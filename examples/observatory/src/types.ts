export interface Plate {
  id: string;
  exposure: number;
}

export interface Card {
  title: string;
  band: string;
  summary: string;
  mark: string;
  nights: number;
}

export type Mode = "production" | "development";

export type SpectrumRow = {
  band: string;
  rank: number;
};
