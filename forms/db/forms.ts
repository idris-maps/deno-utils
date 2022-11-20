import type { FormDefinition } from "../types.ts";
import type { Logger } from "./types.ts";
import { createForm } from "./create-form.ts";
import { createFormsTable } from "./create-forms-table.ts";
import { dropForm } from "./drop-form.ts";
import { getForm } from "./get-form.ts";
import { listForms } from "./list-forms.ts";
import { updateForm } from "./update-form.ts";
import { logger } from "./log.ts";

export interface FormDb {
  create: (
    form: FormDefinition,
    log?: Logger,
  ) => Promise<{ created: true } | { created: false; message: string }>;
  drop: (
    name: string,
    log?: Logger,
  ) => Promise<{ dropped: true } | { dropped: false; message: string }>;
  get: (
    name: string,
    log?: Logger,
  ) => Promise<FormDefinition | undefined>;
  list: (
    log?: Logger,
  ) => Promise<FormDefinition[]>;
  update: (
    name: string,
    change: Partial<Omit<FormDefinition, "fields">>,
    log?: Logger,
  ) => Promise<
    { updated: true; form: FormDefinition } | {
      updated: false;
      message: string;
    }
  >;
}

const notCached = (dbFilename: string, _log?: Logger): FormDb => ({
  create: (form, log) => createForm(dbFilename, logger(log, _log), form),
  drop: (name, log) => dropForm(dbFilename, logger(log, _log), name),
  get: (name, log) => getForm(dbFilename, logger(log, _log), name),
  list: (log) => listForms(dbFilename, logger(log, _log)),
  update: (name, change, log) =>
    updateForm(dbFilename, logger(log, _log), name, change),
});

const cached = (
  cache: Map<string, FormDefinition>,
  db: FormDb,
  _log?: Logger,
): FormDb => ({
  create: async (form, log) => {
    const res = await db.create(form, logger(log, _log));
    if (res.created) {
      cache.set(form.name, form);
    }
    return res;
  },
  drop: async (name, log) => {
    const res = await db.drop(name, logger(log, _log));
    if (res.dropped) {
      cache.delete(name);
    }
    return res;
  },
  get: (name) => Promise.resolve(cache.get(name)),
  list: () => Promise.resolve(Array.from(cache.values())),
  update: async (name, change, log) => {
    const res = await db.update(name, change, logger(log, _log));
    if (res.updated) {
      cache.set(res.form.name, res.form);
    }
    return res;
  },
});

export const initForms = async (
  dbFilename: string,
  log?: Logger,
  cache?: boolean,
): Promise<FormDb> => {
  await createFormsTable(dbFilename, logger(log));

  const _cache = new Map<string, FormDefinition>();
  const _forms = notCached(dbFilename, log);

  if (cache) {
    const all = await _forms.list();
    all.forEach((d) => _cache.set(d.name, d));
    return cached(_cache, _forms, log);
  }

  return _forms;
};
