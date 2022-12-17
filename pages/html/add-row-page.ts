import { formHtml, FormsDb, html } from "../deps.ts";
import { page404 } from "./404-page.ts";
import { pageLayout } from "./page-layout.ts";

interface Props {
  formsDb: FormsDb;
  formName: string;
  formsBaseUrl: string;
}

export const addRowPage = async (
  { formsDb, formName, formsBaseUrl }: Props,
) => {
  const def = await formsDb.forms.get(formName);

  if (!def) return page404;

  const baseUrl = `${formsBaseUrl}/${formName}`;
  const title = `Add row to ${formName}`;

  return pageLayout(
    title,
    html`
      <main>
        <h3>${title}</h3>
        ${
      formHtml({
        action: `${baseUrl}/_add`,
        method: "POST",
        fields: def.fields,
      })
    }
      </main>
    `,
  );
};
