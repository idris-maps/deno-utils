import { serveFile } from "./serve-file.ts";
import type { El } from "./jsx.ts";
import { renderString } from "./jsx.ts";
import type { Cookie } from "./deps.ts";
import { setCookie } from "./deps.ts";
import { createCookie } from "./cookie.ts";
import type { Logger } from "./types.d.ts";

type LogResponse = (type: string, d: object) => void;

interface ResponseOptions {
  headers?: Record<string, string>;
  status?: number;
}

const getHeaders = ({ cookie, headers, contentType, redirectUrl }: {
  cookie?: Cookie;
  headers?: Record<string, string>;
  contentType?: string;
  redirectUrl?: string;
}) => {
  const head = new Headers({
    ...(headers || {}),
    ...(contentType ? { "Content-Type": contentType } : {}),
    ...(redirectUrl ? { "Location": redirectUrl } : {}),
  });
  if (cookie) {
    setCookie(head, cookie);
  }
  return head;
};

type JSONResponse = (
  data?: unknown,
  options?: ResponseOptions,
) => Response;

const json = (log: LogResponse, cookie?: Cookie): JSONResponse =>
  (data, options) => {
    const status = options?.status || 200;
    const headers = getHeaders({
      contentType: "application/json",
      cookie,
      headers: options?.headers,
    });
    log("json", { status, headers, data });
    return new Response(
      data ? JSON.stringify(data) : undefined,
      {
        status,
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
  headers?: { [key: string]: string };
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

const status = (log: LogResponse, cookie?: Cookie): StatusResponse =>
  (code, options) =>
    json(log, cookie)(
      getStatusBody(code, options?.message, options?.data),
      { status: code, headers: options?.headers },
    );

type HTMLResponse = (
  htmlString: string,
  options?: ResponseOptions,
) => Response;

const html = (log: LogResponse, cookie?: Cookie): HTMLResponse =>
  (htmlString, options) => {
    const headers = getHeaders({
      contentType: "text/html",
      cookie,
      headers: options?.headers,
    });

    log("html", { status: 200 });

    return new Response(
      "<!DOCTYPE html>\n" + htmlString,
      { status: 200, headers },
    );
  };

type JSXResponse = (
  jsx: El | string | null,
  options?: ResponseOptions & { doctype?: 'none' | string },
) => Response;

const jsx = (log: LogResponse, cookie?: Cookie): JSXResponse =>
  (jsx, _options) => {
    const { doctype, ...options } = (_options || {})
    const _html = doctype === 'none'
      ? renderString(jsx)
      : [(doctype || '<!DOCTYPE html>'), renderString(jsx)].join('\n')
    return html(log, cookie)(_html, options);
  }

type RedirectResponse = (
  url: string,
  options?: ResponseOptions,
) => Response;

const redirect = (log: LogResponse, cookie?: Cookie): RedirectResponse =>
  (url, options) => {
    const headers = getHeaders({
      cookie,
      headers: options?.headers,
      redirectUrl: url,
    });
    const status = options?.status || 301;
    log("redirect", { status, headers });

    return new Response(undefined, { status, headers });
  };

type FileResponse = (filePath: string) => Promise<Response>;

const file = (req: Request, log: LogResponse): FileResponse =>
  async (filePath: string) => {
    try {
      const [file, fileInfo] = await Promise.all([
        Deno.open(filePath),
        Deno.stat(filePath),
      ]);
      log("file", { status: 200, filePath });
      return serveFile(req, filePath, file, fileInfo);
    } catch (err) {
      return status(log)(404);
    }
  };

export interface Res<T> {
  file: FileResponse;
  html: HTMLResponse;
  json: JSONResponse;
  jsx: JSXResponse;
  redirect: RedirectResponse;
  status: StatusResponse;
  setCookie: (d: T) => void;
  removeCookie: () => void;
}

interface Props<T> {
  cookieConfig?: Omit<Cookie, "value">;
  cookieContent?: T;
  logger?: Logger;
  req: Request;
  requestId: string;
}

const init = <T>({
  cookieConfig,
  cookieContent,
  logger,
  req,
  requestId,
}: Props<T>): Res<T> => {
  const log: LogResponse = (responseType, data) =>
    logger
      ? logger({
        type: "info",
        requestId,
        event: "response",
        responseType,
        ...data,
      })
      : undefined;

  let cookie: Cookie | undefined = createCookie(cookieContent, cookieConfig);

  return {
    file: file(req, log),
    html: (htmlString: string, options?: ResponseOptions) =>
      html(log, cookie)(htmlString, options),
    json: (data?: unknown, options?: ResponseOptions) =>
      json(log, cookie)(data, options),
    jsx: (jsxElement: El | string | null, options?: ResponseOptions) =>
      jsx(log, cookie)(jsxElement, options),
    redirect: (url: string, options?: ResponseOptions) =>
      redirect(log, cookie)(url, options),
    status: (code: number, options?: StatusResponseOptions) =>
      status(log, cookie)(code, options),
    setCookie: (d: T) => {
      cookie = createCookie(d, cookieConfig);
    },
    removeCookie: () => {
      if (cookieConfig) {
        cookie = { ...cookieConfig, value: "", expires: new Date(0) };
      }
    },
  };
};

export default init;
