import type { HeadTag, LayoutConfig } from "./get-layout.ts";
import { is, isArrayOf, isArrayOfStrings, isRecord, isString } from "./deps.ts";

const isHeadTagProps = is<Record<string, string>>((d) =>
  isRecord(d) &&
  Object.values(d).every(isString)
);

const isHeadTag = is<HeadTag>((d) =>
  isRecord(d) &&
  isString(d.tag) &&
  (d.props ? isHeadTagProps(d.props) : true) &&
  (d.content ? isString(d.content) : true)
);

export const getLayoutConfig = (
  meta: unknown,
  globalLayoutConfig: Partial<LayoutConfig>,
  codeblockCss: string[] = [],
  codeblockScripts: string[] = [],
) => {
  const config: Partial<LayoutConfig> = {
    scripts: [],
    css: [],
    headTags: [],
    ...globalLayoutConfig,
  };
  if (!isRecord(meta)) return config;

  if (isString(meta.title)) config.title = meta.title;
  if (isString(meta.lang)) config.lang = meta.lang;
  if (isString(meta.script) && config.scripts) config.scripts.push(meta.script);
  if (isArrayOfStrings(meta.scripts)) {
    meta.scripts.forEach((d) => {
      if (config.scripts) config.scripts.push(d);
    });
  }
  if (isString(meta.css) && config.css) config.css.push(meta.css);
  if (isArrayOfStrings(meta.css)) {
    meta.css.forEach((d) => {
      if (config.css) config.css.push(d);
    });
  }
  if (isArrayOf<HeadTag>(isHeadTag)(meta.headTags)) {
    meta.headTags.forEach((d) => {
      if (config.headTags) config.headTags.push(d);
    });
  }

  codeblockCss.forEach((d) => {
    if (config.css) config.css.push(d);
  });

  codeblockScripts.forEach((d) => {
    if (config.scripts) config.scripts.push(d);
  });

  return config;
};
