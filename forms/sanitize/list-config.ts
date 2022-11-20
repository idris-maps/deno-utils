import { sanitizeFilters } from "./filtering.ts";
import { Field, ListRowsConfig, Sort } from "../types.ts";

const sanitizeSort = (
  fields: Field[],
  query: Record<string, string>,
): Sort | undefined => {
  if (!query.sort) return undefined;
  const [column, desc] = query.sort.split(".");

  const exists = Boolean(fields.find((d) => d.property === column));

  return exists ? { column, desc: desc === "desc" } : undefined;
};

const intOrUndefined = (
  key: string,
  query: Record<string, string>,
): number | undefined => {
  const value = query[key];
  if (value && Number.isInteger(Number(value))) return Number(value);
  return undefined;
};

export const sanitizeListConfig = (
  fields: Field[],
  query: Record<string, string>,
): ListRowsConfig => {
  return {
    filters: sanitizeFilters(fields)(query),
    sort: sanitizeSort(fields, query),
    limit: intOrUndefined("limit", query),
    offset: intOrUndefined("offset", query),
  };
};
