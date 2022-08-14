import createFileContent from "./create-file-content.ts";
import { createDirPath } from "../deps.ts";

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

const fileExists = async (filePath: string) => {
  try {
    await Deno.stat(filePath);
    return true;
  } catch {
    return false;
  }
};

const getPathParts = (path: string) =>
  path.split("/").filter((d) => d.trim() !== "");

export default async (
  method: string,
  path: string,
  rootdir?: string,
) => {
  if (!(await hasRoutesDir(rootdir))) {
    throw 'no "routes" directory';
  }

  const filePathParts = [
    "routes",
    ...getPathParts(path).map((d) =>
      d.startsWith(":") ? `[${d.substring(1)}]` : d
    ),
  ];

  const dirPath = (rootdir ? [rootdir, ...filePathParts] : filePathParts).join(
    "/",
  );
  const filePath = `${dirPath}/${method.toLowerCase()}.ts`;

  if (await fileExists(filePath)) {
    throw `file "${filePath}" already exists`;
  }

  await createDirPath(dirPath);

  const file = createFileContent(method.toLowerCase());
  await Deno.writeTextFile(filePath, file, { create: true });

  console.log("Wrote " + filePath);
};
