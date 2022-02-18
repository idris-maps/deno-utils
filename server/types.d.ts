import type { Cookie } from "./deps.ts";
import type { Res } from "./respond.ts";

export type Method = Request["method"];

export interface Endpoint<Local, CookieContent = any> {
  path: string;
  method: Method;
  handler: Handler<Local, CookieContent>;
}

export interface Req<CookieContent> {
  cookies: Record<string, string>;
  data: Record<string, unknown>;
  files: File[];
  headers: Record<string, string>;
  method: Method;
  params: Record<string, string>;
  query: Record<string, string>;
  request: Request;
  url: URL;
  user?: CookieContent;
}

export type Handler<Local, CookieContent = any> = (
  req: Req<CookieContent>,
  res: Res<CookieContent>,
  local: Local,
) => Response | Promise<Response>;

export interface RouterResponse<Local, CookieContent = any> {
  handler: Handler<Local, CookieContent>;
  params: {
    [key: string]: string;
  };
}

export type Router<Local, CookieContent = any> = (
  method: Method,
  path: string,
) => RouterResponse<Local, CookieContent> | undefined;

export interface LogContent extends Record<string, any> {
  type: "info" | "warn" | "error";
  requestId: string;
  event: string;
}

export type Logger = (d: LogContent) => void;

export interface Config<Local, CookieContent = any> {
  port?: number;
  routes: Endpoint<Local, CookieContent>[];
  local: Local;
  log?: Logger;
  cookie?: Omit<Cookie, "value">;
}
