import { parseCsv, parseYaml } from "../deps.ts";

const META_SEPARATOR = "---";

export interface DsvData {
  columns: string[];
  data: Record<string, string>[];
  meta: Record<string, unknown>;
}

const isRecord = (d: any): d is Record<string, unknown> =>
  typeof d === "object" &&
  !Array.isArray(d) &&
  d !== null;

const isString = (d: any): d is string => d && String(d) === d;

const getMeta = (d: string): Record<string, unknown> => {
  try {
    const o = parseYaml(d);
    return isRecord(o) ? o : {};
  } catch {
    return {};
  }
};

export const separateMeta = (
  code: string,
): { meta: Record<string, unknown>; content: string } => {
  const parts = code.split(META_SEPARATOR).map((d) => d.trim());
  if (parts.length === 1) {
    return { meta: {}, content: parts[0] };
  }
  return {
    meta: getMeta(parts[0]),
    content: parts[1],
  };
};

const getDsvData = async (
  d: string,
  separator: string = ",",
): Promise<Record<string, string>[]> => {
  try {
    const json = await parseCsv(d, { skipFirstRow: true, separator });
    return json.map((d) =>
      Object.keys(d).reduce(
        (r, key) => ({ ...r, [key.trim()]: String(d[key]).trim() }),
        {},
      )
    );
  } catch {
    return [];
  }
};

const getColumns = (d: string, separator: string = ",") => {
  const firstRow = d.split("\n")[0];
  return firstRow.split(separator).map((d) => d.trim());
};

export const parseDsv = async (code: string): Promise<DsvData> => {
  const { meta, content } = separateMeta(code);
  const separator = isString(meta.separator) ? meta.separator : undefined;

  return {
    meta,
    data: await getDsvData(content, separator),
    columns: getColumns(content, separator),
  };
};
