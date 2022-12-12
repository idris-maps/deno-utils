import { is, isRecord, isString } from "../deps.ts";

export interface Leaf {
  type: "leaf";
  path: string;
}

export interface Tree {
  [key: string]: Tree | Leaf;
}

const normalizePath = (path: string, source?: string) =>
  path.split("/").reduce((r: string[], d) => {
    const part = d.trim();
    if (part !== "") r.push(part);
    return r;
  }, source ? [source] : []);

const isLeaf = is<Leaf>((d) =>
  isRecord(d) && d.type === "leaf" && isString(d.path)
);
const isPage = (d: Tree | Leaf): d is Leaf => isLeaf(d);

const addToTree = (path: string, parts: string[], tree: Tree): Tree => {
  const [first, ...rest] = parts;

  if (!rest.length) {
    return { ...tree, [first]: { type: "leaf", path } };
  }

  const _subtree = tree[first] || {};
  const subtree: Tree = isPage(_subtree) ? {} : _subtree;

  return { ...tree, [first]: addToTree(path, rest, subtree) };
};

export const getTree = (source: string, pages: string[]) => {
  const pageParts: [string, string[]][] = pages.map((d) => [
    d.startsWith("/") ? d : `/${d}`,
    normalizePath(d, source),
  ]);

  return pageParts.reduce(
    (r: Tree, [path, parts]) => addToTree(path, parts, r),
    {},
  );
};

export interface Route {
  path: string;
  requestedPath: string;
  params: Record<string, string>;
}

const isRoute = (d: Route | undefined): d is Route => Boolean(d);

export const matchRoute = (
  requestedPath: string,
  parts: string[],
  tree: Tree,
  path: string[] = [],
  params: Record<string, string> = {},
) => {
  if (!parts.length) return undefined;
  const [key, ...rest] = parts;

  const handleSubtree = (
    subtree?: Tree | Leaf,
    param?: [k: string, v: string],
  ): Route | undefined => {
    const _params = param
      ? { ...params, [param[0].slice(1).slice(0, -1)]: param[1] }
      : params;
    if (!subtree) return undefined;
    if (isPage(subtree)) {
      if (!rest.length) {
        return {
          path: subtree.path,
          requestedPath,
          params: _params,
        };
      }
      return undefined;
    }
    return matchRoute(
      requestedPath,
      rest,
      subtree,
      [...path, param ? param[0] : key],
      _params,
    );
  };

  const route = handleSubtree(tree[key]);
  if (route) return route;

  const paramParts = Object.keys(tree).filter((d) =>
    d.startsWith("[") && d.endsWith("]")
  );
  const routes = paramParts.map((d) => handleSubtree(tree[d], [d, key]));
  return routes.find(isRoute);
};

export const getRoute = (source: string, tree: Tree) => {
  const subtree = tree[source];
  const t = isPage(subtree) ? {} : subtree;
  return (path: string) => {
    const pathParts = normalizePath(path);
    const route = matchRoute(path, pathParts, t) ||
      matchRoute(path, [...pathParts, "index"], t);
    return route
      ? {
        ...route,
        params: Object.entries(route.params).reduce(
          (r: Record<string, string>, [k, v]) => {
            r[k] = decodeURIComponent(v);
            return r;
          },
          {},
        ),
      }
      : undefined;
  };
};
