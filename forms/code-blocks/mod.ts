import type { CodeBlockHandlers } from "../deps.ts";
import type { FormsDb } from "../db/mod.ts";
import { form } from "./form.ts";
import { formUpdate } from "./form-update.ts";
import { table } from "./table.ts";

export interface Deps {
  db: FormsDb;
  formBaseUrl: string;
}

export const getFormCodeblocks = (deps: Deps): CodeBlockHandlers => ({
  form: (content: string) => form(deps, content),
  "form-update": (content: string) => formUpdate(deps, content),
  "form-table": (content: string) => table(deps, content),
});
