import { Endpoint, server } from "../server/mod.ts";
import html from "../html/mod.ts";
import { initAuth } from "./auth.ts";
import { initAuthDb } from "./db-sqlite-wasm.ts";
import { redirectIfUnknown } from "./handlers.ts";

const isString = (d: unknown): d is string => Boolean(d && String(d) === d);

const form = (action?: string) =>
  html`
  <form method="POST" action=${action}>
    <label for="name">username</label>
    <input name="name" />
    <label for="password">password</label>
    <input name="password" type="password" />
    <input type="submit" />
  </form>
`;

const auth = initAuth({ db: await initAuthDb("test-sqlite.db") });

const redirectIfNotLoggedIn = redirectIfUnknown({ auth, redirectUrl: "/" });

const routes: Endpoint[] = [
  {
    path: "/",
    method: "GET",
    handler: async (req, res) => {
      const user = await auth.user.getFromCookie(req.headers);

      const links = user ? html`<a href="/logout">Log out</a>` : html`
          <h1>Log in</h1>
          ${form("/login")}
          <p>Not user? <a href="/signin">Sign in</a></p>
        `;

      return res.html(
        html`
          <p>You are ${user ? user.name : "not logged in"}</p>
          ${links}
        `,
      );
    },
  },
  {
    path: "/signin",
    method: "GET",
    handler: (req, res) => {
      return res.html(
        html`
          <h1>Sign in</h1>
          ${form()}
          ${req.query.error ? html`<p>${req.query.error}</p>` : ""}
        `,
      );
    },
  },
  {
    path: "/signin",
    method: "POST",
    handler: async (req, res) => {
      const { created, error, name } = await auth.user.create(req.data);
      if (!created && error || !name) {
        return res.redirect(
          "/signin?error=" + encodeURIComponent(error || "unknown error"),
        );
      }

      return res.redirect("/", {
        mutateHeaders: (h) => auth.cookies.create(h, name),
      });
    },
  },
  {
    path: "/login",
    method: "GET",
    handler: (req, res) => {
      return res.html(
        html`
          <h1>Log in</h1>
          ${form()}
          ${req.query.error ? html`<p>${req.query.error}</p>` : ""}
        `,
      );
    },
  },
  {
    path: "/login",
    method: "POST",
    handler: async (req, res) => {
      const name = req.data.name;
      if (!isString(name)) {
        return res.redirect(
          `/login?error=${
            encodeURIComponent("name/password combination is invalid")
          }`,
        );
      }

      const ok = await auth.user.verifyPassword(req.data);
      if (!ok) {
        return res.redirect(
          `/login?error=${
            encodeURIComponent("name/password combination is invalid")
          }`,
        );
      }

      return res.redirect("/", {
        mutateHeaders: (h) => auth.cookies.create(h, name),
      });
    },
  },
  {
    path: "/users",
    method: "GET",
    handler: redirectIfNotLoggedIn(async (req, res) => {
      return res.json({
        me: req.user,
        users: await auth.admin.getAllUsersWithRoles(),
      });
    }),
  },
  {
    path: "/logout",
    method: "GET",
    handler: redirectIfNotLoggedIn((_, res) => {
      return res.redirect("/", {
        mutateHeaders: (h) => auth.cookies.delete(h),
      });
    }),
  },
];

server({
  routes,
  port: 3000,
});
