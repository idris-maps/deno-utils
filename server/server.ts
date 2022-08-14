import { serve, ServeHandler } from "./deps.ts";
import parseRequest from "./parse-request.ts";
import initRes from "./respond.ts";
import initRouter from "./match-route.ts";
import type { Config, Logger, Router } from "./types.d.ts";

const requestHandler = <CookieContent>(
  router: Router,
  log?: Logger,
): ServeHandler =>
async (request: Request): Promise<Response> => {
  const requestId = crypto.randomUUID();
  try {
    const req = await parseRequest(request, requestId);
    const res = initRes<CookieContent>({
      req: request,
      requestId,
      logger: log,
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

const init = (
  { port, routes, log }: Config,
) => {
  const router = initRouter(routes);
  const handleRequest = requestHandler(router, log);

  console.log(`Started on port ${port}`);
  serve(handleRequest, { port });
};

export default init;
