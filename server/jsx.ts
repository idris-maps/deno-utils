export interface El {
  tag: string;
  props: {
    [key: string]: any;
  };
  children: Array<El | string> | null;
}

export const h = (tag: any, props: any, ...args: any): El => {
  if (typeof tag === "function") return tag(props || {});
  const children: Array<El | string> | null = args.length
    ? [].concat(...args)
    : null;
  return { tag, props, children };
};

const isString = (d: El | string): d is string => String(d) === d;
const stringifyProps = (props?: { [key: string]: any }): string =>
  props
    ? " " + Object.keys(props)
      .map((key) => `${key}="${String(props[key])}"`)
      .join(" ")
    : "";

export const renderString = (d: El | string | null): string => {
  if (!d) return "";
  if (isString(d)) return d;
  const { tag, props, children } = d;
  if (!tag) return renderString(String(d));
  return [
    `<${tag}${stringifyProps(props)}>`,
    children ? children.map(renderString).join("") : "",
    `</${tag}>`,
  ].join("");
};
