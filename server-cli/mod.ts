import init from "./init/mod.ts";
import createRoute from "./create-route/mod.ts";
import generateRoutesFile from "./generate-routes-file/mod.ts";
import * as msg from "./msg.ts";
import { readArg } from "./deps.ts";

const isString = (d: string | boolean | undefined): d is string =>
  String(d) === d;

const UTILS_VERSION = "1.0.0";

const [op, ...args] = Deno.args;

if (op === "init") {
  const dir = args[0];
  await init(UTILS_VERSION, dir);
  await createRoute("get", "/", dir);
  await generateRoutesFile(dir);

  console.log(msg.init(dir));
} else if (op === "route") {
  const path = readArg("path");
  const method = readArg("method");

  if (isString(path) && isString(method)) {
    await createRoute(method, path);
    await generateRoutesFile();
    console.log(msg.routeCreated(path, method));
  }

  if (!isString(path)) console.log(msg.missingPath);
  if (!isString(method)) console.log(msg.missingMethod);
} else if (op === "generate-routes-file") {
  await generateRoutesFile();

  console.log(msg.generatedRoutesFile);
} else {
  console.log(msg.help(UTILS_VERSION));
}
