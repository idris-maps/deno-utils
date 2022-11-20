import { isAlphaNumOrUnderscore, startsWithNum } from "../utils.ts";
import { is, isBoolean, isNumber, isRecord, isString } from "../deps.ts";
import { onError } from "./errors.ts";
import type { Field, SelectOption } from "../types.ts";

const ERR = {
  notField: (d: unknown) => `invalid field: ${JSON.stringify(d)}`,
  noProperty: "all fields must have a property",
  propertyAlphaNum:
    "property may only contain alpha numeric characters and _ (underscore)",
  propertyStartsWithUnderscore: "property may not start with _ (underscore)",
  propertyStartsWithNumber: "property may not start with a number",
  noType: "all fields must have a valid type",
  noOptions:
    "options must be an array of strings or { label: string, value: string }[]",
  notString: (d: string) => `${d} must be a string`,
  notNum: (d: string) => `${d} must be a number`,
  notBoolean: (d: string) => `${d} must be boolean`,
  uniqProp: "fields must have uniq properties",
  invalidKeys: (d: string[]) => `invalid keys: ${d.join(", ")}`,
};

const isOption = is<SelectOption | string>((d) =>
  d &&
  (
    isString(d) ||
    (d.label && d.value && isString(d.label) && isString(d.value))
  )
);

const isOptions = is<(SelectOption | string)[]>((d) =>
  Array.isArray(d) &&
  d.every(isOption)
);

const assertIfDefined = (
  assertion: (d: unknown) => boolean,
  msg: (k: string) => string,
) =>
(key: string, obj: Record<string, unknown>): void => {
  if (obj && obj[key]) {
    if (!assertion(obj[key])) {
      return onError(msg(key));
    }
  }
  return;
};

const assertStringIfDefined = assertIfDefined(isString, ERR.notString);
const assertNumberIfDefined = assertIfDefined(isNumber, ERR.notNum);
const assertBooleanIfDefined = assertIfDefined(isBoolean, ERR.notBoolean);

const validKeys = [
  "label",
  "max",
  "maxLength",
  "min",
  "minLength",
  "notRequired",
  "options",
  "pattern",
  "placeholder",
  "property",
  "step",
  "type",
  "value",
];

const assertNoInvalidKeys = (field: Record<string, unknown>) => {
  const invalidKeys = Object.keys(field).filter((d) => !validKeys.includes(d));
  if (invalidKeys.length) {
    return onError(ERR.invalidKeys(invalidKeys));
  }
  return;
};

const stringTypes = [
  "color",
  "date",
  "email",
  "password",
  "tel",
  "text",
  "textarea",
];
const numTypes = [
  "number",
  "range",
];
const optionTypes = [
  "select",
  "radio",
];
const boolTypes = [
  "checkbox",
];
const types = [
  ...stringTypes,
  ...numTypes,
  ...optionTypes,
  ...boolTypes,
];

export const isFieldProperty = is<string>((property) => {
  if (!property) {
    return onError(ERR.noProperty);
  }

  if (!isString(property) || !isAlphaNumOrUnderscore(property)) {
    return onError(ERR.propertyAlphaNum);
  }

  if (property.startsWith("_")) {
    return onError(ERR.propertyStartsWithUnderscore);
  }

  if (startsWithNum(property)) {
    return onError(ERR.propertyStartsWithNumber);
  }

  return true;
});

export const isFieldType = is<string>((type) => {
  if (!type || !isString(type) || !types.includes(type)) {
    return onError(ERR.noType);
  }

  return true;
});

export const isField = is<Field>((field) => {
  if (!isRecord(field)) {
    return onError(ERR.notField(field));
  }

  if (!isFieldProperty(field.property) || !isFieldType(field.type)) {
    return false;
  }

  const { type } = field;
  if (stringTypes.includes(type)) {
    assertStringIfDefined("value", field);
  }
  if (numTypes.includes(type)) {
    assertNumberIfDefined("value", field);
  }
  if (boolTypes.includes(type)) {
    assertBooleanIfDefined("value", field);
  }
  if (optionTypes.includes(field.type)) {
    assertStringIfDefined("value", field);
    if (!isOptions(field.options)) {
      return onError(ERR.noOptions);
    }
  }

  assertStringIfDefined("label", field);
  assertStringIfDefined("pattern", field);
  assertStringIfDefined("placeholder", field);

  assertNumberIfDefined("maxLength", field);
  assertNumberIfDefined("minLength", field);
  assertNumberIfDefined("min", field);
  assertNumberIfDefined("max", field);
  assertNumberIfDefined("step", field);

  assertBooleanIfDefined("notRequired", field);

  assertNoInvalidKeys(field);

  return true;
});

export const isFields = is<Field[]>((fields) => {
  if (!Array.isArray(fields)) {
    return onError("fields must be an array");
  }

  if (!fields.length) {
    return onError("fields may not be empty");
  }

  return fields.every(isField);
});
