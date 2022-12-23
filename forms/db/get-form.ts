import { run } from "./run.ts";
import type { Logger } from "./types.ts";
import type { FormDefinition } from "../types.ts";

export const getForm = (
  dbFilename: string,
  log: Logger,
  name: string,
): Promise<FormDefinition | undefined> => {
  return run(dbFilename, log, async ({ query }) => {
    log({
      level: "info",
      message: `Getting form "${name}"`,
    });

    const forms = await query<{ name: string; label: string; fields: string }>`
    SELECT id, name, label, fields FROM __forms WHERE name = ${name} AND deleted_at IS NULL
  `;

    const form = forms[0];

    if (!form) {
      log({
        level: "info",
        message: `Form "${name}" does not exist`,
      });

      return undefined;
    }

    return {
      ...form,
      fields: JSON.parse(form.fields),
    };
  });
};
