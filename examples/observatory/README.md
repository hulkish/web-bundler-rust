# Observatory

A night-station log for the Node target. The config drives the build: one TypeScript entry, JSX pragmas `h` / `Fragment`, compile-time defines, a source map, and a module report. `minify` stays off so the bundle is readable. `watch` is not set here; pass it on the command line so a normal run exits.

```bash
cargo run -- --config examples/observatory/webbundler.config.json
node examples/observatory/dist/observatory.js
```

The browser page is a separate bundle, so the Node build can keep using `require("path")`:

```bash
cargo run -- --config examples/observatory/webbundler.ui.json
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/examples/observatory/preview/index.html`. Blue and Red redraw the card. The node command above still prints the log.

`node` prints:

```text
mode=production
build=field-7
site=North Bowl
shift=3
band=blue
rank=2
exposure=85
nights=16
seeing=good
cycle=east
legacy=legacy.cjs:station:plate-log
meta=file:dir:url
mark=svg
plate=png
css=css
focus=6
lens=8
family=glass
arc=6
card=<header class="card-head">Ada Ridge</header><p class="blue">good 2<em>long</em></p><img src="./mark.svg" alt="mark" data-nights="16">
```

The report lists `optics/dead.js` and `optics/side-effect.js` as omitted. The bundle does not contain `RETIRED_RANK`, `RETIRED_PROBE`, `SPARE_LENS`, `UNUSED_POSTER`, `OPTICS_UNUSED`, or `OPTICS_SIDE_EFFECT`. It does contain `UNITS_KEPT_BY_STAR`, because `export * as units` keeps that module whole.

## What each file is for

- `src/index.ts` is the entry. It awaits a module that itself uses top-level await, reads `import.meta.url`, `import.meta.dirname`, and `import.meta.filename`, and branches on `process.env.NODE_ENV`. The development branch is still in this unminified build. Minify removes it:

  ```bash
  cargo run -- --config examples/observatory/webbundler.config.json --minify -o examples/observatory/dist/observatory.min.js
  ```

  `observatory.min.js` no longer contains `DEV_ONLY_OBSERVATORY`. Rebuild without `--minify` to restore the readable bundle.

- `webbundler.config.json` replaces `process.env.NODE_ENV` with `"production"`, `process.env.OBSERVATORY_SITE` with `"North Bowl"`, `OBSERVATORY_BUILD` with `"field-7"`, and `OBSERVATORY_SHIFT` with `3`. String values are JavaScript source, so the quotes are part of the JSON string.

- `src/types.ts` is imported only with `import type` and `export type`. Those statements are erased, and this file never enters the graph.

- `src/sky.ts` lowers a string enum and a numeric enum (`Rank.Film` is `2`). `describe` is generic; `satisfies` is stripped. `retiredRank` is a pure export nothing reads, so it is dropped.

- `src/instruments.ts` uses `implements`, an abstract method (deleted), a public method, a readonly field, and a constructor parameter property (`public power`). `SpareLens` and `retiredProbe` are unused and dropped. `src/notes.ts` imports `calibrate` and `type Named` from the same statement.

- `src/barrel.ts` re-exports the names the entry uses and does `export * as units`. The namespace object keeps `keptByStar` even though the entry never calls it.

- `src/cycle/a.ts` and `src/cycle/b.ts` call each other. `fromA(3)` prints `east`.

- `src/log/async-log.ts` awaits a promise at the top level and dynamically imports `catalog.json`. The static import in the entry and the dynamic import share one module. The JSON object is the module exports value, so the loader reads `.nights` from `default` or the object itself.

- `src/station/legacy.cjs` is CommonJS. `__filename` and `__dirname` become the real path of that file, and `require("path")` stays a Node built-in.

- `src/view.tsx` and `src/runtime/dom.ts` lower JSX to `h(...)`, including a fragment, an expression child, and a spread attribute. The config sets the pragma, and the import of `h` and `Fragment` is rewritten like any other binding. `unusedPoster` is dropped.

- `src/styles/night.css`, `src/styles/print.css`, and `optics/theme.css` are concatenated into `dist/observatory.css`. Importing the CSS default export yields `./observatory.css`.

- `src/assets/mark.svg` and `src/assets/plate.png` are copied beside the bundle and imported as those relative URLs.

- `package.json` sets `"sideEffects": ["**/*.css", "**/*.svg", "**/*.png"]`, so local JavaScript is eligible for tree shaking while those assets stay side-effectful when something imports them.

- `node_modules/optics` sets `"sideEffects": false`. The entry imports only `focus`. The bare `import "./side-effect.js"` and the unused `deadLens` re-export are omitted. `theme.css` is a separate import from the entry, so it is kept. Package `exports` maps `"."` and `"./theme.css"`.

Rebuild on change:

```bash
cargo run -- --watch --config examples/observatory/webbundler.config.json
```

Stop it with Ctrl+C. The source map is `dist/observatory.js.map` and points at the original `.ts` and `.tsx` files.
