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

export const createAssetsFolder = async (folder: string) => {
  await Deno.mkdir(folder);
  await Promise.all(
    assets.map(({ file, content }) => Deno.writeTextFile(file, content)),
  );
};
`);
