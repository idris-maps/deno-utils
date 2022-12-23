import { LayoutConfig } from "./types.d.ts";
import { getHead } from "./get-head.ts";

export const getLayout = (
  content: string,
  config: Partial<LayoutConfig> = {},
) =>
  [
    "<!DOCTYPE html>",
    config.lang ? `<html lang="${config.lang}">` : "<html>",
    "<head>",
    getHead(config),
    "</head>",
    "<body>",
    "<main>",
    content,
    "</main>",
    "</body>",
    "</html>",
  ].join("\n");
