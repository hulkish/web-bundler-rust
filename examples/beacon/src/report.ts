import { State, sumNights } from "./reexports.ts";
import { depthC } from "./chain/c.ts";
import { metaOk } from "./meta.ts";
import { steady } from "wick";
import here from "./paths/here.cjs";
import there from "./paths/nested/there.cjs";
import nights from "./data.json";
import css from "./styles/beacon.css";
import lampUrl from "./assets/lamp.svg";

declare const BEACON_ARMED: boolean;

export interface BeaconReport {
  armed: string;
  mode: string;
  state: number;
  nights: number;
  bonus: number;
  chain: number;
  wick: string;
  here: string;
  there: string;
  meta: string;
  lamp: string;
  css: string;
}

export async function loadBeacon(): Promise<BeaconReport> {
  const armed = BEACON_ARMED ? "yes" : "DEV_BEACON_DISARMED";
  const loaded = await import("./extra.json");
  const extra = loaded.default ?? loaded;
  return {
    armed,
    mode: String(process.env.NODE_ENV),
    state: State.Lit,
    nights: sumNights(nights.nights),
    bonus: extra.bonus,
    chain: depthC,
    wick: steady(),
    here: `${here.file}:${here.dir}`,
    there: `${there.file}:${there.dir}`,
    meta: metaOk(),
    lamp: lampUrl,
    css,
  };
}
