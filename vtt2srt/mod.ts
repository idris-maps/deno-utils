import { linesFromFile } from "../iterable/mod.ts";

const file = Deno.args[0];
if (!file || !file.endsWith(".vtt")) throw new Error("No .vtt file specified");

const lines = linesFromFile(file);

const isTimestamp = (d: string) => {
  if (!d.includes(" --> ")) return { ts: false };
  const [start, _end] = d.split(" --> ").map((p) => p.trim());
  const [end] = _end.split(" ");
  return start.length === 12 && end.length === 12
    ? { ts: true, start, end }
    : { ts: false };
};

interface Part {
  start: string;
  end: string;
  rows: string[];
}

async function* toPart(lines: AsyncGenerator<string>) {
  let part: Part | undefined;
  for await (const line of lines) {
    const l = line.trim();
    const { ts, start, end } = isTimestamp(l);
    if (ts && start && end) {
      part = { start, end, rows: [] };
    } else if (l === "") {
      if (part) yield part;
      part = undefined;
    } else {
      if (part) part.rows.push(l);
    }
  }
  if (part) yield part;
}

const toSrtTimestamp = ({ start, end }: Part) =>
  [
    start.replace(".", ","),
    end.replace(".", ","),
  ].join(" --> ");

const fixRow = (d: string) => {
  if (d.includes("<") && d.includes(">")) {
    const letters = [];
    let skip = false;
    for (const l of Array.from(d)) {
      if (l === "<") skip = true;
      else if (l === ">") skip = false;
      else {
        if (!skip) letters.push(l);
      }
    }
    return letters.join("");
  }
  return d;
};

let num = 0;

for await (const part of toPart(lines)) {
  console.log(part);
  num = num + 1;
  console.log(num);
  console.log(toSrtTimestamp(part));
  part.rows.forEach((row) => console.log(fixRow(row)));
  console.log("");
}
