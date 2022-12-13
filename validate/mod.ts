import { validateArrayOf } from './array.ts'
import { validateBoolean, BooleanProps } from './boolean.ts'
import { validateNumber, NumberProps } from './number.ts'
import { validateRecord, validateRecordOrUndefined } from './object.ts'
import { validateString, StringProps } from './string.ts'
import { orUndefined, Test } from './validator.ts'
export { validate } from './validator.ts'

export const is = {
  arrayOf: validateArrayOf,
  arrayOfOrUndefined: <T>(test: Test<T>) => orUndefined(validateArrayOf(test)),
  boolean: validateBoolean,
  booleanOrUndefined: (props?: BooleanProps) => orUndefined(validateBoolean(props)),
  number: validateNumber,
  numberOrUndefined: (props?: NumberProps) => orUndefined(validateNumber(props)),
  object: validateRecord,
  objectOrUndefined: validateRecordOrUndefined,
  string: validateString,
  stringOrUndefined: (props?: StringProps) => orUndefined(validateString(props)),
}
