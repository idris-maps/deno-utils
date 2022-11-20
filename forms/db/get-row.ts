import { run } from "./run.ts";
import type { Logger } from "./types.ts";
import type { QueryParameter } from "../deps.ts";
import type { FormDefinition } from "../types.ts";
import { castResponse } from "./cast-boolean.ts";

export const getRow = <T extends Record<string, unknown>>(
  dbFilename: string,
  log: Logger,
  form: FormDefinition,
  id: string,
): Promise<T | undefined> =>
  run(dbFilename, async ({ db }) => {
    log({
      level: "info",
      message: `Getting row ${id} from "${form.name}"`,
    });

    try {
      const rows = await db.queryEntries<Record<string, QueryParameter>>(
        `SELECT * FROM ${form.name} WHERE __id = ? LIMIT 1`,
        [id],
      );
      return castResponse<T>(form.fields, rows[0]);
    } catch (err) {
      log({
        level: "error",
        message: `Could not get row ${id} from "${form.name}"`,
        error: err,
      });
    }
  });
