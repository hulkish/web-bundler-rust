import { compareBooks } from "../books/catalog.js";
import { page } from "./layout.js";
import { bookLink, text } from "./lists.js";

function row(label, left, right) {
  return "<tr><th>" + text(label) + "</th><td>" + left + "</td><td>" + right + "</td></tr>";
}

export function comparePage(params) {
  const leftId = params.get("a") || "";
  const rightId = params.get("b") || "";
  const form = "<form action=\"/compare\" method=\"get\">\n" +
    "<input name=\"a\" value=\"" + text(leftId) + "\" placeholder=\"First book id\" aria-label=\"First book id\">\n" +
    "<input name=\"b\" value=\"" + text(rightId) + "\" placeholder=\"Second book id\" aria-label=\"Second book id\">\n" +
    "<button type=\"submit\">Compare</button>\n</form>\n" +
    "<p class=\"fine\">Use the id from a book page, such as <code>packing</code> and <code>leaf-0001</code>.</p>";
  let result = "<p class=\"fine\">Choose two different books.</p>";
  if (leftId && rightId) {
    const compared = compareBooks(leftId, rightId);
    if (!compared) {
      result = "<p>Those two ids are not a pair on this shelf.</p>";
    } else {
      const left = compared.left;
      const right = compared.right;
      const notes = [];
      if (compared.sameAuthor) notes.push("same author");
      if (compared.sameShelf) notes.push("same stack");
      if (compared.sameSeries) notes.push("same series");
      if (compared.sharedTags.length) notes.push("shared tags: " + compared.sharedTags.join(", "));
      if (!notes.length) notes.push("no shared author, stack, series, or tag");
      result = "<table>\n" +
        row("Title", bookLink(left), bookLink(right)) + "\n" +
        row("Author", text(left.author), text(right.author)) + "\n" +
        row("Stack", text(left.shelfTitle), text(right.shelfTitle)) + "\n" +
        row("Pages", text(left.pages), text(right.pages)) + "\n" +
        row("Spine date", text(left.publishedLabel), text(right.publishedLabel)) + "\n" +
        row("Reading time", text(left.reading), text(right.reading)) + "\n" +
        row("Chapters", text(left.chapters.length), text(right.chapters.length)) + "\n" +
        row("Status", text(left.status), text(right.status)) + "\n" +
        "</table>\n<p>" + text(notes.join(" · ")) + ". Page gap " + text(compared.pageGap) +
        ". Spine dates differ by " + text(compared.dayGap) + " days.</p>\n" +
        "<p><a href=\"/api/compare?a=" + text(left.id) + "&amp;b=" + text(right.id) + "\">JSON</a></p>";
    }
  }
  const body = "<h1>Compare</h1>\n" + form + "\n" + result;
  return page("Compare", body, "/compare");
}
