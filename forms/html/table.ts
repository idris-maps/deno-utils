import { html } from "../deps.ts";
import type { Field } from "../types.ts";
import { editIcon } from "./icons.ts";

const Head = ({ fields, edit }: { fields: Field[]; edit?: boolean }) =>
  html`
    <thead>
      <tr>
        ${fields.map((d) => html`<th>${d.label || d.property || ""}</th>`)}
      </tr>
      ${edit ? html`<tr></td>` : ""}
    </thead>
  `;

interface CommonProps {
  fields: Field[];
  edit?: boolean;
  baseUrl?: string;
}

type RowProps = CommonProps & { data: Record<string, unknown> };

const Row = ({ fields, data, edit, baseUrl }: RowProps) =>
  html`
    <tr>
      ${
    fields.map(({ property, type }) =>
      html`<td>${data[property] || (type === "checkbox" ? "false" : "")}</td>`
    )
  }
      ${
    (edit && baseUrl)
      ? html`
            <td>
              <a href="${baseUrl}/${data.__id}" title="edit row">${editIcon}</a>
            </td>
          `
      : ""
  }
    </tr>
  `;

type TableProps = CommonProps & { data: Record<string, unknown>[] };

const Table = (
  { fields, data, ...rest }: TableProps,
) =>
  html`
    <table>
      ${Head({ fields })}
      <tbody>
        ${data.map((d) => Row({ fields, data: d, ...rest }))}
      </tbody>
    </table>
  `;

export default (props: TableProps): string => {
  if (props.data.length) return Table(props);
  return "";
};
