import { FormsDb, initFormHandlers, serve } from "../deps.ts";
import { initAssetsHandler } from "./assets-router.ts";
import { initPageHandler } from "./page-router.ts";
import { initApiRouter } from "./api-router.ts";
import { Log } from "./types.d.ts";
import { PageDb } from "../db/types.d.ts";
import { initAdminRouter } from "./admin-router.ts";

interface Props {
  adminPath?: string; // default "admin"
  apiPath?: string; // default "/api"
  assetsFolder?: string; // default "assets"
  formsDb: FormsDb;
  layoutConfig?: string;
  log?: Log;
  pageDb: PageDb;
  port?: number; // default 3333
}

export const startServer = async (
  {
    adminPath,
    apiPath,
    assetsFolder,
    formsDb,
    layoutConfig: layoutPath,
    log,
    pageDb,
    port,
  }: Props,
) => {
  const apiPrefix = apiPath
    ? apiPath.startsWith("/") ? apiPath : `/${apiPath}`
    : "/api";
  const adminPrefix = adminPath
    ? adminPath.startsWith("/") ? adminPath : `/${adminPath}`
    : "/admin";
  const assetsPrefix = assetsFolder
    ? assetsFolder.startsWith("/") ? assetsFolder : `/${assetsFolder}`
    : "/assets";

  const layoutConfig = await pageDb.getLayoutConfig(layoutPath);

  const formHandlers = initFormHandlers(formsDb);
  const adminHandler = initAdminRouter({
    adminPath: adminPrefix,
    formsDb,
    pageDb,
    h: formHandlers,
    layoutConfig,
  });
  const apiHandler = initApiRouter({
    apiPath: apiPrefix,
    h: formHandlers,
    log,
  });
  const assetsHandler = initAssetsHandler(log);
  const pageHandler = initPageHandler(
    pageDb,
    formsDb,
    layoutConfig,
    log,
  );

  const handler = (request: Request): Promise<Response> => {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith(assetsPrefix)) {
      return assetsHandler(request);
    }

    if (pathname.startsWith(adminPrefix)) {
      return adminHandler(request);
    }

    if (pathname.startsWith(apiPrefix)) {
      return apiHandler(request);
    }

    return pageHandler(request);
  };

  serve(handler, { port: port || 3333 });
};
