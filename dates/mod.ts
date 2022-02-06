import {
  addDays as _addDays,
  expose,
  getMonth as _getMonth,
  getNextWeekdayByIndex as _getNextWeekdayByIndex,
  getPrevWeekdayByIndex as _getPrevWeekdayByIndex,
  getUnixTimestamp as _getUnixTimestamp,
  getWeek as _getWeek,
  getWeeksOfMonth as _getWeeksOfMonth,
  getYYYYMMDD as _getYYYYMMDD,
  subtractDays as _subtractDays,
} from "./dates.ts";

export const addDays = (n: number) => expose((d) => _addDays(d, n));
export const getMonth = expose(_getMonth);
export const getNextWeekdayByIndex = (i: number) =>
  expose((d) => _getNextWeekdayByIndex(d, i));
export const getPrevWeekdayByIndex = (i: number) =>
  expose((d) => _getPrevWeekdayByIndex(d, i));
export const getUnixTimestamp = expose(_getUnixTimestamp);
export const getWeek = expose(_getWeek);
export const getWeeksOfMonth = expose(_getWeeksOfMonth);
export const getYYYYMMDD = expose(_getYYYYMMDD);
export const subtractDays = (n: number) => expose((d) => _subtractDays(d, n));
