import type { ChartData } from "./parse.ts";
import { renderVegalite } from "./vega.ts";
import { checkDateValueLabel, checkXValueLabel } from "./validate-sanitize.ts";

interface Config {
  width: number;
  height: number;
  color: string;
  temporal?: boolean;
  [key: string]: any;
}

const defaultConfig: Config = {
  width: 400,
  height: 200,
  color: "steelblue",
};

export default async (d: ChartData, area: boolean = false) => {
  const { isInvalid, sanitizeData } = d.meta.temporal
    ? checkDateValueLabel
    : checkXValueLabel;

  if (isInvalid(d)) {
    throw new Error("Invalid data");
  }

  const config = { ...defaultConfig, ...d.meta };
  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "width": config.width,
    "height": config.height,
    "data": {
      "values": sanitizeData(d),
    },
    "mark": "line",
    "encoding": {
      "x": {
        "field": d.columns[0],
        "type": config.temporal ? "temporal" : "ordinal",
      },
      "y": { "field": d.columns[1], "type": "quantitative" },
      "color": { "field": d.columns[2], "type": "nominal" },
    },
  };

  return await renderVegalite(spec);
};
