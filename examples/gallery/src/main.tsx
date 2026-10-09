import { accent, frame } from "gallery-theme";
import type { Room, Work } from "./types.ts";
import { works } from "./works.ts";
import { when } from "./clock.ts";
import { renderWall } from "./frame.tsx";
import seal from "./assets/seal.svg";
import swatch from "./assets/swatch.png";
import css from "./styles/wall.css";

declare const GALLERY_ROOM: Room;

const mode = process.env.NODE_ENV;
const room: Room = GALLERY_ROOM;

if (process.env.NODE_ENV === "development") {
  console.log("GALLERY_DEV_ONLY");
}

const shown: Work[] = select(room);

const lines = [
  `mode=${mode}`,
  `room=${room}`,
  `when=${when}`,
  `accent=${accent}`,
  `css=${css.endsWith(".css") ? "css" : css}`,
  `seal=${seal.endsWith(".svg") ? "svg" : seal}`,
  `swatch=${swatch.endsWith(".png") ? "png" : swatch}`,
  `meta=${import.meta.filename.endsWith("main.tsx") ? "file" : "bad"}:${import.meta.dirname.endsWith("src") ? "dir" : "bad"}:${import.meta.url.includes("main.tsx") ? "url" : "bad"}`,
  `wall=${renderWall(shown, seal, swatch, accent)}`,
];

console.log(lines.join("\n"));

if (typeof document !== "undefined") {
  const root = document.getElementById("app");
  if (root) {
    mount(root);
  }
}

type Filter = Room | "all";

function select(filter: Filter): Work[] {
  return works
    .filter((work) => filter === "all" || work.room === filter)
    .map((work) => ({ ...work, title: frame(work.title) }));
}

function mount(root: HTMLElement) {
  let filter: Filter = room;
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest("button[data-room]");
    if (!button) {
      return;
    }
    const next = button.getAttribute("data-room");
    if (next === "west" || next === "east" || next === "all") {
      filter = next;
      paint();
    }
  });
  paint();

  function paint() {
    const themeAccent = accent;
    const sealUrl = seal;
    const swatchUrl = swatch;
    const visible = select(filter);
    const cards = visible
      .map(
        (work) => `
          <article>
            <p class="year">${work.year}</p>
            <h2>${escapeHtml(work.title)}</h2>
            <p>${escapeHtml(work.room)} room</p>
          </article>
        `,
      )
      .join("");
    const label =
      filter === "all" ? "every room" : `the ${filter} room`;
    root.innerHTML = `
      <header class="mast">
        <p class="eyebrow">${escapeHtml(when)} · ${escapeHtml(mode)}</p>
        <h1>Gallery</h1>
        <p class="lede" id="count">${visible.length} on ${label}</p>
      </header>
      <div class="toolbar" role="group" aria-label="Room">
        <button type="button" id="room-west" data-room="west" aria-pressed="${filter === "west"}">West</button>
        <button type="button" id="room-east" data-room="east" aria-pressed="${filter === "east"}">East</button>
        <button type="button" id="room-all" data-room="all" aria-pressed="${filter === "all"}">All</button>
      </div>
      <section id="wall" class="hang" style="--accent: ${themeAccent}">${cards}</section>
      <section class="swatches">
        <figure><img src="${sealUrl}" alt="Seal"><figcaption>Seal</figcaption></figure>
        <figure><img src="${swatchUrl}" alt="Swatch"><figcaption>Swatch</figcaption></figure>
        <p>Accent ${escapeHtml(accent)} · stylesheet ${escapeHtml(css)}</p>
      </section>
    `;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
