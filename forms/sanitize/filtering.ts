import { Field, Filter, FilterOp } from "../types.ts";

const isPlace = (d?: string): d is "start" | "end" | "contains" =>
  Boolean(d) && ["start", "end", "contains"].includes(String(d));

const parseFilter = (
  key: string,
  value: string,
  isColumn: (d: string) => boolean,
): Filter | undefined => {
  const [column, op, place] = key.split(".");

  if (!isColumn(column)) return undefined;

  switch (op) {
    case "eq":
      return { column, op: FilterOp.eq, value };
    case "in":
      return { column, op: FilterOp.in, values: value.split(",") };
    case "like":
      return {
        column,
        op: FilterOp.like,
        place: isPlace(place) ? place : "contains",
        value,
      };
    case "notEq":
      return { column, op: FilterOp.notEq, value };
    case "notIn":
      return { column, op: FilterOp.notIn, values: value.split(",") };
    case "notLike":
      return {
        column,
        op: FilterOp.notLike,
        place: isPlace(place) ? place : "contains",
        value,
      };
    case "gt":
      return { column, op: FilterOp.gt, value };
    case "gte":
      return { column, op: FilterOp.gte, value };
    case "lt":
      return { column, op: FilterOp.lt, value };
    case "lte":
      return { column, op: FilterOp.lte, value };
    default:
      return undefined;
  }
};

export const sanitizeFilters = (fields: Field[]) => {
  const columns = fields.map((d) => d.property);
  const isColumn = (d: string) => columns.includes(d);

  return (data: Record<string, string>) =>
    Object.keys(data)
      .reduce((filtering: Filter[], key: string): Filter[] => {
        const value = data[key];
        if (!value || value.trim() === "") return filtering;
        const filter = parseFilter(key, value, isColumn);
        return filter ? [...filtering, filter] : filtering;
      }, []);
};
