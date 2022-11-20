import type { AnyIterable } from "./deps.ts";
import type { LayoutConfig } from "./get-layout.ts";
import type { ReplaceData } from "./replace-data.ts";
import { map, pipe, toArray } from "./deps.ts";
import { separateFrontmatter } from "./separate-frontmatter.ts";
import { replaceData } from "./replace-data.ts";
import { Part, separateCodeblocks } from "./separate-codeblocks.ts";
import { renderHtml } from "./render-html.ts";
import { getLayoutConfig } from "./get-layout-config.ts";
import { getLayout } from "./get-layout.ts";
import { parseFrontmatter } from "./parse-frontmatter.ts";
import { getCodeblocksCss, getCodeblocksScripts } from "./get-lang-assets.ts";

export const renderPage = (
  md2html: (d: string) => Promise<string>,
  codeblockHandlers: Array<{ [key: string]: (d: string) => Promise<string> }> =
    [],
  codeblockAssets: { [key: string]: { css?: string[]; scripts?: string[] } } =
    {},
  globalLayoutConfig: Partial<LayoutConfig> = {},
) =>
async (
  lines: AnyIterable<string>,
  data: ReplaceData = {},
) => {
  const [fmLines, mdLines] = separateFrontmatter(lines);
  const meta = await parseFrontmatter(fmLines, data);
  const langs: string[] = [];

  const getLangs = (d: Part): Part => {
    if (d.type === "code" && d.lang) {
      langs.push(d.lang);
    }
    return d;
  };

  const htmlParts = pipe(
    replaceData(meta),
    separateCodeblocks,
    map(getLangs),
    renderHtml(md2html, codeblockHandlers),
  )(mdLines);

  const content = (await toArray(htmlParts)).join("\n");

  const layoutConfig = getLayoutConfig(
    meta,
    globalLayoutConfig,
    getCodeblocksCss(langs, codeblockAssets),
    getCodeblocksScripts(langs, codeblockAssets),
  );

  return getLayout(content, layoutConfig);
};
