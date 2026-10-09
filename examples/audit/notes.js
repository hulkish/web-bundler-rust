import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import slugify from "slugify";

hljs.registerLanguage("javascript", javascript);

const markdown = new MarkdownIt({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return "";
  },
});

export function renderNotes(files) {
  return files.map((text) => {
    const parsed = matter(text);
    const title = String(parsed.data.title);
    return {
      title,
      author: String(parsed.data.author),
      status: String(parsed.data.status),
      slug: slugify(title, { lower: true, strict: true }),
      html: markdown.render(parsed.content),
    };
  });
}
