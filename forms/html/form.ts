import type { Field } from "../types.ts";
import FieldComponent from "./field.ts";
import { html } from "../deps.ts";

interface Props {
  method: "POST" | "PUT" | "UPDATE";
  action: string;
  fields: Field[];
  submitLabel?: string;
  hiddenValues?: Record<string, unknown>;
}

export default ({
  action,
  fields,
  hiddenValues,
  method,
  submitLabel,
}: Props): string =>
  html`
  <form action="${action}" method="${method}">
    ${fields.map((field) => FieldComponent({ field, hiddenValues }))}
    <input type="submit" ${submitLabel ? `value="${submitLabel}"` : ""} />
  </form>
`;
