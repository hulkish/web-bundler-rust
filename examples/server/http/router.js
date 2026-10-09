import { apiResponse } from "./api.js";
import { send, sendHTML, sendJSON } from "./respond.js";
import {
  booksOnShelf,
  booksWithTag,
  findAuthor,
  findBook,
  findChapter,
  findSeries,
  findShelf,
} from "../books/catalog.js";
import { aboutPage } from "../pages/about.js";
import { apiPage } from "../pages/api.js";
import { authorPage, authorsPage } from "../pages/authors.js";
import { bookPage, chapterPage } from "../pages/book.js";
import { comparePage } from "../pages/compare.js";
import { homePage } from "../pages/home.js";
import { mapPage } from "../pages/map.js";
import { notFoundPage } from "../pages/missing.js";
import { notesPage } from "../pages/notes.js";
import { readingPage } from "../pages/reading.js";
import { seriesIndexPage, seriesPage, shelfPage, shelvesPage, tagPage, tagsPage } from "../pages/shelves.js";
import { timelinePage } from "../pages/timeline.js";

function htmlRoute(path, params) {
  if (path === "/") return { status: 200, body: homePage(params) };
  if (path === "/authors") return { status: 200, body: authorsPage() };
  if (path === "/shelves") return { status: 200, body: shelvesPage() };
  if (path === "/series") return { status: 200, body: seriesIndexPage() };
  if (path === "/tags") return { status: 200, body: tagsPage() };
  if (path === "/timeline") return { status: 200, body: timelinePage(params) };
  if (path === "/reading") return { status: 200, body: readingPage() };
  if (path === "/compare") return { status: 200, body: comparePage(params) };
  if (path === "/notes") return { status: 200, body: notesPage(params) };
  if (path === "/map") return { status: 200, body: mapPage(params) };
  if (path === "/about") return { status: 200, body: aboutPage() };
  if (path === "/api") return { status: 200, body: apiPage() };

  const author = /^\/authors\/([^/]+)$/.exec(path);
  if (author) {
    const found = findAuthor(decodeURIComponent(author[1]));
    if (!found) return null;
    return { status: 200, body: authorPage(found, params) };
  }
  const shelf = /^\/shelves\/([^/]+)$/.exec(path);
  if (shelf) {
    const id = decodeURIComponent(shelf[1]);
    const found = findShelf(id);
    if (!found) return null;
    return { status: 200, body: shelfPage(found, booksOnShelf(id), params) };
  }
  const series = /^\/series\/([^/]+)$/.exec(path);
  if (series) {
    const found = findSeries(decodeURIComponent(series[1]));
    if (!found) return null;
    return { status: 200, body: seriesPage(found, params) };
  }
  const tag = /^\/tags\/([^/]+)$/.exec(path);
  if (tag) {
    const name = decodeURIComponent(tag[1]);
    const found = booksWithTag(name);
    if (!found) return null;
    return { status: 200, body: tagPage(name, found, params) };
  }
  const chapter = /^\/books\/([^/]+)\/([^/]+)$/.exec(path);
  if (chapter) {
    const found = findChapter(decodeURIComponent(chapter[1]), decodeURIComponent(chapter[2]));
    if (!found) return null;
    return { status: 200, body: chapterPage(found) };
  }
  const book = /^\/books\/([^/]+)$/.exec(path);
  if (book) {
    const found = findBook(decodeURIComponent(book[1]));
    if (!found) return null;
    return { status: 200, body: bookPage(found) };
  }
  return null;
}

export function handle(req, res) {
  let path = new URL(req.url, "http://127.0.0.1").pathname;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  const params = new URL(req.url, "http://127.0.0.1").searchParams;

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "text/plain; charset=utf-8", "Method not allowed\n");
    return;
  }

  const html = htmlRoute(path, params);
  if (html) {
    sendHTML(res, html.status, html.body);
    return;
  }
  if (path.startsWith("/api/")) {
    const json = apiResponse(path, params);
    if (!json) {
      sendJSON(res, 404, { error: "not found" });
      return;
    }
    sendJSON(res, json.status, json.body);
    return;
  }
  sendHTML(res, 404, notFoundPage(path));
}
