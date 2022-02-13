import getFileContent from "./get-file-content.ts";
import createDirs from "./create-dirs.ts";

const hasRoutesDir = async (_dir?: string) => {
  const dir = Deno.readDir(_dir ? `./${_dir}` : ".");
  let has = false;
  for await (const file of dir) {
    if (file.name === "routes" && file.isDirectory) {
      has = true;
    }
  }
  return has;
};

const getPathParts = (path: string) =>
  path.split("/").filter((d) => d.trim() !== "");

const fileExists = async (filePath: string) => {
  try {
    await Deno.stat(filePath);
    return true;
  } catch {
    return false;
  }
};

export default async (
  method: string,
  path: string,
  tsx?: boolean,
  dir?: string,
) => {
  const pathParts = getPathParts(path);
  const _method = method.toLowerCase();
  const file = getFileContent(_method, pathParts, tsx);

  if (!(await hasRoutesDir(dir))) {
    throw 'no "routes" directory in the current location';
  }

  await createDirs(pathParts, dir);

  const filePath = [
    ...(dir ? [dir, "routes", ...pathParts] : ["routes", ...pathParts]),
    _method + (tsx ? ".tsx" : ".ts"),
  ].join("/");

  if (await fileExists(filePath)) {
    throw `file "${filePath}" already exists`;
  }

  return Deno.writeTextFile(filePath, file);
};
