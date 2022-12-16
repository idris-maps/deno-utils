import type { PageDb } from "../db/types.d.ts";
import {
  codeblockHandlers,
  LayoutConfig,
  md2html,
  renderPage,
  FormsDb,
  getFormCodeblocks,
} from "../deps.ts";
import { sendStatus } from "./send-status.ts";
import type { Log } from "./types.d.ts";

export const initPageHandler = (
  pageDb: PageDb,
  formsDB: FormsDb,
  globalLayoutConfig: Partial<LayoutConfig>,
  logger?: Log,
) => {
  codeblockHandlers.push(getFormCodeblocks({ db: formsDB, formBaseUrl: '/api/forms' }));
  const getHtml = renderPage(
    md2html,
    codeblockHandlers,
    undefined,
    globalLayoutConfig,
  );

  return async (request: Request) => {
    const requestId = crypto.randomUUID();
    const log = (level: 'info' | 'error', event: string, d: Record<string,unknown> = {}) => {
      if (logger) {
        logger({ ...d, level, event, requestId, type: 'form-request' })
      }
    }
    const { pathname, searchParams } = new URL(request.url);
    const query: Record<string, string> = {};
    for (const key of searchParams.keys()) {
      const value = searchParams.get(key);
      if (value) query[key] = value;
    }

    log('info', 'request', { pathname, query });

    try {
      const route = await pageDb.getRoute(pathname);
      if (!route) {
        log('info', 'response', { route, status: 404 });
        return sendStatus(404);
      }

      const { path, params } = route;
      const html = await getHtml(pageDb.getPageLines(path), { params, query });

      log('info', 'response', { 
        path,
        params,
        route,
        status: 200,
       })

      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    } catch (err) {
      log('error', 'failed to get page', {
        errorMessage: err.message,
        error: err,
        status: 500,
      })

      return sendStatus(500);
    }
  };
};
