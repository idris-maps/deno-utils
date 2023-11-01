import { Endpoint, server } from "../server/mod.ts";
import { initSessions } from "./mod.ts";
import html from "../html/mod.ts";

const port = 3000;

const session = initSessions({
  cookie: { domain: "localhost" },
  dbPath: "test.db",
});

const form = html`
  <form method="POST">
    <label for="name">username</label>
    <input name="name" />
    <label for="password">password</label>
    <input name="password" type="password" />
    <input type="submit" />
  </form>
`;

const routes: Endpoint[] = [
  {
    path: "/",
    method: "GET",
    handler: (req, res) => {
      const { headers, user } = session.getUserIdFromSession(req.request);
      const links = user
        ? `<a href="/logout">Log out</a>`
        : '<a href="/login">Log in</a><br/><a href="/signin">Sign in</a>';

      return res.html(
        html`
          <p>You are ${user ? JSON.stringify(user) : "not logged in"}</p>
          ${links}
        `,
        { headers },
      );
    },
  },
  {
    path: "/signin",
    method: "GET",
    handler: (_req, res) => {
      return res.html(form);
    },
  },
  {
    path: "/signin",
    method: "POST",
    handler: async (req, res) => {
      const { name, password } = req.data;
      const [headers, error] = await session.signIn(
        String(name),
        String(password),
      );
      return headers ? res.redirect("/", { headers }) : res.html(error);
    },
  },
  {
    path: "/login",
    method: "GET",
    handler: (_req, res) => {
      return res.html(form);
    },
  },
  {
    path: "/login",
    method: "POST",
    handler: async (req, res) => {
      const { name, password } = req.data;
      const headers = await session.logIn(String(name), String(password));
      return headers ? res.redirect("/", { headers }) : res.html("no");
    },
  },
  {
    path: "/logout",
    method: "GET",
    handler: (req, res) => {
      const headers = session.logOut(req.request);
      return res.redirect("/", { headers });
    },
  },
];

server({
  routes,
  port,
  log: (d) => d.level === "error" ? console.log(d) : undefined,
});
