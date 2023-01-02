import { createDirPath } from "../deps.ts";
import { createAssetFiles } from "../scripts/assets.ts";
import { createExampleFiles } from "../scripts/examples.ts";

const folders = ["assets", "forms", "pages"];

export const init = async () => {
  await Promise.all(folders.map((d) => createDirPath(d)));
  await createAssetFiles("assets");
  await createExampleFiles();

  console.log(`
  Created folder structure with an example page
  
  Start the server with "pages serve"
  `);
};
