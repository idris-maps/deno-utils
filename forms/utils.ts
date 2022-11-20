import { isRecord, isUndefined } from "./deps.ts";

// validate strings

export const isAlphaNumLetter = (d: string) =>
  "abcdefghijklmnopqrstuvwxyz0123456789".includes(d);
export const isAlphaNum = (d: string) => Array.from(d).every(isAlphaNumLetter);
export const fitsPattern = (pattern: string, d: string) =>
  new RegExp(pattern).test(d);
export const isDateString = (d: string) => {
  const [yyyy, mm, dd] = d.split("-");
  return Boolean(yyyy) && yyyy.length === 4 &&
    Boolean(mm) && mm.length === 2 &&
    Boolean(dd) && dd.length === 2 &&
    new Date(d).toString() !== "Invalid Date";
};
export const isAlphaNumOrUnderscore = (d: string) =>
  isAlphaNum(d.split("_").join(""));
export const startsWithNum = (d: string) => "0123456789".includes(d[0]);

// validate numbers

export const isMultipleOf = (multiple: number, d: number) => {
  // account for 0.1 + 0.2 = 0.30000000000000004
  const multiplier = Math.pow(
    10,
    (String(multiple).split(".")[1] || "").length || 0,
  );
  return (d * multiplier) % (multiple * multiplier) === 0;
};

// helpers

// deno-lint-ignore no-explicit-any
export const removeUndefined = <T = any>(d: T): T => {
  if (!isRecord(d)) return d;
  // @ts-ignore ?
  return Object.keys(d).reduce(
    (r, key) => isUndefined(d[key]) ? r : { ...r, [key]: d[key] },
    {},
  );
};
