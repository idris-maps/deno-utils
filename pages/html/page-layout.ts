import { html } from "../deps.ts";

export const pageLayout = (
  title: string,
  content: string,
  bodyClass?: string,
) =>
  html`
    <html>
      <head>
        <meta charset="utf-8" />
        <meta viewport="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body ${bodyClass ? `class="${bodyClass}"` : ""} >
        ${content}
      </body>
    </html>
  `;
