import { katex } from "./deps.ts";
import type { CodeBlockHandlers } from "./deps.ts";

const handlers: CodeBlockHandlers = {
  "katex": (content: string) =>
    katex(
      content,
      {
        displayMode: true,
        strict: false,
        trust: false,
        globalGroup: false,
      },
    ),
};

export default handlers;
