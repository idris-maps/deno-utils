import { serveFile } from "../deps.ts";
import { sendStatus } from "./send-status.ts";
import { Log } from "./types.d.ts";

export const initAssetsHandler = (log?: Log) =>
  async (request: Request) => {
    const requestId = crypto.randomUUID()
    const { pathname } = new URL(request.url)
    const filePath = pathname.startsWith('/') ? pathname.slice(1) : pathname

    if (log) {
      log({
        level: 'info',
        requestId,
        event: 'request',
        type: 'asset-request',
        pathname,
        filePath,
      })
    }

    try {
      const fileInfo = await Deno.stat(filePath);
      if (log) {
        log({
          level: 'info',
          requestId,
          event: 'response',
          type: 'asset-request',
          fileInfo,
          status: fileInfo.isFile ? 200 : 404,
        })
      }

      if (!fileInfo.isFile) {
        return sendStatus(404);
      }

      return serveFile(request, filePath);
    } catch (err) {

      if (log) {
        log({
          level: 'info',
          requestId,
          event: 'response',
          type: 'asset-request',
          status: 404,
          errorMessage: err.message,
          pathname,
        })
      }

      return sendStatus(404);
    }
  };
