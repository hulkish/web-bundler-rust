// Project audit over a fixture directory.
// commander reads the flags. The rest of the graph pulls in js-yaml,
// papaparse, gray-matter, date-fns, semver, diff, markdown-it,
// highlight.js, slugify, cheerio, and chalk, including their dependencies.
import { Command } from "commander";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { audit } from "./audit.js";

const root = dirname(fileURLToPath(import.meta.url));
const program = new Command();
program
  .name("audit")
  .argument("[dir]", "fixture directory", join(root, "fixtures"))
  .option("--as-of <date>", "measure events from this YYYY-MM-DD date")
  .parse(process.argv);

const opts = program.opts();
process.stdout.write(audit(program.processedArgs[0], opts.asOf));
