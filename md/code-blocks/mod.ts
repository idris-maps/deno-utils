export { default as charts } from "./charts/mod.ts";
export { default as flowchart } from "./flowchart/mod.ts";
export { default as highlight } from "./highlight/mod.ts";
export { default as math } from "./math/mod.ts";
export { default as music } from "./music/mod.ts";

export type HandleCodeBlock =
  | ((content: string) => Promise<string>)
  | ((content: string) => string);

export interface CodeBlockHandlers {
  [key: string]: HandleCodeBlock;
}
