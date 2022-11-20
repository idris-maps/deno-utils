import { separateCodeblocks } from "./separate-codeblocks.ts";
import { assertEquals as isEq } from "https://deno.land/std@0.163.0/testing/asserts.ts";

const md = `
# one

\`\`\`
no lang
\`\`\`

# two

\`\`\`lang
has lang
\`\`\`

\`\`\`lang
second block in a row
\`\`\`
`;

const iterable = function* () {
  const lines = md.trim().split("\n");
  for (const line of lines) {
    yield line;
  }
};

Deno.test("[md] separateCodeblocks", async () => {
  const items = separateCodeblocks(iterable());

  const parts = [];
  for await (const item of items) {
    parts.push(item);
  }

  isEq(parts[0], { type: "md", content: "# one" });
  isEq(parts[1], { type: "code", lang: undefined, content: "no lang" });
  isEq(parts[2], { type: "md", content: "# two" });
  isEq(parts[3], { type: "code", lang: "lang", content: "has lang" });
  isEq(parts[4], { type: "md", content: "" });
  isEq(parts[5], {
    type: "code",
    lang: "lang",
    content: "second block in a row",
  });
  isEq(parts[6], { type: "md", content: "" });
});
