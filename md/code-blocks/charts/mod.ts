import area from "./area.ts";
import bar from "./bar.ts";
import multiBar from "./multi-bar.ts";
import multiLine from "./multi-line.ts";
import pie from "./pie.ts";
import stackedBar from "./stacked-bar.ts";
import { parseData } from "./parse.ts";
import type { ChartData } from "./parse.ts";
import type { CodeBlockHandlers } from "./deps.ts";

const removeWidthAndHeight = (svg: string) => {
  const [svgTag, ...rest] = svg.split('>')
  const svgAttrs = svgTag.split(' ')
  return [
    svgAttrs.filter(d => !d.startsWith('width=') && !d.startsWith('height=')).join(' '),
    ...rest,
  ].join('>')
}

const wrap = (func: (d: ChartData) => Promise<string>) =>
  async (content: string) => {
    const data = await parseData(content)
    const svg = await func(data)
    return removeWidthAndHeight(svg)
  };

const handlers: CodeBlockHandlers = {
  "area-chart": wrap(area),
  "bar-chart": wrap(bar),
  "multibar-chart": wrap(multiBar),
  "multiline-chart": wrap(multiLine),
  "pie-chart": wrap(pie),
  "stackedbar-chart": wrap(stackedBar),
};

export default handlers;
