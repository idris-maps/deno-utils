export interface DbLog {
  level: "info" | "error";
  message: string;
  isMutation?: boolean;
  timestamp?: number;
  [key: string]: unknown;
}

export type Logger = (d: DbLog) => void;
