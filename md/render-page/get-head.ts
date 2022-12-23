import type { HeadTag, LayoutConfig } from "./types.d.ts";

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

export const getHead = (config: Partial<LayoutConfig>) =>
  renderHead(getHeadTags(config));
