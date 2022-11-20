import type { AnyIterable } from "./deps.ts";
import type { ReplaceData } from "./replace-data.ts";
import { is, isRecord, parseYAML, toArray } from "./deps.ts";
import { FRONTMATTER_FENCE } from "./separate-frontmatter.ts";
import { replaceData } from "./replace-data.ts";

export const parseFrontmatter = async (
  lines: AnyIterable<string>,
  data: ReplaceData = {},
): Promise<ReplaceData> => {
  const yaml = (await toArray(replaceData(data)(lines)))
    .filter((d) => d !== FRONTMATTER_FENCE)
    .join("\n");

  try {
    const frontmatter = parseYAML(yaml);
    if (is<ReplaceData>(isRecord)(frontmatter)) {
      return { ...data, ...frontmatter };
    }
  } catch {
    return data;
  }

  return data;
};
