import { DB, QueryParameter, QueryParameterSet } from "../deps.ts";
import type { Logger } from "./types.ts";

type Q = <T>(sql: string, params?: QueryParameterSet) => Promise<T[]>

const _query = (db: DB, log: Logger) =>
  <T>(sql: string, params?: QueryParameterSet): Promise<T[]> => {
    const start = new Date().getTime()
    const result = db.query(sql, params)
    log({
      level: 'info',
      message: 'query',
      time: new Date().getTime() - start,
      sql,
      params,
    })
    // @ts-ignore ?
    return result
  }

const _queryEntries = (db: DB, log: Logger) =>
  <T>(sql: string, params?: QueryParameterSet): Promise<T[]> => {
    const start = new Date().getTime()
    const result = db.queryEntries(sql, params)
    log({
      level: 'info',
      message: 'query',
      time: new Date().getTime() - start,
      sql,
      params,
    })
    // @ts-ignore ?
    return result
  }

const query = (_queryEntries: Q) =>
  <T = unknown>(
    stmt: TemplateStringsArray,
    ...args: QueryParameter[]
  ): Promise<T[]> =>
    _queryEntries<T>(stmt.join("?"), args);

const exec = (_query: Q) =>
  async (
    stmt: TemplateStringsArray,
    ...args: QueryParameter[]
  ): Promise<void> => {
    await _query(stmt.join("?"), args);
    return;
  };


interface DbProps {
  db: {
    query: Q
    queryEntries: Q
  };
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
  log: Logger,
  func: (props: DbProps) => Promise<T>,
) => {
  const _db = new DB(dbFilename, { mode: 'create' });
  const q = _query(_db, log)
  const qe = _queryEntries(_db, log)
  const db = { query: q, queryEntries: qe }

  try {
    const result = await func({ db, exec: exec(q), query: query(qe) });
    await _db.close();
    return result;
  } catch (err) {
    _db.close();
    throw err;
  }
};
