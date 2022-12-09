import { server } from "../mod.ts";
import type { Endpoint } from "../mod.ts";
import db from "./fake-db.ts";

const routes: Endpoint[] = [
  // res.html adds the doctype
  // query parameters can be accessed with req.query
  {
    method: "GET",
    path: "/",
    handler: (req, res) =>
      res.html(`<h1>Hello ${req.query.name || "world"}</h1>`),
  },
  // req.data is either the json body or url encoded form data depending on content type
  {
    path: "/api/collection",
    method: "POST",
    handler: async (req, res) => res.json(await db.insert(req.data)),
  },
  {
    path: "/api/collection",
    method: "GET",
    handler: async (_, res) => res.json(await db.getAll()),
  },
  // url parameters are defined with a colon ":" in the path and accessed with req.params
  {
    path: "/api/collection/:id",
    method: "GET",
    handler: async (req, res) => {
      const data = await db.getById(req.params.id);
      return data ? res.json(data) : res.status(404);
    },
  },
  {
    path: "/redirect",
    method: "GET",
    handler: (_, res) => res.redirect("/?name=redirected"),
  },
  // the path to the file is relative to where the server is started
  {
    path: "/assets/*",
    method: "GET",
    handler: (req, res) => res.file(`assets/${req.params["*"]}`),
  },
  // headers can be modified with the "mutateHeaders" option
  {
    path: "/headers",
    method: "GET",
    handler: (_, res) =>
      res.html(
        '<p>Added a "foo" header</p>',
        {
          mutateHeaders: (headers) => {
            headers.set("foo", "bar");
          },
        },
      ),
  },
  // handlers may return any "Response"
  {
    path: "/custom",
    method: "GET",
    handler: (req, _, log) => {
      if (log) {
        // log successful response. optional. this is done automatically for other responses
        log({
          level: "info",
          requestId: req.requestId,
          event: "response",
          status: 200,
        });
      }
      // the handler must return a "Response" or "Promise<Response>"
      return new Response("Custom response");
    },
  },
];

server({
  routes,
  port: 3000,
  log: console.log, // optional. ignored if undefined
  cors: { allowedOrigins: '*', allowedMethods: '*', preflight: true }, // optional
});
