import type { RouteToCreate } from "./types.d.ts";

const comment = [
  "/*",
  " * This file is generated",
  " * do not update it manually",
  " */",
].join("\n");

const importEndpointType = `import type { Endpoint } from "$/deps.ts";`;

const importRoutes = (routes: RouteToCreate[]) =>
  [
    "const route = {",
    ...routes.map((d) => `  "${d.file.name}": await import("${d.file.path}"),`),
    "};",
  ].join("\n");

const routesStart = `const routes: Endpoint[] = [`;
const routesEnd = `];`;

const oneRoute = ({ file, path, method }: RouteToCreate) =>
  [
    "  {",
    `    path: "${path}",`,
    `    method: "${method}",`,
    `    handler: route["${file.name}"].default,`,
    "  },",
  ].join("\n");

const allRoutes = (routes: RouteToCreate[]) =>
  [
    routesStart,
    ...routes.map(oneRoute),
    routesEnd,
  ].join("\n");

const exportDefault = `export default routes;`;

const getContent = (routes: RouteToCreate[]) =>
  [
    comment,
    importEndpointType,
    importRoutes(routes),
    allRoutes(routes),
    exportDefault,
  ].join("\n\n") + "\n";

export default getContent;
