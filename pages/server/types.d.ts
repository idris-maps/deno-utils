export interface LogContent extends Record<string, unknown> {
  level: "info" | "warn" | "error";
  requestId: string;
  event: string;
  status?: number;
}

export type Log = (d: LogContent) => void;
