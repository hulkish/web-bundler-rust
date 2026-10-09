import { shelfStamp, titleOf } from "../shared/shelf.ts";
import { editionLine } from "../shared/format.ts";
import catalog from "../shared/catalog.json";
import { inkName } from "ink";
import { draftLine } from "./draft.ts";

declare const DESK_EDITION: string;
declare const DESK_COPIES: number;

export interface EditorReport {
  edition: string;
  copies: number;
  mode: string;
  stamp: string;
  title: string;
  line: string;
  ink: string;
  draft: string;
  volume: string;
}

export function loadEditor(): EditorReport {
  return {
    edition: DESK_EDITION,
    copies: DESK_COPIES,
    mode: String(process.env.NODE_ENV),
    stamp: shelfStamp,
    title: titleOf(catalog.volume),
    line: editionLine(DESK_EDITION, DESK_COPIES),
    ink: inkName(),
    draft: draftLine(catalog.volume),
    volume: catalog.volume,
  };
}
