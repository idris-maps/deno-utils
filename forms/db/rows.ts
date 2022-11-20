import type { Logger } from "./types.ts";
import type { FormDb } from "./forms.ts";
import type { ListRowsConfig } from "../types.ts";
import { dropRow } from "./drop-row.ts";
import { getRow } from "./get-row.ts";
import { insertRow } from "./insert-row.ts";
import { listRows } from "./list-rows.ts";
import { updateRow } from "./update-row.ts";
import { logger } from "./log.ts";

export interface RowDb {
  drop: (
    formName: string,
    id: string,
    log?: Logger,
  ) => Promise<{ dropped: boolean }>;
  get: <T extends Record<string, unknown>>(
    formName: string,
    id: string,
    log?: Logger,
  ) => Promise<T | undefined>;
  insert: <T extends Record<string, unknown>>(
    formName: string,
    data: T,
    log?: Logger,
  ) => Promise<
    { inserted: false } | { inserted: true; row: T & { __id: string } }
  >;
  list: <T extends Record<string, unknown>>(
    formName: string,
    config?: ListRowsConfig,
    log?: Logger,
  ) => Promise<T[] | undefined>;
  update: <T extends Record<string, unknown>>(
    formName: string,
    id: string,
    change: Partial<T>,
    log?: Logger,
  ) => Promise<
    { updated: false } | { updated: true; data: T & { __id: string } }
  >;
}

export const initRows = (
  dbFilename: string,
  forms: FormDb,
  _log?: Logger,
): RowDb => ({
  drop: (formName, id, log) =>
    dropRow(dbFilename, logger(log, _log), formName, id),
  get: async <T extends Record<string, unknown>>(
    formName: string,
    id: string,
    log?: Logger,
  ) => {
    const form = await forms.get(formName);
    if (!form) return undefined;
    return getRow<T>(dbFilename, logger(log, _log), form, id);
  },
  insert: async (formName, data, log) => {
    const form = await forms.get(formName);
    if (!form) return { inserted: false };
    return insertRow(dbFilename, logger(log, _log), form, data);
  },
  list: async (formName, config, log) => {
    const form = await forms.get(formName);
    if (!form) return undefined;
    return listRows(dbFilename, logger(log, _log), form, config);
  },
  update: async (formName, id, change, log) => {
    const form = await forms.get(formName);
    if (!form) return { updated: false };
    return updateRow(dbFilename, logger(log, _log), form, id, change);
  },
});
