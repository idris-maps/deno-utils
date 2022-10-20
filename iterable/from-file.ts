import { BufReader, TextProtoReader } from "./deps.ts";

const isString = (d: unknown): d is string => String(d) === d;

export const fromFile = async function* (filename: string) {
  const lines = new TextProtoReader(
    new BufReader(await Deno.open(filename, { read: true })),
  );

  let hasMore = true;

  while (hasMore) {
    const line = await lines.readLine();
    if (!isString(line)) {
      hasMore = false;
      return;
    }
    yield line;
  }
};
