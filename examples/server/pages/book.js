import format from "date-fns/format/index.js";
import parseISO from "date-fns/parseISO/index.js";
import { findChapter, relatedBooks, statusLabel } from "../books/catalog.js";
import { page } from "./layout.js";
import { authorLink, bookLink, metaLine, shelfLink, statusPill, tagLinks, text } from "./lists.js";

export function bookPage(book) {
  const chapters = book.chapters.map(function (chapter) {
    const open = book.progress === chapter.id ? " · open" : "";
    return "<li><a href=\"" + text(chapter.href) + "\">" + text(chapter.title) + "</a>" + text(open) + "</li>";
  }).join("\n");
  const related = relatedBooks(book).map(function (other) {
    return "<li>" + bookLink(other) + " · " + text(other.author) + "</li>";
  }).join("\n");
  let loan = "";
  if (book.loan) {
    loan = "<p class=\"fine\">Lent to " + text(book.loan.to) + ", due " +
      text(format(parseISO(book.loan.due), "d MMM yyyy")) + ".</p>";
  }
  const progress = book.progress ? findChapter(book.id, book.progress) : null;
  const desk = progress
    ? "<p class=\"fine\">The desk is open at <a href=\"" + text(progress.chapter.href) + "\">" + text(progress.chapter.title) + "</a>.</p>"
    : "";
  const series = book.seriesName
    ? "<p>Series <a href=\"/series/" + text(book.seriesSlug) + "\">" + text(book.seriesName) + "</a>, volume " + text(book.seriesIndex) + ".</p>"
    : "";
  const body = "<h1>" + text(book.title) + "</h1>\n" +
    metaLine(book) + "\n" +
    "<p>" + statusPill(book) + " " + text(statusLabel(book.status)) + " · " + text(book.daysOnShelf) + " days since the spine date.</p>\n" +
    loan + desk + series +
    "<p class=\"tags\">" + shelfLink(book) + " · " + authorLink(book) + " · " + tagLinks(book.tags) + "</p>\n" +
    "<div class=\"blurb\">" + book.html + "</div>\n" +
    "<h2>Chapters</h2>\n<ol class=\"chapters\">\n" + chapters + "\n</ol>\n" +
    "<h2>Related</h2>\n<ul>\n" + (related || "<li>None listed.</li>") + "\n</ul>\n" +
    "<p><a href=\"/api/books/" + text(book.id) + "\">JSON</a> · <a href=\"/compare?a=" + text(book.id) + "\">Compare</a></p>";
  return page(book.title, body, "");
}

export function chapterPage(found) {
  const book = found.book;
  const chapter = found.chapter;
  const previous = found.index > 0 ? book.chapters[found.index - 1] : null;
  const next = found.index + 1 < book.chapters.length ? book.chapters[found.index + 1] : null;
  const trail = "<p class=\"fine\"><a href=\"/books/" + text(book.id) + "\">" + text(book.title) + "</a> · chapter " +
    text(found.index + 1) + " of " + text(book.chapters.length) + "</p>";
  const pager = "<p>" +
    (previous ? "<a href=\"" + text(previous.href) + "\">" + text(previous.title) + "</a>" : "Start") +
    " · " +
    (next ? "<a href=\"" + text(next.href) + "\">" + text(next.title) + "</a>" : "End") +
    "</p>";
  const body = trail + "\n<h1>" + text(chapter.title) + "</h1>\n" +
    "<div class=\"chapter\">" + chapter.html + "</div>\n" + pager;
  return page(chapter.title + " · " + book.title, body, "");
}
