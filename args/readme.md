# args

# `readArgs`

reads all arguments

Example `try-all.ts`:

```ts
import { readArgs } from "./mod.ts";
console.log(readArgs());
```

`deno run try-all.ts --key=value --thing` logs

```json
{ "key": "value", "thing": true }
```

# `readArg`

reads one argument

Example `try-key-value.ts`:

```ts
import { readArg } from "./mod.ts";
console.log(readArg("key"));
```

`deno run try-key-value.ts --key=value --thing` logs `"value"`

Example `try-boolean.ts`:

```ts
import { readArg } from "./mod.ts";
console.log(readArg("thing"));
```

`deno run try-key-value.ts --key=value --thing` logs `true`
