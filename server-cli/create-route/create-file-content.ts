const importHandler = `import type { Handler } from "$/deps.ts";`;

const otherHandler = (method: string) =>
  [
    `const ${method.toLowerCase()}: Handler = (req, res) =>`,
    "  res.json(req.query);",
  ].join("\n");

const getHandler = (method: string) =>
  [
    `const ${method.toLowerCase()}: Handler = (req, res) =>`,
    "  res.html(`Hello ${req.query.name || 'world'}`);",
  ].join("\n");

const exportDefault = (method: string) => `export default ${method};`;

export default (method: string) =>
  [
    importHandler,
    method.toLowerCase() === "get" ? getHandler(method) : otherHandler(method),
    exportDefault(method),
  ].join("\n\n") + "\n";
