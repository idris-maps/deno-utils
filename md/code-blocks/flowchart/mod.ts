import { renderFlowchart } from "./deps.ts";
import type { CodeBlockHandlers } from "./deps.ts";

const handlers: CodeBlockHandlers = {
  "flowchart": (d) => renderFlowchart(d),
};

export default handlers;
