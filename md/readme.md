# md

Convert markdown to HTML

Based on [markdown-wasm](https://github.com/rsms/markdown-wasm) by [rsms](https://rsms.me/), built as ES module with embedded WASM with the following `parseOptions`:

```js
{
  bytes: false,
  parseFlags: md.ParseFlags.DEFAULT | md.ParseFlags.NO_HTML | md.ParseFlags.UNDERLINE,
}
```
