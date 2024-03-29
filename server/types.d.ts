import type { Res } from "./respond.ts";

export type { Res };

export type Method = Request["method"];

export interface Endpoint {
  path: string;
  method: Method;
  handler: Handler;
}

export interface Req {
  data: Record<string, unknown>;
  files: File[];
  headers: Headers;
  method: Method;
  params: Record<string, string>;
  query: Record<string, string>;
  request: Request;
  requestId: string;
  url: URL;
}

export type Handler = (
  req: Req,
  res: Res,
  log?: Logger,
) => Response | Promise<Response>;

export interface RouterResponse {
  handler: Handler;
  params: {
    [key: string]: string;
  };
}

export type Router = (
  method: Method,
  path: string,
) => RouterResponse | undefined;

export interface LogContent extends Record<string, unknown> {
  level: "info" | "warn" | "error";
  requestId: string;
  event: string;
  status?: number;
}

export type Logger = (d: LogContent) => void;

export interface CorsConfig {
  allowedOrigins: "*" | string[];
  allowedMethods: "*" | string[];
  preflight?: boolean;
}

export interface Config {
  port: number;
  routes: Endpoint[];
  log?: Logger;
  cors?: CorsConfig;
}
