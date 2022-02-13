const readDir = async (path: string) => {
  const dir = Deno.readDir(path);

  let dirs: string[] = [];
  let files: string[] = [];
  for await (const file of dir) {
    if (file.isDirectory) dirs.push(path + "/" + file.name);
    if (file.isFile) files.push(path + "/" + file.name);
  }

  const children = (await Promise.all(dirs.map(readDir)));
  const childFiles = children
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

const readDirDeep = async (path: string = ".") => {
  const { files } = await readDir(path);
  return files.map(normalizePath);
};

export default readDirDeep;
