# flowchart

## `renderFlowChart`

```ts
const svg = renderFlowchart(`
Alice --> Bob
`);
```

Takes a flowchart description as described
[here](https://flowchart.surge.sh/about.html) and returns an SVG string.

[Demo](https://flowchart.surge.sh/)

Based on [dagre](https://github.com/dagrejs/dagre)
