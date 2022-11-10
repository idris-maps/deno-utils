import { readableStreamFromReader, TextLineStream } from "./deps.ts";

export const linesFromFile = async function* (filename: string) {
  const file = await Deno.open(filename, { read: true });
  const lines = readableStreamFromReader(file)
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  for await (const line of lines) {
    yield line;
  }
};
