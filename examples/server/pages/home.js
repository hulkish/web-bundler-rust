import {
  allShelves,
  allTags,
  searchBooks,
  shelfStats,
} from "../books/catalog.js";
import { bookCards, pageOf, pager, text } from "./lists.js";
import { page } from "./layout.js";

function stat(label, value) {
  return "<span><strong>" + text(value) + "</strong> " + text(label) + "</span>";
}

export function homePage(params) {
  const query = params.get("q") || "";
  const shelf = params.get("shelf") || "";
  const tag = params.get("tag") || "";
  const status = params.get("status") || "";
  const books = searchBooks({ query: query, shelf: shelf, tag: tag, status: status });
  const view = pageOf(books, params);
  const stats = shelfStats();
  const shelves = allShelves();
  const tags = allTags();
  const shelfOptions = "<option value=\"\">Every stack</option>\n" + shelves.map(function (item) {
    const mark = item.id === shelf ? " selected" : "";
    return "<option value=\"" + text(item.id) + "\"" + mark + ">" + text(item.title) + "</option>";
  }).join("\n");
  const tagOptions = "<option value=\"\">Every tag</option>\n" + tags.map(function (item) {
    const mark = item.tag === tag ? " selected" : "";
    return "<option value=\"" + text(item.tag) + "\"" + mark + ">" + text(item.tag) + " (" + text(item.count) + ")</option>";
  }).join("\n");
  const statusOptions = [
    ["", "Any status"],
    ["shelf", "On the shelf"],
    ["reading", "Open on the desk"],
    ["lent", "Out on loan"],
  ].map(function (item) {
    const mark = item[0] === status ? " selected" : "";
    return "<option value=\"" + text(item[0]) + "\"" + mark + ">" + text(item[1]) + "</option>";
  }).join("\n");
  const strip = "<div class=\"stats\">\n" +
    stat("books", stats.books) + "\n" +
    stat("authors", stats.authors) + "\n" +
    stat("pages", stats.pages) + "\n" +
    stat("minutes", stats.minutes) + "\n" +
    stat("chapters", stats.chapters) + "\n" +
    "</div>";
  const form = "<form action=\"/\" method=\"get\">\n" +
    "<input name=\"q\" value=\"" + text(query) + "\" placeholder=\"Title, author, tag, or a line from a chapter\" aria-label=\"Search\">\n" +
    "<select name=\"shelf\" aria-label=\"Stack\">" + shelfOptions + "</select>\n" +
    "<select name=\"tag\" aria-label=\"Tag\">" + tagOptions + "</select>\n" +
    "<select name=\"status\" aria-label=\"Status\">" + statusOptions + "</select>\n" +
    "<button type=\"submit\">Search</button>\n" +
    "</form>";
  const heading = query || shelf || tag || status
    ? "<h1>" + text(books.length) + " matching</h1>"
    : "<h1>Shelf</h1>";
  const body = heading + "\n" + strip + "\n" + form + "\n" + pager(view, "/", params) + "\n" + bookCards(view.items);
  return page("Shelf", body, "/");
}
