import type { Is } from "./type.d.ts";
import { throwValidationError } from "./validator.ts";

const validate = <T extends Is<unknown>>(props: T[]) => {
  return (d: unknown): d is T => {
    const isOneOf = props.some((is) => {
      try {
        const pass = is.test(d);
        return Boolean(pass);
      } catch {
        return false;
      }
    });
    if (!isOneOf) {
      props.map((d) => d.schema);
      throwValidationError({
        expected: `oneOf ${JSON.stringify(props.map((d) => d.schema))}`,
        got: d,
      });
    }
    return isOneOf;
  };
};

export default <T extends Is<any>>(props: T[]) => ({
  test: validate(props),
  schema: { oneOf: props.map((d) => d.schema) },
});
