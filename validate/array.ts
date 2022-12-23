import { is } from "./deps.ts";
import {
  getValidationErrors,
  throwValidationError,
  throwValidationErrors,
} from "./validator.ts";
import type { Test, ValidationError } from "./validator.ts";

export const validateArrayOf = <T>(test: Test<T>) =>
  is<T[]>((d: unknown) => {
    if (!Array.isArray(d)) {
      return throwValidationError({ expected: "array", got: d });
    } else {
      const errors: ValidationError[] = [];
      const tests = d.map((d, i) => {
        try {
          return test(d);
        } catch (err) {
          getValidationErrors(err).forEach((d) =>
            errors.push({ ...d, path: `[${i}]${d.path ? "." + d.path : ""}` })
          );
          return false;
        }
      });

      return tests.every(Boolean) || throwValidationErrors(errors);
    }
  });
