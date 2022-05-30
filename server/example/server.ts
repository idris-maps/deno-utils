import server from "../mod.ts";
import jsxPage from "./page.jsx";

// fake async database
const map = new Map<string, object>();
const db = {
  insert: async (data: object) => {
    const _id = crypto.randomUUID();
    map.set(_id, data);
    return { ...data, _id };
  },
  get: async (_id: string) => {
    const data = map.get(_id);
    return data ? { ...data, _id } : undefined;
  },
};

interface Local {
  db: {
    insert: (data: object) => Promise<{
        _id: string;
    }>;
    get: (_id: string) => Promise<{
        _id: string;
    } | undefined>;
  }
}

// local is accessible in the route handlers
const local: Local = { db };

// type definition of cookie content
interface CookieContent {
  id: number
  name: string
}

server<Local, CookieContent>({
  port: 3000,
  local,
  cookie: {
    name: 'my-cookie',
    secure: true,
  },
  routes: [
    {
      path: "/html",
      method: "GET",
      handler: (req, res) => res.html(`Hello ${req.query.name || "world"}`),
    },
    {
      path: "/json",
      method: "POST",
      handler: async (req, res, local) =>
        res.json(await local.db.insert(req.data)),
    },
    {
      path: "/json/:id",
      method: "GET",
      handler: async (req, res, local) => {
        const data = await local.db.get(req.params.id);
        return data ? res.json(data) : res.status(404);
      },
    },
    {
      path: "/jsx/:name",
      method: "GET",
      handler: (req, res) => res.jsx(jsxPage(req.params.name)),
    },
    {
      path: "/redirect",
      method: "GET",
      handler: (_, res) => {
        res.setCookie({ id: 1, name: 'User' })
        return res.redirect("/redirected")
      },
    },
    {
      path: "/redirected",
      method: "GET",
      handler: (req, res) =>
        res.json(req.user),
    },
    {
      path: "/assets/*",
      method: "GET",
      handler: (req, res) => res.file(`assets/${req.params["*"]}`),
    },
  ],
});
