const minify = (d: string) =>
  d.replaceAll("\n", "")
    .replaceAll("\t", "")
    .replaceAll("  ", "");

const stringifyArg = (d: any): string => {
  if (typeof d === "undefined" || String(d) === "null") return "";
  if (Array.isArray(d)) return d.map(stringifyArg).join("");
  return String(d);
};

const html = (str: TemplateStringsArray, ...args: any[]) =>
  str.reduce(
    (r: string, d: string, i: number) => r + minify(d) + stringifyArg(args[i]),
    "",
  );

export default html;
