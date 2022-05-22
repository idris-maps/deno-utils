import type { DsvData } from "./deps.ts";
import { vegaliteToSvg } from "./deps.ts";
import { checkDateValue, checkLabelValue, currentColor } from "./utils/mod.ts";

interface Config {
  width: number;
  height: number;
  color: string;
  temporal?: boolean;
  background?: boolean;
  [key: string]: any;
}

const defaultConfig: Config = {
  width: 400,
  height: 200,
  color: "currentColor",
};

export default async (d: DsvData, area: boolean = false) => {
  const { isInvalid, sanitizeData } = d.meta.temporal
    ? checkDateValue
    : checkLabelValue;

  if (isInvalid(d)) {
    throw new Error("Invalid data");
  }

  const config = { ...defaultConfig, ...d.meta };

  const baseSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "width": config.width,
    "height": config.height,
    "data": {
      "values": sanitizeData(d),
    },
    "mark": area ? "area" : "line",
    "encoding": {
      "x": {
        "field": d.columns[0],
        "type": config.temporal ? "temporal" : "ordinal",
      },
      "y": { "field": d.columns[1], "type": "quantitative" },
      "color": { "value": config.color },
    },
  };

  const spec = config.background ? baseSpec : { ...baseSpec, ...currentColor };

  return await vegaliteToSvg(spec);
};
