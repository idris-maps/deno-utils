import type { Field, RadioField, SelectField, SelectOption } from "../types.ts";
import { isEnumField, isEnumString, isTextareaField } from "../types.ts";
import { html } from "../deps.ts";
import { isCheckboxField } from "../types.ts";
import { removeUndefined } from "../utils.ts";

const omit = (keys: string[], obj: Field): Partial<Field> => {
  const result: Partial<Field> = {};
  Object.keys(obj).forEach((key) => {
    // @ts-ignore ?
    if (!keys.includes(key)) result[key] = obj[key];
  });
  return result;
};

const getHiddenValue = (
  property: string,
  hiddenValues: Record<string, unknown> = {},
) => {
  return Object.keys(hiddenValues).find((d) => d === property)
    ? String(hiddenValues[property])
    : undefined;
};

const isSelected = (v: string, i: number, value?: string) =>
  value ? value === v : i === 0;

const Label = ({ field }: { field: Field }) =>
  html`
    <label for=${field.property}>${field.label || field.property}</label>
  `;

const SelectOptions = ({
  options,
  value,
}: { options: string[] | SelectOption[]; value?: string }) => {
  const getAttributes = (d: string | SelectOption, i: number) => {
    const v = isEnumString(d) ? d : d.value
    return isSelected(v, i, value) ? { value: v, selected: true } : { value: v }
  }

  return options.map((d, i) =>
    html`
        <option ${getAttributes(d, i)}>
          ${isEnumString(d) ? d : d.label}
        </option>
      `
  );
};

const SelectField = ({ field }: { field: SelectField }) =>
  html`
    <div class=${`field field-${field.type}`}>
      ${Label({ field })}
      <select name=${field.property}>
        ${SelectOptions({ options: field.options, value: field.value })}
      </select>
    </div>
  `;

const RadioOptions = ({
  property,
  options,
  value,
}: {
  property: string;
  options: string[] | SelectOption[];
  value?: string;
}) => {
  const attrs = { type: "radio", name: property };
  const getAttributes = (d: string | SelectOption, i: number) =>
    isEnumString(d)
      ? { ...attrs, id: d, value: d, checked: isSelected(d, i, value) }
      : {
        ...attrs,
        id: d.value,
        value: d.value,
        checked: isSelected(d.value, i, value),
      };

  return options.map((d, i) =>
    html`
        <div class="field-radio-option">
          <input ${getAttributes(d, i)} />
          <label for=${isEnumString(d) ? d : d.label}>
            ${isEnumString(d) ? d : d.label}
          </label>
        </div>
      `
  );
};

const RadioField = ({ field }: { field: RadioField }) =>
  html`
    <fieldset class=${`field field-${field.type}`}>
      <legend>${field.label || field.property}</legend>
      ${RadioOptions(field)}
    </fieldset>
  `;

const getAttributes = (
  field: Field,
) => {
  const init: Record<string, unknown> = { name: field.property };
  if (!isEnumField(field) && !isCheckboxField(field) && !field.notRequired) {
    init.required = true;
  }

  return Object.entries(omit(["property", "label", "notRequired"], field))
    .reduce(
      (r, [key, value]) => ({ ...r, [key.toLowerCase()]: value }),
      init,
    );
};

export default (
  { field, hiddenValues }: {
    field: Field;
    hiddenValues?: Record<string, unknown>;
  },
): string => {
  const d = field;

  const hiddenValue = getHiddenValue(d.property, hiddenValues);

  if (hiddenValue) {
    return html`
      <input
        type="hidden"
        name="${d.property}"
        value="${hiddenValue}"
      />
    `;
  }

  if (isEnumField(d)) {
    return d.type === "select"
      ? SelectField({ field: d })
      : RadioField({ field: d });
  }

  if (isTextareaField(d)) {
    return html`
      <div class=${`field field-${d.type}`}>
        ${Label({ field: d })}
        <textarea
          ${{ name: d.property, required: d.notRequired ? undefined : true }}
        >
          {d.value}
        </textarea>
      </div>
    `;
  }

  if (isCheckboxField(d)) {
    return html`
      <div class=${`field field-${d.type}`}>
        <input type="hidden" name="${d.property}" value="false"></input>
        <input
          ${
      removeUndefined({
        type: d.type,
        name: d.property,
        value: "true",
        checked: d.value ? true : undefined,
      })
    }
        />
        ${Label({ field: d })}
      </div>
    `;
  }

  return html`
    <div class=${`field field-${d.type}`}>
      ${Label({ field: d })}
      <input ${getAttributes(d)} />
    </div>
  `;
};
