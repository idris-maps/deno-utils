const getPathToMain = (pathParts: string[]) =>
  Array.from(Array(pathParts.length + 1))
    .map(() => "../")
    .join("");

const importJson = (pathToMain: string) =>
  `import type { Handler } from "${pathToMain}local.ts";`;

const importJsx = (pathToMain: string) =>
  [
    "/** @jsx h */",
    `import { h } from "${pathToMain}deps.ts";`,
    `import type { Handler } from "${pathToMain}local.ts";`,
    `import "${pathToMain}types.d.ts";`,
  ].join("\n");

const handlerJson = (method: string) =>
  [
    `const ${method.toLowerCase()}: Handler = (req, res) =>`,
    "  res.json(req.query);",
  ].join("\n");

const handlerJsx = (method: string) =>
  [
    `const ${method}: Handler = (req, res) =>`,
    '  res.jsx(<h2>Hello {req.query.name || "world"}</h2>);',
  ].join("\n");

const exportDefault = (method: string) => `export default ${method}`;

export default (method: string, pathParts: string[], jsx?: boolean) => {
  const pathToMain = getPathToMain(pathParts);

  if (jsx) {
    return [
      importJsx(pathToMain),
      handlerJsx,
      exportDefault(method),
    ].join("\n\n");
  }

  return [
    importJson(pathToMain),
    handlerJson(method),
    exportDefault(method),
  ].join("\n\n");
};
