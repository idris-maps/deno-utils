import { renderFlowchart } from "./deps.ts";
import type { CodeBlockHandlers } from "./deps.ts";

const handlers: CodeBlockHandlers = {
  "flowchart": async (d) => renderFlowchart(d),
};

export default handlers;
