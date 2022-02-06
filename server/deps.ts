export { serve } from "https://deno.land/std@0.117.0/http/server.ts";
export { extname } from 'https://deno.land/std@0.117.0/path/mod.ts'
export { Status, STATUS_TEXT } from "https://deno.land/std@0.117.0/http/http_status.ts";
import type { Handler } from "https://deno.land/std@0.117.0/http/server.ts";
export type ServeHandler = Handler;
