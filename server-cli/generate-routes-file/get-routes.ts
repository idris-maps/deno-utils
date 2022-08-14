import { readDirDeep } from "../deps.ts";
import type { RouteToCreate } from "./types.d.ts";

const ALLOWED_METHODS = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
];

const isAllowedMethod = (method: string) => ALLOWED_METHODS.includes(method);

const ALLOWED_EXT = ["ts", "js", "tsx", "jsx"];

const isAllowedExt = (ext: string) => ALLOWED_EXT.includes(ext);

const getPathFromRoutes = (path: string) =>
  path
    .split("/")
    .reduce((r, d) => {
      if (d === "routes") return `$/routes`;
      return r.startsWith("$/routes") ? r + "/" + d : r;
    }, "");

const getEndpointPath = ([_, ...rest]: string[]) =>
  "/" + rest
    .map((d) => d.startsWith("[") && d.endsWith("]") ? ":" + d.slice(1, -1) : d)
    .join("/");

const fixFileNamePart = (part: string) => {
  if (part.startsWith("[") && part.endsWith("]")) {
    return '$' + part.slice(1, -1)
  }
  if (part === '*') {
    return '$wildcard'
  }
  return part
}

const getFileName = (parts: string[], method: string) =>
  [...parts, method].map(fixFileNamePart).join("_");

const parseFilePath = (filePath: string) => {
  const path = getPathFromRoutes(filePath);
  const parts = path.split("/");
  parts.shift();
  const fileName = parts.pop();
  const [method, ext] = String(fileName).split(".");

  if (isAllowedExt(ext) && isAllowedMethod(method)) {
    const route: RouteToCreate = {
      file: {
        name: getFileName(parts, method),
        path,
      },
      path: getEndpointPath(parts),
      method: method.toUpperCase(),
    };

    return route;
  }
  return undefined;
};

const isRoute = (d: RouteToCreate | undefined): d is RouteToCreate =>
  Boolean(d);

const getRoutes = async (dir: string): Promise<RouteToCreate[]> => {
  const files = await readDirDeep(dir);
  return files.map(parseFilePath).filter(isRoute);
};

export default getRoutes;
