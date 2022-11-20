import type { FormDefinition } from "../types.ts";
import { is, isRecord, isString, isUndefined } from "../deps.ts";
import { onError } from "./errors.ts";
import { isFields } from "./fields.ts";
import { isTableName } from "./table-name.ts";

export const isForm = is<FormDefinition>((form) => {
  const f = isRecord(form) ? form : {};

  if (!isTableName(f.name) || !isFields(f.fields)) {
    return false;
  }

  if (!isUndefined(f.label) && !isString(f.label)) {
    return onError("label must be a string");
  }

  return true;
});
