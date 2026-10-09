# Atelier

A React workshop of 107 UI components and 535 Storybook stories. Each component is a JSX widget: data grid, menu, dialog, tabs, inputs, charts, and seven Three.js scenes, including a city, a portrait, and a Milky Way galaxy. Stories are composed with `composeStory` from `@storybook/react` 10.6.

Eleven families cover Three.js, data display, navigation, inputs, choices, actions, overlays, feedback, layout, charts, and content. A story is Resting, Dense, Empty, Alert, or Disabled. Controls edit the composed args. The canvas can change background, width, zoom, and outline.

Install the packages once, then bundle:

```bash
npm install --prefix examples/storybook
cargo run -- --config examples/storybook/webbundler.config.json
```

Open `examples/storybook/preview/index.html`. The bundle also prints four lines:

```text
components=107
stories=535
families=11
renderer=storybook
```

`process.env.NODE_ENV` is defined as `"production"`, so React stays on the production build. The browser bundle is ESM and includes a source map.
