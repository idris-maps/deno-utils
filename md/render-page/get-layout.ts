export interface HeadTag {
  tag: string;
  props?: Record<string, string>;
  content?: string;
}

export interface LayoutConfig {
  css: string[];
  scripts: string[];
  title: string;
  lang: string;
  headTags: HeadTag[];
}

const defaultTags: HeadTag[] = [
  { tag: "meta", props: { charset: "utf-8" } },
  {
    tag: "meta",
    props: {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
  },
];

const renderHeadTag = (d: HeadTag) =>
  [
    "<",
    d.tag,
    " ",
    Object.entries(d.props || {}).map(([key, value]) => `${key}="${value}"`)
      .join(" "),
    d.content ? `>${d.content.trim()}</${d.tag}>` : " />",
  ].join("");

const renderHead = (d: HeadTag[]) => d.map(renderHeadTag).join("\n");

const getHeadTags = (d: Partial<LayoutConfig>) => [
  ...defaultTags,
  ...(d.headTags || []),
  ...(d.title ? [d.title] : []).map((content) => ({
    tag: "title",
    content,
  })),
  ...(d.css || []).map((href) => ({
    tag: "link",
    props: { rel: "stylesheet", href },
  })),
  ...(d.scripts || []).map((src) => ({
    tag: "script",
    props: { src },
    content: " ",
  })),
];

export const getLayout = (
  content: string,
  config: Partial<LayoutConfig> = {},
) =>
  [
    "<!DOCTYPE html>",
    config.lang ? `<html lang="${config.lang}">` : "<html>",
    "<head>",
    renderHead(getHeadTags(config)),
    "</head>",
    "<body>",
    "<main>",
    content,
    "</main>",
    "</body>",
    "</html>",
  ].join("\n");
