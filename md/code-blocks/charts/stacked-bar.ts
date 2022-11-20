import type { DsvData } from "./deps.ts";
import { vegaliteToSvg } from "./deps.ts";
import {
  checkXValueLabel,
  currentColor,
  isArrayOfStrings,
} from "./utils/mod.ts";

interface Config {
  width: number;
  height: number;
  background?: boolean;
  [key: string]: unknown;
}

const defaultConfig: Config = {
  width: 400,
  height: 200,
};

export default (d: DsvData) => {
  const { isInvalid, sanitizeData } = checkXValueLabel;

  if (isInvalid(d)) {
    throw new Error("Invalid data");
  }

  const config = { ...defaultConfig, ...d.meta };
  const colors = isArrayOfStrings(d.meta.colors) ? d.meta.colors : undefined;

  const baseSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    width: config.width,
    height: config.height,
    data: {
      values: sanitizeData(d),
    },
    mark: "bar",
    encoding: {
      x: { field: d.columns[0], type: "ordinal" },
      y: { field: d.columns[1], type: "quantitative" },
      color: {
        field: d.columns[2],
        type: "nominal",
        scale: colors ? { range: colors } : undefined,
      },
    },
  };

  const spec = config.background ? baseSpec : { ...baseSpec, ...currentColor };

  return vegaliteToSvg(spec);
};
