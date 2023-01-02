import { init } from "./init.ts";
import { serve } from "./serve.ts";

const firstArg = Deno.args[0];

if (firstArg === "init") {
  init();
} else if (firstArg === "serve") {
  serve();
} else {
  console.log(`
Use one of the following commands:

- "init" to create the folder structure
- "serve" to start the server
  `);
}
