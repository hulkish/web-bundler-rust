import posts from "../content/posts.json";
import authors from "../content/authors.json";
import { slugify } from "slug";
import { renderBlocks, plainText } from "./markdown/index.js";

const stats = require("./stats.cjs");

export function buildFeed(sourceLabel) {
  const pages = posts.map(function (post) {
    const text = plainText(post.body);
    return {
      title: post.title,
      slug: slugify(post.title),
      author: authors[post.author],
      html: renderBlocks(post.body),
      words: stats.countWords(text),
    };
  });
  return { source: sourceLabel, pages: pages };
}
