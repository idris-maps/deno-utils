import { decode, encode } from "./deps.ts";
import type { Cookie } from './deps.ts'
import type { CookieConfig } from "./types.d.ts";

export const parseCookie = <T>(
  cookies: Record<string, string>,
  config?: CookieConfig,
): T | undefined => {
  if (!config) return undefined;
  const cookie = cookies[config.name];
  if (!cookie) return undefined;
  try {
    return JSON.parse(new TextDecoder().decode(decode(cookie)));
  } catch {
    return undefined;
  }
};

export const createCookie = <T>(
  data: T,
  config?: CookieConfig,
): Cookie | undefined => {
  if (config) {
    return {
      ...config,
      value: encode(JSON.stringify(data)),
    };
  }
  return undefined;
};
