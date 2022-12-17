import { html } from "../deps.ts";
import { pageLayout } from "./page-layout.ts";

export const page404 = pageLayout(
  "404",
  html`
    <main>
      <p>The page does not exist</p>
    </main>
  `,
);
