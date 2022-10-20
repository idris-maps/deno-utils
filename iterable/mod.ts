export { pipe } from "./pipe.js";
export { fromFile } from "./from-file.ts";

export type Iter<T> = AsyncGenerator<T> | AsyncIterable<T>;
export type IterFunc<A, B> =
  | ((d: A) => Promise<B | undefined>)
  | ((d: A) => B | undefined);

export const iterate = <A, B>(func: IterFunc<A, B>) => {
  return async function* (iterable: Iter<A>) {
    for await (const item of iterable) {
      const res = await func(item);
      if (res) yield res;
    }
  };
};

export const toArray = async <T>(iterable: Iter<T>) => {
  const result: T[] = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
};
