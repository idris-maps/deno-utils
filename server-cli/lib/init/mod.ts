import files from "./files.ts";

export default async (utilsVersion: string, dir?: string) => {
  if (dir) {
    await Deno.mkdir(dir);
  }

  const folder = dir ? `./${dir}` : ".";

  await Deno.mkdir(folder + "/routes");

  const _files = files(utilsVersion).map((d) => ({
    path: folder + "/" + d.file,
    data: d.content.trim(),
  }));

  return Promise.all(
    _files.map(
      ({ path, data }) => Deno.writeTextFile(path, data, { create: true }),
    ),
  );
};
