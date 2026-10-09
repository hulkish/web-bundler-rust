# Beacon

The minified build. `webbundler.config.json` sets `"minify": true` and `"sourcemap": true`, so the source map is the bundle map composed with the minifier map. Constant branches created by `--define` are removed before the file is written.

```bash
cargo run -- --config examples/beacon/webbundler.config.json
node examples/beacon/dist/beacon.js
```

The browser page uses the same readings without minifying the page script:

```bash
cargo run -- --config examples/beacon/webbundler.ui.json
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/examples/beacon/preview/index.html`. Close shutter dims the lamp. Open shutter lights it again.

`node` prints:

```text
armed=yes
mode=production
state=1
nights=9
bonus=1
chain=3
wick=steady
here=here.cjs:paths
there=there.cjs:nested
meta=yes
lamp=svg
css=css
```

`dist/beacon.js` does not contain `DEV_BEACON_DISARMED`, `DEV_BEACON_CONSOLE`, `RETIRED_MATH`, or `WICK_FLARE`. The map still names `index.ts` and `meta.ts`.

## What each file is for

- Defines replace `BEACON_ARMED` with `true` and `process.env.NODE_ENV` with `"production"`. The false side of `BEACON_ARMED ? "yes" : "DEV_BEACON_DISARMED"` and the `!== "production"` branch are both gone from the minified file. A JSON boolean becomes the JavaScript token `true`; a JSON string is inserted as source, quotes included.

- `src/chain/a.ts` awaits at the top level. `b.ts` awaits that module and adds one. `c.ts` adds one more. The entry imports `c`, so the whole chain is async and `chain` is `3`.

- `src/reexports.ts` uses `export *` from `math.ts` and a named re-export of `lampLabel`. `State.Lit` is the numeric enum member `1`. `retiredMath` is not imported and is dropped. The lamp module pulls in `src/assets/lamp.svg`, which is copied beside the bundle.

- `src/paths/here.cjs` and `src/paths/nested/there.cjs` rewrite `__filename` and `__dirname` to those files. The printed directories are `paths` and `nested`.

- `src/meta.ts` checks `import.meta.filename`, `import.meta.dirname`, and `import.meta.url`.

- `src/data.json` is a static import. `src/extra.json` is loaded with `import("./extra.json")` from the entry. The dynamic import returns the JSON object as the module exports.

- `src/styles/beacon.css` is bundled to `dist/beacon.css`. `url("./unbundled.png")` is left as written, and that file is not copied.

- `node_modules/wick` sets `"sideEffects": false`. The entry imports `steady`. `flare.js` logs `WICK_FLARE` and is omitted, so the log does not run. The report says why.
