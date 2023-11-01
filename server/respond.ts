import { serveFile } from "./deps.ts";
import { cors } from "./cors.ts";
import type { CorsConfig, Logger } from "./types.d.ts";

type LogResponse = (type: string, d: Record<string, unknown>) => void;

interface ResponseOptions {
  headers?: Headers;
  status?: number;
}

const getHeaders = (
  { contentType, redirectUrl, headers, addCorsHeaders }: {
    contentType?: string;
    redirectUrl?: string;
    headers?: Headers;
    addCorsHeaders?: (headers: Headers) => void;
  },
) => {
  const _headers = headers || new Headers();
  if (contentType) {
    _headers.set("Content-Type", contentType);
  }
  if (redirectUrl) {
    _headers.set("Location", redirectUrl);
  }
  if (addCorsHeaders) {
    addCorsHeaders(_headers);
  }
  console.log({ addCorsHeaders, _headers })
  return _headers;
};

type JSONResponse = (
  data?: unknown,
  options?: ResponseOptions,
  addCorsHeaders?: (headers: Headers) => void,
) => Response;

const json =
  (log: LogResponse): JSONResponse => (data, options, addCorsHeaders) => {
    const headers = getHeaders({
      contentType: "application/json",
      headers: options?.headers,
      addCorsHeaders,
    });
    log("json", { status, headers, data });
    return new Response(
      data ? JSON.stringify(data) : undefined,
      {
        status: options?.status || 200,
        headers,
      },
    );
  };

const defaultMessage: { [key: number]: string } = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal server error",
};

interface StatusResponseOptions {
  data?: unknown;
  headers?: Headers;
  message?: string;
}

type StatusResponse = (
  code: number,
  options?: StatusResponseOptions,
) => Response;

const getStatusBody = (code: number, message?: string, data?: unknown) => {
  if (code === 204) return undefined;
  const msg = message || defaultMessage[code];
  return data || msg || undefined;
};

const status = (log: LogResponse): StatusResponse => (code, options) =>
  json(log)(
    getStatusBody(code, options?.message, options?.data),
    { status: code, headers: options?.headers },
  );

type HTMLResponse = (
  htmlString: string,
  options?: ResponseOptions,
  addCorsHeaders?: (headers: Headers) => void,
) => Response;

const html =
  (log: LogResponse): HTMLResponse => (htmlString, options, addCorsHeaders) => {
    const headers = getHeaders({
      contentType: "text/html",
      headers: options?.headers,
      addCorsHeaders,
    });

    log("html", { status: 200 });

    return new Response(
      "<!DOCTYPE html>\n" + htmlString,
      { status: 200, headers },
    );
  };

type RedirectResponse = (
  url: string,
  options?: ResponseOptions,
) => Response;

const redirect = (log: LogResponse): RedirectResponse => (url, options) => {
  const headers = getHeaders({
    headers: options?.headers,
    redirectUrl: url,
  });
  const status = options?.status || 302;
  log("redirect", { status, headers });

  return new Response(undefined, { status, headers });
};

type FileResponse = (filePath: string) => Promise<Response>;

const file = (req: Request, log: LogResponse): FileResponse =>
async (
  filePath: string,
) => {
  try {
    const fileInfo = await Deno.stat(filePath);
    if (!fileInfo.isFile) {
      return status(log)(404);
    }
    log("file", { status: 200, filePath, fileInfo });
    return serveFile(req, filePath);
  } catch {
    log("file", { status: 404, filePath });
    return status(log)(404);
  }
};

export interface Res {
  file: FileResponse;
  html: HTMLResponse;
  json: JSONResponse;
  redirect: RedirectResponse;
  status: StatusResponse;
}

interface Props {
  corsConfig?: CorsConfig;
  logger?: Logger;
  req: Request;
  requestId: string;
}

const initCorsHeaders =
  (req: Request, corsConfig?: CorsConfig) => (headers: Headers) => {
    const origin = req.headers.get("origin");
    if (origin && cors.isAllowedMethodAndOrigin(req, corsConfig)) {
      cors.addHeaders(headers, origin, [req.method]);
    }
  };

const init = ({
  logger,
  req,
  requestId,
  corsConfig,
}: Props): Res => {
  const log: LogResponse = (responseType, data) =>
    logger
      ? logger({
        level: "info",
        requestId,
        event: "response",
        responseType,
        ...data,
      })
      : undefined;

  const addCorsHeaders = initCorsHeaders(req, corsConfig);
  const wtf = new Headers()
  addCorsHeaders(wtf)
  console.log({  addCorsHeaders , corsConfig, wtf })
  return {
    file: file(req, log),
    html: (htmlString: string, options?: ResponseOptions) =>
      html(log)(htmlString, options, addCorsHeaders),
    json: (data?: unknown, options?: ResponseOptions) =>
      json(log)(data, options, addCorsHeaders),
    redirect: (url: string, options?: ResponseOptions) =>
      redirect(log)(url, options),
    status: (code: number, options?: StatusResponseOptions) =>
      status(log)(code, options),
  };
};

export default init;
