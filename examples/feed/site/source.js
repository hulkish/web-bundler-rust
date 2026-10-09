import { basename } from "path";
import { fileURLToPath } from "url";

export function sourceLabel() {
  return basename(fileURLToPath(import.meta.url));
}
