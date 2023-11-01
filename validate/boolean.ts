import { isBoolean } from "./deps.ts";
import { SchemaBoolean } from "./type.d.ts";
import { throwValidationError, validator } from "./validator.ts";

export interface BooleanProps {
  enum?: boolean[];
}

const validate = (props?: BooleanProps) => {
  return (d: unknown): d is boolean => {
    if (isBoolean(d) && props) {
      if (props.enum && !props.enum.includes(d)) {
        throwValidationError({
          expected: `one of (${(props.enum || []).join(",")})`,
          got: d,
        });
      }
    }
    return validator<boolean>("boolean", isBoolean)(d);
  };
};

const getSchema = (props: BooleanProps = {}): SchemaBoolean => ({
  type: "boolean",
  ...props,
});

export default (props?: BooleanProps) => ({
  schema: getSchema(props),
  test: validate(props),
});
