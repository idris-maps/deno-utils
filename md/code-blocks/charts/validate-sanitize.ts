import type { ChartData } from "./parse.ts";

export const checkLabelValue = () => {
  const isValidRow = ([label, value]: string[], d: any) =>
    String(d[label]) === d[label] &&
    !Number.isNaN(Number(d[value]));

  const isInvalid = ({ columns, data }: ChartData) =>
    columns.length < 2 ||
    !data.length ||
    data.some((d) => !isValidRow(columns, d));

  const sanitizeData = ({ columns, data }: ChartData) => {
    const [label, value] = columns;
    return data.map((d) => ({
      [label]: String(d[label]),
      [value]: Number(d[value]),
    }));
  };

  return { isInvalid, sanitizeData };
};
