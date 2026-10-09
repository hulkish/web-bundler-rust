import { page } from "./layout.js";
import { text } from "./lists.js";

const ENDPOINTS = [
  ["/api/books", "Every book, oldest spine first."],
  ["/api/books/packing", "One book. Unknown ids return 404."],
  ["/api/authors", "Authors with the ids of their books."],
  ["/api/authors/ada-lovelace", "One author."],
  ["/api/shelves", "Stacks and how many books sit on each."],
  ["/api/shelves/systems", "One stack, with its books."],
  ["/api/series", "Series in volume order."],
  ["/api/series/analytical", "One series."],
  ["/api/tags", "Tag counts."],
  ["/api/tags/modules", "Books carrying that tag."],
  ["/api/timeline", "Books grouped by spine year."],
  ["/api/reading", "Open books and loans."],
  ["/api/stats", "Counts, pages, and the oldest and newest spines."],
  ["/api/notes", "First line of every chapter."],
  ["/api/compare?a=packing&b=cycles", "A pair. The same id twice, or an unknown id, returns 404."],
];

export function apiPage() {
  const rows = ENDPOINTS.map(function (item) {
    return "<tr><td><a href=\"" + text(item[0]) + "\"><code>" + text(item[0]) + "</code></a></td><td>" + text(item[1]) + "</td></tr>";
  }).join("\n");
  const body = "<h1>JSON catalog</h1>\n" +
    "<p>The same shelf, without the HTML. <code>GET</code> only.</p>\n" +
    "<table>\n<tr><th>Path</th><th>Reply</th></tr>\n" + rows + "\n</table>";
  return page("JSON catalog", body, "");
}
