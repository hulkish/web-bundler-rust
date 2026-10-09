import { shelfStamp, titleOf } from "../shared/shelf.ts";
import { editionLine } from "../shared/format.ts";
import catalog from "../shared/catalog.json";
import { inkName } from "ink";
import { preface } from "./preface.ts";
import { marginNote } from "./margin.ts";

declare const DESK_EDITION: string;
declare const DESK_COPIES: number;

export interface ReaderReport {
  edition: string;
  copies: number;
  mode: string;
  stamp: string;
  title: string;
  line: string;
  ink: string;
  preface: string;
  margin: string;
  volume: string;
  pages: number;
}

export async function loadReader(): Promise<ReaderReport> {
  const text = await preface();
  return {
    edition: DESK_EDITION,
    copies: DESK_COPIES,
    mode: String(process.env.NODE_ENV),
    stamp: shelfStamp,
    title: titleOf(catalog.volume),
    line: editionLine(DESK_EDITION, DESK_COPIES),
    ink: inkName(),
    preface: text,
    margin: marginNote(catalog.pages),
    volume: catalog.volume,
    pages: catalog.pages,
  };
}
