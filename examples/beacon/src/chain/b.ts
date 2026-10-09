import { depth } from "./a.ts";

const extra = await Promise.resolve(depth + 1);

export const depthB = extra;
