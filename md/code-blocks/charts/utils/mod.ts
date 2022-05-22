export { default as currentColor } from './current-color.ts'
export * from './validate-sanitize.ts'

const isString = (d: any): d is string => String(d) === d

export const isArrayOfStrings = (d: any): d is string[] =>
  Array.isArray(d) && d.every(isString)