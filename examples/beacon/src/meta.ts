export function metaOk(): string {
  const file = import.meta.filename.endsWith("meta.ts");
  const dir = import.meta.dirname.endsWith("src");
  const url = import.meta.url.includes("meta.ts");
  return file && dir && url ? "yes" : "no";
}
