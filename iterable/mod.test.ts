import { assertEquals } from "https://deno.land/std@0.160.0/testing/asserts.ts";
import { pipe, toArray, map, filter } from "./mod.ts";

function* generateInts() {
  let i = 0;
  while (i < 3) {
    yield i;
    i++;
  }
}

const multiplyBy2 = map((d: number) => d * 2)
const add1 = map((d: number) => d + 1)
const remove3 = filter((d: number) => d !== 3)
const stringify = map((d: number) => `NUM:${d}`)

const multiplyBy2Async = map((d: number) => Promise.resolve(d * 2))
const add1Async = map((d: number) => Promise.resolve(d + 1))
const remove3Async = filter((d: number) => Promise.resolve(d !== 3))
const stringifyAsync = map((d: number) => Promise.resolve(`NUM:${d}`))

Deno.test("[iterate] sync", async () => {
  const ints = generateInts();

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

  const transform = pipe(
    multiplyBy2Async,
    add1Async,
    remove3Async,
    stringifyAsync,
  );

  const transformed = transform(ints);

  const res = await toArray(transformed);

  assertEquals(res, ["NUM:1", "NUM:5"]);
});

Deno.test("[iterate] mixed async/sync", async () => {
  const ints = generateInts();

  const transform = pipe(
    multiplyBy2,
    add1Async,
    remove3,
    stringifyAsync,
  );

  const transformed = transform(ints);

  const res = await toArray(transformed);

  assertEquals(res, ["NUM:1", "NUM:5"]);
});
