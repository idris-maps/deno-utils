import { isNumber } from "./deps.ts";
import { SchemaNumber } from "./type.d.ts";
import { throwValidationError, validator } from "./validator.ts";

export interface NumberProps {
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  minimum?: number;
  multipleOf?: number;
  enum?: number[];
}

const isMultipleOf = (multiple: number, d: number) => {
  // account for 0.1 + 0.2 = 0.30000000000000004
  const multiplier = Math.pow(
    10,
    (String(multiple).split(".")[1] || "").length || 0,
  );
  return (d * multiplier) % (multiple * multiplier) === 0;
};

const validate = (props?: NumberProps) => {
  return (d: unknown): d is number => {
    if (isNumber(d) && props) {
      if (props.maximum && d > props.maximum) {
        throwValidationError({ expected: `maximum ${props.maximum}`, got: d });
      }
      if (props.exclusiveMaximum && d >= props.exclusiveMaximum) {
        throwValidationError({
          expected: `exclusive maximum ${props.exclusiveMaximum}`,
          got: d,
        });
      }
      if (props.minimum && d < props.minimum) {
        throwValidationError({ expected: `minimum ${props.minimum}`, got: d });
      }
      if (props.exclusiveMinimum && d <= props.exclusiveMinimum) {
        throwValidationError({
          expected: `exclusive minimum ${props.exclusiveMinimum}`,
          got: d,
        });
      }
      if (props.multipleOf && !isMultipleOf(props.multipleOf, d)) {
        throwValidationError({
          expected: `multiple of ${props.multipleOf}`,
          got: d,
        });
      }
      if (props.enum && !props.enum.includes(d)) {
        throwValidationError({
          expected: `one of (${(props.enum || []).join(", ")})`,
          got: d,
        });
      }
    }
    return validator<number>("number", isNumber)(d);
  };
};

const getSchema = (props: NumberProps = {}): SchemaNumber => ({
  type: "number",
  ...props,
});

export default (props?: NumberProps) => ({
  schema: getSchema(props),
  test: validate(props),
});
