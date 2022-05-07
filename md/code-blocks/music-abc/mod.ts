import abcToSvg from "./abc.esm.js";

export default (abc: string): Promise<string> => abcToSvg(abc);
