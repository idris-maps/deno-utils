import { validator, throwValidationError } from './validator.ts'

export interface BooleanProps {
  enum?: boolean[]
}

const isBoolean = (d: unknown): d is boolean =>
  typeof d === 'boolean' && ["true", "false"].includes(String(d))

export const validateBoolean = (props?: BooleanProps) => {
  return (d: unknown): d is boolean => {
    if (isBoolean(d) && props) {
      if (props.enum && !props.enum.includes(d)) {
        throwValidationError({ expected: `one of ${(props.enum || []).join(',')}`, got: d })
      }
    }
    return validator<boolean>('boolean', isBoolean)(d)
  }
}
