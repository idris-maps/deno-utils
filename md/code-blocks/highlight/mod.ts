import { getLangs, highlight } from "./deps.ts";
import type { CodeBlockHandlers } from "./deps.ts";

const handle = (lang: string) =>
  async (content: string) =>
    [
      `<pre class="language-${lang}"><code lang="${lang}">`,
      highlight(content, lang),
      "</code></pre>",
    ].join("");

const handlers: CodeBlockHandlers = getLangs()
  .reduce((r, key) => ({ ...r, [key]: handle(key) }), {});

export default handlers;
