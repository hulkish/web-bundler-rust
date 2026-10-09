import type { Card, Mode, Plate } from "./types.ts";
import {
  Band,
  Instrument,
  Lens,
  Rank,
  Scope,
  describe,
  units,
} from "./barrel.ts";
import { exposureOf } from "./notes.ts";
import { focus } from "optics";
import catalog from "./catalog.json";
import mark from "./assets/mark.svg";
import plate from "./assets/plate.png";
import nightHref from "./styles/night.css";
import { loadPlateCount, log } from "./log/async-log.ts";
import { fromA } from "./cycle/a.ts";

declare const OBSERVATORY_BUILD: string;
declare const OBSERVATORY_SHIFT: number;

interface Spectrum {
  band: Band;
}

export interface Station {
  mode: Mode;
  site: string;
  build: string;
  shift: number;
  plates: Plate[];
  nights: number;
  band: Band;
  rank: number;
  exposure: number;
  seeing: string;
  cycle: string;
  mark: string;
  plate: string;
  css: string;
  focus: number;
  lens: number;
  family: string;
  arc: number;
  title: string;
  card: Card;
}

export async function loadStation(): Promise<Station> {
  const plates = catalog.plates as Plate[];
  const nights = await loadPlateCount();
  const scope = new Scope(catalog.site);
  const lens = new Lens(4);
  const band = describe<Spectrum>({ band: Band.Blue });
  const card: Card = {
    title: scope.read(),
    band,
    summary: `${log.seeing} ${Rank.Film}`,
    mark,
    nights,
  };
  return {
    mode: process.env.NODE_ENV as Mode,
    site: process.env.OBSERVATORY_SITE!,
    build: OBSERVATORY_BUILD,
    shift: OBSERVATORY_SHIFT,
    plates,
    nights,
    band,
    rank: Rank.Film,
    exposure: exposureOf(plates),
    seeing: log.seeing,
    cycle: fromA(3),
    mark,
    plate,
    css: nightHref,
    focus: focus(2),
    lens: lens.stop(),
    family: new Instrument().family(),
    arc: units.arcseconds(3),
    title: scope.read(),
    card,
  };
}

export function cardFor(station: Station, band: Band): Card {
  return {
    ...station.card,
    band: describe<Spectrum>({ band }),
    summary: `${station.seeing} ${station.rank}`,
  };
}
