export type Test<T> = (d: unknown) => d is T;

export interface ValidationError {
  expected: string;
  got: unknown;
  path?: string;
}

export type Validation<T> = [data: T] | [undefined, ValidationError[]];

export const ERROR = "[validation-error]";

export const throwValidationError = (validationError: ValidationError) => {
  throw new Error(ERROR, { cause: [validationError] });
};

export const throwValidationErrors = (validationErrors: ValidationError[]) => {
  throw new Error(ERROR, { cause: validationErrors });
};

export const validator =
  <T>(expected: string, test: Test<T>): Test<T> => (d): d is T => {
    if (!test(d)) throwValidationError({ expected, got: d });
    return test(d);
  };

export const getValidationErrors = (err: Error): ValidationError[] => {
  const { message, cause } = err;
  if (
    message === ERROR &&
    Array.isArray(cause) &&
    cause.every((d) => d.expected)
  ) {
    return cause;
  }
  throw err;
};

export const validate = <T>(test: Test<T>) => (d: unknown): Validation<T> => {
  try {
    if (test(d)) {
      return [d];
    }
  } catch (err) {
    return [undefined, getValidationErrors(err)];
  }
  return [undefined, []];
};

export const orUndefined =
  <T>(test: Test<T>) => (d: unknown): d is T | undefined => {
    if (typeof d === "undefined") {
      return true;
    }
    return test(d);
  };
