import { splitAsLongAs } from "./split-as-long-as.ts";
import type { AnyIterable } from "./deps.ts";

export const FRONTMATTER_FENCE = "---";

const condition = () => {
  let first: string | undefined = undefined;
  let isFrontmatter = false;

  return (line: string) => {
    if (!first) {
      first = line;
      isFrontmatter = line.trim() === FRONTMATTER_FENCE;
      return isFrontmatter;
    } else {
      if (isFrontmatter) {
        if (line.trim() === FRONTMATTER_FENCE) {
          isFrontmatter = false;
        }
        return true;
      } else {
        return false;
      }
    }
  };
};

export const separateFrontmatter = (lines: AnyIterable<string>) =>
  splitAsLongAs(condition(), lines);
