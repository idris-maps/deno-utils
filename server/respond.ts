import { serveFile } from "./deps.ts";
import { cors } from "./cors.ts";
import type { CorsConfig, Logger } from "./types.d.ts";

type LogResponse = (type: string, d: Record<string, unknown>) => void;

type MutateHeaders =
  | ((headers: Headers) => void)
  | ((headers: Headers) => Promise<void>);

interface ResponseOptions {
  mutateHeaders?: MutateHeaders;
  status?: number;
}

const getHeaders = async (
  { contentType, redirectUrl, mutateHeaders, addCorsHeaders }: {
    contentType?: string;
    redirectUrl?: string;
    mutateHeaders?: MutateHeaders;
    addCorsHeaders?: (headers: Headers) => void;
  },
) => {
  const headers = new Headers({
    ...(contentType ? { "Content-Type": contentType } : {}),
    ...(redirectUrl ? { "Location": redirectUrl } : {}),
  });
  if (mutateHeaders) {
    await mutateHeaders(headers);
  }
  if (addCorsHeaders) {
    addCorsHeaders(headers);
  }
  return headers;
};

type JSONResponse = (
  data?: unknown,
  options?: ResponseOptions,
  addCorsHeaders?: (headers: Headers) => void,
) => Promise<Response>;

const json =
  (log: LogResponse): JSONResponse => async (data, options, addCorsHeaders) => {
    const headers = await getHeaders({
      contentType: "application/json",
      mutateHeaders: options?.mutateHeaders,
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
  mutateHeaders?: (headers: Headers) => void;
  message?: string;
}

type StatusResponse = (
  code: number,
  options?: StatusResponseOptions,
) => Promise<Response>;

const getStatusBody = (code: number, message?: string, data?: unknown) => {
  if (code === 204) return undefined;
  const msg = message || defaultMessage[code];
  return data || msg || undefined;
};

const status = (log: LogResponse): StatusResponse => (code, options) =>
  json(log)(
    getStatusBody(code, options?.message, options?.data),
    { status: code, mutateHeaders: options?.mutateHeaders },
  );

type HTMLResponse = (
  htmlString: string,
  options?: ResponseOptions,
  addCorsHeaders?: (headers: Headers) => void,
) => Promise<Response>;

const html =
  (log: LogResponse): HTMLResponse =>
  async (htmlString, options, addCorsHeaders) => {
    const headers = await getHeaders({
      contentType: "text/html",
      mutateHeaders: options?.mutateHeaders,
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
) => Promise<Response>;

const redirect =
  (log: LogResponse): RedirectResponse => async (url, options) => {
    const headers = await getHeaders({
      mutateHeaders: options?.mutateHeaders,
      redirectUrl: url,
    });
    const status = options?.status || 301;
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
