import { FormsDb, html, tableHtml, LayoutConfig } from "../deps.ts";
import { pageLayout } from "./page-layout.ts";
import { page404 } from "./404-page.ts";
import { formHeader } from './form-header.ts'

interface Props {
  adminPath: string;
  formsDb: FormsDb;
  formsBaseUrl: string;
  formName: string;
  layoutConfig: Partial<LayoutConfig>
}

export const formPage = async ({ adminPath, formsBaseUrl, formsDb, formName, layoutConfig }: Props) => {
  const def = await formsDb.forms.get(formName);

  if (!def) return page404(layoutConfig);

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
    ${formHeader({
      left: html`<h3>${title}</h3>`,
      right: html`
        <a href="${adminPath}">
          <button>Back to admin</button>
        </a>
        <a href="${baseUrl}/add">
        <button>Add entry</button>
      </a>
      `
    })}
    <div class="form-page-table">
      ${table}
    </div>
  `;

  return pageLayout(layoutConfig, title, page, "form-page");
};
