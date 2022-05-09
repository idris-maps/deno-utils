import { parseCsv, parseYaml } from "./deps.ts";

const META_SEPARATOR = "---";

export interface ChartData {
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

const getData = async (
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

export const parseData = async (content: string): Promise<ChartData> => {
  const parts = content.split(META_SEPARATOR).map((d) => d.trim());
  if (parts.length === 1) {
    return {
      columns: getColumns(parts[0]),
      meta: {},
      data: await getData(parts[0]),
    };
  }
  const meta = getMeta(parts[0]);
  const separator = isString(meta.separator) ? meta.separator : undefined;

  return {
    columns: getColumns(parts[1], separator),
    data: await getData(parts[1], separator),
    meta,
  };
};
