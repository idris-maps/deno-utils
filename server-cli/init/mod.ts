import createFiles from "./create-files.ts";

export default async (utilsVersion: string, dir?: string) => {
  if (dir) {
    await Deno.mkdir(dir);
  }

  const folder = dir ? `./${dir}` : ".";

  await Deno.mkdir(folder + "/routes");

  const files = createFiles(utilsVersion).map((d) => ({
    path: folder + "/" + d.file,
    data: d.content.trim() + '\n',
  }));

  return Promise.all(
    files.map(
      ({ path, data }) => Deno.writeTextFile(path, data, { create: true }),
    ),
  );
};
