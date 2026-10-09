# Gallery

A browser bundle. The output is an ES module that imports `gallery-theme` instead of inlining it. `package.json` sets `"type": "module"` so Node can run that file and resolve the external package from `node_modules`.

```bash
cargo run -- --config examples/gallery/webbundler.config.json
node examples/gallery/dist/gallery.js
```

The same entry also mounts a page when a browser loads it. Build that copy into `preview/` and serve the example directory tree:

```bash
cargo run -- --config examples/gallery/webbundler.ui.json
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/examples/gallery/preview/index.html`. West, East, and All filter the wall. `gallery-theme` stays an external import, resolved with the import map on that page.

`node` prints:

```text
mode=production
room=west
when=dusk
accent=#c45c26
css=css
seal=svg
swatch=png
meta=file:dir:url
wall=<h1 style="#c45c26">2</h1><ul><li key="w1" data-year="1912" data-room="west">[HARBOR]</li><li key="w3" data-year="1920" data-room="west">[NIGHT GLASS]</li></ul><img src="./seal.svg" alt="seal"><img src="./swatch.png" alt="swatch">
```

`dist/gallery.js` contains `import` from `"gallery-theme"` and `export default`. It does not contain `GALLERY_THEME_SECRET`, which lives only in the external package. It also drops `GALLERY_DROPPED` and `GALLERY_UNUSED_CLOCK`.

## What each file is for

- `webbundler.config.json` sets `"target": "browser"`, `"external": ["gallery-theme"]`, a source map, a report, and defines. `process.env.NODE_ENV` becomes `"production"` and `GALLERY_ROOM` becomes `"west"`. The development `console.log` remains in this unminified file.

- `src/main.tsx` filters the catalog to the west room, asks the external `frame()` to title each work, and prints `import.meta` for this file. A Node built-in here would fail the build.

- `src/clock.ts` has top-level await. Importing it makes the entry async. `unusedClock` is dropped.

- `src/works.ts` is the catalog. `droppedCaption` is an unused function export and is dropped. `src/types.ts` is type-only and never enters the graph.

- `src/frame.tsx` lowers a list of elements, a spread attribute (`data-room`), and two images through the `h` / `Fragment` pragma.

- `src/styles/wall.css` is written to `dist/gallery.css`. The `url("./not-rewritten.png")` reference is copied through unchanged, and that PNG is not emitted as an asset.

- `src/assets/seal.svg` and `src/assets/swatch.png` are copied next to the bundle.

- `node_modules/gallery-theme/index.js` is a real ESM package (`"type": "module"`). Node loads it when the bundle runs. `accent` is `#c45c26` and `frame` wraps a title in brackets and uppercases it.
