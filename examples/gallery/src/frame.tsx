import { Fragment, h } from "./runtime/dom.ts";
import type { Work } from "./types.ts";

export function renderWall(
  works: Work[],
  seal: string,
  swatch: string,
  accent: string,
): string {
  const flag = { "data-room": "west" };
  const items = works.map((work) => (
    <li key={work.id} data-year={String(work.year)} {...flag}>
      {work.title}
    </li>
  ));
  return (
    <>
      <h1 style={accent}>{works.length}</h1>
      <ul>{items}</ul>
      <img src={seal} alt="seal" />
      <img src={swatch} alt="swatch" />
    </>
  );
}
