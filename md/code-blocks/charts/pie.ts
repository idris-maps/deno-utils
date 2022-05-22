import type { DsvData } from "./deps.ts";
import { vegaliteToSvg } from "./deps.ts";
import { checkLabelValue, currentColor, isArrayOfStrings } from "./utils/mod.ts";

interface Config {
  width: number;
  height: number;
  donut?: string | boolean;
  background?: boolean
  [key: string]: unknown;
}

const defaultConfig: Config = {
  width: 400,
  height: 200,
};

export default async (d: DsvData) => {
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

  const colors = isArrayOfStrings(d.meta.colors) ? d.meta.colors : undefined

  const baseSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    width: config.width,
    height: config.height,
    data: {
      values: sanitizeData(d),
    },
    mark,
    encoding: {
      theta: {
        field: d.columns[1],
        type: "quantitative",
      },
      color: {
        field: d.columns[0], 
        type: "nominal",
        scale: colors ? { range: colors } : undefined,
      },
    },
    view: { "stroke": null },
  };

  const spec = config.background ? baseSpec : { ...baseSpec, ...currentColor }

  return vegaliteToSvg(spec);
};
