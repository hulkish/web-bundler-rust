export function render(feed) {
  return feed.pages.map(function (page) {
    return [
      "<article id=\"" + page.slug + "\">",
      "<h1>" + page.title + "</h1>",
      "<p class=\"by\">" + page.author + "</p>",
      page.html,
      "<p class=\"meta\">" + page.words + " words</p>",
      "</article>",
    ].join("\n");
  }).join("\n");
}
