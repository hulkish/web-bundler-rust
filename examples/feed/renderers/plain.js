export function render(feed) {
  return feed.pages.map(function (page) {
    return page.slug + " | " + page.author + " | " + page.words;
  }).join("\n");
}
