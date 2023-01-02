import { readDirDeep } from "../deps.ts";

const folder = "assets";

const files = await Promise.all((
  await readDirDeep(folder)
).map(async (file) => ({
  file,
  content: await Deno.readTextFile(folder + "/" + file),
})));

console.log(`
export const assets = ${JSON.stringify(files, null, 2)};

export const createAssetFiles = (folder: string) =>
  Promise.all(
    assets.map(({ file, content }) =>
      Deno.writeTextFile(folder + "/" + file, content)
    ),
  );
`);
