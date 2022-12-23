import type { Logger } from "./types.ts";
import type { FormDb } from "./forms.ts";
import type { RowDb } from "./rows.ts";
import { initForms } from "./forms.ts";
import { initRows } from "./rows.ts";
import { run } from "./run.ts";
import { QueryParameter } from "../deps.ts";
import { logger } from "./log.ts";

export { ERRORS } from "./errors.ts";

export interface FormsDb {
  forms: FormDb;
  rows: RowDb;
  sql: <T = unknown>(
    stmt: TemplateStringsArray,
    ...args: QueryParameter[]
  ) => Promise<T[]>;
}

export const initDb = async (
  dbFilename: string,
  { logger: _log, cacheForms }: { logger?: Logger; cacheForms?: boolean } = {},
): Promise<FormsDb> => {
  const log = logger(_log);
  const forms = await initForms(dbFilename, log, cacheForms);
  const rows = await initRows(dbFilename, forms, log);

  return {
    forms,
    rows,
    sql: <T = unknown>(
      stmt: TemplateStringsArray,
      ...args: QueryParameter[]
    ) =>
      run(dbFilename, log, ({ query }) => {
        return query<T>(stmt, ...args);
      }),
  };
};
