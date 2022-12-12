// deno-lint-ignore no-explicit-any
export const is = <T>(func: (d: any) => boolean) => (d: any): d is T => func(d);

export const isBoolean = is<boolean>((d) =>
  ["true", "false"].includes(String(d))
);

export const isUndefined = is<undefined>((d) => typeof d === "undefined");

export const isString = is<string>((d) => String(d) === d);

export const isNumber = is<number>((d) =>
  typeof d === "number" && !Number.isNaN(d)
);

export const isInteger = is<number>((d) => 
  isNumber(d) && Number.isInteger(d)
)

// records

export const isRecord = is<Record<string, unknown>>((d) =>
  d && !isString(d) && !isNumber(d) && !Array.isArray(d) &&
  Object.keys(d).every(isString)
);

// arrays

export const isArrayOf = <T>(test: (d: unknown) => boolean) =>
  is<T[]>((d) => Array.isArray(d) && d.every(test));

export const isArrayOfStrings = isArrayOf<string>(isString);

export const isArrayOfBooleans = isArrayOf<boolean>(isBoolean);

export const isArrayOfNumbers = isArrayOf<number>(isNumber);
