export interface Part {
  type: "md" | "code";
  lang?: string;
  content: string;
}

export type Gen<T> = AsyncGenerator<T, void, unknown>;

const iteratorToGenerator = async function* <T>(
  iterator: AsyncIterableIterator<T>,
): Gen<T> {
  for await (const d of iterator) {
    yield d;
  }
};

const stringToGenerator = async function* (md: string): Gen<string> {
  const lines = md.split("\n");
  let i = 0;
  const length = lines.length;
  while (i < length) {
    yield lines[i];
    i = i + 1;
  }
};

const FENCE = "```";

const separateCode = async function* (iterator: Gen<string>): Gen<Part> {
  let isCode = false;
  let lang: string | undefined = undefined;
  let current: string | undefined = undefined;
  for await (const line of iterator) {
    if (line.startsWith(FENCE)) {
      if (!isCode) {
        yield { type: "md", content: current || "" };
        const _lang = line.split(FENCE)[1];
        if (_lang !== "") lang = _lang;
        current = undefined;
        isCode = true;
      } else {
        yield { type: "code", lang, content: current || "" };
        lang = undefined;
        current = undefined;
        isCode = false;
      }
    } else {
      current = (current || "") + "\n" + line;
    }
  }

  yield { type: "md", content: current || "" };
};

const trim = async function* (iterator: Gen<Part>): Gen<Part> {
  for await (const part of iterator) {
    part.content = part.content.trim();
    if (part.content !== "") {
      yield part;
    }
  }
};

const uniq = <T>(arr: T[]): T[] => Array.from(new Set(arr));

const parse = async (
  md2html: (md: string) => Promise<string>,
  handleCodeBlock: (content: string, lang?: string) => Promise<string>,
  lines: Gen<string>,
) => {
  const parts = trim(separateCode(lines));

  let result: string = "";
  let langs: string[] = [];

  for await (const part of parts) {
    try {
      if (part.type === "code") {
        result = result + await handleCodeBlock(part.content, part.lang);
        if (part.lang) {
          langs.push(part.lang);
        }
      } else {
        result = result + await md2html(part.content);
      }
    } catch (err) {
      throw new Error(`Could not parse md part: \n${part.content}`, err);
    }
  }

  return { html: result, langs: uniq(langs) };
};

export const fromGenerator = async (
  md2html: (md: string) => Promise<string>,
  handleCodeBlock: (content: string, lang?: string) => Promise<string>,
  lines: AsyncIterableIterator<string>,
) =>
  parse(
    md2html,
    handleCodeBlock,
    iteratorToGenerator(lines),
  );

export const fromString = async (
  md2html: (md: string) => Promise<string>,
  handleCodeBlock: (content: string, lang?: string) => Promise<string>,
  md: string,
) =>
  parse(
    md2html,
    handleCodeBlock,
    stringToGenerator(md),
  );
