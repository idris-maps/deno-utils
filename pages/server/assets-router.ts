import { serveFile } from "../deps.ts";
import { sendStatus } from "./send-status.ts";
import { Log } from "./types.d.ts";

export const initAssetsHandler = (logger?: Log) => async (request: Request) => {
  const requestId = crypto.randomUUID();
  const { pathname } = new URL(request.url);
  const filePath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  const log = (level: 'info' | 'warn', event: string, d: Record<string,unknown> = {}) => {
    if (logger) {
      logger({ ...d, level, event, requestId, type: 'form-request' })
    }
  }

    log('info', 'request', { pathname, filePath });

  try {
    const fileInfo = await Deno.stat(filePath);
      log('info', 'response', {
        fileInfo,
        status: fileInfo.isFile ? 200 : 404,
      });

    if (!fileInfo.isFile) {
      return sendStatus(404);
    }

    return serveFile(request, filePath);
  } catch (err) {
      log('info', 'response', {
        status: 404,
        errorMessage: err.message,
        pathname,
      });

    return sendStatus(404);
  }
};
