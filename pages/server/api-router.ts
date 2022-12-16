import { initFormHandlers, router } from "../deps.ts";
import { sendStatus } from "./send-status.ts";
import type { Endpoint, FormsDb, Handler } from "../deps.ts";
import type { Log } from "./types.d.ts";
import { isString } from "https://deno.land/std@0.138.0/encoding/_yaml/utils.ts";

interface Props {
  formsDb: FormsDb;
  apiPath: string;
  log?: Log;
}

interface FormLog {
  level: "info" | "warn" | "error";
  message: string;
  [key: string]: unknown;
}

interface HInput {
  data: Record<string, unknown>;
  params: Record<string, string>;
  query: Record<string, string>;
  log: (d: FormLog) => void;
}

interface HOutput {
  status: number;
  body?: unknown;
}

type FormEndpoint = [
  path: string,
  method: string,
  formHandler: (d: HInput) => Promise<HOutput>,
];

const toEndPoint = (
  apiPath: string,
  logger: (requestId: string) => (d: FormLog) => void,
) =>
([path, method, formHandler]: FormEndpoint): Endpoint => {
  const handler: Handler = async (req, res) => {
    const requestId = crypto.randomUUID();
    const log = logger(requestId);
    log({ level: "info", message: "request", path, method });

    try {
      const { status, body } = await formHandler({ ...req, log });
      log({ level: "info", message: "response", status: status, body });
      if (!body) return res.status(status);
      if (status === 302 && isString(body)) return res.redirect(body);
      return res.json(body, { status });
    } catch (err) {
      log({
        level: "error",
        message: "response",
        stats: 500,
        errorMessage: err.message,
        error: err,
      });
      return sendStatus(500);
    }
  };

  return {
    path: apiPath + path,
    method,
    handler,
  };
};

export const initApiRouter = (
  { formsDb, apiPath, log }: Props,
) => {
  const h = initFormHandlers(formsDb);
  const logger = (requestId: string) => (d: FormLog) => {
    if (log) {
      log({ ...d, requestId, event: d.message, type: "form-request" });
    }
  };
  const endpoints: FormEndpoint[] = [
    ["/forms", "POST", h.forms.post],
    ["/forms", "GET", h.forms.list],
    ["/forms/:formName", "GET", h.forms.get],
    ["/forms/:formName", "PUT", h.forms.put],
    ["/forms/:formName", "DELETE", h.forms.delete],
    ["/form-schema/:formName", "GET", h.forms.getSchema],
    ["/forms/:formName", "POST", h.rows.post],
    ["/forms/:formName", "GET", h.rows.list],
    ["/forms/:formName/:rowId", "GET", h.rows.get],
    ["/forms/:formName/:rowId", "PUT", h.rows.put],
    ["/forms/:formName/:rowId", "DELETE", h.rows.delete],
  ];

  return router(endpoints.map(toEndPoint(apiPath, logger)), undefined);
};
