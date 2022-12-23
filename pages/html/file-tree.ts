import { html, is, isRecord, TreeFolder } from "../deps.ts";
import { PageDb } from "../db/types.d.ts";

const removeLast = <T>(arr: T[]) => arr.filter((_, i) => i !== arr.length - 1);
const handleIndex = (name: string) =>
  name.endsWith("index") ? removeLast(name.split("/")).join("/") : name;
const removeExt = (name: string) => name.split(".").slice(0, -1).join(".");
const getUrl = (
  pagesFolder: string,
  path: string[],
  folderName: string,
  name: string,
) => {
  const _name = handleIndex(removeExt(name));
  const r = "/" +
    (pagesFolder === folderName && path.length === 0
      ? _name
      : [...path, folderName, _name].join("/"));
  return r;
};

const isFolder = is<TreeFolder>((d) => isRecord(d) && d.type === "folder");
const getSubFolders = (d: TreeFolder): TreeFolder[] =>
  d.children.filter(isFolder);
const getFiles = (d: TreeFolder) => d.children.filter((d) => d.type === "file");

const renderFileList = (
  pagesFolder: string,
  path: string[],
  folder: TreeFolder,
) =>
  html`
    <ul>
      ${
    getFiles(folder).map(({ name }) =>
      html`
          <a href="${getUrl(pagesFolder, path, folder.name, name)}">
            <li>${removeExt(name)}</li>
          </a>
        `
    )
  }
    </ul>
  `;

const renderFolder = (
  pagesFolder: string,
  path: string[],
  folder: TreeFolder,
): string =>
  html`
    <details style="margin-left:1em">
      <summary>${folder.name}</summary>
      ${
    getSubFolders(folder).map((d) =>
      renderFolder(pagesFolder, [...path, folder.name], d)
    )
  }
      ${renderFileList(pagesFolder, path, folder)}
    </details>
  `;

export const fileTree = async (pagesFolder: string, pageDb: PageDb) => {
  const tree = await pageDb.getPageTree(pagesFolder);
  if (!tree) {
    return html`<p>There are no pages, create one</p>`;
  }

  return html`
    <div class="admin-file-tree">
      ${getSubFolders(tree).map((d) => renderFolder(pagesFolder, [], d))}
      ${renderFileList(pagesFolder, [], tree)}
    </div>
  `;
};
