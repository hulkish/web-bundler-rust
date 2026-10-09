import escapeHtml from "escape-html";
import { statusLabel } from "../books/catalog.js";

export function text(value) {
  return escapeHtml(String(value));
}

export function bookLink(book) {
  return "<a href=\"/books/" + text(book.id) + "\">" + text(book.title) + "</a>";
}

export function authorLink(book) {
  return "<a href=\"/authors/" + text(book.authorSlug) + "\">" + text(book.author) + "</a>";
}

export function shelfLink(book) {
  return "<a href=\"/shelves/" + text(book.shelfId) + "\">" + text(book.shelfTitle) + "</a>";
}

export function tagLinks(tags) {
  return tags.map(function (tag) {
    return "<a href=\"/tags/" + text(tag) + "\">" + text(tag) + "</a>";
  }).join(" ");
}

export function statusPill(book) {
  return "<span class=\"status status-" + text(book.status) + "\">" + text(statusLabel(book.status)) + "</span>";
}

export function metaLine(book) {
  const series = book.seriesName
    ? " · <a href=\"/series/" + text(book.seriesSlug) + "\">" + text(book.seriesName) + " " + text(book.seriesIndex) + "</a>"
    : "";
  return "<p class=\"meta\">" + authorLink(book) + " · " + shelfLink(book) + " · " +
    text(book.pages) + " pages · " + text(book.publishedLabel) + " · " + text(book.reading) +
    series + "</p>";
}

export function bookCard(book) {
  return "<article>\n" +
    "<h2>" + bookLink(book) + "</h2>\n" +
    metaLine(book) + "\n" +
    "<p class=\"tags\">" + statusPill(book) + " " + tagLinks(book.tags) + "</p>\n" +
    "<p class=\"slug\">" + text(book.slug) + "</p>\n" +
    "<div class=\"blurb\">" + book.html + "</div>\n" +
    "</article>";
}

export function bookCards(list) {
  if (!list.length) return "<p>Nothing on the shelf matches.</p>";
  return list.map(bookCard).join("\n");
}

export var PAGE_SIZE = 40;

export function pageOf(list, params) {
  var total = list.length;
  var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  var requested = 1;
  if (params && params.get) {
    var raw = parseInt(params.get("page") || "1", 10);
    if (raw > 0) requested = raw;
  }
  var current = requested > pages ? pages : requested;
  var start = (current - 1) * PAGE_SIZE;
  return {
    items: list.slice(start, start + PAGE_SIZE),
    page: current,
    pages: pages,
    total: total,
    start: start,
  };
}

export function pager(view, path, params) {
  if (!view || view.pages < 2) return "";
  var kept = [];
  if (params && params.forEach) {
    params.forEach(function (value, key) {
      if (key === "page" || value === "") return;
      kept.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
  }
  function href(n) {
    var query = kept.slice();
    if (n > 1) query.push("page=" + String(n));
    return path + (query.length ? "?" + query.join("&") : "");
  }
  var links = [];
  if (view.page > 1) links.push("<a href=\"" + text(href(view.page - 1)) + "\">Previous</a>");
  links.push("page " + text(view.page) + " of " + text(view.pages));
  if (view.page < view.pages) links.push("<a href=\"" + text(href(view.page + 1)) + "\">Next</a>");
  var from = view.start + 1;
  var to = view.start + view.items.length;
  return "<p class=\"pager\">" + text(from) + "–" + text(to) + " of " + text(view.total) + " · " + links.join(" · ") + "</p>";
}

export function optionList(books, selected) {
  return books.map(function (book) {
    const mark = book.id === selected ? " selected" : "";
    return "<option value=\"" + text(book.id) + "\"" + mark + ">" + text(book.title) + "</option>";
  }).join("\n");
}
