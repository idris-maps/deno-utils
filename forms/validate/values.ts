import {
  CheckboxField,
  ColorField,
  DateField,
  EnumField,
  Field,
  isCheckboxField,
  isColorField,
  isDateField,
  isEnumField,
  isEnumString,
  isNumericField,
  isStringField,
  isTextareaField,
  NumericField,
  StringField,
  TextareaField,
} from "../types.ts";
import {
  fitsPattern,
  isAlphaNum,
  isDateString,
  isMultipleOf,
} from "../utils.ts";
import { is, isBoolean, isNumber, isString, isUndefined } from "../deps.ts";
import { onError } from "./errors.ts";

const ERR = {
  notFieldType: `not a valid field type`,
  notBoolean: (prop: string) => `${prop} must be boolean`,
  notEnum: (prop: string, values: string[]) =>
    `${prop} must be one of ${values.join(",")}`,
  notColor: (prop: string) => `${prop} must be a hex color`,
  notDate: (prop: string) => `${prop} must be a date in the yyyy-mm-dd format`,
  notString: (prop: string) => `${prop} must be a string`,
  tooLong: (prop: string, max: number) =>
    `${prop} is too long (max length: ${max})`,
  tooShort: (prop: string, min: number) =>
    `${prop} is too short (min length ${min})`,
  notPattern: (prop: string, pattern: string) =>
    `${prop} does not fit pattern: ${pattern}`,
  notNum: (prop: string) => `${prop} must be a number`,
  tooSmall: (prop: string, min: number) => `${prop} is too small (min: ${min})`,
  tooBig: (prop: string, max: number) => `${prop} is too big (max: ${max})`,
  notMultiple: (prop: string, step: number) =>
    `${prop} must be a multiple of ${step}`,
  tooEarly: (prop: string, min: string) => `${prop} is too early (min: ${min})`,
  tooLate: (prop: string, max: string) => `${prop} is too late (max: ${max})`,
};

export const isStringValue = (field: StringField | TextareaField) =>
  is<string>((value) => {
    if (!isString(value)) {
      return onError(ERR.notString(field.property));
    }

    if (isStringField(field)) {
      if (field.maxLength && value.length > field.maxLength) {
        return onError(ERR.tooLong(field.property, field.maxLength));
      }

      if (field.minLength && value.length < field.minLength) {
        return onError(ERR.tooLong(field.property, field.minLength));
      }

      if (field.pattern && !fitsPattern(field.pattern, value)) {
        return onError(ERR.notPattern(field.property, field.pattern));
      }
    }

    return true;
  });

export const isNumericValue = (field: NumericField) =>
  is<number>((value) => {
    if (!isNumber(value)) {
      return onError(ERR.notNum(field.property));
    }

    if (field.min && value < field.min) {
      return onError(ERR.tooSmall(field.property, field.min));
    }

    if (field.max && value > field.max) {
      return onError(ERR.tooBig(field.property, field.max));
    }

    if (field.step && !isMultipleOf(field.step, value)) {
      return onError(ERR.notMultiple(field.property, field.step));
    }

    return true;
  });

export const isCheckboxValue = (field: CheckboxField) =>
  is<boolean>((value) => {
    if (!isBoolean(value)) {
      return onError(ERR.notBoolean(field.property));
    }

    return true;
  });

export const isEnumValue = (field: EnumField) =>
  is<string>((value) => {
    const options = field.options.map((d) => isEnumString(d) ? d : d.value);

    if (!isString(value) || !options.includes(value)) {
      return onError(ERR.notEnum(field.property, options));
    }

    return true;
  });

export const isColorValue = (field: ColorField) =>
  is<string>((value) => {
    if (
      !isString(value) ||
      ![4, 7].includes(value.length) ||
      !value.startsWith("#") ||
      !isAlphaNum(value.substring(1))
    ) {
      return onError(ERR.notColor(field.property));
    }

    return true;
  });

export const isDateValue = (field: DateField) =>
  is<string>((value) => {
    if (!(isString(value) && isDateString(value))) {
      return onError(ERR.notDate(field.property));
    }

    if (field.min && value < field.min) {
      return onError(ERR.tooEarly(field.property, field.min));
    }

    if (field.max && value > field.max) {
      return onError(ERR.tooLate(field.property, field.max));
    }

    return true;
  });

type Value = string | number | boolean | undefined;

export const isValue = (field: Field) =>
  is<Value>((value) => {
    // use default value
    if (isUndefined(value) && field.value) {
      return true;
    }

    if (isEnumField(field)) {
      return isEnumValue(field)(value);
    }

    if (isCheckboxField(field)) {
      return isCheckboxValue(field)(value);
    }

    if (isUndefined(value) && field.notRequired) {
      return true;
    }

    if (isColorField(field)) {
      return isColorValue(field)(value);
    }

    if (isDateField(field)) {
      return isDateValue(field)(value);
    }

    if (isNumericField(field)) {
      return isNumericValue(field)(value);
    }

    if (isStringField(field) || isTextareaField(field)) {
      return isStringValue(field)(value);
    }

    return onError(ERR.notFieldType);
  });

// deno-lint-ignore no-explicit-any
export const isValues = <T = any>(fields: Field[]) =>
  is<T>((values) =>
    fields.every((field) => isValue(field)(values[field.property]))
  );
