const pairsReducer = <T>(r: [T, T][], d: T, i: number, all: T[]): [T, T][] =>
  i % 2 === 1 ? [...r, [all[i - 1], d]] : r;

export const pairs = <T>(arr: T[]) => {
  const init: [T, T][] = [];
  return arr.reduce(pairsReducer, init);
};

export const path = <T = any>(_path: string[], obj: any): T | undefined => {
  if (!obj) return undefined;
  const [first, ...rest] = _path;
  if (!first) return obj;
  return path(rest, obj[first]);
};

export const uniq = <T>(arr: T[]) => Array.from(new Set(arr));

export const has = (key: string, obj: object) => Object.keys(obj).includes(key);

export const isNum = (d: any): d is number => d && !Number.isNaN(d);

export const flatten = <T>(arr: T[][]) =>
  arr.reduce((r, _arr) => {
    _arr.forEach((d) => r.push(d));
    return r;
  }, []);

export const getBbox = (points: number[][]) =>
  points.reduce((r, [x, y]) => {
    if (r[0] > x) r[0] = x;
    if (r[1] > y) r[1] = y;
    if (r[2] < x) r[2] = x;
    if (r[3] < y) r[3] = y;
    return r;
  }, [Infinity, Infinity, -Infinity, -Infinity]);

export const isNonEmptyString = (d?: string) => d && String(d).trim() !== "";

export const getLinePath = ([first, ...rest]: [number, number][]) =>
  [
    `M ${first[0]} ${first[1]}`,
    ...pairs(rest).map(([one, two]) => {
      const [x1, y1] = one;
      const [x2, y2] = two;
      return ["Q", x1, y1, x2, y2].join(" ");
    }),
  ].join(" ");
