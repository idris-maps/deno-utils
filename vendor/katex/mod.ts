import renderToString from "./katex.js";

export interface TrustContext {
  command: string;
  url: string;
  protocol: string;
}

export interface KatexOptions {
  displayMode: boolean;
  output: "html" | "mathml" | "htmlAndMathml";
  leqno: boolean;
  fleqn: boolean;
  throwOnError: boolean;
  errorColor: string;
  macros: object;
  minRuleThickness?: number;
  colorIsTextColor?: boolean;
  maxSize?: number;
  maxExpand?: number;
  strict?: boolean | string | Function;
  trust?: boolean | ((context: TrustContext) => boolean);
  globalGroup?: boolean;
}

export default (katex: string, options?: Partial<KatexOptions>): string =>
  renderToString(katex, options);
