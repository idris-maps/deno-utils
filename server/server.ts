import { serve, ServeHandler } from "./deps.ts";
import parseRequest from "./parse-request.ts";
import res from "./respond.ts";
import initRouter from "./match-route.ts";
import type { Config, Router } from "./types.d.ts";

const requestHandler = <T>(
  router: Router<T>,
  local: T,
  onError?: (e: unknown) => void,
): ServeHandler =>
  async (request: Request): Promise<Response> => {
    try {
      const req = await parseRequest(request);
      const route = router(req.method, req.url.pathname);
      if (!route) return res.status(404);

      const { handler, params } = route;
      return handler({ ...req, params }, res, local);
    } catch (e) {
      if (onError) onError(e);
      return res.status(500);
    }
  };

const init = <T>({ port = 3000, routes, local, onError }: Config<T>) => {
  const router = initRouter(routes);
  const handleRequest = requestHandler(router, local, onError);

  console.log(`Started on port ${port}`);
  serve(handleRequest, { addr: `:${port}` });
};

export default init;
