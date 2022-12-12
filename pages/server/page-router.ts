import type { PageDb } from "../db/types.d.ts";
import { codeblockHandlers, LayoutConfig, md2html, renderPage } from "../deps.ts";
import { sendStatus } from "./send-status.ts";
import type { Log } from './types.d.ts'

export const initPageHandler = (db: PageDb, globalLayoutConfig: Partial<LayoutConfig>, log?: Log) => {
  const getHtml = renderPage(md2html, codeblockHandlers, undefined, globalLayoutConfig);
  return async (request: Request) => {
    const requestId = crypto.randomUUID();
    const { pathname, searchParams } = new URL(request.url);
    const query: Record<string, string> = {};
    for (const key of searchParams.keys()) {
      const value = searchParams.get(key);
      if (value) query[key] = value;
    }

    if (log) {
      log({
        level: "info",
        event: "request",
        type: "page-request",
        requestId,
        pathname,
        query,
      });
    }

    try {
      const route = await db.getRoute(pathname);
      if (!route) {
        if (log) {
          log({
            level: "info",
            event: "response",
            type: "page-request",
            requestId,
            route,
            status: 404,
          });
        }

        return sendStatus(404);
      }

      const { path, params } = route;
      const html = await getHtml(db.getPageLines(path), { params, query });

      if (log) {
        log({
          level: "info",
          event: "response",
          type: "page-request",
          requestId,
          path,
          params,
          route,
          status: 200,
        });
      }

      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    } catch (err) {
      if (log) {
        log({
          level: "error",
          event: "Failed to get page",
          type: "page-request",
          requestId,
          errorMessage: err.message,
          error: err,
          status: 500,
        });
      }
      return sendStatus(500);
    }
  };
};
