import * as md from "./markdown.es.embed.js";
import type { ParseOptions } from "./markdown.d.ts";

export default async (source: string | ArrayLike<number>): Promise<string> => {
  const parseOptions: ParseOptions = {
    bytes: false,
    parseFlags: md.ParseFlags.DEFAULT | md.ParseFlags.NO_HTML |
      md.ParseFlags.UNDERLINE,
  };
  await md.ready;
  return md.parse(source, parseOptions);
};
