import getRoutes from "./get-routes.ts";
import createFileContent from "./create-file-content.ts";

export default async (path = ".") => {
  const routes = await getRoutes(path);

  if (routes.length === 0) {
    throw 'Could not find any routes'
  }

  return Deno.writeTextFile(path + "/routes.ts", createFileContent(routes), {
    create: true,
  });
};
