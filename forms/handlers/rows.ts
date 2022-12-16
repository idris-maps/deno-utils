import type { Handler, Logger } from "./types.ts";
import { sanitizeListConfig, sanitizeValues } from "../sanitize/mod.ts";
import { isValues } from "../validate/mod.ts";
import type { FormsDb } from "../db/mod.ts";

const getFields = async (
  db: FormsDb,
  params: Record<string, string>,
  log?: Logger,
) => {
  if (!params.formName) {
    throw new Error('"params.formName" is undefined');
  }

  const form = await db.forms.get(params.formName, log);

  return form ? form.fields : undefined;
};

export const postRow: Handler = async ({ db, query, params, data, log }) => {
  const fields = await getFields(db, params, log);
  if (!fields) return { status: 404 };

  const redirect = query.redirect && query.redirect !== '' ? query.redirect : undefined;
  const values = sanitizeValues(fields)(data);

  if (isValues(fields)(values)) {
    const res = await db.rows.insert(params.formName, values, log);

    if (res.inserted) {
      return redirect ? { status: 302, body: redirect } : { status: 200, body: res.row };
    }
  }
};

export const listRows: Handler = async ({ db, params, query, log }) => {
  if (!params.formName) {
    throw new Error('"params.formName" is undefined');
  }

  const fields = await getFields(db, params, log);
  if (!fields) return { status: 404 };

  const config = sanitizeListConfig(fields, query);

  const rows = await db.rows.list(params.formName, config, log);

  return { status: 200, body: rows };
};

export const getRow: Handler = async ({ db, params, log }) => {
  if (!params.formName) {
    throw new Error('"params.formName" is undefined');
  }

  if (!params.rowId) {
    throw new Error('"params.rowId" is undefined');
  }

  const row = await db.rows.get(params.formName, params.rowId, log);

  return row ? { status: 200, body: row } : { status: 404 };
};

export const putRow: Handler = async ({ db, params, query, data, log }) => {
  if (!params.rowId) {
    throw new Error('"params.rowId" is undefined');
  }

  const fields = await getFields(db, params, log);
  if (!fields) return { status: 404 };

  const row = await db.rows.get(params.formName, params.rowId, log);
  if (!row) return { status: 404 };

  const redirect = query.redirect && query.redirect !== '' ? query.redirect : undefined;
  const values = sanitizeValues(fields)({ ...row, ...data });

  if (isValues(fields)(values)) {
    const res = await db.rows.update(
      params.formName,
      params.rowId,
      values,
      log,
    );

    if (res.updated) {
      return redirect ? { status: 302, body: redirect } : { status: 200, body: res.data };
    }
  }
};

export const deleteRow: Handler = async ({ db, params, log }) => {
  if (!params.formName) {
    throw new Error('"params.formName" is undefined');
  }

  if (!params.rowId) {
    throw new Error('"params.rowId" is undefined');
  }

  const res = await db.rows.drop(params.formName, params.rowId, log);

  return res.dropped ? { status: 204 } : { status: 404 };
};
