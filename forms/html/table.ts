import { html } from "../deps.ts";
import type { Field } from "../types.ts";

const Head = ({ fields }: { fields: Field[] }) =>
  html`
    <thead>
      <tr>
        ${fields.map((d) => html`<th>${d.label || d.property || ""}</th>`)}
      </tr>
    </thead>
  `;

const Row = (
  { fields, data }: { fields: Field[]; data: Record<string, unknown> },
) =>
  html`
    <tr>
      ${
    fields.map(({ property, type }) =>
      html`<td>${data[property] || (type === "checkbox" ? "false" : "")}</td>`
    )
  }
    </tr>
  `;

const Table = (
  { fields, data }: { fields: Field[]; data: Record<string, unknown>[] },
) =>
  html`
    <table>
      ${Head({ fields })}
      <tbody>
        ${data.map((d) => Row({ fields, data: d }))}
      </tbody>
    </table>
  `;

export default ({
  fields,
  data,
}: { fields: Field[]; data: Record<string, unknown>[] }): string => {
  if (data.length) return Table({ fields, data });
  return "";
};
