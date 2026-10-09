import { timeline } from "../books/catalog.js";
import { page } from "./layout.js";
import { authorLink, bookLink, text } from "./lists.js";

export function timelinePage(params) {
  const years = timeline();
  const requested = parseInt(params.get("year") || "", 10);
  const index = years.map(function (group) {
    const here = group.year === requested ? " aria-current=\"page\"" : "";
    return "<a href=\"/timeline?year=" + text(group.year) + "\"" + here + ">" + text(group.year) + "</a> <span class=\"fine\">" +
      text(group.books.length) + "</span>";
  }).join(" · ");
  let detail = "<p class=\"fine\">Choose a year to list the spines. Within a year, the older date comes first.</p>";
  if (requested) {
    let group = null;
    for (let i = 0; i < years.length; i++) {
      if (years[i].year === requested) group = years[i];
    }
    if (!group) {
      detail = "<p>No spines in " + text(requested) + ".</p>";
    } else {
      const rows = group.books.map(function (book) {
        return "<li>" + text(book.publishedLabel) + " · " + bookLink(book) + " · " + authorLink(book) + "</li>";
      }).join("\n");
      detail = "<h2>" + text(group.year) + "</h2>\n<ul>\n" + rows + "\n</ul>";
    }
  }
  const body = "<h1>Timeline</h1>\n<p class=\"fine\">Spine dates, newest year first.</p>\n<p class=\"pills\">" + index + "</p>\n" + detail;
  return page("Timeline", body, "/timeline");
}
