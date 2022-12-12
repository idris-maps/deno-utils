import { readDirDeep } from "../../deps.ts";
import {
  getRoute as _getRoute,
  getTree as _getTree,
  Tree,
} from "../get-route.ts";

const getTree = async (folder: string) => {
  const files = await readDirDeep(folder);
  const mdFiles = files.reduce((r: string[], d) => {
    if (d.endsWith(".md")) {
      r.push(d.split(".md")[0]);
    }
    return r;
  }, []);

  return _getTree(folder, mdFiles);
};

export const initGetRouteCached = (folder: string) => {
  let tree: Tree | undefined = undefined;
  return async (path: string) => {
    if (tree) {
      return _getRoute(folder, tree)(path);
    }
    tree = await getTree(folder);
    return _getRoute(folder, tree)(path);
  };
};

export const initGetRoute = (folder: string) => async (path: string) =>
  _getRoute(folder, await getTree(folder))(path);
