import { assertEquals } from "https://deno.land/std@0.126.0/testing/asserts.ts";
import { encode } from "./deps.ts";
import jwt from "./jwt.ts";

const secret = crypto.randomUUID();

const getError = (func: () => any) => {
  try {
    func();
    return false;
  } catch (err) {
    return err;
  }
};

Deno.test("[jwt] should encode / decode the payload", () => {
  const { check, create } = jwt<{ id: string }>({ secret });
  const payload = { id: crypto.randomUUID() };
  const token = create(payload);
  const decoded = check(token);
  assertEquals(payload, decoded);
});

Deno.test("[jwt] check should fail if expired", () => {
  const { check, create } = jwt<{ id: string }>({
    secret,
    validityInMs: -10000,
  });
  const payload = { id: crypto.randomUUID() };
  const token = create(payload);
  const err = getError(() => check(token));
  assertEquals(err, "Token is expired");
});

Deno.test("[jwt] check should fail if not a token", () => {
  const { check } = jwt<{ id: string }>({ secret });
  const err = getError(() => check("not-a-token"));
  assertEquals(err, "Not a token");
});

Deno.test("[jwt] check should fail if token has been modified", () => {
  const { check, create } = jwt<{ id: string }>({ secret });
  const payload = { id: crypto.randomUUID() };
  const token = create(payload);
  const [head, _, sign] = token.split(".");
  const err = getError(() =>
    check(`${head}.${encode(JSON.stringify({ id: "x" }))}.${sign}`)
  );
  assertEquals(err, "Invalid token");
});
