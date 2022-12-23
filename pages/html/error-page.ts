import { html, LayoutConfig } from "../deps.ts";
import { pageLayout } from "./page-layout.ts";

export const errorPage = (layoutConfig: Partial<LayoutConfig>, error: unknown) =>
  pageLayout(
    layoutConfig,
    "Error",
    html`
    <main>
      <h3>Error</h3>
      <pre>${JSON.stringify(error)}</pre>
    </main>
  `,
  );
