# Foundry

Four Three.js scenes in one browser page: an orrery, an instanced yard, a displaced shader, and a shuttle on a curve. Orbit the view by dragging the canvas. Three.js 0.186 supplies the renderer, the geometries, and `OrbitControls`.

Install the package once, then bundle:

```bash
npm install --prefix examples/foundry
cargo run -- --config examples/foundry/webbundler.config.json
```

Open `examples/foundry/preview/index.html`. The bundle also prints:

```text
scenes=4
revision=186
renderer=three
```

`process.env.NODE_ENV` is defined as `"production"`. The browser bundle is ESM and includes a source map.
