import { isRecord } from './deps.ts'
import { throwValidationErrors, throwValidationError, getValidationErrors } from './validator.ts'
import type { ValidationError } from './validator.ts'

export type ObjectProps<T> = {
  [Key in keyof T]: (d: unknown) => d is T[Key];
};

export const validateRecord = <T>(props: ObjectProps<T>) =>
  (d: unknown): d is T => {
    if (!isRecord(d)) {
      return throwValidationError({ expected: 'object', got: d })
    }

    const errors: ValidationError[] = []
    const tests = Object.entries(props).map(([key, test]) => {
      try {
        // @ts-ignore ?
        return test(d[key])
      } catch (err) {
        getValidationErrors(err).forEach(d => errors.push(({ ...d, path: `${key}${d.path ? '.' + d.path : ''}` })))
        return false;
      }
    })

    return tests.every(Boolean) || throwValidationErrors(errors)
  }

export const validateRecordOrUndefined = <T>(props: ObjectProps<T>) =>
  (d: unknown): d is T | undefined => {
    if (typeof d === 'undefined') {
      return true;
    }

    if (!isRecord(d)) {
      return throwValidationError({ expected: 'object', got: d })
    }

    const errors: ValidationError[] = []
    const tests = Object.entries(props).map(([key, test]) => {
      try {
        // @ts-ignore ?
        return test(d[key])
      } catch (err) {
        getValidationErrors(err).forEach(d => errors.push(({ ...d, path: `${key}${d.path ? '.' + d.path : ''}` })))
        return false;
      }
    })

    return tests.every(Boolean) || throwValidationErrors(errors)
  }
