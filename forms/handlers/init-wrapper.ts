import type { FormsDb } from "../db/mod.ts";
import type { Handler, HandlerResponse, Logger, LogProps } from "./types.ts";
import { validationErrorToResponse } from "../validate/mod.ts";

export interface ReqProps {
  data: Record<string, unknown>;
  params: Record<string, string>;
  query: Record<string, string>;
  log?: Logger;
}

export const initWrapper = (db: FormsDb) => {
  return (func: Handler) => {
    return async (
      { data, params, query, log: _log }: ReqProps,
    ): Promise<HandlerResponse> => {
      const log = _log
        ? (d: LogProps) => _log({ ...d, formHandlerLog: true })
        : (_d: LogProps) => undefined;

      log({ level: "info", message: `Calling ${func.name} handler` });

      try {
        const res = await func({ db, log, data, params, query });

        if (res) return res;

        log({ level: "error", message: "Handler did not know what to do" });

        return { status: 500 };
      } catch (err) {
        return validationErrorToResponse(err, log);
      }
    };
  };
};
