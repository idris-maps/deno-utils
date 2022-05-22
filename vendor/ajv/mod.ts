import {
  validate as _validate,
  validateSchema as _validateSchema,
} from "./ajv.js";
import type { JSONSchema7 } from "./types.ts";

export interface Error {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: { [key: string]: unknown };
  message: string;
}

export interface ValidationResponse {
  isValid: boolean;
  errors?: Error[];
}

type Validator = (data: unknown) => ValidationResponse;
export const validate = (schema: JSONSchema7): Validator => _validate(schema);

type SchemaValidator = (
  schema: unknown,
) => { isValid: boolean; message?: string };
export const validateSchema: SchemaValidator = (schema) => {
  try {
    _validateSchema(schema, true);
    return { isValid: true };
  } catch (err) {
    return { isValid: false, message: err.message };
  }
};

export type JSONSchema = JSONSchema7;
