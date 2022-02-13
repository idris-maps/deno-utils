import readDir from "./read-dir-deep.ts";
import type { Endpoint } from "../deps.ts";

export interface RouteToCreate extends Omit<Endpoint<any>, "handler"> {
  file: { name: string; path: string };
}

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
      if (d === "routes") return `./routes`;
      return r.startsWith("./routes") ? r + "/" + d : r;
    }, "");

const getEndpointPath = ([_, ...rest]: string[]) =>
  "/" + rest
    .map((d) => d.startsWith("[") && d.endsWith("]") ? ":" + d.slice(1, -1) : d)
    .join("/");

const parseFilePath = (filePath: string) => {
  const path = getPathFromRoutes(filePath);
  const parts = path.split("/");
  parts.shift();
  const fileName = parts.pop();
  const [method, ext] = String(fileName).split(".");

  if (isAllowedExt(ext) && isAllowedMethod(method)) {
    const route: RouteToCreate = {
      file: {
        name: [...parts, method].join("_"),
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
  const files = await readDir(dir);
  return files.map(parseFilePath).filter(isRoute);
};

export default getRoutes;
