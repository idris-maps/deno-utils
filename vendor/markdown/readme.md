# markdown-wasm

https://github.com/rsms/markdown-wasm

## How to build

```
git clone https://github.com/rsms/markdown-wasm
cd markdown-wasm
npm install
```

Add to `wasmrc.js`

```js
module({ ...m,
  name:   "markdown-custom",
  out:    outdir + "/markdown.embed.js",
  embed:  true,
  format: "es",
})
```

```
npm run build
```
