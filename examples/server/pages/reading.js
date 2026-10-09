import format from "date-fns/format/index.js";
import parseISO from "date-fns/parseISO/index.js";
import { findChapter, readingDesk } from "../books/catalog.js";
import { page } from "./layout.js";
import { bookLink, text } from "./lists.js";

function openLine(book) {
  const found = findChapter(book.id, book.progress);
  if (!found) return bookLink(book);
  return bookLink(book) + " · <a href=\"" + text(found.chapter.href) + "\">" + text(found.chapter.title) + "</a>";
}

export function readingPage() {
  const desk = readingDesk();
  const reading = desk.reading.map(function (book) {
    return "<li>" + openLine(book) + " · " + text(book.reading) + "</li>";
  }).join("\n");
  const lent = desk.lent.map(function (book) {
    const due = book.loan ? format(parseISO(book.loan.due), "d MMM yyyy") : "";
    const who = book.loan ? book.loan.to : "";
    return "<li>" + bookLink(book) + " · " + text(who) + " · due " + text(due) + "</li>";
  }).join("\n");
  const body = "<h1>Reading</h1>\n" +
    "<h2>Open on the desk</h2>\n<ul>\n" + (reading || "<li>None.</li>") + "\n</ul>\n" +
    "<h2>Out on loan</h2>\n<ul>\n" + (lent || "<li>None.</li>") + "\n</ul>\n" +
    "<p class=\"fine\">" + text(desk.shelf.length) + " other books are closed on the shelf.</p>";
  return page("Reading", body, "/reading");
}
