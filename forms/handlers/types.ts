// deno-lint-ignore-file no-explicit-any

import type { FormsDb } from "../db/mod.ts";

export interface LogProps {
  level: "info" | "warn" | "error";
  message: string;
  [key: string]: unknown;
}

export type Logger = (d: LogProps) => void;

export interface HandlerProps {
  data: Record<string, unknown>;
  db: FormsDb;
  log: Logger;
  params: Record<string, string>;
  query: Record<string, string>;
}

export interface HandlerResponse {
  status: number;
  body?: any;
}

export type Handler = (
  props: HandlerProps,
) => Promise<HandlerResponse | undefined>;
