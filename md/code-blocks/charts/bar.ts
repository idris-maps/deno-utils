import type { ChartData } from "./parse.ts";
import { vegaliteToSvg } from "./deps.ts";
import { checkLabelValue } from "./validate-sanitize.ts";

interface Config {
  width: number;
  height: number;
  color: string;
  [key: string]: unknown;
}

const defaultConfig: Config = {
  width: 400,
  height: 200,
  color: "steelblue",
};

export default async (d: ChartData) => {
  const { isInvalid, sanitizeData } = checkLabelValue;

  if (isInvalid(d)) {
    throw new Error("Invalid data");
  }

  const config: Config = { ...defaultConfig, ...d.meta };

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "width": config.width,
    "height": config.height,
    "data": {
      "values": sanitizeData(d),
    },
    "mark": "bar",
    "encoding": {
      "x": { "field": d.columns[0], "type": "ordinal" },
      "y": { "field": d.columns[1], "type": "quantitative" },
      "color": { "value": config.color },
    },
  };

  return vegaliteToSvg(spec);
};
