import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { getRoute, getTree } from "./get-route.ts";

const pages = [
  "/index",
  "/a/b/c",
  "/a/b/d",
  "/a/b/[x]",
  "/a/[x]/c",
  "/a/index",
];

const source = "root";

Deno.test("[pages] getTree", () => {
  assertEquals(
    getTree(source, pages),
    {
      "root": {
        "index": { "type": "leaf", "path": "/index" },
        "a": {
          "b": {
            "c": { "type": "leaf", "path": "/a/b/c" },
            "d": { "type": "leaf", "path": "/a/b/d" },
            "[x]": { "type": "leaf", "path": "/a/b/[x]" },
          },
          "[x]": {
            "c": { "type": "leaf", "path": "/a/[x]/c" },
          },
          "index": { "type": "leaf", "path": "/a/index" },
        },
      },
    },
  );
});

Deno.test("[pages] matchRoute", () => {
  const tree = getTree(source, pages);
  const run = getRoute(source, tree);

  assertEquals(run("/"), {
    requestedPath: "/",
    path: "/index",
    params: {},
  });

  assertEquals(run("/a/b/c"), {
    requestedPath: "/a/b/c",
    path: "/a/b/c",
    params: {},
  });

  assertEquals(run("/a/b/d"), {
    requestedPath: "/a/b/d",
    path: "/a/b/d",
    params: {},
  });

  assertEquals(run("/a/b/test"), {
    requestedPath: "/a/b/test",
    path: "/a/b/[x]",
    params: { x: "test" },
  });

  assertEquals(run("/a/test/c"), {
    requestedPath: "/a/test/c",
    path: "/a/[x]/c",
    params: { x: "test" },
  });

  assertEquals(run("/a/test-1/test-2"), undefined);

  assertEquals(run("/a"), {
    requestedPath: "/a",
    path: "/a/index",
    params: {},
  });

  assertEquals(run("/a/index"), {
    requestedPath: "/a/index",
    path: "/a/index",
    params: {},
  });
});
