import { ParseFlags, ParseOptions, toString } from "./deps.ts";

export default async (source: string | ArrayLike<number>): Promise<string> => {
  const parseOptions: ParseOptions = {
    parseFlags: ParseFlags.DEFAULT | ParseFlags.NO_HTML | ParseFlags.UNDERLINE,
  };
  return toString(source, parseOptions);
};
