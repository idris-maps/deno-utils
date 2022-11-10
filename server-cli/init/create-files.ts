const files = (version: string) => ({
  "import_map.json": `
{
  "imports": {
    "$/": "./"
  }
}
  `,

  // ---------------

  "deps.ts": `
export { server } from "https://deno.land/x/anders@v${version}/server/mod.ts";
export { default as html } from "https://deno.land/x/anders@v${version}/html/mod.ts";
export { readArg } from "https://deno.land/x/anders@v${version}/args/mod.ts";
export type { Endpoint, Handler } from "https://deno.land/x/anders@v${version}/server/types.d.ts";
  `,

  // ---------------

  "mod.ts": `
import { readArg, server } from "./deps.ts";
import routes from "./routes.ts";

const port = Number.isNaN(Number(readArg("port")))
  ? 3000
  : Number(readArg("port"));
  
server({ routes, port });
  `,

  // ---------------

  "start.sh": `
#!/bin/bash

deno run --allow-net --importmap=import_map.json mod.ts    
  `,
});

export default (version: string) => {
  const obj = files(version);

  return Object.entries(obj).map(([file, content]) => ({ file, content }));
};
