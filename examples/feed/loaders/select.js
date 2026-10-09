export function loadRenderer(kind) {
  if (kind === "html") {
    return import("../renderers/html.js");
  }
  if (kind === "plain") {
    return import("../renderers/plain.js");
  }
  return Promise.reject(new Error("unknown renderer " + kind));
}
