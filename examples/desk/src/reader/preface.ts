const line = await Promise.resolve("the river was low");

export async function preface(): Promise<string> {
  const loaded = await import("../shared/catalog.json");
  const book = loaded.default ?? loaded;
  return `${line}:${book.volume}`;
}
