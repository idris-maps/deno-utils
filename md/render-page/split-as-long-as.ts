import type { AnyIterable } from "./deps.ts";

const anyIterableToAsyncGenerator = async function* <T>(
  iterable: AnyIterable<T>,
): AsyncGenerator<T> {
  for await (const item of iterable) {
    yield item;
  }
};

export const splitAsLongAs = <T>(
  condition: (d: T) => boolean,
  _iterable: AnyIterable<T>,
): [AsyncGenerator<T>, AsyncGenerator<T>] => {
  const iterable = anyIterableToAsyncGenerator(_iterable);
  const source = iterable[Symbol.asyncIterator]();
  const buffer: T[] = [];
  const stop0 = Symbol(0);
  const stop1 = Symbol(1);
  const isT = (d: unknown): d is T =>
    (Boolean(d) || d === "") && d !== stop0 && d !== stop1;

  const next = async (i: number) => {
    if (i === 1 && buffer.length !== 0) {
      return buffer.shift();
    }
    const r = await source.next();
    if (r.done) {
      return stop1;
    }
    if (i === 0) {
      if (condition(r.value)) {
        return r.value;
      } else {
        buffer.push(r.value);
        return stop0;
      }
    } else {
      if (!condition(r.value)) {
        return r.value;
      } else {
        return undefined;
      }
    }
  };

  async function* one() {
    let run = true;
    while (run) {
      const v = await next(0);
      if (v === stop0) run = false;
      if (isT(v)) yield v;
    }
  }

  async function* two() {
    let run = true;
    while (run) {
      const v = await next(1);
      if (v === stop1) run = false;
      if (isT(v)) yield v;
    }
  }

  return [one(), two()];
};
