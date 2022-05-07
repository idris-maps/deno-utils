import line from './line.ts'
import type { ChartData } from "./parse.ts";

export default (d: ChartData) => line(d, true)
