import { createLayout } from "./layout.ts";
import { toSvg } from "./layout-to-svg.ts";
import { isNonEmptyString } from "./utils.ts";

const EDGE_TYPES = ["-", "--", "..", "->", "-->", "..>"];
const DIRS = ["TB", "BT", "LR", "RL"];
const NODE = { xChar: 11.5, height: 30, xPad: 30 };

interface EdgeWithType {
  from: string;
  to: string;
  type: string;
}

const parseEdgeNode = (node?: string) => {
  if (!node || node.trim() === "") return undefined;
  if (node.includes("[") && node.includes("]")) {
    const [id, rest] = node.split("[").map((d) => d.trim());
    if (!isNonEmptyString(id)) return undefined;
    if (rest) {
      const [label] = rest.split("]").map((d) => d.trim());
      if (isNonEmptyString(label)) {
        return { id, label };
      }
    }
  }
  const id = (node || "").trim();
  return isNonEmptyString(id) ? { id } : undefined;
};

const getEdge = (line: string) => {
  const type = EDGE_TYPES.reduce((r, type) => {
    if (line.includes(type)) return type;
    return r;
  });
  if (!type) return undefined;
  const [_from, _to] = line.split(type);
  const from = parseEdgeNode(_from);
  const to = parseEdgeNode(_to);
  return from && to ? { from, to, type } : undefined;
};

const isDir = (d?: string): d is "TB" | "BT" | "LR" | "RL" =>
  Boolean(d) && DIRS.includes(String(d));

const getDir = (line: string) => {
  if (!line.trim().startsWith("dir:")) {
    return undefined;
  }
  return (line.split("dir:")[1] || "").trim();
};

const getNodeSize = (label: string) => ({
  width: label.length * NODE.xChar + NODE.xPad,
  height: NODE.height,
});

const initEdges = () => {
  const map = new Map<string, string>();
  const toId = (from: string, to: string) => from + "___" + to;
  const fromId = (id: string) => {
    const [from, to] = id.split("___");
    return { from, to };
  };
  return {
    add: (d: EdgeWithType) => {
      map.set(toId(d.from, d.to), d.type);
    },
    getType: (from: string, to: string) => map.get(toId(from, to)),
    getAll: (): EdgeWithType[] =>
      Array.from(map.entries()).map(([id, type]) => ({ ...fromId(id), type })),
  };
};

const getStrokeDashArray = (type?: string) => {
  if (type && type.includes("--")) return "2 3";
  if (type && type.includes("..")) return "0.5 1.5";
  return "1 0";
};

const getEdgePath = (type?: string) => ({
  stroke: "currentColor",
  "stroke-dasharray": getStrokeDashArray(type),
});

export const renderFlowchart = (dsl: string) => {
  let rankdir: "TB" | "BT" | "LR" | "RL" = "TB";
  const lines = dsl.split("\n").map((d) => d.trim());
  const nodes = new Map<string, string>();
  const edges = initEdges();

  const addNode = ({ id, label }: { id: string; label?: string }) => {
    const existing = nodes.get(id);
    if (!existing) nodes.set(id, label || id);
    if (label && label !== existing) nodes.set(id, label);
  };

  lines.forEach((line) => {
    const _dir = getDir(line);
    if (isDir(_dir)) rankdir = _dir;
    const edge = getEdge(line);
    if (edge) {
      addNode(edge.from);
      addNode(edge.to);
      edges.add({ from: edge.from.id, to: edge.to.id, type: edge.type });
    }
  });

  const layout = createLayout({
    nodes: Array.from(nodes.entries())
      .map((d) => ({ ...getNodeSize(d[1]), id: d[0], label: d[1] })),
    edges: edges.getAll(),
    config: { rankdir },
  });

  return toSvg(layout, {
    padding: [10, 10],
    edge: ({ to, from }) => {
      const type = edges.getType(String(from), String(to));
      return {
        arrow: Boolean(type && type.includes(">")),
        path: getEdgePath(type),
      };
    },
    node: {
      rect: {
        stroke: "currentColor",
        rx: "3",
        fill: "currentColor",
        "fill-opacity": 0.05,
        "stroke-opacity": 0.5,
      },
      label: { fill: "currentColor" },
    },
  });
};
