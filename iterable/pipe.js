const iterate = (func) => {
  return async function* (iterable) {
    for await (const item of iterable) {
      const res = await func(item);
      if (res) yield res;
    }
  };
};

/** @type {import('./pipe.d.ts').pipe} */
export const pipe = (...funcs) => (iterable) =>
  funcs.map(iterate).reduce((r, func) => func(r), iterable);
