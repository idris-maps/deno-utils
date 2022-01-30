interface Part {
  type: "md" | "code";
  lang?: string;
  content: string;
}

type Gen<T> = AsyncGenerator<T, void, unknown>;

const toLines = async function* (md: string): Gen<string> {
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

export default (
  md2html: (md: string) => Promise<string>,
  handleCodeBlock: (content: string, lang?: string) => Promise<string>,
) =>
  async (md: string) => {
    const lines = toLines(md);
    const parts = trim(separateCode(lines));

    let result: string = "";

    for await (const part of parts) {
      try {
        if (part.type === "code") {
          result = result + await handleCodeBlock(part.content, part.lang);
        } else {
          result = result + await md2html(part.content);
        }
      } catch (err) {
        throw new Error(`Could not parse md part: \n${part.content}`, err);
      }
    }

    return result;
  };
