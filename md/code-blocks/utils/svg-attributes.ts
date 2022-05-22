export type SvgAttrs = { key: string; value: string }[];

const parseAttrs = (attrs: string): SvgAttrs => {
  let isKey = true;
  let key = "";
  let value = "";
  let res: SvgAttrs = [];
  const chars = Array.from(attrs.trim());
  chars.forEach((d, i) => {
    const next = chars[i + 1] || "";
    if (d === "=" && next === '"') {
      isKey = false;
    } else {
      if (d === '"' && [" ", "/"].includes(next) && !isKey) {
        isKey = true;
        res.push({ key, value });
        key = "";
        value = "";
      }
      if (isKey && d !== '"') key = key + d;
      if (!isKey && d !== '"') value = value + d;
    }
  });

  res.push({ key, value });

  return res
    .map(({ key, value }) => ({ key: key.trim(), value: value.trim() }))
    .filter(({ key }) => key !== "");
};

const stringifyAttrs = (attrs: SvgAttrs): string[] =>
  attrs.map(({ key, value }) => {
    if (value && value !== "") return `${key}="${value}"`;
    return key;
  });

export const updateSvgAttributes = (
  svg: string,
  fix: (prev: SvgAttrs) => SvgAttrs,
) => {
  const [svgTag, ...rest] = svg.split(">");
  const [tag, ...attrs] = svgTag.split(" ");

  const newAttrs = stringifyAttrs(fix(parseAttrs(attrs.join(" "))));
  const newSvgTag = [tag, ...newAttrs].join(" ");

  return [newSvgTag, ...rest].join(">");
};
