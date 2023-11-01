import isArray from "./array.ts";
import isBoolean, { BooleanProps } from "./boolean.ts";
import isNumber, { NumberProps } from "./number.ts";
import isObj, { ObjectProps } from "./object.ts";
import isString, { StringProps } from "./string.ts";
import isOneOf from "./one-of.ts";
import type { Is } from "./type.d.ts";
export { validate } from "./validator.ts";
export * from './type.d.ts'

const orUndefined = <T>(_is_: Is<T>): Is<T | undefined> => {
  return {
    test: (d: unknown): d is T | undefined =>
      typeof d === "undefined" ? true : _is_.test(d),
    schema: { oneOf: [_is_.schema, { type: "null" }] },
    orUndefined: true,
  };
};

export const is = {
  arrayOf: isArray,
  arrayOfOrUndefined: <T>(d: Is<T>) => orUndefined(isArray(d)),
  boolean: isBoolean,
  booleanOrUndefined: (props?: BooleanProps) => orUndefined(isBoolean(props)),
  number: isNumber,
  numberOrUndefined: (props?: NumberProps) => orUndefined(isNumber(props)),
  oneOf:  <T extends Is<unknown>>(props: T[]) => isOneOf(props),
  object: isObj,
  objectOrUndefined: <T>(props: ObjectProps<T>) => orUndefined(isObj<T>(props)),
  string: <T extends string>(props?: StringProps) => isString<T>(props),
  stringOrUndefined: (props?: StringProps) => orUndefined(isString(props)),
};
