export { serve } from "https://deno.land/std@0.126.0/http/server.ts";
export { extname } from "https://deno.land/std@0.126.0/path/mod.ts";
export {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.126.0/http/http_status.ts";
export {
  getCookies,
  setCookie,
} from "https://deno.land/std@0.126.0/http/cookie.ts";
export {
  decode,
  encode,
} from "https://deno.land/std@0.126.0/encoding/base64url.ts";
export type { Cookie } from "https://deno.land/std@0.126.0/http/cookie.ts";
import type { Handler } from "https://deno.land/std@0.126.0/http/server.ts";
export type ServeHandler = Handler;
