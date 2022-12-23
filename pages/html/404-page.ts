import { html, LayoutConfig } from "../deps.ts";
import { pageLayout } from "./page-layout.ts";

export const page404 = (layoutConfig: Partial<LayoutConfig>) =>
  pageLayout(
    layoutConfig,
    "404",
    html`
    <main>
      <p>The page does not exist</p>
    </main>
  `,
  );
