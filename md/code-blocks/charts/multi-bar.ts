import type { ChartData } from "./parse.ts";
import { renderVegalite } from "./vega.ts";
import { checkLabelValues } from "./validate-sanitize.ts";

interface Config {
  width: number;
  height: number;
  yLabel?: string;
  [key: string]: any;
}

const defaultConfig: Config = {
  width: 400,
  height: 200,
};

export default async (d: ChartData, area: boolean = false) => {
  const { isInvalid, sanitizeData } = checkLabelValues;

  if (isInvalid(d)) {
    throw new Error("Invalid data");
  }

  const config = { ...defaultConfig, ...d.meta };
  const [x, ...rest] = d.columns;

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": config.width,
    "height": config.width,
    "data": {
      "values": sanitizeData(d),
    },
    "repeat": { "layer": rest },
    "spec": {
      "mark": "bar",
      "encoding": {
        "x": {
          "field": x,
          "type": "nominal",
        },
        "y": {
          "field": { "repeat": "layer" },
          "type": "quantitative",
          "title": config.yLabel,
        },
        "color": { "datum": { "repeat": "layer" } },
        "xOffset": { "datum": { "repeat": "layer" } },
      },
    },
    "config": {
      "mark": { "invalid": null },
    },
  };

  return renderVegalite(spec);
};
