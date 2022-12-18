import { formHtml, FormsDb, html, LayoutConfig} from "../deps.ts";
import { page404 } from "./404-page.ts";
import { pageLayout } from "./page-layout.ts";

interface Props {
  formsDb: FormsDb;
  formName: string;
  formsBaseUrl: string;
  layoutConfig: Partial<LayoutConfig>
}

export const addRowPage = async (
  { formsDb, formName, formsBaseUrl, layoutConfig }: Props,
) => {
  const def = await formsDb.forms.get(formName);

  if (!def) return page404(layoutConfig);

  const baseUrl = `${formsBaseUrl}/${formName}`;
  const title = `Add row to ${formName}`;

  return pageLayout(
    layoutConfig,
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
