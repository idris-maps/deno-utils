import { serve } from "./deps.ts";
import parseRequest from "./parse-request.ts";
import initRes from "./respond.ts";
import initRouter from "./match-route.ts";
import type {
  Config,
  CorsConfig,
  Endpoint,
  Logger,
  Router,
} from "./types.d.ts";

export const requestHandler = (
  router: Router,
  log?: Logger,
  corsConfig?: CorsConfig,
) =>
async (request: Request): Promise<Response> => {
  const requestId = crypto.randomUUID();
  try {
    const req = await parseRequest(request, requestId);
    const res = initRes({
      req: request,
      requestId,
      logger: log,
      corsConfig,
    });

    if (log) {
      log({ level: "info", requestId, event: "request", req });
    }
    const route = router(req.method, req.url.pathname);
    if (!route) return res.status(404);

    const { handler, params } = route;
    return handler({ ...req, params }, res, log);
  } catch (e) {
    if (log) {
      log({
        level: "error",
        requestId,
        event: "handler-error",
        errorMessage: e?.message,
        error: e,
      });
      log({ level: "info", requestId, event: "response", status: 500 });
    }
    return new Response(undefined, { status: 500 });
  }
};

export const router = (
  routes: Endpoint[],
  log: Logger | undefined,
  cors?: CorsConfig,
) => {
  const router = initRouter(routes, cors);
  return requestHandler(router, log, cors);
};

export const server = (
  { port, routes, log, cors }: Config,
) => {
  const router = initRouter(routes, cors);
  const handleRequest = requestHandler(router, log, cors);
  serve(handleRequest, { port });
};
