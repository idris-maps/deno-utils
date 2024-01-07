import type { Logger, Req, Res } from "../server/mod.ts";
import type { Auth } from "./types.ts";

type HandlerWithUser = (
  req: Req & { user: { name: string; roles: string[] } },
  res: Res,
  log?: Logger,
) => Response | Promise<Response>;

export const redirectIfUnknown = (
  { auth, redirectUrl }: { auth: Auth; redirectUrl: string },
) =>
(handler: HandlerWithUser) =>
async (req: Req, res: Res, log?: Logger) => {
  const user = await auth.user.getFromCookie(req.headers);
  if (!user) return res.redirect(redirectUrl);
  return handler({ ...req, user }, res, log);
};

export const redirectIfDoesNotHaveRoles = (
  { auth, redirectUrl, roles }: {
    auth: Auth;
    redirectUrl: string;
    roles: string[];
  },
) =>
(handler: HandlerWithUser) =>
async (req: Req, res: Res, log?: Logger) => {
  const user = await auth.user.getFromCookie(req.headers);
  if (!user) return res.redirect(redirectUrl);

  if (!roles.some((role) => user.roles.includes(role))) {
    return res.redirect(redirectUrl);
  }

  return handler({ ...req, user }, res, log);
};

export const notFoundIfUnknown = (
  { auth }: { auth: Auth },
) =>
(handler: HandlerWithUser) =>
async (req: Req, res: Res, log?: Logger) => {
  const user = await auth.user.getFromCookie(req.headers);
  if (!user) return res.status(404);
  return handler({ ...req, user }, res, log);
};

export const notFoundIfDoesNotHaveRoles = (
  { auth, roles }: { auth: Auth; roles: string[] },
) =>
(handler: HandlerWithUser) =>
async (req: Req, res: Res, log?: Logger) => {
  const user = await auth.user.getFromCookie(req.headers);
  if (!user) return res.status(404);

  if (!roles.some((role) => user.roles.includes(role))) {
    return res.status(404);
  }

  return handler({ ...req, user }, res, log);
};
