import type { FormsDb } from "../db/mod.ts";
import { initWrapper } from "./init-wrapper.ts";
import {
  deleteForm,
  getForm,
  getFormSchema,
  listForms,
  postForms,
  putForm,
} from "./forms.ts";
import { deleteRow, getRow, listRows, postRow, putRow } from "./rows.ts";

export const initFormHandlers = (db: FormsDb) => {
  const wrap = initWrapper(db);

  return {
    forms: {
      delete: wrap(deleteForm),
      get: wrap(getForm),
      getSchema: wrap(getFormSchema),
      list: wrap(listForms),
      put: wrap(putForm),
      post: wrap(postForms),
    },
    rows: {
      delete: wrap(deleteRow),
      get: wrap(getRow),
      list: wrap(listRows),
      put: wrap(putRow),
      post: wrap(postRow),
    },
  };
};
