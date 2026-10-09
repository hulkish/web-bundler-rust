import { loadProject } from "./load.js";
import { checkVersions } from "./versions.js";
import { selectEvents } from "./timeline.js";
import { renderNotes } from "./notes.js";
import { countChanges } from "./changes.js";
import { summarizePage } from "./page.js";
import { renderReport } from "./report.js";

export function audit(dir, asOf) {
  const project = loadProject(dir);
  const manifest = project.manifest;
  const date = asOf || manifest.asOf;
  const deps = checkVersions(manifest.dependencies);
  const events = selectEvents(project.events, date, manifest.windowDays);
  const notes = renderNotes(project.notes);
  const changes = countChanges(project.previous, project.current);
  const page = summarizePage(notes);
  return renderReport({
    name: manifest.name,
    asOf: date,
    windowDays: manifest.windowDays,
    deps,
    events,
    notes,
    changes,
    page,
  });
}
