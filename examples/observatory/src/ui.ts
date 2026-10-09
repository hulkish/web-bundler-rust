import { Band } from "./sky.ts";
import { cardFor, loadStation } from "./station.ts";
import type { Station } from "./station.ts";
import { renderCard } from "./view.tsx";
import "./styles/print.css";
import "optics/theme.css";

const station = await loadStation();
const root = document.getElementById("app");
if (root) {
  mount(root, station);
}

function mount(root: HTMLElement, station: Station) {
  let band: Band = station.band;
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest("button[data-band]");
    if (!button) {
      return;
    }
    const next = button.getAttribute("data-band");
    if (next === Band.Red || next === Band.Blue) {
      band = next;
      paint();
    }
  });
  paint();

  function paint() {
    const card = cardFor(station, band);
    const plates = station.plates
      .map(
        (plate) =>
          `<li><span>${escapeHtml(plate.id)}</span><span>${plate.exposure}s</span></li>`,
      )
      .join("");
    root.innerHTML = `
      <header class="mast">
        <p class="eyebrow">Night station</p>
        <h1>${escapeHtml(station.title)}</h1>
        <p class="lede">${escapeHtml(station.site)} · build ${escapeHtml(station.build)} · ${escapeHtml(station.mode)}</p>
      </header>
      <section class="stats" aria-label="Readings">
        ${stat("Exposure", String(station.exposure))}
        ${stat("Nights", String(station.nights))}
        ${stat("Seeing", station.seeing)}
        ${stat("Cycle", station.cycle)}
        ${stat("Focus", String(station.focus))}
        ${stat("Lens stop", String(station.lens))}
        ${stat("Family", station.family)}
        ${stat("Arcseconds", String(station.arc))}
      </section>
      <section class="plate-card">
        <div class="toolbar" role="group" aria-label="Band">
          <button type="button" id="band-blue" data-band="blue" aria-pressed="${band === "blue"}">Blue</button>
          <button type="button" id="band-red" data-band="red" aria-pressed="${band === "red"}">Red</button>
        </div>
        <div id="card" class="card">${renderCard(card)}</div>
        <p class="meta">Rank ${station.rank} · shift ${station.shift} · stylesheet ${escapeHtml(station.css)}</p>
      </section>
      <section class="assets">
        <div>
          <h2>Plates</h2>
          <ul class="plate-list">${plates}</ul>
        </div>
        <figure>
          <img src="${escapeHtml(station.mark)}" alt="Station mark">
          <figcaption>Mark</figcaption>
        </figure>
        <figure>
          <img class="plate-image" src="${escapeHtml(station.plate)}" alt="Plate swatch">
          <figcaption>Plate</figcaption>
        </figure>
      </section>
    `;
  }
}

function stat(label: string, value: string): string {
  return `<p><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></p>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
