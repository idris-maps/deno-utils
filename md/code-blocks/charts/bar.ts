import type { DsvData } from "./deps.ts";
import { vegaliteToSvg } from "./deps.ts";
import { checkLabelValue, currentColor } from "./utils/mod.ts";

interface Config {
  width: number;
  height: number;
  color: string;
  background: boolean;
  [key: string]: unknown;
}

const defaultConfig: Config = {
  width: 400,
  height: 200,
  color: "currentColor",
  background: false,
};

export default (d: DsvData) => {
  const { isInvalid, sanitizeData } = checkLabelValue;

  if (isInvalid(d)) {
    throw new Error("Invalid data");
  }

  const config: Config = { ...defaultConfig, ...d.meta };

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
      color: { value: config.color },
    },
  };

  const spec = config.background ? baseSpec : { ...baseSpec, ...currentColor };

  return vegaliteToSvg(spec);
};
