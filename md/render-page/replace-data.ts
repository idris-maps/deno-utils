import type { AnyIterable } from "./deps.ts";

interface ReplacePart {
  type: "data" | "text";
  value: string;
}

export interface ReplaceData {
  [key: string]:
    | string
    | number
    | boolean
    | (string | number | boolean)[]
    | ReplaceData;
}

const getPath = (path: string[], obj?: Record<string, unknown>): unknown => {
  const [first, ...rest] = path;
  if (!first) return obj;
  if (!obj || !obj[first]) return undefined;
  // @ts-ignore ?
  return getPath(rest, obj[first]);
};

const replaceValue = (data: ReplaceData) => (part: ReplacePart): string => {
  if (part.type === "text") return part.value;
  const [_path, _defaultValue] = part.value.split("|").map((d) => d.trim());
  const path = _path.trim().split(".");
  const defaultValue = _defaultValue && _defaultValue !== ""
    ? _defaultValue
    : `{{${_path}}}`;
  // @ts-ignore ?
  return getPath(path, data) || defaultValue;
};

const replaceValues = (data: ReplaceData, line: string) => {
  const _parts = line.split("{{");
  if (_parts.length === 1) return line;
  const parts = _parts.reduce((r: ReplacePart[], d: string): ReplacePart[] => {
    const _ = d.split("}}");
    if (_.length === 1) return [...r, { type: "text", value: _[0] || "" }];
    return [...r, { type: "data", value: _[0] }, {
      type: "text",
      value: _[1] || "",
    }];
  }, []);
  return parts.map(replaceValue(data)).join("");
};

export const replaceData = (data: ReplaceData) => {
  return async function* (lines: AnyIterable<string>) {
    for await (const line of lines) {
      yield replaceValues(data, line);
    }
  };
};
