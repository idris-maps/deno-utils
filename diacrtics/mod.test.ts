import { addDiacritics, replaceDiacritics } from "./mod.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.121.0/testing/asserts.ts";

Deno.test("replaceDiacritics", () => {
  assertEquals(replaceDiacritics("Ⓗềŀḹṍ Ｗǭŕłđ"), "Hello World");
  assertEquals(replaceDiacritics("Héllö"), "Hello");
});

Deno.test("addDiacritics", () => {
  assertNotEquals(addDiacritics("Hello"), "Hello");
  assertEquals(
    replaceDiacritics(
      addDiacritics("Hello"),
    ),
    "Hello",
  );
});
