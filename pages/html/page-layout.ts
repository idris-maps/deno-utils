import { html, LayoutConfig, getHead } from "../deps.ts";

export const pageLayout = (
  layoutConfig: Partial<LayoutConfig> = {},
  title: string,
  content: string,
  bodyClass?: string,
) =>
  html`
    <html>
      <head>
        ${getHead({ ...layoutConfig, title })}
      </head>
      <body ${bodyClass ? `class="${bodyClass}"` : ""} >
        ${content}
      </body>
    </html>
  `;
