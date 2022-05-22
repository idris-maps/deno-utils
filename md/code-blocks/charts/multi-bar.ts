import type { DsvData } from "./deps.ts";
import { vegaliteToSvg } from "./deps.ts";
import { checkLabelValues, currentColor, isArrayOfStrings } from "./utils/mod.ts";

interface Config {
  width: number;
  height: number;
  yLabel?: string;
  background?: boolean;
  [key: string]: any;
}

const defaultConfig: Config = {
  width: 400,
  height: 200,
};

export default async (d: DsvData, area: boolean = false) => {
  const { isInvalid, sanitizeData } = checkLabelValues;

  if (isInvalid(d)) {
    throw new Error("Invalid data");
  }

  const config = { ...defaultConfig, ...d.meta };
  const [x, ...rest] = d.columns;
  const colors = isArrayOfStrings(d.meta.colors) ? d.meta.colors : undefined;

  const baseSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    width: config.width,
    height: config.height,
    data: {
      values: sanitizeData(d),
    },
    repeat: { layer: rest },
    spec: {
      mark: "bar",
      encoding: {
        x: {
          field: x,
          type: "nominal",
        },
        y: {
          field: { repeat: "layer" },
          type: "quantitative",
          title: config.yLabel,
        },
        color: {
          datum: { repeat: "layer" },
          scale: colors ? { range: colors } : undefined,
        },
        xOffset: { datum: { repeat: "layer" } },
      },
    },
    config: {
      mark: { invalid: null },
    },
  };

  const spec = config.background
    ? baseSpec
    : { ...baseSpec, ...currentColor }
  return vegaliteToSvg(spec);
};
