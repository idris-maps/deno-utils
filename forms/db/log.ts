import type { DbLog, Logger } from "./types.ts";

export const logger = (...loggers: (Logger | undefined)[]) => {
  return (d: DbLog) => {
    loggers.forEach((log) => {
      if (log) {
        log({ ...d, timestamp: new Date().getTime(), dbLog: true });
      }
    });
  };
};
