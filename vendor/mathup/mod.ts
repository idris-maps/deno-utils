import mathup from "./mathup.js";

export interface MathUpOptions {
  decimalMark?: string;
  colSep?: string;
  rowSep?: string;
  display?: string;
  dir?: string;
  bare?: boolean;
}

const defaultOptions: MathUpOptions = {
  decimalMark: ".",
  colSep: ",",
  rowSep: ";",
  display: "inline",
  dir: "ltr",
  bare: false,
};

export default (equation: string, options: MathUpOptions = {}) =>
  // @ts-ignore ?
  mathup(equation, { ...defaultOptions, ...options });
