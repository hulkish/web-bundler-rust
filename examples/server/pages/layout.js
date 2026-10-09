import escapeHtml from "escape-html";

const NAV = [
  ["/", "Shelf"],
  ["/authors", "Authors"],
  ["/shelves", "Stacks"],
  ["/series", "Series"],
  ["/timeline", "Timeline"],
  ["/reading", "Reading"],
  ["/compare", "Compare"],
  ["/notes", "Notes"],
  ["/map", "Map"],
  ["/about", "About"],
];

function nav(current) {
  return "<nav>\n" + NAV.map(function (item) {
    const href = item[0];
    const label = item[1];
    const here = current === href ? " aria-current=\"page\"" : "";
    return "<a href=\"" + href + "\"" + here + ">" + escapeHtml(label) + "</a>";
  }).join("\n") + "\n</nav>";
}

export function page(title, body, current) {
  return "<!DOCTYPE html>\n" +
    "<html lang=\"en\">\n" +
    "<head>\n" +
    "<meta charset=\"utf-8\">\n" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
    "<title>" + escapeHtml(title) + "</title>\n" +
    "<style>\n" +
    "body { font: 18px/1.5 Georgia, serif; margin: 0 auto; max-width: 46rem; padding: 1.5rem 1.25rem 3rem; color: #1c1917; background: #f6f1e8; }\n" +
    "a { color: #9a3412; }\n" +
    "header { margin-bottom: 1rem; }\n" +
    "header .mark { font-variant: small-caps; letter-spacing: 0.08em; text-decoration: none; color: #44403c; font-size: 1.15rem; }\n" +
    "nav { display: flex; flex-wrap: wrap; gap: 0.35rem 0.75rem; margin: 0.75rem 0 1.25rem; }\n" +
    "nav a { text-decoration: none; color: #44403c; border-bottom: 1px solid transparent; }\n" +
    "nav a[aria-current=\"page\"] { color: #9a3412; border-bottom-color: #9a3412; }\n" +
    "form { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0 1.5rem; }\n" +
    "input, select { font: inherit; padding: 0.35rem 0.5rem; border: 1px solid #d6d3d1; background: #fff; }\n" +
    "input[name=\"q\"] { flex: 1; min-width: 12rem; }\n" +
    "button { font: inherit; padding: 0.35rem 0.75rem; background: #1c1917; color: #faf7f2; border: 0; }\n" +
    "article { margin: 0 0 1.4rem; padding-bottom: 0.4rem; border-bottom: 1px solid #e7e5e4; }\n" +
    ".meta, .slug, .fine { color: #57534e; }\n" +
    ".slug { font: 0.85rem/1.4 ui-monospace, monospace; margin-top: -0.4rem; }\n" +
    ".blurb p, .chapter p { margin: 0.4rem 0 0; }\n" +
    ".stats { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; margin: 0 0 1rem; padding: 0.75rem 0; border-top: 1px solid #e7e5e4; border-bottom: 1px solid #e7e5e4; }\n" +
    ".stats span { font-size: 0.95rem; }\n" +
    ".stats strong { font-weight: 600; }\n" +
    ".tags a, .pills a { margin-right: 0.45rem; }\n" +
    ".status { display: inline-block; font: 0.75rem/1.2 ui-monospace, monospace; letter-spacing: 0.03em; padding: 0.1rem 0.35rem; background: #fff; border: 1px solid #d6d3d1; }\n" +
    ".status-reading { border-color: #9a3412; color: #9a3412; }\n" +
    ".status-lent { border-color: #1d4ed8; color: #1e3a8a; }\n" +
    "table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.95rem; }\n" +
    "th, td { text-align: left; vertical-align: top; padding: 0.35rem 0.5rem; border-bottom: 1px solid #e7e5e4; }\n" +
    "th { color: #57534e; font-weight: 600; }\n" +
    "code { font-family: ui-monospace, monospace; font-size: 0.9em; background: #fff; padding: 0.05rem 0.25rem; }\n" +
    "ol.chapters { padding-left: 1.2rem; }\n" +
    ".pager { margin: 1rem 0 1.4rem; }\n" +
    ".pager a { margin: 0 0.35rem; }\n" +
    "footer { margin-top: 2rem; color: #57534e; font-size: 0.9rem; }\n" +
    "</style>\n" +
    "</head>\n" +
    "<body>\n" +
    "<header><a class=\"mark\" href=\"/\">Shelf</a>\n" + nav(current || "") + "</header>\n" +
    "<main>\n" + body + "</main>\n" +
    "<footer><a href=\"/api\">JSON catalog</a> · sample books, not a public record</footer>\n" +
    "</body>\n</html>\n";
}
