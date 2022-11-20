import { DB, QueryParameter } from "../deps.ts";

export const query = (db: DB) =>
async <T = unknown>(
  stmt: TemplateStringsArray,
  ...args: QueryParameter[]
): Promise<T[]> =>
  // @ts-ignore T !== RowObject
  await db.queryEntries<T>(stmt.join("?"), args);

const exec = (db: DB) =>
async (
  stmt: TemplateStringsArray,
  ...args: QueryParameter[]
): Promise<void> => {
  await db.query(stmt.join("?"), args);
  return;
};

interface DbProps {
  db: DB;
  exec: (
    stmt: TemplateStringsArray,
    ...args: QueryParameter[]
  ) => Promise<void>;
  query: <T = unknown>(
    stmt: TemplateStringsArray,
    ...args: QueryParameter[]
  ) => Promise<T[]>;
}

export const run = async <T>(
  dbFilename: string,
  func: (props: DbProps) => Promise<T>,
) => {
  const db = new DB(dbFilename);
  try {
    const result = await func({ db, exec: exec(db), query: query(db) });
    await db.close();
    return result;
  } catch (err) {
    db.close();
    throw err;
  }
};
