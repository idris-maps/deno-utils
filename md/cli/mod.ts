import {
  charts,
  highlight,
  highlightLangs,
  html,
  init,
  math,
  music,
} from "./deps.ts";

const getPage = (main: string, css: string[] = [], title?: string) =>
  "<!DOCTYPE>\n" + html`
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || ""}</title>
        ${css.map((d) => html`<link rel="stylesheet" href="${d}" />`)}
      </head>
      <body>
        <main>${main}</main>
      </body>
    </html>
  `;

const hasHighlight = (langs: string[]) =>
  highlightLangs.some((d) => langs.includes(d));

const hasKatex = (langs: string[]) => langs.includes("katex");

const createPage = async (md: string) => {
  const res = await init([
    highlight,
    charts,
    math,
    music,
  ])(md);

  let css: string[] = ["style.css"];
  if (hasHighlight(res.langs)) css.push("prism.css");
  if (hasKatex(res.langs)) css.push("katex.css");

  return getPage(res.html, css);
};

export default createPage;
