import type { Part } from "./separate-codeblocks.ts";
import type { AnyIterable } from "./deps.ts";
import type { CodeBlockHandlers } from '../code-blocks/mod.ts'

const noOp = (content: string, lang?: string) =>
  [
    "<pre><code",
    lang ? ` lang="${lang}">\n` : ">\n",
    content,
    "\n</code></pre>",
  ].join("");

const handleCodeBlocks = (handlers: CodeBlockHandlers[]) => {
  const codeHandlers = handlers.reduce((r, d) => ({ ...r, ...d }), {});

  return async ({ lang, content }: Part) => {
    if (!lang) return noOp(content);

    const handler = codeHandlers[lang];
    if (!handler) return noOp(content, lang);

    try {
      const html = await handler(content);
      return `<div class="code ${lang}">${html}</div>`;
    } catch {
      return noOp(content, lang);
    }
  };
};

export const renderHtml = (
  md2html: (d: string) => Promise<string>,
  handlers: CodeBlockHandlers[],
) => {
  const renderCode = handleCodeBlocks(handlers);
  return async function* (parts: AnyIterable<Part>) {
    for await (const part of parts) {
      if (part.type === "code") {
        yield await renderCode(part);
      }
      if (part.type === "md") {
        yield await md2html(part.content);
      }
    }
  };
};
