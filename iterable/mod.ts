export { pipe } from "./pipe.js";
export { fromFile } from "./from-file.ts";

export type Func<A, B> =
  | ((d: A) => Promise<B | undefined>)
  | ((d: A) => B | undefined);

export const toArray = async <T>(
  iterable: AsyncGenerator<T> | AsyncIterable<T>,
) => {
  const result: T[] = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
};
