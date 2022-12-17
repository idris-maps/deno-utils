import { FormsDb, html, tableHtml } from "../deps.ts";
import { pageLayout } from "./page-layout.ts";
import { page404 } from "./404-page.ts";

interface Props {
  formsDb: FormsDb;
  formsBaseUrl: string;
  formName: string;
}

export const formPage = async ({ formsBaseUrl, formsDb, formName }: Props) => {
  const def = await formsDb.forms.get(formName);

  if (!def) return page404;

  const data = (await formsDb.rows.list(formName)) || [];

  const baseUrl = `${formsBaseUrl}/${formName}`;

  const table = tableHtml({
    fields: def.fields,
    data,
    edit: true,
    baseUrl,
  });

  const title = def.label || def.name;

  const page = html`
    <header class="form-page-header">
      <h3>${title}</h3>
      <a href="${baseUrl}/add">
        <button>Add entry</button>
      </a>
      <div class="form-page-table">
        ${table}
      </div>
    </header>
  `;

  return pageLayout(title, page, "form-page");
};
