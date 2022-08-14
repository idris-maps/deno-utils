import { md2html } from "./deps.ts";
import { fromGenerator, fromString } from "./separate-codeblocks.ts";

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
    } catch (err) {
      // TODO throw error setting
      return noOp(content, lang);
    }
  };
};

const isString = (d: string | AsyncIterableIterator<string>): d is string =>
  typeof d === "string";

export default (handlers: CodeBlockHandlers[]) =>
(input: string | AsyncIterableIterator<string>) =>
  isString(input)
    ? fromString(md2html, handleCodeBlocks(handlers), input)
    : fromGenerator(md2html, handleCodeBlocks(handlers), input);
