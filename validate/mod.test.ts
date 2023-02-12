import { assertEquals } from "https://deno.land/std@0.175.0/testing/asserts.ts";
import { is, validate } from "./mod.ts";

const isEq = assertEquals;

Deno.test("[validate] is.array", () => {
  const arr = is.arrayOf(is.string());
  isEq(arr.schema, { type: "array", items: { type: "string" } });

  isEq(validate(arr)(["a", "b"])[0], ["a", "b"]);
  isEq(validate(arr)("a")[1], [{ expected: "array", got: "a" }]);
  isEq(validate(arr)(["a", 1])[1], [{
    expected: "string",
    got: 1,
    path: "[1]",
  }]);
});

Deno.test("[validate] is.boolean", () => {
  const bool1 = is.boolean();
  isEq(bool1.schema, { type: "boolean" });

  isEq(validate(bool1)(true)[0], true);
  isEq(validate(bool1)(false)[0], false);
  isEq(validate(bool1)(1)[1], [{ expected: "boolean", got: 1 }]);

  const bool2 = is.boolean({ enum: [true] });
  isEq(bool2.schema, { type: "boolean", enum: [true] });

  isEq(validate(bool2)(true)[0], true);
  isEq(validate(bool2)(false)[1], [{ expected: "one of (true)", got: false }]);
});

Deno.test("[validate] is.number", () => {
  const num1 = is.number();
  isEq(num1.schema, { type: "number" });

  isEq(validate(num1)(1)[0], 1);
  isEq(validate(num1)("a")[1], [{ expected: "number", got: "a" }]);

  const num2 = is.number({
    maximum: 2,
    minimum: 1,
    multipleOf: 0.1,
    enum: [1.1, 1.2, 1.6],
  });
  isEq(num2.schema, {
    type: "number",
    enum: [1.1, 1.2, 1.6],
    maximum: 2,
    minimum: 1,
    multipleOf: 0.1,
  });

  isEq(validate(num2)(1.2)[0], 1.2);
  isEq(validate(num2)(2.1)[1], [{ expected: "maximum 2", got: 2.1 }]);
  isEq(validate(num2)(0.1)[1], [{ expected: "minimum 1", got: 0.1 }]);
  isEq(validate(num2)(1.12)[1], [{ expected: "multiple of 0.1", got: 1.12 }]);
  isEq(validate(num2)(1.3)[1], [{
    expected: "one of (1.1, 1.2, 1.6)",
    got: 1.3,
  }]);

  const num3 = is.number({ exclusiveMaximum: 2, exclusiveMinimum: 1 });
  isEq(num3.schema, {
    type: "number",
    exclusiveMaximum: 2,
    exclusiveMinimum: 1,
  });

  isEq(validate(num3)(1.2)[0], 1.2);
  isEq(validate(num3)(2)[1], [{ expected: "exclusive maximum 2", got: 2 }]);
  isEq(validate(num3)(1)[1], [{ expected: "exclusive minimum 1", got: 1 }]);
});

Deno.test("[validate] is.object", () => {
  const obj = is.object({
    a: is.string(),
    b: is.number(),
    c: is.booleanOrUndefined(),
  });
  isEq(obj.schema, {
    type: "object",
    properties: {
      a: { type: "string" },
      b: { type: "number" },
      c: { type: "boolean" },
    },
    required: ["a", "b"],
  });

  isEq(validate(obj)({ a: "a", b: 2, c: true })[0], { a: "a", b: 2, c: true });
  // @ts-ignore types expect c: undefined but it is not returned as it is not passed
  isEq(validate(obj)({ a: "a", b: 2 })[0], { a: "a", b: 2 });
  isEq(validate(obj)({ a: "a", b: "hello" })[1], [{
    expected: "number",
    got: "hello",
    path: "b",
  }]);
});

Deno.test("[validate] is.string", () => {
  const str1 = is.string();
  isEq(str1.schema, { type: "string" });

  isEq(validate(str1)("a string")[0], "a string");
  isEq(validate(str1)(99)[0], undefined);
  isEq(validate(str1)(99)[1], [{ expected: "string", got: 99 }]);

  const str2 = is.string({
    minLength: 2,
    maxLength: 4,
    pattern: "^[0-9]*$",
    enum: ["1234", "5678"],
  });
  isEq(str2.schema, {
    type: "string",
    minLength: 2,
    maxLength: 4,
    pattern: "^[0-9]*$",
    enum: ["1234", "5678"],
  });

  isEq(validate(str2)("1234")[0], "1234");
  isEq(validate(str2)("1")[1], [{ expected: "minLength 2", got: "1" }]);
  isEq(validate(str2)("12345")[1], [{ expected: "maxLength 4", got: "12345" }]);
  isEq(validate(str2)("aaaa")[1], [{
    expected: "pattern ^[0-9]*$",
    got: "aaaa",
  }]);
  isEq(validate(str2)("1111")[1], [{
    expected: "one of (1234, 5678)",
    got: "1111",
  }]);
});

Deno.test("[validate] is.oneOf", () => {
  const str = is.string();
  const num = is.number();
  const oneOf = is.oneOf<string, number>([str, num]);

  isEq(oneOf.schema, { oneOf: [str.schema, num.schema] });

  isEq(validate(oneOf)("hello")[0], "hello");
  isEq(validate(oneOf)(2)[0], 2);

  const [value, errors] = validate(oneOf)([1, "hello"]);
  isEq(value, undefined);
  isEq(errors, [{
    expected: 'oneOf [{"type":"string"},{"type":"number"}]',
    got: [1, "hello"],
  }]);
});
