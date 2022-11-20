import { run } from "./run.ts";
import type { Logger } from "./types.ts";
import type { FormDefinition } from "../types.ts";
import { castRequest } from "./cast-boolean.ts";

export const updateRow = <T extends Record<string, unknown>>(
  dbFilename: string,
  log: Logger,
  form: FormDefinition,
  id: string,
  data: Partial<T>,
): Promise<
  { updated: false } | { updated: true; data: T & { __id: string } }
> =>
  run(dbFilename, async ({ db }) => {
    log({
      level: "info",
      message: `Updating row ${id} of "${form.name}"`,
      data,
    });

    try {
      const rows = await db.queryEntries<T & { id: number }>(
        `SELECT * FROM ${form.name} WHERE __id = ?`,
        [id],
      );

      if (!rows.length) {
        log({
          level: "info",
          message: `Could not update row ${id} of "${form.name}"`,
        });

        return { updated: false };
      }

      const fieldsToUpdate = Object.keys(data);

      const sql = [
        `UPDATE ${form.name} SET`,
        fieldsToUpdate.map((d) => `${d} = ?`).join(", "),
        "WHERE __id = ?",
      ].join(" ");

      const _data = castRequest(form.fields, data);
      const values = [
        ...fieldsToUpdate.map((key) => _data[key]),
        id,
      ];

      await db.query(sql, values);

      log({
        level: "info",
        message: `Updated row ${id} of "${form.name}"`,
        isMutation: true,
      });

      return {
        updated: true,
        data: { ...rows[0], ...data, __id: id },
      };
    } catch (err) {
      log({
        level: "error",
        message: `Could not update row ${id} of "${form.name}"`,
        error: err,
      });

      return { updated: false };
    }
  });
