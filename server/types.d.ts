import type { Res } from "./respond.ts";

export type Method = Request["method"];

export interface Endpoint<T> {
  path: string;
  method: Method;
  handler: Handler<T>;
}

export interface Req {
  data: { [key: string]: unknown };
  files: File[];
  headers: { [key: string]: string };
  method: Method;
  params: { [key: string]: string };
  query: { [key: string]: string };
  url: URL;
}

export type Handler<T> = (
  req: Req,
  res: Res,
  local: T,
) => Response | Promise<Response>;

export interface RouterResponse<T> {
  handler: Handler<T>;
  params: {
    [key: string]: string;
  };
}

export type Router<T> = (
  method: Method,
  path: string,
) => RouterResponse<T> | undefined;

export interface Config<T> {
  port?: number;
  routes: Endpoint<T>[];
  local: T;
  onError?: (e: unknown) => void;
}
