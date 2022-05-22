import init from "./lib/init/mod.ts";
import createRoute from "./lib/create-route/mod.ts";
import generateRoutesFile from "./lib/generate-routes-file/mod.ts";
import * as msg from "./lib/msg.ts";

const UTILS_VERSION = "v0.0.10";

const [op, ...args] = Deno.args;

const getArg = (prefix: string) => {
  const found = args.find((d) => d.startsWith("--" + prefix + "="));
  return found ? found.split("=")[1] : undefined;
};

if (op === "init") {
  const dir = args[0];
  await init(UTILS_VERSION, dir);
  await createRoute("get", "/", undefined, dir);
  await generateRoutesFile(dir);

  console.log(msg.init(dir));
} else if (op === "route") {
  const path = getArg("path");
  const method = getArg("method");
  const tsx = Boolean(args.find((d) => d === "--tsx"));

  if (path && method) {
    await createRoute(method, path, tsx);
    await generateRoutesFile();
    console.log(msg.routeCreated(path, method, tsx));
  }

  if (!path) console.log(msg.missingPath);
  if (!method) console.log(msg.missingMethod);
} else {
  console.log(msg.help(UTILS_VERSION));
}
