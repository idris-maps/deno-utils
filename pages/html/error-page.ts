import { html } from "../deps.ts";
import { pageLayout } from "./page-layout.ts";

export const errorPage = (error: unknown) =>
  pageLayout(
    "Error",
    html`
    <main>
      <h3>Error</h3>
      <pre>${JSON.stringify(error)}</pre>
    </main>
  `,
  );
