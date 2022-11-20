import { assertEquals } from "https://deno.land/std@0.126.0/testing/asserts.ts";
import html from "./html.ts";

const argsObj = {
  input: html`
    <a ${{ b: 1, c: "c", d: true }} />
  `,
  expected: '<a b="1" c="c" d="true" />',
};

Deno.test("[html] should accept arguments as object", () => {
  assertEquals(argsObj.input, argsObj.expected);
});

const lineArgs = {
  input: html`
    <a
      b="1"
      c="c"
      d="true"
    />
  `,
  expected: '<a b="1" c="c" d="true" />',
};

Deno.test("[html] should accept arguments on different lines", () => {
  assertEquals(lineArgs.input, lineArgs.expected);
});

const arr = {
  input: html`
    <ul ${{ "class": "x" }}>
      ${
    ["a", "b", "c"].map((d, i) =>
      html`
        <li id="x-${i}">${d}</li>
      `
    )
  }
    </ul>
  `,
  expected:
    '<ul class="x"><li id="x-0">a</li><li id="x-1">b</li><li id="x-2">c</li></ul>',
};

Deno.test("[html] should accept array of html", () => {
  assertEquals(arr.input, arr.expected);
});

const space = {
  input: html`
    <a   b="1"   c="d" />
  `,
  expected: '<a b="1" c="d" />',
};

Deno.test("[html] should remove spaces", () => {
  assertEquals(space.input, space.expected);
});

const all = {
  input: html`
    <div>
      ${argsObj.input}
      ${lineArgs.input}
      ${arr.input}
      ${space.input}
    </div>
  `,
  expected: [
    "<div>",
    argsObj.expected,
    lineArgs.expected,
    arr.expected,
    space.expected,
    "</div>",
  ].join(""),
};

Deno.test("[html]", () => {
  assertEquals(all.input, all.expected);
});
