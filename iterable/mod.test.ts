import { assertEquals } from "https://deno.land/std@0.160.0/testing/asserts.ts";
import { pipe, toArray, map, filter } from "./mod.ts";

function* generateInts() {
  let i = 0;
  while (i < 3) {
    yield i;
    i++;
  }
}

Deno.test("[iterate] sync", async () => {
  const ints = generateInts();

  const multiplyBy2 = map((d: number) => d * 2)
  const add1 = map((d: number) => d + 1)
  const remove3 = filter((d: number) => d !== 3)
  const stringify = map((d: number) => `NUM:${d}`)

  const transform = pipe(
    multiplyBy2,
    add1,
    remove3,
    stringify,
  );

  const transformed = transform(ints);

  const res = await toArray(transformed);

  assertEquals(res, ["NUM:1", "NUM:5"]);
});

Deno.test("[iterate] async", async () => {
  const ints = generateInts();

  const multiplyBy2 = map((d: number) => Promise.resolve(d * 2))
  const add1 = map((d: number) => Promise.resolve(d + 1))
  const remove3 = filter((d: number) => Promise.resolve(d !== 3))
  const stringify = map((d: number) => Promise.resolve(`NUM:${d}`))

  const transform = pipe(
    multiplyBy2,
    add1,
    remove3,
    stringify,
  );

  const transformed = transform(ints);

  const res = await toArray(transformed);

  assertEquals(res, ["NUM:1", "NUM:5"]);
});

Deno.test("[iterate] mixed async/sync", async () => {
  const ints = generateInts();

  const multiplyBy2 = map((d: number) => Promise.resolve(d * 2))
  const add1 = map((d: number) => d + 1)
  const remove3 = filter((d: number) => Promise.resolve(d !== 3))
  const stringify = map((d: number) => `NUM:${d}`)

  const transform = pipe(
    multiplyBy2,
    add1,
    remove3,
    stringify,
  );

  const transformed = transform(ints);

  const res = await toArray(transformed);

  assertEquals(res, ["NUM:1", "NUM:5"]);
});
