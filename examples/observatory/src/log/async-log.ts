const settled = await Promise.resolve({ nights: 12, seeing: "good" });

export const log = settled;

export async function loadPlateCount(): Promise<number> {
  const loaded = await import("../catalog.json");
  const book = loaded.default ?? loaded;
  return book.nights + settled.nights;
}
