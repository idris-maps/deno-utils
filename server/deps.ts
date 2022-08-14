export { serve } from "https://deno.land/std@0.152.0/http/server.ts";
export { serveFile } from "https://deno.land/std@0.152.0/http/file_server.ts";
import type { Handler } from "https://deno.land/std@0.152.0/http/server.ts";
export type ServeHandler = Handler;
