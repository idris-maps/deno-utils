import type { Endpoint, Handler, Method, Router } from "./types.d.ts";

export interface RouteTree {
  [key: string]: RouteTree | Method[];
}

const isMethodArray = (d: RouteTree | Method[]): d is Method[] =>
  Array.isArray(d);

const addToTree = (
  d: RouteTree,
  parts: string[],
  method: Method,
): RouteTree => {
  const [first, ...rest] = parts;

  if (!first) {
    const prev = d._ && Array.isArray(d._) ? d._ : [];
    return { _: [...prev, method] };
  }

  const subtree = d[first] || {};
  if (Array.isArray(subtree)) return {};

  return {
    ...d,
    [first]: addToTree(subtree, rest, method),
  };
};

const splitPath = (path: string): string[] =>
  path.split("/")
    .map((d) => decodeURIComponent(d).trim())
    .filter((d) => d !== "");

const createEndpointTree = <T>(endpoints: Endpoint<T>[]): RouteTree =>
  endpoints.reduce(
    (tree, { path, method }) => addToTree(tree, splitPath(path), method),
    {},
  );

const matchPath = (
  tree: RouteTree | Method[],
  parts: string[],
  path: string[] = [],
  params: { [key: string]: string } = {},
): {
  path?: string[];
  methods: Method[];
  params: { [key: string]: string };
} => {
  const [first, ...rest] = parts;

  if (isMethodArray(tree)) {
    return { path, methods: tree || [], params };
  }

  if (!first && isMethodArray(tree._)) {
    return { path, methods: tree._, params };
  }

  const subtree = tree[first];

  if (!subtree) {
    const paramKeys = Object.keys(tree).filter((d) => d.startsWith(":"));
    const wildCard = Object.keys(tree).find((d) => d === "*");

    if (paramKeys.length === 0 && wildCard) {
      return matchPath(tree["*"], [], [...path, "*"], {
        ...params,
        ":*": [first, ...rest].join("/"),
      });
    }

    const subtrees = paramKeys.map((k) =>
      matchPath(tree[k], rest, [...path, k], { ...params, [k]: first })
    );

    return subtrees.find((d) => d.path && d.methods.length) ||
      { methods: [], params };
  }

  const nextPath = [...path, first];

  if (isMethodArray(subtree)) {
    return { path: nextPath, methods: subtree, params };
  }

  return matchPath(subtree, rest, nextPath, params);
};

interface Match {
  path: string;
  method: string;
  params: { [key: string]: string };
}

const findMatch = (
  tree: RouteTree,
  path: string,
  method: Method,
): Match | undefined => {
  const { methods, params, path: matchedPath } = matchPath(
    tree,
    splitPath(path),
  );
  if (!matchedPath || !methods.includes(method)) {
    return undefined;
  }

  return {
    path: `/${matchedPath.join("/")}`,
    method,
    params: Object.keys(params)
      .reduce((r, key) => ({
        ...r,
        [key.slice(1)]: params[key],
      }), {}),
  };
};

const getMapKey = (
  { method, path }: { method: Method; path: string },
): string => `${method}____${path}`;

export default <T>(endpoints: Endpoint<T>[]): Router<T> => {
  const tree = createEndpointTree(endpoints);
  const map = new Map<string, Handler<T>>();
  endpoints.map((d) => {
    map.set(getMapKey(d), d.handler);
  });

  return (method: Method, path: string) => {
    const match = findMatch(tree, path, method);
    if (!match) return undefined;

    const handler = map.get(getMapKey(match));
    if (!handler) return undefined;

    return { handler, params: match.params };
  };
};
