export interface TreeFile {
  type: "file";
  name: string;
}

export interface TreeFolder {
  type: "folder";
  name: string;
  children: (TreeFile | TreeFolder)[];
}

const last = <T>(arr: T[]) => arr[arr.length - 1];

const readChildren = async (folder: string, extensions?: string[]) => {
  try {
    const files = Deno.readDir(folder);
    const result: (TreeFile | TreeFolder)[] = [];
    for await (const file of files) {
      if (file.isFile) {
        const ext = last(file.name.split("."));
        if (!extensions || extensions.includes(ext)) {
          result.push({ type: "file", name: file.name });
        }
      }
      if (file.isDirectory) {
        result.push({ type: "folder", name: file.name, children: [] });
      }
    }
    return result;
  } catch {
    return [];
  }
};

export const getFileTree = async (
  path: string,
  extensions?: string[],
): Promise<TreeFolder> => {
  const name = last(path.split("/"));
  const directChildren = await readChildren(path, extensions);
  const children = await Promise.all(
    directChildren.map((d) => {
      if (d.type === "file") return d;
      return getFileTree(path + "/" + d.name, extensions);
    }),
  );
  return {
    type: "folder",
    name,
    children: children
      .filter((d) => d.type === "file" || d.children.length)
      .sort((a, b) => a.name > b.name ? 1 : -1),
  };
};
