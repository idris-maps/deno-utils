import { formHtml, FormsDb, html, LayoutConfig } from "../deps.ts";
import { page404 } from "./404-page.ts";
import { pageLayout } from "./page-layout.ts";

interface Props {
  formsDb: FormsDb;
  rowId: string;
  formName: string;
  formsBaseUrl: string;
  layoutConfig: Partial<LayoutConfig>
}

export const rowPage = async (
  { formsDb, rowId, formName, formsBaseUrl, layoutConfig }: Props,
) => {
  const row = await formsDb.rows.get(formName, rowId);
  const def = await formsDb.forms.get(formName);

  if (!def || !row) return page404(layoutConfig);

  const baseUrl = `${formsBaseUrl}/${formName}/${rowId}`;
  const title = `${formName} row ${rowId}`;

  return pageLayout(
    layoutConfig,
    title,
    html`
      <header class="row-page-header">
        <a href="${baseUrl}/_delete">
          <button>Delete row</button>
        </a>
      </header>
      <main>
        <h3>${title}</h3>
        ${
      formHtml({
        action: `${baseUrl}/_update`,
        method: "POST",
        // @ts-ignore ?
        fields: def.fields.map((field) => ({
          ...field,
          value: row[field.property],
        })),
      })
    }
      </main>
    `,
  );
};
