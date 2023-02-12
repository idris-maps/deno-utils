import { isString } from "./deps.ts";
import { SchemaString } from "./type.d.ts";
import { throwValidationError, validator } from "./validator.ts";

export interface StringProps {
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  enum?: string[];
}

const fitsPattern = (pattern: string, d: string) => new RegExp(pattern).test(d);

const validate = (props?: StringProps) => {
  return (d: unknown): d is string => {
    if (isString(d) && props) {
      if (props.maxLength && d.length > props.maxLength) {
        throwValidationError({
          expected: `maxLength ${props.maxLength}`,
          got: d,
        });
      }
      if (props.minLength && d.length < props.minLength) {
        throwValidationError({
          expected: `minLength ${props.minLength}`,
          got: d,
        });
      }
      if (props.pattern && !fitsPattern(props.pattern, d)) {
        throwValidationError({ expected: `pattern ${props.pattern}`, got: d });
      }
      if (props.enum && !props.enum.includes(d)) {
        throwValidationError({
          expected: `one of (${(props.enum || []).join(", ")})`,
          got: d,
        });
      }
    }
    return validator<string>("string", isString)(d);
  };
};

const getSchema = (props: StringProps = {}): SchemaString => ({
  type: "string",
  ...props,
});

export default (props?: StringProps) => ({
  schema: getSchema(props),
  test: validate(props),
});
