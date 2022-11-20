import { run } from "./run.ts";
import type { Logger } from "./types.ts";

export const createFormsTable = (dbFilename: string, log: Logger) => {
  return run(dbFilename, async ({ exec, query }) => {
    log({
      level: "info",
      message: "Start creating __forms table",
    });

    const exists = await query<{ name: string }>`
      SELECT name
      FROM sqlite_schema
      WHERE type = 'table'
      AND name = '__forms'
    `;

    if (!exists.length) {
      await exec`
        CREATE TABLE IF NOT EXISTS __forms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          label TEXT,
          fields TEXT,
          deleted_at INT
        )
      `;

      log({
        level: "info",
        message: "Created __forms table",
        isMutation: true,
      });

      await exec`
        CREATE UNIQUE INDEX idx_forms_name
        ON __forms (name)
      `;

      log({
        level: "info",
        message: "Created idx_forms_name index",
        isMutation: true,
      });

      return;
    }

    log({
      level: "info",
      message: "Table __forms already exists",
    });
  });
};
