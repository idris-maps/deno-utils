# jwt

```ts
const jwt: <T>({ secret, validityInMs }: Props) => {
  create: (d: T) => string;
  check: (token: string) => T;
};
```
