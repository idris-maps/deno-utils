import { ParseFlags as Flags, ParseOptions, toString } from "./deps.ts";

export const ParseFlags = Flags;

export default (
  source: string | ArrayLike<number>,
  options?: ParseOptions,
): Promise<string> => {
  const parseOptions: ParseOptions = {
    parseFlags: ParseFlags.DEFAULT | ParseFlags.NO_HTML | ParseFlags.UNDERLINE,
  };
  return toString(source, options || parseOptions);
};
