// Release note built from packages installed in node_modules.
// minimist reads the flags, ms formats the age, chalk colors the heading,
// and marked renders the body. Their dependencies are bundled too.
import { renderRelease } from "./render.js";

process.stdout.write(renderRelease(process.argv.slice(2)));
