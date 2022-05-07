import type { ChartData } from "./parse.ts";
import { renderVegalite } from "./vega.ts";
import { checkLabelValue } from "./validate-sanitize.ts";

interface Config {
  width: number;
  height: number;
  donut?: string | boolean;
  [key: string]: unknown;
}

const defaultConfig: Config = {
  width: 400,
  height: 200,
};

export default async (d: ChartData) => {
  const { isInvalid, sanitizeData } = checkLabelValue;

  if (isInvalid(d)) {
    throw new Error("Invalid data");
  }

  const config: Config = { ...defaultConfig, ...d.meta };

  const mark = config.donut
    ? {
      type: "arc",
      innerRadius: Math.round(Math.min(config.height, config.width) / 3),
    }
    : "arc";

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "width": config.width,
    "height": config.height,
    "data": {
      "values": sanitizeData(d),
    },
    mark,
    "encoding": {
      "theta": { "field": d.columns[1], "type": "quantitative" },
      "color": { "field": d.columns[0], "type": "nominal" },
    },
    "view": { "stroke": null },
  };

  return renderVegalite(spec);
};
