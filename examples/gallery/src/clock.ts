const clock = await Promise.resolve("dusk");

export const when = clock;

export function unusedClock(): string {
  return "GALLERY_UNUSED_CLOCK";
}
