import { page } from "./layout.js";
import { text } from "./lists.js";

export function notFoundPage(path) {
  return page("Not found", "<h1>Not found</h1>\n<p>No page at " + text(path) + ".</p>\n<p><a href=\"/map\">Map of the shelf</a></p>", "");
}
