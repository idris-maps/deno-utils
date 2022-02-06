import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  addDays,
  expose,
  getNextWeekdayByIndex,
  getPrevWeekdayByIndex,
  getWeek,
  subtractDays,
} from "./dates.ts";

const isTrue = (expr: any, msg?: string) => assertEquals(expr, true, msg);

const func = (d: Date) => d;

Deno.test("[dates] expose", () => {
  const notDefined = expose(func)();
  isTrue(
    notDefined instanceof Date,
    "should set now as default date if undefined",
  );

  const defined = expose(func)(new Date("2020-01-01"));
  assertEquals(
    new Date(defined),
    new Date("2020-01-01"),
    "should use passed date",
  );

  try {
    // @ts-ignore
    expose(func)("not a date");
    isTrue(false, "should throw if date is invalid");
  } catch (err) {
    assertEquals(err, "invalid date", "should throw if date is invalid");
  }
});

Deno.test("[dates] addDays", () => {
  const date = new Date("2020-01-01");
  const in40Days = addDays(date, 40);
  assertEquals(in40Days, new Date("2020-02-10"));
});

Deno.test("[dates] subtractDays", () => {
  const date = new Date("2020-02-10");
  const in40Days = subtractDays(date, 40);
  assertEquals(in40Days, new Date("2020-01-01"));
});

Deno.test("[dates] getPrevWeekdayByIndex", () => {
  // 2020-01-01 is on a wednesday
  const mondayBefore = getPrevWeekdayByIndex(new Date("2020-01-01"), 1);
  assertEquals(mondayBefore, new Date("2019-12-30"));
});

Deno.test("[dates] getNextWeekdayByIndex", () => {
  // 2020-01-01 is on a wednesday
  const sundayAfter = getNextWeekdayByIndex(new Date("2020-01-01"), 0);
  assertEquals(sundayAfter, new Date("2020-01-05"));
});

Deno.test("[dates] getWeek", () => {
  const daysOfWeek = getWeek(new Date("2020-01-01"));
  isTrue(daysOfWeek.length === 7);
  assertEquals(daysOfWeek[0], new Date("2019-12-30"));
  assertEquals(daysOfWeek[6], new Date("2020-01-05"));
});
