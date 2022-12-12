import { mathup } from "./deps.ts";
import { separateMeta } from "../utils/mod.ts";
import type { CodeBlockHandlers } from "./deps.ts";

const handlers: CodeBlockHandlers = {
  "mathup": (code: string) => {
    const { meta, content } = separateMeta(code);
    return mathup(content, meta).toString();
  },
};

export default handlers;
