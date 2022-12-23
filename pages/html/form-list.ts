import { FormDefinition, FormsDb, html } from "../deps.ts";

const renderItem = (baseUrl: string, form: FormDefinition) =>
  html`
    <li>
      <a href="${baseUrl}/${form.name}">
        ${form.label || form.name}
      </a>
    </li>
  `;

export const formList = async (baseUrl: string, formsDb: FormsDb) => {
  const forms = (await formsDb.forms.list())
    .sort((a, b) => a.name > b.name ? 1 : -1);

  if (!forms.length) {
    return html`<p>There are no forms, create one</p>`;
  }

  return html`<ul class="admin-form-list">${
    forms.map((d) => renderItem(baseUrl, d))
  }</ul>`;
};
