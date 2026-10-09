import chalk from "chalk";

export function renderReport(model) {
  const satisfied = model.deps.filter((dep) => dep.ok).length;
  const lines = [
    chalk.bold(model.name),
    "as of " + model.events.label,
    "window " + model.windowDays + "d",
    "deps " + satisfied + "/" + model.deps.length,
  ];
  for (const dep of model.deps) {
    const detail = dep.name + " " + dep.installed + " " + dep.wanted;
    if (dep.ok) {
      lines.push(chalk.green("ok " + detail));
    } else {
      lines.push(chalk.red("fail " + detail + " need " + dep.need));
    }
  }
  lines.push("events " + model.events.shown.length + "/" + model.events.total);
  for (const event of model.events.shown) {
    lines.push(event.date + " " + event.title + " " + event.kind + " " + event.days + "d");
  }
  lines.push("notes " + model.notes.length);
  for (const note of model.notes) {
    lines.push(note.slug + " | " + note.author + " | " + note.status);
  }
  lines.push("diff +" + model.changes.added + " -" + model.changes.removed);
  lines.push("page articles " + model.page.articles);
  lines.push("page titles " + model.page.titles.join(", "));
  lines.push("page code " + model.page.code);
  lines.push("page keywords " + model.page.keywords);
  return lines.join("\n") + "\n";
}
