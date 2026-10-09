import { allAuthors } from "../books/catalog.js";
import { page } from "./layout.js";
import { bookCards, pageOf, pager, text } from "./lists.js";

export function authorsPage() {
  const authors = allAuthors();
  const items = authors.map(function (author) {
    return "<li><a href=\"/authors/" + text(author.slug) + "\">" + text(author.name) + "</a> · " +
      text(author.books.length) + " books · " + text(author.pages) + " pages</li>";
  }).join("\n");
  const body = "<h1>Authors</h1>\n<p class=\"fine\">" + text(authors.length) + " names on the spines.</p>\n<ul>\n" +
    items + "\n</ul>";
  return page("Authors", body, "/authors");
}

export function authorPage(author, params) {
  const view = pageOf(author.books, params);
  const body = "<h1>" + text(author.name) + "</h1>\n" +
    "<p class=\"fine\">" + text(author.books.length) + " books · " + text(author.pages) + " pages</p>\n" +
    pager(view, "/authors/" + author.slug, params) + "\n" +
    bookCards(view.items);
  return page(author.name, body, "/authors");
}
