import { assertEquals } from "https://deno.land/std@0.126.0/testing/asserts.ts";
import html from "./html.ts";

const argsObj = {
  input: html`
    <a ${{ b: 1, c: "c", d: true }} />
  `,
  expected: '<a b="1" c="c" d="true" />',
};

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

const space = {
  input: html`
    <a   b="1"   c="d" />
  `,
  expected: '<a b="1" c="d" />',
};

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
  assertEquals(argsObj.input, argsObj.expected);
  assertEquals(lineArgs.input, lineArgs.expected);
  assertEquals(arr.input, arr.expected);
  assertEquals(space.input, space.expected);
  assertEquals(all.input, all.expected);
});

Deno.test("[html] should accept object as attributes", () => {
  const input = html`
    <div ${{ id: 'id', class: 'class' }} />
  `
  const expected = `<div id="id" class="class" />`
  assertEquals(input, expected)
})
