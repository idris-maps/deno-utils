import area from "./area.ts";
import bar from "./bar.ts";
import line from './line.ts'
import multiBar from "./multi-bar.ts";
import multiLine from "./multi-line.ts";
import pie from "./pie.ts";
import stackedBar from "./stacked-bar.ts";
import { parseDsv, updateSvgAttributes } from "./deps.ts";
import type { CodeBlockHandlers, DsvData, SvgAttrs } from "./deps.ts";

const wrap = (func: (d: DsvData) => Promise<string>) =>
  async (content: string) => {
    const data = await parseDsv(content)
    const svg = await func(data);
    const fix = (attrs: SvgAttrs) => attrs.filter(({ key }) => !['height', 'width'].includes(key))
    return updateSvgAttributes(svg, fix)
  }

const handlers: CodeBlockHandlers = {
  "area-chart": wrap(area),
  "bar-chart": wrap(bar),
  "line-chart": wrap(line),
  "multibar-chart": wrap(multiBar),
  "multiline-chart": wrap(multiLine),
  "pie-chart": wrap(pie),
  "stackedbar-chart": wrap(stackedBar),
};

export default handlers;
