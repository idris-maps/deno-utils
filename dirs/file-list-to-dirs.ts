import { html } from "./deps.ts";

type G<T> = Generator<T, void, unknown>;

const generate = function* (d: string[]): G<string> {
  for (const item of d) {
    yield item;
  }
};

const normalise = function* (d: G<string>): G<string[]> {
  for (const item of d) {
    let normal = item;
    if (item.startsWith("/")) normal = normal.slice(1);
    if (item.endsWith("/")) normal = normal.slice(0, -1);
    yield normal.split("/");
  }
};

interface DirFile {
  type: "file";
  name: string;
  path: string;
}

interface Dir {
  type: "dir";
  name: string;
  children: (Dir | DirFile)[];
}

const isDir = (d: Dir | DirFile): d is Dir => d.type === "dir";

const addToDir = (fullPath: string[], path: string[], parent: Dir): Dir => {
  if (path.length === 1) {
    parent.children.push({
      type: "file",
      name: path[0],
      path: "/" + fullPath.join("/"),
    });
    return parent;
  }
  if (path.length > 1) {
    const [name, ...rest] = path;
    const exisitingDirs: Dir[] = parent.children.filter(isDir);
    const exisitingDir: Dir | undefined = exisitingDirs.find((d) =>
      d.name === name
    );
    const dir = addToDir(
      fullPath,
      rest,
      exisitingDir || { type: "dir", name, children: [] },
    );
    if (!exisitingDir) {
      parent.children.push(dir);
    } else {
      parent.children = parent.children.map((d) =>
        isDir(d) && d.name === name ? dir : d
      );
    }
    return parent;
  }
  return parent;
};

const createTree = (paths: G<string[]>) => {
  const root: Dir = { type: "dir", name: "root", children: [] };
  for (const path of paths) {
    addToDir(path, path, root);
  }
  return root.children;
};

export const fileListToTree = (fileList: string[]) =>
  createTree(normalise(generate(fileList)));

type RenderFile = (file: DirFile) => string;

const toHtml = (d: (Dir | DirFile)[], renderFile?: RenderFile): string => {
  const dirs: Dir[] = [];
  const files: DirFile[] = [];
  for (const item of d) {
    if (isDir(item)) {
      dirs.push(item);
    } else {
      files.push(item);
    }
  }
  return html`
    ${
    dirs.map((dir) =>
      html`
      <details>
        <summary>${dir.name}</summary>
        ${toHtml(dir.children, renderFile)}
      </details>
    `
    )
  }
    ${
    files.length
      ? html`
          <ul>
            ${
        files.map((file) =>
          html`<li>${renderFile ? renderFile(file) : file.name}</li>`
        )
      }
          </ul>`
      : html``
  }
  `;
};

export const fileListToHtml = (
  fileList: string[],
  renderFile?: RenderFile,
) => toHtml(fileListToTree(fileList), renderFile);
