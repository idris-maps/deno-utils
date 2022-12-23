import { run } from "./run.ts";
import type { Logger } from "./types.ts";

export const dropRow = (
  dbFilename: string,
  log: Logger,
  formName: string,
  id: string,
) =>
  run(dbFilename, log, async ({ db }) => {
    log({
      level: "info",
      message: `Deleting row ${id} from "${formName}"`,
    });

    try {
      const rows = await db.queryEntries(
        `SELECT __id FROM ${formName} WHERE __id = ?`,
        [id],
      );

      if (!rows.length) {
        return { dropped: false };
      }

      await db.query(
        `DELETE FROM ${formName} WHERE __id = ?`,
        [id],
      );

      log({
        level: "info",
        message: `Deleted row ${id} from "${formName}"`,
        isMutation: true,
      });

      return { dropped: true };
    } catch (err) {
      log({
        level: "error",
        message: `Could not delete ${id} from "${formName}"`,
        error: err,
      });

      return { dropped: false };
    }
  });
