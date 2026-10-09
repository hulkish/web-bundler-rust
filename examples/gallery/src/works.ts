import type { Work } from "./types.ts";

export const works: Work[] = [
  { id: "w1", title: "Harbor", room: "west", year: 1912 },
  { id: "w2", title: "Orchard", room: "east", year: 1904 },
  { id: "w3", title: "Night Glass", room: "west", year: 1920 },
];

export function droppedCaption(): string {
  return "GALLERY_DROPPED";
}
