import { renderInline } from "./inline.js";

function parse(src) {
  const blocks = [];
  let paragraph = [];

  function flush() {
    if (paragraph.length === 0) {
      return;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  }

  const lines = String(src).split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      blocks.push({
        type: "heading",
        level: heading[1].length,
        text: heading[2],
      });
      continue;
    }
    if (line.trim() === "") {
      flush();
      continue;
    }
    paragraph.push(line.trim());
  }
  flush();
  return blocks;
}

export function renderBlocks(src) {
  return parse(src).map(function (block) {
    if (block.type === "heading") {
      const tag = "h" + (block.level + 1);
      return "<" + tag + ">" + renderInline(block.text) + "</" + tag + ">";
    }
    return "<p>" + renderInline(block.text) + "</p>";
  }).join("\n");
}

export function plainText(src) {
  return parse(src).map(function (block) {
    return block.text.replace(/\*\*/g, "").replace(/`/g, "");
  }).join(" ");
}
