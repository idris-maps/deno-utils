// deno-lint-ignore-file no-explicit-any

import { isRecord } from "./deps.ts";
import {
  getValidationErrors,
  throwValidationError,
  throwValidationErrors,
} from "./validator.ts";
import type {
  Is,
  Schema,
  SchemaNull,
  SchemaObject,
  SchemaOneOf,
  ValidationError,
} from "./type.d.ts";

export type ObjectProps<T> = {
  [Key in keyof T]: Is<T[Key]>;
};

const validate = <T>(props: ObjectProps<T>) => (d: unknown): d is T => {
  if (!isRecord(d)) {
    return throwValidationError({ expected: "object", got: d });
  }

  const errors: ValidationError[] = [];
  // @ts-ignore ?
  const tests = Object.entries(props).map(([key, { test }]) => {
    try {
      return test(d[key]);
    } catch (err) {
      getValidationErrors(err).forEach((d) =>
        errors.push({ ...d, path: `${key}${d.path ? "." + d.path : ""}` })
      );
      return false;
    }
  });

  return tests.every(Boolean) || throwValidationErrors(errors);
};

const isOneOf = (d: Schema): d is SchemaOneOf =>
  Object.keys(d).includes("oneOf");
const isNull = (d: Schema): d is SchemaNull => !isOneOf(d) && d.type === "null";
const fixPropSchema = (d: Schema) => {
  if (isOneOf(d)) {
    const notNull = d.oneOf.filter((d) => !isNull(d));
    return notNull[0];
  }
  return d;
};

const getSchema = <T>(props: ObjectProps<T>): SchemaObject => ({
  type: "object",
  properties: {
    ...Object.keys(props).reduce((r: Record<string, Schema>, key) => {
      // @ts-ignore ?
      const is = props[key] as Is<any>;
      return { ...r, [key]: fixPropSchema(is.schema) };
    }, {}),
  },
  // @ts-ignore ?
  required: Object.keys(props).filter((key) => !props[key].orUndefined),
});

export default <T>(props: ObjectProps<T>) => ({
  schema: getSchema(props),
  test: validate(props),
});
