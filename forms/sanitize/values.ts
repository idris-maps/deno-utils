import type { Field, FieldValue, FieldValues } from "../types.ts";
import { isCheckboxField, isNumericField, isStringField } from "../types.ts";
import { isRecord } from "../deps.ts";

export const sanitizeValue = (field: Field) => (value: unknown): FieldValue => {
  if (isStringField(field)) {
    return value ? String(value) : field.value;
  }

  if (isNumericField(field)) {
    return value ? Number(value) : field.value;
  }

  if (isCheckboxField(field)) {
    return ["true", "on", "1"].includes(String(value));
  }

  if (!value && field.value) {
    return field.value;
  }

  return String(value);
};

export const sanitizeValues =
  (fields: Field[]) => (values: unknown): FieldValues => {
    const vals = isRecord(values) ? values : {};
    return fields.reduce((r, field) => ({
      ...r,
      [field.property]: sanitizeValue(field)(vals[field.property]),
    }), {});
  };
