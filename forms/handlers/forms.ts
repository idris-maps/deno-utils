import type { Handler } from "./types.ts";
import { sanitizeForm } from "../sanitize/mod.ts";
import { isForm, isTableName } from "../validate/mod.ts";
import { toSchema } from "../to-schema/mod.ts";
import { ERRORS } from "../db/errors.ts";

export const postForms: Handler = async ({ db, data, log }) => {
  const form = sanitizeForm(data);
  if (isForm(form)) {
    const res = await db.forms.create(form, log);
    if (res.created) {
      return { status: 200, body: form };
    }
    return { status: 400, body: { message: res.message } };
  }
};

export const listForms: Handler = async ({ db, log }) => {
  const forms = await db.forms.list(log);
  return { status: 200, body: forms };
};

export const getForm: Handler = async ({ db, params, log }) => {
  if (!params.formName) {
    throw new Error('"params.formName" is undefined');
  }

  const form = await db.forms.get(params.formName, log);

  return form ? { status: 200, body: form } : { status: 404 };
};

export const putForm: Handler = async ({ db, data, params, log }) => {
  if (!params.formName) {
    throw new Error('"params.formName" is undefined');
  }

  if (data.fields) {
    return { status: 400, body: { message: "fields may not be updated" } };
  }

  const name = data.name && isTableName(data.name) ? data.name : undefined;
  const label = data.label && String(data.label) === data.label
    ? data.label
    : undefined;

  const res = await db.forms.update(params.formName, { name, label }, log);

  return res.updated ? { status: 200, body: res.form } : {
    status: res.message === ERRORS.formNotExists ? 404 : 400,
    body: { message: res.message },
  };
};

export const deleteForm: Handler = async ({ db, params, log }) => {
  if (!params.formName) {
    throw new Error('"params.formName" is undefined');
  }

  const res = await db.forms.drop(params.formName, log);

  return res.dropped ? { status: 204 } : { status: 404 };
};

export const getFormSchema: Handler = async ({ db, params, log }) => {
  if (!params.formName) {
    throw new Error('"params.formName" is undefined');
  }

  const form = await db.forms.get(params.formName, log);

  if (!form) {
    return { status: 404 };
  }

  return { status: 200, body: toSchema(form.fields) };
};
