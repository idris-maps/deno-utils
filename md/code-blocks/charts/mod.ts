import area from "./area.ts";
import bar from "./bar.ts";
import multiBar from "./multi-bar.ts";
import multiLine from "./multi-line.ts";
import pie from "./pie.ts";
import stackedBar from "./stacked-bar.ts";
import { parseData } from "./parse.ts";
import type { ChartData } from "./parse.ts";
import type { CodeBlockHandlers } from "./deps.ts";

const wrap = (func: (d: ChartData) => Promise<string>) =>
  async (content: string) => func(await parseData(content));

const handlers: CodeBlockHandlers = {
  "area-chart": wrap(area),
  "bar-chart": wrap(bar),
  "multibar-chart": wrap(multiBar),
  "multiline-chart": wrap(multiLine),
  "pie-chart": wrap(pie),
  "stackedbar-chart": wrap(stackedBar),
};

export default handlers;
