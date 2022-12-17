const readDir = async (path: string) => {
  const dir = Deno.readDir(path);

  const dirs: string[] = [];
  const files: string[] = [];
  for await (const file of dir) {
    if (file.isDirectory) dirs.push(path + "/" + file.name);
    if (file.isFile) files.push(path + "/" + file.name);
  }

  const childDirs = (await Promise.all(dirs.map(readDir)));
  const childFiles = childDirs
    .map((d) => d.files)
    .reduce((r, d) => {
      d.forEach((file) => r.push(file));
      return r;
    }, []);

  const all: string[] = [...files, ...childFiles];

  return { files: all, dirs };
};

const normalizePath = (path: string) => {
  const parts = path.split("/");
  parts.shift();
  return parts.join("/");
};

export const readDirDeep = async (path = ".") => {
  const { files } = await readDir(path);
  return files.map(normalizePath);
};
