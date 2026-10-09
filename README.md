# webbundler

A JavaScript bundler written in Rust. It follows static `import` / `export` and CommonJS `require()` from an entry file, writes one script, and can minify that script with [oxc](https://oxc.rs) and compress the bundled CSS.

## Build

```bash
cargo build --release
```

The binary is `target/release/webbundler`.

## Bundle a program

```bash
cargo run -- examples/app/index.js -o dist/bundle.js
node dist/bundle.js
```

That example imports local modules and a JSON file. It prints `Hello Ada, the answer is 20`.

Larger programs under `examples/` use the rest of the bundler. Each one has a `webbundler.config.json` and prints a fixed report:

```bash
cargo run -- --config examples/observatory/webbundler.config.json
node examples/observatory/dist/observatory.js

cargo run -- --config examples/gallery/webbundler.config.json
node examples/gallery/dist/gallery.js

cargo run -- --config examples/desk/webbundler.config.json
node examples/desk/dist/reader.js
node examples/desk/dist/editor.js

cargo run -- --config examples/beacon/webbundler.config.json
node examples/beacon/dist/beacon.js

cargo run --release -- --threads 8 --config examples/atlas/webbundler.config.json
```

Open the browser pages after building the previews:

```bash
cargo run -- --config examples/observatory/webbundler.ui.json
cargo run -- --config examples/gallery/webbundler.ui.json
cargo run -- --config examples/desk/webbundler.ui.json
cargo run -- --config examples/beacon/webbundler.ui.json
cargo run -- --config examples/economy/webbundler.config.json
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765/examples/index.html`.

`observatory` is a Node program: TypeScript, JSX, defines, top-level await, tree shaking, source maps, CSS, copied assets, `__dirname`, and `import.meta`. `gallery` is a browser bundle that leaves an ESM package external. `desk` splits two entries through `chunk.js`. `beacon` is the minified build, so constant `if` branches from `--define` are removed. `atlas` is a large multi-entry tree for `--threads`, with hundreds of modules, stylesheets, and icons. Rebuild `observatory` while editing with:

```bash
cargo run -- --watch --config examples/observatory/webbundler.config.json
```

Minify with compression, name mangling, and whitespace removal:

```bash
cargo run -- examples/app/index.js -o dist/bundle.min.js --minify
```

Remove every comment, including `/*! */`, `//!`, `@license`, and `@preserve`, in your files and in dependencies:

```bash
cargo run -- examples/app/index.js -o dist/bundle.js --strip-comments
```

Leave a dependency for the runtime to load:

```bash
webbundler src/index.js -o dist/bundle.js --external react
```

Other flags:

```bash
webbundler src/index.ts -o dist/app.js --sourcemap --target browser
webbundler src/index.js -o dist/app.mjs --format esm
webbundler --define process.env.NODE_ENV='"production"' src/index.js
webbundler --watch --report src/index.js
webbundler a.js b.js -o dist
webbundler --threads 8 src/index.js
webbundler --reporter log src/index.js
```

`--threads COUNT` compiles modules on `COUNT` threads and finishes each JavaScript and CSS output in parallel. The written files match a build that omits the flag. Omit it to stay on one thread.

`--reporter log`, `bar`, `tree`, or `json` prints each module as it is compiled, and marks the bundling, optimizing, and minifying stages when those passes run. Color is used when stdout is a terminal. Set `NO_COLOR` to turn that off.

`webbundler.config.json` can set `entry` or `entries`, `output`, `minify`, `stripComments`, `external`, `define`, `target` (`node` or `browser`), `format` (`cjs`, `esm`, `asm` or `wasm`), `sourcemap`, `threads`, `reporter`, and `jsx.pragma` / `jsx.fragment`. Command-line flags override it.

Node built-ins (`fs`, `path`, `node:url`, and the rest) stay external for `--target node` and are rejected for `--target browser`. `--format esm` writes `import` and `export`, including for a Node bundle, and loads those built-ins with `import`. Node defaults to CommonJS. Browser output is an ES module. Several entries that share modules write a `chunk.js` plus one file per entry; with `--format esm` the entries import that chunk.

## What it bundles

- ESM: default, named, and namespace imports, `export` declarations, `export { ... } from`, `export *`, and `export * as`
- Live import bindings, so cyclic modules can call each other's functions
- CommonJS `require("./file")` and `module.exports`
- TypeScript (types are stripped, enums become objects) and JSX (`React.createElement` by default)
- JSON imports, CSS (one bundled `.css` file), and asset imports such as `.svg` and images
- Local image `url(...)` references in CSS, rewritten to the copied file
- `import("./file.js")` when the specifier is a string literal
- Top-level `await`
- `import.meta.url`, `import.meta.dirname`, `import.meta.filename`, `__dirname`, and `__filename`
- Relative files, directory `index.js`, and `node_modules` via `exports`, `module`, or `main`
- Tree shaking of unused exports, including packages with `"sideEffects": false`
- Source maps, `--define` replacements, `--strip-comments`, `--format esm`, and `--watch`

## Limits

`import source` and `import defer` are rejected. Dynamic `import()` and `require()` need a string literal so the dependency can be included. TypeScript namespaces are rejected. CSS `url()` values that are remote, `data:`, or missing on disk are left as written.
