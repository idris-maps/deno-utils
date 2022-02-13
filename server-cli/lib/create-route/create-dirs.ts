const createIfNotExist = async (
  path: string,
  pathParts: string[],
): Promise<void> => {
  const [next, ...rest] = pathParts;

  if (!next) {
    return;
  }

  const dir = Deno.readDir(path);

  let exists = false;
  for await (const file of dir) {
    if (file.isDirectory && file.name === next) {
      exists = true;
    }
  }

  if (!exists) {
    await Deno.mkdir(path + "/" + next);
  }

  return createIfNotExist(path + "/" + next, rest);
};

export default async (pathParts: string[], dir?: string) =>
  createIfNotExist(
    dir ? `./${dir}` : ".",
    pathParts,
  );
