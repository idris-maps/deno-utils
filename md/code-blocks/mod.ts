import { md2html } from "./deps.ts";
import separateCodeblocks from "./separate-codeblocks.ts";

export type HandleCodeBlock = (content: string) => Promise<string>;

export interface CodeBlockHandlers {
  [key: string]: HandleCodeBlock;
}

const noOp = (content: string, lang?: string) =>
  [
    "<pre><code",
    lang ? ` lang="${lang}">\n` : ">\n",
    content,
    "\n</code></pre>",
  ].join("");

const handleCodeBlocks = (handlers: CodeBlockHandlers[]) => {
  const codeHandlers = handlers.reduce((r, d) => ({ ...r, ...d }), {});

  return async (content: string, lang?: string) => {
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

export default (handlers: CodeBlockHandlers[]) =>
  separateCodeblocks(
    md2html,
    handleCodeBlocks(handlers),
  );
