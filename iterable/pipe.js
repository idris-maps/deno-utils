const iterate = (func) => {
  return async function* (iterable) {
    for await (const item of iterable) {
      const res = await func(item);
      if (typeof res !== "undefined") yield res;
    }
  };
};

/** @type {import('./pipe.d.ts').pipe} */
export const pipe = (...funcs) => (iterable) =>
  funcs.reduce((r, func) => iterate(func)(r), iterable);
