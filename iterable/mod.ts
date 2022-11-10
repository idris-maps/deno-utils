export { pipe } from "./pipe.js";
export { linesFromFile } from "./from-file.ts";

type AnyIterable<T> =
  | Generator<T>
  | Iterable<T>
  | AsyncGenerator<T>
  | AsyncIterable<T>;

export const toArray = async <T>(
  iterable: AnyIterable<T>,
) => {
  const result: T[] = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
};

export const map = <A, B>(func: (d: A) => B) => {
  return async function* (iterable: AnyIterable<A>) {
    for await (const item of iterable) {
      yield func(item);
    }
  };
};

export const filter = <T>(func: (d: T) => boolean | Promise<boolean>) => {
  return async function* (iterable: AnyIterable<T>) {
    for await (const item of iterable) {
      if (await func(item)) yield item;
    }
  };
};
