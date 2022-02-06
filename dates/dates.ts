const isValid = (date?: any): date is Date => {
  return date instanceof Date && !Number.isNaN(date.getTime());
};

const cloneDate = (date: Date) => new Date(date.getTime());

export const addDays = (date: Date, n: number) => {
  const clone = cloneDate(date);
  clone.setDate(date.getDate() + n);
  return clone;
};

export const subtractDays = (date: Date, n: number) => {
  const clone = cloneDate(date);
  clone.setDate(date.getDate() - n);
  return clone;
};

export const getPrevWeekdayByIndex = (date: Date, jsIndex: number) => {
  let prev = new Date(date);
  while (prev.getDay() !== jsIndex) {
    prev = subtractDays(prev, 1);
  }
  return prev;
};

export const getNextWeekdayByIndex = (date: Date, jsIndex: number) => {
  let next = new Date(date);
  while (next.getDay() !== jsIndex) {
    next = addDays(next, 1);
  }
  return next;
};

const getPrevMonday = (date: Date) => getPrevWeekdayByIndex(date, 1);

const getNextSunday = (date: Date) => getNextWeekdayByIndex(date, 0);

export const getWeek = (date: Date) => {
  const monday = getPrevMonday(date);
  return Array.from(Array(7)).map((_, i) => addDays(monday, i));
};

const getYYYYMMDD = (date: Date) => date.toISOString().split("T")[0];

const getFirstDayOfMonth = (date: Date) => {
  const [yyyy, mm] = getYYYYMMDD(date);
  return new Date(`${yyyy}-${mm}-01`);
};

const getWeeksOfMonth = (date: Date) => {
  const firstDay = getFirstDayOfMonth(date);
  const firstDayOfFirstWeek = getPrevMonday(firstDay);
  return Array.from(Array(6))
    .map((_, i) => getWeek(addDays(firstDayOfFirstWeek, i * 7)))
    .filter((d, i) => d[0].getMonth() === date.getMonth() || i === 0);
};

const getSomeDayOfNextMonth = (date: Date) =>
  addDays(getFirstDayOfMonth(date), 32);

const getLastDayOfPreviousMonth = (date: Date) =>
  subtractDays(getFirstDayOfMonth(date), 1);

const getFirstDayOfPreviousMonth = (date: Date) =>
  getFirstDayOfMonth(getLastDayOfPreviousMonth(date));

const getFirstDayOfYear = (date: Date) => new Date(String(date.getFullYear()));

const getLastDayOfYear = (date: Date) =>
  new Date(`${date.getFullYear()}-12-31`);

const isSunday = (date: Date) => date.getDay() === 0;

interface DayInMonth {
  date: Date;
  inMonth: boolean;
}

interface WeeksInMonth {
  monthIndex: number;
  date: Date;
  weeks: DayInMonth[][];
  next: () => WeeksInMonth;
  prev: () => WeeksInMonth;
}

const formatMonth = (month: Date[][], date: Date): DayInMonth[][] =>
  month.map(
    (week) =>
      week.map(
        (d) => ({
          date: d,
          inMonth: d.getMonth() === date.getMonth(),
        }),
      ),
  );

const getMonth = (date: Date): WeeksInMonth => {
  if (!isValid(date)) throw "invalid date";
  const month = getWeeksOfMonth(date);
  return {
    monthIndex: date.getMonth(),
    date,
    weeks: formatMonth(month, date),
    next: () => getMonth(getSomeDayOfNextMonth(date)),
    prev: () => getMonth(getFirstDayOfPreviousMonth(date)),
  };
};

const getWeeksOfYear = (date: Date): Date[][] => {
  const first = getFirstDayOfYear(date);
  const last = getNextSunday(getLastDayOfYear(date));
  let day = getPrevMonday(first);
  let weeks = [], week = [];
  while (day <= last) {
    week.push(day);
    if (isSunday(day)) {
      weeks.push(week);
      week = [];
    }
    day = subtractDays(day, 1);
  }
  return weeks;
};

export const getUnixTimestamp = (date: Date) =>
  Math.round(date.getTime() / 1000);

export const expose = <T>(func: (date: Date) => T) => {
  return (date?: Date) => {
    if (!date) return func(new Date());
    if (isValid(date)) return func(date);
    throw "invalid date";
  };
};
