import { initGetRoute, initGetRouteCached } from "./get-route.ts";
import { getFileTree, linesFromFile } from "../../deps.ts";
import type { PageDb } from "../types.d.ts";
import { readLayoutConfig } from "../get-layout-config.ts";

const checkFolderExists = async (folder: string) => {
  try {
    const dir = Deno.readDir(folder);
    for await (const _ of dir) return;
  } catch (e) {
    throw `Could not open pages folder ${folder}: ${e.message}`;
  }
};

interface Props {
  folder: string;
  cacheRoutes?: boolean;
}

export const initPageDb = async (
  { folder, cacheRoutes }: Props,
): Promise<PageDb> => {
  await checkFolderExists(folder);

  const getRoute = cacheRoutes
    ? initGetRouteCached(folder)
    : initGetRoute(folder);

  const getPageLines = (path: string) =>
    linesFromFile(`${folder}${path.startsWith("/") ? path : "/" + path}.md`);

  const getLayoutConfig = (path?: string) => readLayoutConfig(path);

  const getPageTree = async (folder?: string) =>
    folder ? (await getFileTree(folder, ["md"])) : undefined;

  return {
    getRoute,
    getPageLines,
    getLayoutConfig,
    getPageTree,
    folder,
  };
};
