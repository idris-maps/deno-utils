import { renderVega, renderVegalite } from './vegalite.js';

/**
 * @param json see https://vega.github.io/vega/docs/
 * @returns svg
 */
export const vegaToSvg = (json: object): Promise<string> =>
  renderVega(json)

/**
 * @param json see https://vega.github.io/vega-lite/docs/
 * @returns svg
 */
export const vegaliteToSvg = (json: object): Promise<string> =>
  renderVegalite(json)
