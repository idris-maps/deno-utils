interface BaseProps {
  property: string;
  label?: string;
  hidden?: boolean;
}

interface TextProps extends BaseProps {
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  value?: string;
  notRequired?: boolean;
  placeholder?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends BaseProps {
  options: SelectOption[] | string[];
  value?: string;
}

interface NumberProps extends BaseProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  notRequired?: boolean;
}

export interface CheckboxField extends BaseProps {
  type: "checkbox";
  value?: boolean;
}

export interface ColorField extends BaseProps {
  type: "color";
  value?: string;
  notRequired?: boolean;
}

export interface DateField extends BaseProps {
  type: "date";
  property: string;
  label?: string;
  min?: string;
  max?: string;
  value?: string;
  notRequired?: boolean;
}

export interface EmailField extends TextProps {
  type: "email";
}

export interface NumberField extends NumberProps {
  type: "number";
}

export interface PasswordField extends TextProps {
  type: "password";
}

export interface RadioField extends SelectProps {
  type: "radio";
}

export interface RangeField extends NumberProps {
  type: "range";
  min: number;
  max: number;
  step: number;
}

export interface TelField extends TextProps {
  type: "tel";
}

export interface TextField extends TextProps {
  type: "text";
}

export interface TextareaField extends BaseProps {
  type: "textarea";
  value?: string;
  notRequired?: boolean;
}

export interface SelectField extends SelectProps {
  type: "select";
}

export type StringField = EmailField | PasswordField | TelField | TextField;
export type NumericField = NumberField | RangeField;
export type EnumField = RadioField | SelectField;

export type Field =
  | StringField
  | NumericField
  | EnumField
  | CheckboxField
  | ColorField
  | DateField
  | TextareaField;

export interface FormDefinition {
  label?: string;
  name: string;
  fields: Field[];
}

export type FieldValue = string | number | boolean | undefined;
export type FieldValues = Record<string, FieldValue>;

export const isStringField = (d: Field): d is StringField =>
  ["email", "password", "tel", "text"].includes(d.type);
export const isNumericField = (d: Field): d is NumericField =>
  ["number", "range"].includes(d.type);
export const isEnumField = (d: Field): d is EnumField =>
  ["radio", "select"].includes(d.type);
export const isCheckboxField = (d: Field): d is CheckboxField =>
  d.type === "checkbox";
export const isColorField = (d: Field): d is ColorField => d.type === "color";
export const isDateField = (d: Field): d is DateField => d.type === "date";
export const isTextareaField = (d: Field): d is TextareaField =>
  d.type === "textarea";

export const isEnumString = (d: SelectOption | string): d is string =>
  String(d) === d;

// --- filter/sort ---

export interface Sort {
  column: string;
  desc?: boolean;
}

export type FilterValue = string | number | boolean;

export enum FilterOp {
  "eq" = "eq",
  "in" = "in",
  "like" = "like",
  "notEq" = "notEq",
  "notIn" = "notIn",
  "notLike" = "notLike",
  "gt" = "gt",
  "gte" = "gte",
  "lt" = "lt",
  "lte" = "lte",
}

export interface FilterEq {
  column: string;
  op: FilterOp.eq;
  value: FilterValue;
}

export interface FilterIn {
  column: string;
  op: FilterOp.in;
  values: FilterValue[];
}

export interface FilterLike {
  column: string;
  op: FilterOp.like;
  value: FilterValue;
  place: "start" | "end" | "contains";
}

export interface FilterNotEq {
  column: string;
  op: FilterOp.notEq;
  value: FilterValue;
}

export interface FilterNotIn {
  column: string;
  op: FilterOp.notIn;
  values: FilterValue[];
}

export interface FilterNotLike {
  column: string;
  op: FilterOp.notLike;
  value: FilterValue;
  place: "start" | "end" | "contains";
}

export interface FilterGt {
  column: string;
  op: FilterOp.gt;
  value: FilterValue;
}

export interface FilterGte {
  column: string;
  op: FilterOp.gte;
  value: FilterValue;
}

export interface FilterLt {
  column: string;
  op: FilterOp.lt;
  value: FilterValue;
}

export interface FilterLte {
  column: string;
  op: FilterOp.lte;
  value: FilterValue;
}

export type Filter =
  | FilterEq
  | FilterIn
  | FilterLike
  | FilterNotEq
  | FilterNotIn
  | FilterNotLike
  | FilterGt
  | FilterGte
  | FilterLt
  | FilterLte;

export const isFilterEq = (d: Filter): d is FilterEq => d.op === "eq";
export const isFilterIn = (d: Filter): d is FilterIn => d.op === "in";
export const isFilterLike = (d: Filter): d is FilterLike => d.op === "like";
export const isFilterNotEq = (d: Filter): d is FilterNotEq => d.op === "notEq";
export const isFilterNotIn = (d: Filter): d is FilterNotIn => d.op === "notIn";
export const isFilterNotLike = (d: Filter): d is FilterNotLike =>
  d.op === "notLike";
export const isFilterGt = (d: Filter): d is FilterGt => d.op === "gt";
export const isFilterGte = (d: Filter): d is FilterGte => d.op === "gte";
export const isFilterLt = (d: Filter): d is FilterLt => d.op === "lt";
export const isFilterLte = (d: Filter): d is FilterLte => d.op === "lte";

export interface ListRowsConfig {
  filters?: Filter[];
  sort?: Sort;
  limit?: number;
  offset?: number;
}
