// deno-lint-ignore-file no-explicit-any
import type { DsvData } from "../deps.ts";

const isString = (d: any) => String(d) === d;
const isNum = (d: any) => !Number.isNaN(Number(d));
const isDateString = (d: string) =>
  isString(d) && !Number.isNaN(new Date(d).getDate());

const validate = (validators: Array<(d: any) => boolean>) => {
  const isValidRow = (columns: string[], d: any) =>
    columns.every((col, i) => {
      const isValid = validators[i] || validators[1];
      return isValid(d[col]);
    });

  return ({ columns, data }: DsvData) =>
    columns.length < validators.length ||
    !data.length ||
    data.some((row) => !isValidRow(columns, row));
};

const sanitize =
  (to: (StringConstructor | NumberConstructor)[]) =>
  ({ columns, data }: DsvData) =>
    data.map((row) =>
      columns.reduce((r, column, i) => {
        const cast = to[i] || to[1];
        return { ...r, [column]: cast(row[column]) };
      }, {})
    );

export const checkLabelValue = {
  isInvalid: validate([isString, isNum]),
  sanitizeData: sanitize([String, Number]),
};

export const checkDateValue = {
  isInvalid: validate([isDateString, isNum]),
  sanitizeData: sanitize([String, Number]),
};

export const checkXValueLabel = {
  isInvalid: validate([isString, isNum, isString]),
  sanitizeData: sanitize([String, Number, String]),
};

export const checkDateValueLabel = {
  isInvalid: validate([isDateString, isNum, isString]),
  sanitizeData: sanitize([String, Number, String]),
};

export const checkLabelValues = {
  isInvalid: validate([isString, isNum]),
  sanitizeData: sanitize([String, Number]),
};
