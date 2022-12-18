import { run } from "./run.ts";
import type { Logger } from "./types.ts";
import type { FormDefinition } from "../types.ts";

export const listForms = (
  dbFilename: string,
  log: Logger,
): Promise<FormDefinition[]> => {
  return run(dbFilename, log, async ({ query }) => {
    log({
      level: "info",
      message: "List forms",
    });

    const forms = await query<{ name: string; label: string; fields: string }>`
      SELECT name, label, fields FROM __forms WHERE deleted_at IS NULL
    `;

    return forms.map((d) => ({ ...d, fields: JSON.parse(d.fields) }));
  });
};
