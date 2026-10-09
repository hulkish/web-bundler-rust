import { diffLines } from "diff";

export function countChanges(previous, current) {
  let added = 0;
  let removed = 0;
  for (const part of diffLines(previous, current)) {
    const lines = part.value.split("\n");
    let count = lines.length;
    if (count > 0 && lines[count - 1] === "") count--;
    if (part.added) added += count;
    if (part.removed) removed += count;
  }
  return { added, removed };
}
