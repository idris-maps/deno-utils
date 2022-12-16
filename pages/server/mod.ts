import { FormsDb, serve } from "../deps.ts";
import { initAssetsHandler } from "./assets-router.ts";
import { initPageHandler } from "./page-router.ts";
import { initApiRouter } from "./api-router.ts";
import { Log } from "./types.d.ts";
import { PageDb } from "../db/types.d.ts";

interface Props {
  apiPath?: string; // default "/api"
  assetsFolder?: string; // default "assets"
  formsDb: FormsDb;
  layoutConfig?: string;
  log?: Log;
  pageDb: PageDb;
  port?: number; // default 3333
}

export const startServer = async (
  { apiPath, assetsFolder, formsDb, layoutConfig, log, pageDb, port }: Props,
) => {
  const apiPrefix = apiPath
    ? apiPath.startsWith("/") ? apiPath : `/${apiPath}`
    : "/api";

  const apiHandler = initApiRouter({ apiPath: apiPrefix, formsDb, log });
  const assetsHandler = initAssetsHandler(log);
  const pageHandler = initPageHandler(
    pageDb,
    formsDb,
    await pageDb.getLayoutConfig(layoutConfig),
    log,
  );

  const handler = (request: Request): Promise<Response> => {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith(`/${assetsFolder || "assets"}`)) {
      return assetsHandler(request);
    }

    if (pathname.startsWith(apiPrefix)) {
      return apiHandler(request);
    }

    return pageHandler(request);
  };

  serve(handler, { port: port || 3333 });
};
