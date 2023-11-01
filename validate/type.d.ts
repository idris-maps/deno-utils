import type { BooleanProps } from "./boolean.ts";
import type { NumberProps } from "./number.ts";
import type { StringProps } from "./string.ts";

export type SchemaBoolean = { type: "boolean" } & BooleanProps;
export type SchemaNumber = { type: "number" } & NumberProps;
export type SchemaString = { type: "string" } & StringProps;
export type SchemaNull = { type: "null" };

export interface SchemaObject {
  type: "object";
  properties: Record<string, Schema>;
  required: string[];
}

export interface SchemaArray {
  type: "array";
  items: Schema;
}

export type SchemaOneOf = { oneOf: Schema[] };

export type Schema =
  | SchemaArray
  | SchemaBoolean
  | SchemaNumber
  | SchemaObject
  | SchemaString
  | SchemaNull
  | SchemaOneOf;

export type Test<T> = (d: unknown) => d is T;

export interface Is<T> {
  test: Test<T>;
  schema: Schema;
  orUndefined?: boolean;
}

export interface ValidationError {
  expected: string;
  got: unknown;
  path?: string;
}

export type Validation<T> = [data: T] | [undefined, ValidationError[]];
