import { CorsConfig } from "./types.d.ts"

const isAllowedOrigin = (request: Request, corsConfig?: CorsConfig) => {
  if (!corsConfig) { return false }

  const origin = request.headers.get('origin')
  if (!origin) { return false }
  if (corsConfig.allowedOrigins === '*') { return true }
  return corsConfig.allowedOrigins.includes(origin)
}

const isAllowedMethod = (request: Request, corsConfig?: CorsConfig) => {
  if (!corsConfig) { return false }

  const method = request.method.toUpperCase();
  if (corsConfig.preflight && method === 'OPTIONS') { return true }
  if (corsConfig.allowedMethods === '*') { return true }
  return corsConfig.allowedMethods.map(d => d.toUpperCase()).includes(method);
}

const isAllowedMethodAndOrigin = (request: Request, corsConfig?: CorsConfig) =>
  isAllowedMethod(request, corsConfig) && isAllowedOrigin(request, corsConfig);

const addHeaders = (headers: Headers, origin: string, methods: string[]) => {
  headers.append('Access-Control-Allow-Origin', origin);
  headers.append('Access-Control-Allow-Methods', methods.join(', '));
}

export type Config = CorsConfig;

export const cors = {
  addHeaders,
  isAllowedOrigin,
  isAllowedMethod,
  isAllowedMethodAndOrigin,
}
