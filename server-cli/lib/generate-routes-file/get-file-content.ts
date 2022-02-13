import type { RouteToCreate } from "./get-routes-to-create.ts";

const comment = [
  "/*",
  " * This file is generated",
  " * do not update it manually",
  " */",
].join("\n");

const importEndpointType = `import type { Endpoint } from "./local.ts";`;

const importRoute = ({ file }: RouteToCreate) =>
  `import ${file.name} from "${file.path}";`;

const importRoutes = (routes: RouteToCreate[]) =>
  routes.map(importRoute).join("\n");

const routesStart = `const routes: Endpoint[] = [`;
const routesEnd = `];`;

const oneRoute = ({ file, path, method }: RouteToCreate) =>
  [
    "  {",
    `    path: "${path}",`,
    `    method: "${method}",`,
    `    handler: ${file.name},`,
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
  ].join("\n\n");

export default getContent;
