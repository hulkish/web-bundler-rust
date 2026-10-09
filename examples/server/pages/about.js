import { PRESS_COUNT } from "../books/press.js";
import { shelfStats } from "../books/catalog.js";
import { page } from "./layout.js";
import { text } from "./lists.js";

export function aboutPage() {
  const mode = process.env.NODE_ENV || "development";
  const stats = shelfStats();
  const body = "<h1>About this shelf</h1>\n" +
    "<p>The sample catalog holds " + text(stats.books) + " books, " + text(stats.chapters) +
    " chapters, and " + text(stats.pages) + " pages. Ten of those books were set by hand. The other " +
    text(PRESS_COUNT) + " are a press run: <code>leaf-0001</code> through <code>leaf-" + text(PRESS_COUNT) +
    "</code>, spread across the same stacks. The names on the spines are a fiction used to exercise the bundler. They are not a record of anyone's published work.</p>\n" +
    "<h2>What the bundle keeps</h2>\n" +
    "<ul>\n" +
    "<li><code>http</code> stays outside. Node loads it when the process starts.</li>\n" +
    "<li><code>escape-html</code>, <code>marked</code>, <code>date-fns</code>, <code>slugify</code>, <code>reading-time</code>, and <code>mime-types</code> are walked in from <code>node_modules</code>.</li>\n" +
    "<li><code>data/books.json</code> and <code>data/shelves.json</code> are imported as JSON. <code>books/press.js</code> builds the rest of the run when the process starts.</li>\n" +
    "<li>The config replaces <code>process.env.NODE_ENV</code>. This page is running as <strong>" + text(mode) + "</strong>.</li>\n" +
    "</ul>\n" +
    "<h2>Rooms</h2>\n" +
    "<p>Shelf search filters by stack, tag, and status. Authors, stacks, series, and tags are sections derived from the catalog. The timeline sorts spine dates. Reading lists open books and loans. Compare puts two books in one table. Notes quotes the first line of every chapter. The map lists every generated path. <a href=\"/api\">/api</a> repeats the catalog as JSON.</p>\n" +
    "<p class=\"fine\">Oldest spine: " + text(stats.oldest.title) + " (" + text(stats.oldest.publishedLabel) +
    "). Newest spine: " + text(stats.newest.title) + " (" + text(stats.newest.publishedLabel) + ").</p>";
  return page("About", body, "/about");
}
