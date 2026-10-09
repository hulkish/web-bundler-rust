import { allSeries, allShelves, allTags } from "../books/catalog.js";
import { page } from "./layout.js";
import { bookCards, pageOf, pager, text } from "./lists.js";

export function shelvesPage() {
  const shelves = allShelves();
  const items = shelves.map(function (shelf) {
    return "<article>\n<h2><a href=\"/shelves/" + text(shelf.id) + "\">" + text(shelf.title) + "</a></h2>\n" +
      "<p class=\"meta\">" + text(shelf.count) + " books · " + text(shelf.pages) + " pages</p>\n" +
      "<div class=\"blurb\">" + shelf.html + "</div>\n</article>";
  }).join("\n");
  const body = "<h1>Stacks</h1>\n" + items;
  return page("Stacks", body, "/shelves");
}

export function shelfPage(shelf, books, params) {
  const view = pageOf(books, params);
  const body = "<h1>" + text(shelf.title) + "</h1>\n" +
    "<div class=\"blurb\">" + shelf.html + "</div>\n" +
    "<p class=\"fine\">" + text(books.length) + " books · " + text(shelf.pages) + " pages</p>\n" +
    pager(view, "/shelves/" + shelf.id, params) + "\n" +
    bookCards(view.items);
  return page(shelf.title, body, "/shelves");
}

export function seriesIndexPage() {
  const series = allSeries();
  const items = series.map(function (item) {
    const volumes = item.books.map(function (book) {
      return text(book.seriesIndex) + ". <a href=\"/books/" + text(book.id) + "\">" + text(book.title) + "</a>";
    }).join("<br>\n");
    return "<article>\n<h2><a href=\"/series/" + text(item.slug) + "\">" + text(item.name) + "</a></h2>\n" +
      "<p>" + volumes + "</p>\n</article>";
  }).join("\n");
  const body = "<h1>Series</h1>\n" + items;
  return page("Series", body, "/series");
}

export function seriesPage(series, params) {
  const view = pageOf(series.books, params);
  const body = "<h1>" + text(series.name) + "</h1>\n" +
    "<p class=\"fine\">" + text(series.books.length) + " volumes, in order.</p>\n" +
    pager(view, "/series/" + series.slug, params) + "\n" +
    bookCards(view.items);
  return page(series.name, body, "/series");
}

export function tagsPage() {
  const tags = allTags();
  const items = tags.map(function (item) {
    return "<a href=\"/tags/" + text(item.tag) + "\">" + text(item.tag) + "</a> <span class=\"fine\">" +
      text(item.count) + "</span>";
  }).join(" · ");
  const body = "<h1>Tags</h1>\n<p class=\"pills\">" + items + "</p>";
  return page("Tags", body, "");
}

export function tagPage(tag, books, params) {
  const view = pageOf(books, params);
  const body = "<h1>" + text(tag) + "</h1>\n<p class=\"fine\">" + text(books.length) + " books.</p>\n" +
    pager(view, "/tags/" + tag, params) + "\n" +
    bookCards(view.items);
  return page(tag, body, "");
}
