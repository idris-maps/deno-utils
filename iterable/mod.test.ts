import { assertEquals } from "https://deno.land/std@0.160.0/testing/asserts.ts";
import { pipe, toArray } from "./mod.ts";

async function* generateInts() {
  let i = 0;
  while (i < 3) {
    yield i;
    i++;
  }
}

Deno.test("[iterate] pipe / toArray", async () => {
  const ints = generateInts();

  const transform = pipe(
    (d: number) => d * 2,
    (d: number) => d + 1,
    (d: number) => d === 3 ? undefined : d,
    (d: number): string => `NUM:${d}`,
  );

  const transformed = transform(ints);

  const res = await toArray(transformed);

  assertEquals(res, ["NUM:1", "NUM:5"]);
});
