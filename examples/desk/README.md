# Desk

Two Node entries share a shelf, a formatter, a JSON catalog, a stylesheet, and the `ink` package. Those modules are written once to `dist/chunk.js`. Each entry file is CommonJS and loads that chunk with `require("./chunk.js")`. This package is not `"type": "module"`, because the Node target emits `require`.

```bash
cargo run -- --config examples/desk/webbundler.config.json
node examples/desk/dist/reader.js
node examples/desk/dist/editor.js
```

The browser page shows the reader and the editor in one bundle:

```bash
cargo run -- --config examples/desk/webbundler.ui.json
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/examples/desk/preview/index.html`. Reader shows the preface. Editor shows the draft line and a margin note you can type.

Reader prints:

```text
role=reader
edition=folio
copies=2
mode=production
stamp=SHELF_STAMP
title=ADA
line=printed:foliox2
css=css
ink=iron-gall
preface=the river was low:ada
margin=pp.240
```

Editor prints:

```text
role=editor
edition=folio
copies=2
mode=production
stamp=SHELF_STAMP
title=ADA
line=printed:foliox2
css=css
ink=iron-gall
draft=draft:ada
```

`SHELF_STAMP` is in `chunk.js` and not in either entry file. The report omits `ink/dead.js` and `editor/scrap.ts`. The bundles do not contain `UNUSED_SHELF`, `UNUSED_MARGIN`, `INK_DEAD`, or `DESK_SCRAP`.

## What each file is for

- `webbundler.config.json` lists both entries and writes a directory. Defines replace `DESK_EDITION` with `"folio"`, `DESK_COPIES` with `2`, and `process.env.NODE_ENV` with `"production"`. Source maps are written beside each JavaScript file. Shared CSS is `dist/bundle.css` because there is more than one entry.

- `src/shared/shelf.ts`, `src/shared/format.ts`, and `src/shared/catalog.json` are reached by both entries, so they live in the chunk. `unusedShelf` is still dropped from the chunk.

- `src/styles/page.css` is imported by both entries and is concatenated into `bundle.css`.

- `src/reader/preface.ts` uses top-level await and a dynamic import of the catalog. Only the reader entry becomes async. The editor stays synchronous.

- `src/reader/margin.ts` is reader-only. `unusedMargin` is dropped.

- `src/editor/draft.ts` re-exports `scrap`, which the editor never reads. `scrap.ts` logs `DESK_SCRAP` at the top level and is omitted, so that log does not run.

- `node_modules/ink` sets `"sideEffects": false`. Both entries import `inkName`. `deadInk` is omitted.

- `package.json` marks only CSS as side-effectful, so the shared JavaScript modules can drop unused function exports.
