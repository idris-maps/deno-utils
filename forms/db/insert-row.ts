import { run } from "./run.ts";
import { castRequest } from "./cast-boolean.ts";
import type { Logger } from "./types.ts";
import type { FormDefinition } from "../types.ts";

export const insertRow = <T extends Record<string, unknown>>(
  dbFilename: string,
  log: Logger,
  form: FormDefinition,
  data: T,
): Promise<
  { inserted: false } | { inserted: true; row: T & { __id: string } }
> =>
  run(dbFilename, async ({ db }) => {
    log({
      level: "info",
      message: `Inserting row to "${form.name}"`,
    });

    try {
      const __id = crypto.randomUUID();

      const sql = [
        `INSERT INTO ${form.name}`,
        `(__id, ${form.fields.map((d) => d.property).join(", ")})`,
        `VALUES (?, ${form.fields.map(() => "?").join(", ")})`,
      ].join(" ");

      const _data = castRequest(form.fields, data);
      const params = [__id, ...form.fields.map((d) => _data[d.property])];

      await db.query(sql, params);

      log({
        level: "info",
        message: `Inserted row in "${form.name}"`,
        isMutation: true,
      });

      return { inserted: true, row: { __id, ...data } };
    } catch (err) {
      log({
        level: "error",
        message: "Could not insert row",
        err,
      });

      return { inserted: false };
    }
  });
