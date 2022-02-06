import { serveFile } from './serve-file.ts'
import type { El } from "./jsx.ts";
import { renderString } from "./jsx.ts";

type JSONResponse = (
  data?: unknown,
  options?: {
    headers?: { [key: string]: string };
    status?: number;
  },
) => Response;

const json: JSONResponse = (data, options) =>
  new Response(
    data ? JSON.stringify(data) : undefined,
    {
      status: options?.status || 200,
      headers: {
        ...(options?.headers || {}),
        "Content-Type": "application/json",
      },
    },
  );

const defaultMessage: { [key: number]: string } = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal server error",
};

type StatusResponse = (
  code: number,
  options?: {
    message?: string;
    data?: unknown;
    headers?: { [key: string]: string };
  },
) => Response;

const status: StatusResponse = (code, options) => {
  const msg = options?.message || defaultMessage[code];
  return json(
    code === 204
      ? undefined
      : options?.data || msg
      ? { message: msg }
      : undefined,
    { status: code, headers: options?.headers },
  );
};

type HTMLResponse = (
  htmlString: string,
  options?: {
    headers?: { [key: string]: string };
    status?: number;
  },
) => Response;

const html: HTMLResponse = (htmlString, options) =>
  new Response(
    htmlString,
    {
      status: 200,
      headers: {
        ...(options?.headers || {}),
        "Content-Type": "text/html",
      },
    },
  );

type JSXResponse = (
  jsx: El | string | null,
  options?: {
    headers?: { [key: string]: string };
    status?: number;
  },
) => Response;

const jsx: JSXResponse = (jsx, options) =>
  new Response(
    renderString(jsx),
    {
      status: 200,
      headers: {
        ...(options?.headers || {}),
        "Content-Type": "text/html",
      },
    },
  );

type RedirectResponse = (
  url: string,
  options?: {
    headers?: { [key: string]: string };
  },
) => Response;

const redirect: RedirectResponse = (url, options) =>
  new Response(
    undefined,
    {
      status: 301,
      headers: {
        ...(options?.headers || {}),
        "Location": url,
      },
    },
  );

type FileResponse = (filePath: string) => Promise<Response>;

const file = (req: Request): FileResponse =>
  async (filePath: string) => {
    try {
      const [file, fileInfo] = await Promise.all([
        Deno.open(filePath),
        Deno.stat(filePath),
      ]);
      return serveFile(req, filePath, file, fileInfo)
    } catch (err) {
      return status(404)
    }
  }

export interface Res {
  file: FileResponse;
  html: HTMLResponse;
  json: JSONResponse;
  jsx: JSXResponse;
  redirect: RedirectResponse;
  status: StatusResponse;
}

const init = (req: Request): Res => ({
  file: file(req),
  html,
  json,
  jsx,
  redirect,
  status,
});

export default init;
