import { castResponse } from "./cast-boolean.ts";
import { QueryParameter } from "../deps.ts";
import type { Filter, FilterValue, ListRowsConfig } from "../types.ts";
import type { FormDefinition } from "../types.ts";

const getLikeValue = (place: "start" | "end" | "contains", value: string) => {
  switch (place) {
    case "contains":
      return `%${value}%`;
    case "end":
      return `%${value}`;
    default:
      return `${value}%`;
  }
};

const getPart = (filter: Filter): [string, FilterValue[]] => {
  const { op, column } = filter;

  switch (op) {
    case "eq":
      return [`${column} = ?`, [filter.value]];
    case "notEq":
      return [`${column} != ?`, [filter.value]];
    case "in":
      return [
        `${column} IN (${filter.values.map(() => "?").join(",")})`,
        filter.values,
      ];
    case "notIn":
      return [
        `${column} NOT IN (${filter.values.map(() => "?").join(",")})`,
        filter.values,
      ];
    case "like":
      return [`${column} LIKE ?`, [
        getLikeValue(filter.place, String(filter.value)),
      ]];
    case "notLike":
      return [`${column} NOT LIKE ?`, [
        getLikeValue(filter.place, String(filter.value)),
      ]];
    case "lt":
      return [`${column} < ?`, [filter.value]];
    case "lte":
      return [`${column} <= ?`, [filter.value]];
    case "gt":
      return [`${column} > ?`, [filter.value]];
    case "gte":
      return [`${column} >= ?`, [filter.value]];
    default:
      return ["", []];
  }
};

import { run } from "./run.ts";
import type { Logger } from "./types.ts";

export const listRows = <T extends Record<string, unknown>>(
  dbFilename: string,
  log: Logger,
  form: FormDefinition,
  config: ListRowsConfig = {},
): Promise<T[] | undefined> =>
  run(dbFilename, async ({ db }) => {
    log({
      level: "info",
      message: `Listing rows of "${form.name}", config: ${
        JSON.stringify(config)
      }`,
    });

    try {
      const filters = config.filters
        ? config.filters.map(getPart).filter((d) => d[0] !== "")
        : [];
      const sort = config.sort
        ? `ORDER BY ${config.sort.column} ${config.sort.desc ? "DESC" : "ASC"}`
        : "";
      const limit = config.limit ? `LIMIT ${config.limit}` : "";
      const offset = config.offset ? `OFFSET ${config.offset}` : "";

      const sql = [
        `SELECT * FROM ${form.name}`,
        filters.length ? "WHERE" : "",
        filters.map((d) => d[0]).join(" AND "),
        sort,
        limit,
        offset,
      ].filter((d) => d !== "").join(" ");

      const values = filters
        .map((d) => d[1])
        .reduce((r, d) => [...r, ...d], []);

      const rows = await db.queryEntries<Record<string, QueryParameter>>(
        sql,
        values,
      );

      return rows
        ? rows.map((row) => castResponse<T>(form.fields, row))
        : undefined;
    } catch (err) {
      log({
        level: "error",
        message: `Could not list rows from "${form.name}"`,
        error: err,
      });

      return undefined;
    }
  });
