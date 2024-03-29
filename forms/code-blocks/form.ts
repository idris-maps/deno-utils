import { parseYaml } from "../deps.ts";
import formHtml from "../html/form.ts";
import { Deps } from "./mod.ts";
import { isRecord, isString } from "../deps.ts";

export const form = async ({ db, formBaseUrl }: Deps, content: string) => {
  // deno-lint-ignore no-explicit-any
  const data: any = parseYaml(content);

  if (!isString(data.name)) {
    throw new Error('[form codeblock]: no form "name"');
  }

  const hiddenValues: Record<string, unknown> = isRecord(data.hide)
    ? data.hide
    : {};

  const _form = await db.forms.get(data.name);

  if (!_form) {
    throw new Error(`[form codeblock]: form "${data.name}" does not exist`);
  }

  let action = formBaseUrl + "/" + _form.name;
  if (isString(data.redirect)) action = action + `?redirect=${data.redirect}`;

  return formHtml({
    action,
    fields: _form.fields,
    hiddenValues,
    method: "POST",
    submitLabel: isString(data.submitLabel) ? data.submitLabel : undefined,
  });
};
