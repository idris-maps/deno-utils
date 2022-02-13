import getRoutes from "./get-routes-to-create.ts";
import getContent from "./get-file-content.ts";

export default async (path: string = ".") => {
  const routes = await getRoutes(path);
  return Deno.writeTextFile(path + "/routes.ts", getContent(routes), {
    create: true,
  });
};
