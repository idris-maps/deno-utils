import type { FormsDb } from "../db/mod.ts";
import { initWrapper, ReqProps } from "./init-wrapper.ts";
import {
  deleteForm,
  getForm,
  getFormSchema,
  listForms,
  postForms,
  putForm,
} from "./forms.ts";
import { deleteRow, getRow, listRows, postRow, putRow } from "./rows.ts";
import { HandlerResponse } from "./types.ts";

type FormHandler = (req: ReqProps) => Promise<HandlerResponse>;

export interface FormHandlers {
  forms: {
    delete: FormHandler;
    get: FormHandler;
    getSchema: FormHandler;
    list: FormHandler;
    put: FormHandler;
    post: FormHandler;
  };
  rows: {
    delete: FormHandler;
    get: FormHandler;
    list: FormHandler;
    put: FormHandler;
    post: FormHandler;
  };
}

export const initFormHandlers = (db: FormsDb): FormHandlers => {
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
