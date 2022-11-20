import { run } from "./run.ts";
import type { Logger } from "./types.ts";
import type { FormDefinition } from "../types.ts";
import { ERRORS } from "./errors.ts";

export const updateForm = (
  dbFilename: string,
  log: Logger,
  name: string,
  change: Partial<Omit<FormDefinition, "fields">>,
): Promise<
  { updated: true; form: FormDefinition } | { updated: false; message: string }
> => {
  return run(dbFilename, async ({ db, exec, query }) => {
    log({
      level: "info",
      message: `Updating form ${name}`,
    });

    const forms = await query<
      {
        id: number;
        name: string;
        label: string;
        fields: string;
        deleted_at?: number;
      }
    >`
      SELECT * FROM __forms WHERE name =${name} AND deleted_at IS NULL
    `;

    const _form = forms[0]
      ? { ...forms[0], fields: JSON.parse(forms[0].fields) }
      : undefined;

    if (!_form) {
      log({
        level: "info",
        message: `Form ${name} does not exist`,
      });

      return { updated: false, message: ERRORS.formNotExists };
    }

    const { id, deleted_at: _deleted_at, ...form } = _form;

    if (!change.name && !change.label) {
      log({
        level: "info",
        message: `Nothing to update on ${name}`,
      });

      return { updated: false, message: "Nothing to update", form };
    }

    if (change.name) {
      const existingNames = await query<
        { name: string }
      >`SELECT name FROM __forms WHERE name = ${change.name}`;

      if (existingNames.length) {
        log({
          level: "info",
          message:
            `There is already a form called ${change.name}. Will not update`,
        });

        return { updated: false, message: "Form name is already taken" };
      }

      await db.query(`ALTER TABLE ${name} RENAME TO ${change.name}`);

      log({
        level: "info",
        message: `Renamed table ${name} to ${change.name}`,
        isMutation: true,
      });
    }

    await exec`
      UPDATE __forms
      SET name = ${change.name || form.name}, label = ${
      change.label || form.label
    }
      WHERE id = ${id}
    `;
    log({
      level: "info",
      message: `Updated ${name} in __forms`,
      isMutation: true,
    });

    return {
      updated: true,
      form: {
        ...form,
        label: change.label || form.label,
        name: change.name || form.name,
      },
    };
  });
};
