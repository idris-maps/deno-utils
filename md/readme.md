# md

## to-html

Convert markdown to HTML

```ts
type toHtml = (source: string | ArrayLike<number>) => Promise<string>;
```

Based on [markdown-wasm](https://github.com/rsms/markdown-wasm) by
[rsms](https://rsms.me/), built as ES module with embedded WASM with the
following `parseOptions`:

```js
{
  bytes: false,
  parseFlags: md.ParseFlags.DEFAULT | md.ParseFlags.NO_HTML | md.ParseFlags.UNDERLINE,
}
```

## handle-code-blocks

Parse code blocks separately

```ts
type HandleCodeBlocks(
  md2html: (md: string) => Promise<string>,
  handleCodeBlock: (content: string, lang?: string) => Promise<string>,
) =>
  (md: string) =>
    Promise<string>
```
