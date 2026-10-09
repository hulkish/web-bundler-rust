import { noteIndex } from "../books/catalog.js";
import { page } from "./layout.js";
import { pageOf, pager, text } from "./lists.js";

export function notesPage(params) {
  const notes = noteIndex();
  const view = pageOf(notes, params);
  const items = view.items.map(function (note) {
    return "<article>\n<h2><a href=\"" + text(note.chapter.href) + "\">" + text(note.chapter.title) + "</a></h2>\n" +
      "<p class=\"meta\"><a href=\"/books/" + text(note.book.id) + "\">" + text(note.book.title) + "</a> · " +
      text(note.book.author) + "</p>\n<p>" + text(note.excerpt) + "</p>\n</article>";
  }).join("\n");
  const body = "<h1>Notes</h1>\n<p class=\"fine\">The first line of every chapter. " + text(notes.length) + " notes.</p>\n" +
    pager(view, "/notes", params) + "\n" + items;
  return page("Notes", body, "/notes");
}
