export { parse as parseYAML } from "https://deno.land/std@0.158.0/encoding/yaml.ts";

export type { AnyIterable } from "../../iterable/mod.ts";
export { map, pipe, toArray } from "../../iterable/mod.ts";
export {
  is,
  isArrayOf,
  isArrayOfStrings,
  isRecord,
  isString,
} from "../../is/mod.ts";
