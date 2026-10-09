import { loadBeacon } from "./report.ts";
import type { BeaconReport } from "./report.ts";

const report = await loadBeacon();
const root = document.getElementById("app");
if (root) {
  mount(root, report);
}

function mount(root: HTMLElement, report: BeaconReport) {
  let open = true;
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (!target.closest("#shutter")) {
      return;
    }
    open = !open;
    paint();
  });
  paint();

  function paint() {
    root.innerHTML = `
      <header class="mast">
        <p class="eyebrow">Wick ${escapeHtml(report.wick)} · state ${report.state}</p>
        <h1>${open ? "Beacon lit" : "Shutter closed"}</h1>
        <p class="lede">Armed ${escapeHtml(report.armed)} · ${escapeHtml(report.mode)} · chain ${report.chain}</p>
      </header>
      <figure id="lamp" class="${open ? "is-lit" : "is-dim"}">
        <img src="${escapeHtml(report.lamp)}" alt="Beacon lamp">
      </figure>
      <button type="button" id="shutter">${open ? "Close shutter" : "Open shutter"}</button>
      <section class="stats" aria-label="Readings">
        ${stat("Nights", String(report.nights))}
        ${stat("Bonus", String(report.bonus))}
        ${stat("Chain", String(report.chain))}
        ${stat("Here", report.here)}
        ${stat("There", report.there)}
        ${stat("Meta", report.meta)}
      </section>
      <p class="meta">Stylesheet ${escapeHtml(report.css)}</p>
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
