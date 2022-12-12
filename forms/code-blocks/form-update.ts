import { parseYaml } from "../deps.ts";
import formHtml from "../html/form.ts";
import { Deps } from "./mod.ts";
import { isRecord, isString } from "../deps.ts";
import { sanitizeValue } from "../sanitize/mod.ts";
import { Field } from "../types.ts";

export const formUpdate = async (
  { db, formBaseUrl }: Deps,
  content: string,
) => {
  // deno-lint-ignore no-explicit-any
  const data: any = parseYaml(content);

  if (!isString(data.name)) {
    throw new Error('[form-update codeblock]: no form "name"');
  }

  if (!isString(data.id)) {
    throw new Error('[form-update codeblock]: no row "id"');
  }

  const hiddenValues: Record<string, unknown> = isRecord(data.hide)
    ? data.hide
    : {};

  const form = await db.forms.get(data.name);

  if (!form) {
    throw new Error(
      `[form-update codeblock]: form "${data.name}" does not exist`,
    );
  }

  const row = await db.rows.get(data.name, data.id);

  if (!row) {
    throw new Error(`[form-update codeblock]: row "${data.id}" does not exist`);
  }

  // @ts-ignore ?
  const fields: Field[] = form.fields.map((d) => ({
    ...d,
    value: sanitizeValue(d)(row[d.property]),
  }));

  const action = [
    formBaseUrl,
    "/",
    form.name,
    isString(data.redirect)
      ? `?${new URLSearchParams({ redirect: data.redirect }).toString()}`
      : "",
  ].join("");

  return formHtml({
    action,
    fields,
    hiddenValues,
    method: "PUT",
    submitLabel: isString(data.submitLabel) ? data.submitLabel : undefined,
  });
};
