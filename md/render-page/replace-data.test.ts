import type { AnyIterable } from "./deps.ts";
import { replaceData } from "./replace-data.ts";
import { assertEquals as isEq } from "https://deno.land/std@0.163.0/testing/asserts.ts";

const data = {
  some: { nested: "data" },
  just: "data",
};

const lines: [input: string, expected: string][] = [
  ["{{just}}", data.just],
  ["{{ just }}", data.just],
  ["{{ noKey }}", "{{noKey}}"],
  ["{{ noKey | defaultString }}", "defaultString"],
  ["{{some.nested}}", data.some.nested],
  ["{{ some.nested }}", data.some.nested],
  ["{{ noKey.noNested }}", "{{noKey.noNested}}"],
  [
    "{{ just }} {{ some.nested }} {{ noKey }}",
    data.just + " " + data.some.nested + " {{noKey}}",
  ],
].map((
  [input, expected],
) => [`before ${input} after`, `before ${expected} after`]);

const iterate = function* (): AnyIterable<string> {
  for (const line of lines) {
    yield line[0];
  }
};

Deno.test("[md] replace-data", async () => {
  const res = replaceData(data)(iterate());
  let i = 0;
  for await (const line of res) {
    isEq(line, lines[i][1]);
    i++;
  }
});
