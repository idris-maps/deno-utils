import {
  Field,
  Filter,
  FilterOp,
  isCheckboxField,
  isNumericField,
  Sort,
} from "../types.ts";
import { isArrayOfStrings, isInteger, isString } from "../deps.ts";
import { Deps } from "./mod.ts";
import { parseYaml } from "../deps.ts";
import tableHtml from "../html/table.ts";

const opMap: Record<string, FilterOp> = {
  "=": FilterOp.eq,
  "!=": FilterOp.notEq,
  ">": FilterOp.gt,
  ">=": FilterOp.gte,
  "<": FilterOp.lt,
  "<=": FilterOp.lte,
  "LIKE": FilterOp.like,
  "NOT LIKE": FilterOp.notLike,
  "IN": FilterOp.in,
  "NOT IN": FilterOp.notIn,
};

const sortedKeys = Object.keys(opMap).map((d) => String(d)).sort((a, b) =>
  a.length > b.length ? 0 : 1
);

const getOp = (d: string) => {
  const key = sortedKeys.find((key) => d.includes(key));
  return (key && opMap[key]) ? { separator: key, op: opMap[key] } : undefined;
};

const castValue = (field: Field) => (value: string) => {
  if (isNumericField(field)) {
    return Number(value);
  }
  if (isCheckboxField(field)) {
    return ["true", "1", "on"].includes(value);
  }
  return value;
};

const getPlace = (value: string): "start" | "end" | "contains" => {
  const start = value.endsWith("%");
  const end = value.startsWith("%");

  if (start && !end) return "start";
  if (end && !start) return "end";
  return "contains";
};

const parseFilter = (fields: Field[], d: string): Filter | undefined => {
  const _op = getOp(d);
  if (!_op) return undefined;

  const { separator, op } = _op;
  const [column, value] = d.split(separator).map((d) => d.trim());
  if (column === "") return undefined;
  if (value === "") return undefined;

  const field = fields.find((d) => d.property === column);
  if (!field) return undefined;

  const cast = castValue(field);

  if (op === FilterOp.in || op === FilterOp.notIn) {
    const values = value.split(",").map((d) => cast(d.trim()));
    return { column, op, values };
  }

  if (op === FilterOp.like || op === FilterOp.notLike) {
    const place = getPlace(value);
    return { column, op, value: value.split("%").join(""), place };
  }

  return { column, op, value: cast(value) };
};

const parseSort = (formColumns: string[], d: string): Sort | undefined => {
  const [column, postfix] = d.trim().split(" ").map((_) => _.trim());

  if (!formColumns.includes(column)) return undefined;

  return {
    column,
    desc: !(postfix && postfix.toUpperCase() === "ASC"),
  };
};

export const table = async ({ db }: Deps, content: string) => {
  // deno-lint-ignore no-explicit-any
  const data: any = parseYaml(content);

  if (!isString(data.form)) {
    throw new Error('[table codeblock]: no "form"');
  }

  const form = await db.forms.get(data.form);

  if (!form) {
    throw new Error(`[table codeblock]: form "${data.form}" does not exist`);
  }

  const formColumns = form.fields.map((d) => d.property);

  const columns: string[] = isArrayOfStrings(data.columns)
    ? data.columns.filter((d: string) => formColumns.includes(d))
    : [];

  const filters: Filter[] = isArrayOfStrings(data.filters)
    ? data.filters.map((filter: string) => parseFilter(form.fields, filter))
      .filter(Boolean)
    : [];

  const sort = isString(data.sort)
    ? parseSort(formColumns, data.sort)
    : undefined;

  const limit = isInteger(Number(data.limit)) ? Number(data.limit) : undefined;

  const offset = isInteger(Number(data.offset))
    ? Number(data.offset)
    : undefined;

  const rows = await db.rows.list(
    form.name,
    { filters, sort, limit, offset },
  );

  if (!rows || !rows.length) {
    throw new Error("[table codeblock]: query returned no rows");
  }

  const fields = columns.length
    ? form.fields.filter((d) => columns.includes(d.property))
    : form.fields;

  return tableHtml({ fields, data: rows });
};
