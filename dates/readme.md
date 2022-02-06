# dates

## addDays

```ts
const addDays: (n: number) => (date?: Date | undefined) => Date;
```

## getMonth

```ts
const getMonth: (date?: Date | undefined) => WeeksInMonth;

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
```

## getNextWeekdayByIndex

```ts
const getNextWeekdayByIndex: (i: number) => (date?: Date | undefined) => Date;
```

## getPrevWeekdayByIndex

```ts
const getPrevWeekdayByIndex: (i: number) => (date?: Date | undefined) => Date;
```

## getUnixTimestamp

```ts
const getUnixTimestamp: (date?: Date | undefined) => number;
```

## getWeek

Monday to Sunday

```ts
const getWeek: (date?: Date | undefined) => Date[];
```

## getWeeksOfMonth

```ts
const getWeeksOfMonth: (date?: Date | undefined) => Date[][];
```

## getYYYYMMDD

```ts
const getYYYYMMDD: (date?: Date | undefined) => string;
```

## subtractDays

```ts
const subtractDays: (n: number) => (date?: Date | undefined) => Date;
```
