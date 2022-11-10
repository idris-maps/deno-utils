/** @type {import('./pipe.d.ts').pipe} */
export const pipe = (...funcs) => (data) =>
  funcs.reduce((r, func) => func(r), data);
