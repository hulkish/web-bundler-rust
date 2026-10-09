import {
  allAuthors,
  allBooks,
  allSeries,
  allShelves,
  allTags,
} from "../books/catalog.js";
import { page } from "./layout.js";
import { pageOf, pager, text } from "./lists.js";

function links(items) {
  return "<ul>\n" + items.join("\n") + "\n</ul>";
}

export function mapPage(params) {
  const rooms = [
    ["/", "Shelf"],
    ["/authors", "Authors"],
    ["/shelves", "Stacks"],
    ["/series", "Series"],
    ["/tags", "Tags"],
    ["/timeline", "Timeline"],
    ["/reading", "Reading"],
    ["/compare", "Compare"],
    ["/notes", "Notes"],
    ["/about", "About"],
    ["/api", "JSON catalog"],
  ].map(function (item) {
    return "<li><a href=\"" + item[0] + "\">" + text(item[1]) + "</a></li>";
  });
  const bookView = pageOf(allBooks(), params);
  const books = bookView.items.map(function (book) {
    const chapters = book.chapters.map(function (chapter) {
      return "<a href=\"" + text(chapter.href) + "\">" + text(chapter.title) + "</a>";
    }).join(", ");
    return "<li><a href=\"/books/" + text(book.id) + "\">" + text(book.title) + "</a> · " + chapters + "</li>";
  });
  const authors = allAuthors().map(function (author) {
    return "<li><a href=\"/authors/" + text(author.slug) + "\">" + text(author.name) + "</a></li>";
  });
  const shelves = allShelves().map(function (shelf) {
    return "<li><a href=\"/shelves/" + text(shelf.id) + "\">" + text(shelf.title) + "</a></li>";
  });
  const series = allSeries().map(function (item) {
    return "<li><a href=\"/series/" + text(item.slug) + "\">" + text(item.name) + "</a></li>";
  });
  const tags = allTags().map(function (item) {
    return "<li><a href=\"/tags/" + text(item.tag) + "\">" + text(item.tag) + "</a></li>";
  });
  const body = "<h1>Map</h1>\n" +
    "<h2>Rooms</h2>\n" + links(rooms) +
    "<h2>Books and chapters</h2>\n" +
    "<p class=\"fine\">" + text(bookView.total) + " books. Each book is <code>/books/</code> plus its id, and each chapter adds one more segment.</p>\n" +
    pager(bookView, "/map", params) + "\n" + links(books) +
    "<h2>Authors</h2>\n" + links(authors) +
    "<h2>Stacks</h2>\n" + links(shelves) +
    "<h2>Series</h2>\n" + links(series) +
    "<h2>Tags</h2>\n" + links(tags);
  return page("Map", body, "/map");
}
