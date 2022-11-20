import { splitAsLongAs } from "./split-as-long-as.ts";
import { assertEquals } from "https://deno.land/std@0.163.0/testing/asserts.ts";

const isTrue = (d: unknown) => assertEquals(d, true);

const lines = [
  ...(Array.from(Array(10)).map(() => "a")),
  ...(Array.from(Array(10)).map(() => "b")),
];

const iterate = function* () {
  for (const line of lines) {
    yield line;
  }
};

Deno.test("[iterable] splitAsLongAs", async () => {
  const [a, b] = splitAsLongAs((d: string) => d === "a", iterate());

  const as = [];
  const bs = [];

  for await (const item of a) {
    as.push(item);
  }

  for await (const item of b) {
    bs.push(item);
  }

  isTrue(as.every((d) => d === "a"));
  isTrue(bs.every((d) => d === "b"));
});
