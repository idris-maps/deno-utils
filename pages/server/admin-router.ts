import { PageDb } from "../db/types.d.ts";
import { Endpoint, FormHandlers, FormsDb, router } from "../deps.ts";
import {
  addRowPage,
  adminPage,
  errorPage,
  formPage,
  rowPage,
} from "../html/mod.ts";

interface Props {
  adminPath: string;
  formsDb: FormsDb;
  pageDb: PageDb;
  h: FormHandlers;
}

const getEndpoints = ({ adminPath, formsDb, pageDb, h }: Props): Endpoint[] => [
  {
    path: `${adminPath}`,
    method: "GET",
    handler: async (_, res) =>
      res.html(
        await adminPage({
          formsBaseUrl: `${adminPath}/forms`,
          formsDb,
          pageDb,
          pagesFolder: pageDb.folder,
        }),
      ),
  },
  {
    path: `${adminPath}/forms/:formName`,
    method: "GET",
    handler: async (req, res) =>
      res.html(
        await formPage({
          formsBaseUrl: `${adminPath}/forms`,
          formsDb,
          formName: req.params.formName,
        }),
      ),
  },
  {
    path: `${adminPath}/forms/:formName/add`,
    method: "GET",
    handler: async (req, res) =>
      res.html(
        await addRowPage({
          formsBaseUrl: `${adminPath}/forms`,
          formsDb,
          formName: req.params.formName,
        }),
      ),
  },
  {
    path: `${adminPath}/forms/:formName/:rowId`,
    method: "GET",
    handler: async (req, res) =>
      res.html(
        await rowPage({
          formsBaseUrl: `${adminPath}/forms`,
          formsDb,
          formName: req.params.formName,
          rowId: req.params.rowId,
        }),
      ),
  },
  {
    path: `${adminPath}/forms/:formName/_add`,
    method: "POST",
    handler: async (req, res) => {
      const { status, body } = await h.rows.post(req);
      if (status === 200) {
        return res.redirect(`${adminPath}/forms/${req.params.formName}`);
      }
      return res.html(errorPage(body));
    },
  },
  {
    path: `${adminPath}/forms/:formName/:rowId/_update`,
    method: "POST",
    handler: async (req, res) => {
      const { status, body } = await h.rows.put(req);
      if (status === 200) {
        return res.redirect(`${adminPath}/forms/${req.params.formName}`);
      }
      return res.html(errorPage(body));
    },
  },
  {
    path: `${adminPath}/forms/:formName/:rowId/_delete`,
    method: "GET",
    handler: async (req, res) => {
      const { status, body } = await h.rows.delete(req);
      if (status === 204) {
        return res.redirect(`${adminPath}/forms/${req.params.formName}`);
      }
      return res.html(errorPage(body));
    },
  },
];

export const initAdminRouter = (d: Props) => router(getEndpoints(d), undefined);
