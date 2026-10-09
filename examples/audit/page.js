import { load } from "cheerio/slim";

export function summarizePage(notes) {
  const $ = load("<main></main>");
  for (const note of notes) {
    const article = $("<article></article>").attr("id", note.slug);
    article.append($("<h1></h1>").text(note.title));
    article.append(note.html);
    $("main").append(article);
  }
  return {
    articles: $("article").length,
    titles: $("article > h1")
      .map((_, el) => $(el).text())
      .get(),
    code: $("pre code").text().trim(),
    keywords: $("pre code .hljs-keyword").length,
  };
}
