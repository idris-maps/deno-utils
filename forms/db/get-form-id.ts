import type { QueryParameter } from "../deps.ts";

type Query = <T = unknown>(
  stmt: TemplateStringsArray,
  ...args: QueryParameter[]
) => Promise<T[]>;

export const getFormId = async (
  query: Query,
  name: string,
): Promise<number | undefined> => {
  const forms = await query<{ id: number; name: string }>`
    SELECT id, name FROM __forms WHERE name = ${name} AND deleted_at IS NULL
  `;

  const form = forms[0];

  return form ? form.id : undefined;
};
