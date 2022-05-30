import { serve, ServeHandler } from "./deps.ts";
import parseRequest from "./parse-request.ts";
import initRes from "./respond.ts";
import initRouter from "./match-route.ts";
import { parseCookie } from "./cookie.ts";
import type { Config, Logger, Router, CookieConfig } from "./types.d.ts";

const requestHandler = <Local, CookieContent>(
  router: Router<Local, CookieContent>,
  local: Local,
  cookieConfig?: CookieConfig,
  log?: Logger,
): ServeHandler =>
  async (request: Request): Promise<Response> => {
    const requestId = crypto.randomUUID();
    try {
      const req = await parseRequest<CookieContent>(request);
      const cookieContent = parseCookie<CookieContent>(
        req.cookies,
        cookieConfig,
      );
      const res = initRes<CookieContent>({
        cookieConfig,
        cookieContent,
        req: request,
        requestId,
        logger: log,
      });

      if (log) {
        log({ type: "info", requestId, event: "call", req });
      }
      const route = router(req.method, req.url.pathname);
      if (!route) return res.status(404);

      const { handler, params } = route;
      return handler({ ...req, params, user: cookieContent }, res, local);
    } catch (e) {
      if (log) {
        log({
          type: "error",
          requestId,
          event: "handler-error",
          errorMessage: e?.message,
          error: e,
        });
        log({ type: "info", requestId, event: "response", status: 500 });
      }
      return new Response(undefined, { status: 500 });
    }
  };

const init = <Local, CookieContent = any>(
  { port = 3000, routes, local, log, cookie }: Config<Local, CookieContent>,
) => {
  const router = initRouter(routes);
  const handleRequest = requestHandler(router, local, cookie, log);

  console.log(`Started on port ${port}`);
  serve(handleRequest, { port });
};

export default init;
