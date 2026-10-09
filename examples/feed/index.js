// Static-site style pipeline.
// JSON posts, a node_modules package, a CommonJS word counter, export *,
// a dynamic renderer import, and Node's path/url built-ins.
import { buildFeed, plainText } from "./pipeline/index.js";
import { loadRenderer } from "./loaders/select.js";
import { sourceLabel } from "./site/source.js";

const feed = buildFeed(sourceLabel());
const sample = plainText("# Hello\n\nShip **bundles**.");

loadRenderer("html").then(function (html) {
  return loadRenderer("plain").then(function (plain) {
    console.log("source " + feed.source);
    console.log("sample " + sample);
    console.log(plain.render(feed));
    console.log(html.render(feed));
  });
});
