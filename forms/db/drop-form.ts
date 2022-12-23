import { run } from "./run.ts";
import { getFormId } from "./get-form-id.ts";
import type { Logger } from "./types.ts";
import { ERRORS } from "./errors.ts";

export const dropForm = (
  dbFilename: string,
  log: Logger,
  name: string,
): Promise<{ dropped: true } | { dropped: false; message: string }> => {
  return run(dbFilename, log, async ({ db, exec, query }) => {
    log({
      level: "info",
      message: `Deleting form "${name}"`,
    });

    const id = await getFormId(query, name);

    if (!id) {
      return { dropped: false, message: ERRORS.formNotExists };
    }

    const now = new Date().getTime();
    const formName = `__deleted_${now}_${name}`;

    await exec`
      UPDATE __forms
      SET name = ${formName}, deleted_at = ${now}
      WHERE id = ${id}
    `;

    log({
      level: "info",
      message: `Soft deleted ${name} from __forms, is now ${formName}`,
      isMutation: true,
    });

    await db.query(`ALTER TABLE ${name} RENAME TO ${formName}`);

    log({
      level: "info",
      message: `Soft deleted ${name} table, is now ${formName}`,
      isMutation: true,
    });

    return { dropped: true };
  });
};
