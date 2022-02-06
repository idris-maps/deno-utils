import {
  addDays as _addDays,
  expose,
  getNextWeekdayByIndex as _getNextWeekdayByIndex,
  getPrevWeekdayByIndex as _getPrevWeekdayByIndex,
  getUnixTimestamp as _getUnixTimestamp,
  getWeek as _getWeek,
  subtractDays as _subtractDays,
} from "./dates.ts";

export const addDays = (n: number) => expose((d) => _addDays(d, n));
export const subtractDays = (n: number) => expose((d) => _subtractDays(d, n));
export const getUnixTimestamp = expose(_getUnixTimestamp);
export const getNextWeekdayByIndex = (i: number) =>
  expose((d) => _getNextWeekdayByIndex(d, i));
export const getPrevWeekdayByIndex = (i: number) =>
  expose((d) => _getPrevWeekdayByIndex(d, i));
export const getWeek = expose(_getWeek);
