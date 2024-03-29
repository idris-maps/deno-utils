import { Field, isEnumString } from "../types.ts";
import { JSONSchema7 } from "./json-schema.types.d.ts";
import { removeUndefined } from "../utils.ts";

export type JSONSchema = JSONSchema7;

const getProp = (d: Field): JSONSchema7 => {
  if (d.type === "checkbox") {
    return {
      type: "boolean",
      title: d.label,
      default: false,
    };
  }

  if (d.type === "color") {
    return {
      type: "string",
      title: d.label,
      pattern: "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      default: d.value,
    };
  }

  if (d.type === "date") {
    return {
      type: "string",
      title: d.label,
      format: "date",
      default: d.value,
    };
  }

  if (d.type === "email") {
    return {
      type: "string",
      title: d.label,
      format: "email",
      maxLength: d.maxLength,
      minLength: d.minLength,
      pattern: d.pattern,
      default: d.value,
    };
  }

  if (d.type === "number") {
    return {
      type: "number",
      title: d.label,
      maximum: d.max,
      minimum: d.min,
      multipleOf: d.step,
      default: d.value,
    };
  }

  if (d.type === "password") {
    return {
      type: "string",
      title: d.label,
      maxLength: d.maxLength,
      minLength: d.minLength,
      pattern: d.pattern,
      default: d.value,
    };
  }

  if (d.type === "radio") {
    const options: string[] = d.options.map((o) =>
      isEnumString(o) ? o : o.value
    );
    return {
      type: "string",
      title: d.label,
      enum: options,
      default: d.value,
    };
  }

  if (d.type === "select") {
    const options: string[] = d.options.map((o) =>
      isEnumString(o) ? o : o.value
    );
    return {
      type: "string",
      title: d.label,
      enum: options,
      default: d.value,
    };
  }

  if (d.type === "range") {
    return {
      type: "number",
      title: d.label,
      maximum: d.max,
      minimum: d.min,
      multipleOf: d.step,
      default: d.value,
    };
  }

  if (d.type === "tel") {
    return {
      type: "string",
      title: d.label,
      maxLength: d.maxLength,
      minLength: d.minLength,
      pattern: d.pattern,
      default: d.value,
    };
  }

  if (d.type === "text") {
    return {
      type: "string",
      title: d.label,
      maxLength: d.maxLength,
      minLength: d.minLength,
      pattern: d.pattern,
      default: d.value,
    };
  }

  if (d.type === "textarea") {
    return {
      type: "string",
      default: d.value,
    };
  }

  return {};
};

export const toSchema = (fields: Field[]): JSONSchema7 => ({
  type: "object",
  properties: fields.reduce((r, field) => ({
    ...r,
    [field.property]: removeUndefined(getProp(field)),
  }), {}),
  required: fields
    // @ts-ignore ?
    .filter((d) => !d["notRequired"])
    .map((d) => d.property),
});
