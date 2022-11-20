import { QueryParameter } from "../deps.ts";
import type { Field } from "../types.ts";

export const castResponse = <T extends Record<string, unknown>>(
  fields: Field[],
  values: Record<string, QueryParameter>,
): T => {
  if (!values) return values;

  const booleanFields = fields.filter((d) => d.type === "checkbox");

  /** @ts-ignore */
  if (!booleanFields.length) return values;

  const booleanFieldsInValues = booleanFields.filter((d) =>
    Object.keys(values).includes(d.property)
  );

  /** @ts-ignore */
  return booleanFieldsInValues.reduce((r, { property }) => ({
    ...r,
    [property]: r[property] === 1,
  }), values);
};

export const castRequest = <T extends Record<string, unknown>>(
  fields: Field[],
  values: T,
): Record<string, QueryParameter> => {
  const booleanFields = fields.filter((d) => d.type === "checkbox");

  /** @ts-ignore */
  if (!booleanFields.length) return values;

  const booleanFieldsInValues = booleanFields.filter((d) =>
    Object.keys(values).includes(d.property)
  );

  /** @ts-ignore */
  return booleanFieldsInValues.reduce((r, { property }) => ({
    ...r,
    [property]: r[property] ? 1 : 0,
  }), values);
};
