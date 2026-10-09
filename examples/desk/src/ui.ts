import css from "./styles/page.css";
import { loadEditor } from "./editor/report.ts";
import { loadReader } from "./reader/report.ts";
import type { EditorReport } from "./editor/report.ts";
import type { ReaderReport } from "./reader/report.ts";

const reader = await loadReader();
const editor = loadEditor();
const root = document.getElementById("app");
if (root) {
  mount(root, reader, editor, css);
}

function mount(
  root: HTMLElement,
  reader: ReaderReport,
  editor: EditorReport,
  css: string,
) {
  let pane: "reader" | "editor" = "reader";
  let note = "";
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest("button[data-pane]");
    if (!button) {
      return;
    }
    const next = button.getAttribute("data-pane");
    if (next === "reader" || next === "editor") {
      const field = document.getElementById("draft-note");
      if (field instanceof HTMLTextAreaElement) {
        note = field.value;
      }
      pane = next;
      paint();
    }
  });
  root.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) {
      return;
    }
    note = target.value;
    const count = document.getElementById("note-count");
    if (count) {
      count.textContent = `${words(note)} words`;
    }
  });
  paint();

  function paint() {
    root.innerHTML = `
      <header class="mast">
        <p class="eyebrow">${escapeHtml(reader.stamp)} · ${escapeHtml(reader.ink)}</p>
        <h1>${escapeHtml(reader.title)}</h1>
        <p class="lede">${escapeHtml(reader.line)} · ${reader.copies} copies · ${escapeHtml(reader.mode)}</p>
      </header>
      <div class="toolbar" role="group" aria-label="Desk">
        <button type="button" id="show-reader" data-pane="reader" aria-pressed="${pane === "reader"}">Reader</button>
        <button type="button" id="show-editor" data-pane="editor" aria-pressed="${pane === "editor"}">Editor</button>
      </div>
      <section id="reader-view" class="sheet" ${pane === "reader" ? "" : "hidden"}>
        <p class="margin">${escapeHtml(reader.margin)}</p>
        <p class="preface">${escapeHtml(reader.preface)}</p>
      </section>
      <section id="editor-view" class="sheet" ${pane === "editor" ? "" : "hidden"}>
        <p class="draft">${escapeHtml(editor.draft)}</p>
        <label for="draft-note">Margin note</label>
        <textarea id="draft-note" rows="5">${escapeHtml(note)}</textarea>
        <p id="note-count">${words(note)} words</p>
      </section>
      <p class="meta">${reader.pages} pages in ${escapeHtml(reader.volume)} · stylesheet ${escapeHtml(css)}</p>
    `;
  }
}

function words(note: string): number {
  const trimmed = note.trim();
  if (!trimmed) {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
