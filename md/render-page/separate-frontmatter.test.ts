import { separateFrontmatter } from "./separate-frontmatter.ts";
import { assertEquals as isEq } from "https://deno.land/std@0.163.0/testing/asserts.ts";

const md = `
---
a: 1
b: hello
---
# Some md

and some more
`;

const iterable = function* () {
  const lines = md.trim().split("\n");
  for (const line of lines) {
    yield line;
  }
};

Deno.test("[md] separateFrontmatter", async () => {
  const [fm, md] = separateFrontmatter(iterable());

  const frontmatter = [];
  const markdown = [];

  for await (const line of fm) {
    frontmatter.push(line);
  }

  for await (const line of md) {
    markdown.push(line);
  }

  isEq(frontmatter, [
    "---",
    "a: 1",
    "b: hello",
    "---",
  ]);

  isEq(markdown, [
    "# Some md",
    "",
    "and some more",
  ]);
});
