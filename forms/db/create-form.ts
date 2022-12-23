import type { Logger } from "./types.ts";
import type { Field, FormDefinition } from "../types.ts";
import { run } from "./run.ts";
import { getFormId } from "./get-form-id.ts";
import { ERRORS } from "./errors.ts";

interface Column {
  name: string;
  type: string;
}

const getColumn = (field: Field): Column => {
  if (["number", "range"].includes(field.type)) {
    return { name: field.property, type: "REAL" };
  }
  return { name: field.property, type: "TEXT" };
};

const getColumns = (fields: Field[]) => fields.map(getColumn);

const createTableQuery = (name: string, fields: Field[]) =>
  [
    `CREATE TABLE IF NOT EXISTS ${name} (`,
    [
      "__id TEXT PRIMARY KEY",
      ...getColumns(fields).map((d) => d.name + " " + d.type),
    ].join(",\n"),
    ")",
  ].join("\n");

export const createForm = (
  dbFilename: string,
  log: Logger,
  form: FormDefinition,
): Promise<{ created: true } | { created: false; message: string }> => {
  log({
    level: "info",
    message: `Start creating form table "${form.name}"`,
  });

  return run(dbFilename, log, async ({ db, exec, query }) => {
    const exists = await getFormId(query, form.name);

    if (exists) {
      log({
        level: "info",
        message: `Can not create form table "${form.name}", already exists`,
      });
      return { created: false, message: ERRORS.formExists };
    }

    await exec`
      INSERT INTO __forms (name, label, fields)
      VALUES (${form.name}, ${form.label || form.name}, ${
      JSON.stringify(form.fields)
    })
    `;

    log({
      level: "info",
      message: `Added form "${form.name}" to __forms`,
      isMutation: true,
    });

    await db.query(createTableQuery(form.name, form.fields));

    log({
      level: "info",
      message: `Create table for "${form.name}"`,
      isMutation: true,
    });

    return { created: true };
  });
};
