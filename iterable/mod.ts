import { readableStreamFromReader, TextLineStream } from "./deps.ts";
export { pipe } from "./pipe.js";

type AnyIterable<T> =
  | Generator<T>
  | Iterable<T>
  | AsyncGenerator<T>
  | AsyncIterable<T>;

// -- input --

export const linesFromFile = async function* (filename: string) {
  const file = await Deno.open(filename, { read: true });
  const lines = readableStreamFromReader(file)
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  for await (const line of lines) {
    yield line;
  }
};

export const linesFromStdin = async function* () {
  const lines = readableStreamFromReader(Deno.stdin)
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  for await (const line of lines) {
    yield line;
  }
};

// -- transforms --

export const map = <A, B>(func: (d: A, index: number) => B) => {
  let i = 0;
  return async function* (iterable: AnyIterable<A>) {
    for await (const item of iterable) {
      yield func(item, i);
      i++;
    }
  };
};

export const filter = <T>(
  func: (d: T, index: number) => boolean | Promise<boolean>,
) => {
  let i = 0;
  return async function* (iterable: AnyIterable<T>) {
    for await (const item of iterable) {
      if (await func(item, i)) yield item;
      i++;
    }
  };
};

export const tap = <T>(func: (d: T, index: number) => void) => {
  let i = 0;
  return async function* (iterable: AnyIterable<T>) {
    for await (const item of iterable) {
      func(item, i);
      yield item;
      i++;
    }
  };
};

export const take = <T>(num: number) => {
  let i = 0;
  return async function* (iterable: AnyIterable<T>) {
    for await (const item of iterable) {
      if (i < num) {
        yield item;
        i++;
      }
    }
  };
};

export const drop = <T>(num: number) => {
  let i = 0;
  return async function* (iterable: AnyIterable<T>) {
    for await (const item of iterable) {
      if (i >= num) {
        yield item;
        i++;
      }
    }
  };
};

export const dsvToJson = (delimiter = ",") => {
  const split = (line: string) => line.split(delimiter).map((d) => d.trim());

  let head: string[] = [];
  let gotHead = false;

  return async function* (
    iterable: AnyIterable<string>,
  ): AsyncGenerator<Record<string, string>> {
    for await (const line of iterable) {
      if (!gotHead) {
        head = split(line);
        gotHead = true;
      } else {
        const data = split(line);
        yield head.reduce((r, key, i) => ({
          ...r,
          [key]: data[i],
        }), {});
      }
    }
  };
};

export const jsonToDsv = (delimiter = ",") => {
  let keys: string[] = [];
  let gotKeys = false;

  return async function* (iterable: AnyIterable<Record<string, unknown>>) {
    for await (const item of iterable) {
      if (!gotKeys) {
        keys = Object.keys(item);
        gotKeys = true;
        yield keys.join(delimiter);
      }

      yield keys.map((key) => String(item[key])).join(delimiter);
    }
  };
};

export async function* flatten<T>(iterable: AnyIterable<T[]>) {
  for await (const item of iterable) {
    for (const part of item) {
      yield part;
    }
  }
}

// -- output --

export const toArray = async <T>(
  iterable: AnyIterable<T>,
) => {
  const result: T[] = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
};

export type Reducer<A, B> = (previous: B, value: A, index: number) => B;

export const reduce = <A, B>(reducer: Reducer<A, B>, initalValue: B) => {
  let i = 0;
  let result = initalValue;
  return async (iterable: AnyIterable<A>): Promise<B> => {
    for await (const item of iterable) {
      result = await reducer(result, item, i);
      i++;
    }
    return result;
  };
};

export const forEach = <T>(func: (d: T, index: number) => void) => {
  let i = 0;
  return async (iterable: AnyIterable<T>): Promise<void> => {
    for await (const item of iterable) {
      await func(item, i);
      i++;
    }
    return;
  };
};
