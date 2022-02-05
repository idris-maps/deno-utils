type Gen<T> = Generator<T, void, unknown>;

const toChars = function* (html: string): Gen<string> {
  const chars = Array.from(html);
  let i = 0;
  const length = chars.length;
  while (i < length) {
    yield chars[i];
    i = i + 1;
  }
};

const comparePrev = function* (iterator: Gen<string>): Gen<string> {
  let prev;
  for (const char of iterator) {
    if (char === "/" && !prev) {
      yield " /";
    } else if (
      char !== "\t" &&
      char !== "\n" &&
      !(char === " " && prev === " ") &&
      !(char === " " && prev === ">") &&
      !(char === " " && !prev)
    ) {
      yield char;
      prev = char;
    }
  }
};

const compareNext = function* (iterator: Gen<string>): Gen<string> {
  let current;
  for (const next of iterator) {
    if (
      current &&
      !(current === " " && next === ">") &&
      !(current === " " && next === "<")
    ) {
      yield current;
    }
    current = next;
  }
  if (current) {
    yield current;
  }
};

const pipe = (...funcs: Array<(d: Gen<string>) => Gen<string>>) =>
  (iterator: Gen<string>) => funcs.reduce((d, f) => f(d), iterator);

const minify = (html: string) => {
  let result = "";
  for (const char of pipe(comparePrev, compareNext)(toChars(html))) {
    result = result + char;
  }
  return result;
};

const stringifyArg = (d: any): string => {
  if (typeof d === "undefined" || String(d) === "null") return "";
  if (Array.isArray(d)) return d.map(stringifyArg).join("");
  if (typeof d === "object") {
    return Object.entries(d)
      .map(([key, val]) => `${key}="${String(val)}"`)
      .join(" ");
  }
  return String(d);
};

const html = (str: TemplateStringsArray, ...args: any[]) =>
  str.reduce(
    (r: string, d: string, i: number) => r + minify(d) + stringifyArg(args[i]),
    "",
  );

export default html;
