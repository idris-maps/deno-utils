import { PageDb } from "../db/types.d.ts";
import { FormsDb, html } from "../deps.ts";
import { fileTree } from "./file-tree.ts";
import { formList } from "./form-list.ts";
import { pageLayout } from "./page-layout.ts";

interface Props {
  formsDb: FormsDb;
  pageDb: PageDb;
  formsBaseUrl: string;
  pagesFolder: string;
}

export const adminPage = async (
  { formsDb, pageDb, formsBaseUrl, pagesFolder }: Props,
) =>
  pageLayout(
    "Admin",
    html`
    <main>
      <h1>Admin</h1>
      <h2>Pages</h2>
      ${await fileTree(pagesFolder, pageDb)}
      <h2>Forms</h2>
      ${await formList(formsBaseUrl, formsDb)}
    </main>
    `,
  );
