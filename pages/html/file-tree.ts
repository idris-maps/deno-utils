import { html, is, isRecord, TreeFolder } from "../deps.ts";
import { PageDb } from "../db/types.d.ts";

const removeExt = (name: string) => name.split(".").slice(0, -1).join(".");
const isFolder = is<TreeFolder>((d) => isRecord(d) && d.type === "folder");
const getSubFolders = (d: TreeFolder): TreeFolder[] =>
  d.children.filter(isFolder);
const getFiles = (d: TreeFolder) => d.children.filter((d) => d.type === "file");

const renderFileList = (path: string[], folder: TreeFolder) =>
  html`
    <ul>
      ${
    getFiles(folder).map(({ name }) =>
      html`
          <a href="/${[...path, folder.name, removeExt(name)].join("/")}">
            <li>${removeExt(name)}</li>
          </a>
        `
    )
  }
    </ul>
  `;

const renderFolder = (path: string[], folder: TreeFolder): string =>
  html`
    <details style="margin-left:1em">
      <summary>${folder.name}</summary>
      ${
    getSubFolders(folder).map((d) => renderFolder([...path, folder.name], d))
  }
      ${renderFileList(path, folder)}
    </details>
  `;

export const fileTree = async (pagesFolder: string, pageDb: PageDb) => {
  const tree = await pageDb.getPageTree(pagesFolder);
  if (!tree) {
    return html`<p>There are no pages, create one</p>`;
  }
  return html`
    <div class="admin-file-tree">
      ${getSubFolders(tree).map((d) => renderFolder([], d))}
      ${renderFileList([], tree)}
    </div>
  `;
};
