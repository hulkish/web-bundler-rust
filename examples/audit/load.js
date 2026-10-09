import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";
import Papa from "papaparse";

export function loadProject(dir) {
  const manifest = yaml.safeLoad(readFileSync(join(dir, "manifest.yml"), "utf8"));
  const table = Papa.parse(readFileSync(join(dir, "events.csv"), "utf8"), {
    header: true,
    skipEmptyLines: true,
  });
  const noteDir = join(dir, "notes");
  const notes = readdirSync(noteDir)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => readFileSync(join(noteDir, name), "utf8"));
  return {
    manifest,
    events: table.data,
    notes,
    previous: readFileSync(join(dir, "changelog", "previous.md"), "utf8"),
    current: readFileSync(join(dir, "changelog", "current.md"), "utf8"),
  };
}
