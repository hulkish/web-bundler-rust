import chalk from "chalk";
import { marked } from "marked";
import parseArgs from "minimist";
import ms from "ms";

export function renderRelease(argv) {
  const args = parseArgs(argv, {
    string: ["title", "ago"],
    default: { title: "bundle", ago: "2h" },
  });
  const elapsed = ms(String(args.ago));
  const heading = chalk.bold(args.title);
  const when = chalk.dim(ms(elapsed) + " ago");
  const html = marked.parse("# " + args.title + "\n\nShipped **" + ms(elapsed) + "** ago.");
  return heading + "\n" + when + "\n" + html;
}
