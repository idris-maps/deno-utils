# server-cli

Initialize server and generate routes

## Install

```
deno install --allow-write --allow-read -n server-cli https://deno.land/x/anders@v0.0.6/server-cli/mod.ts
```

## Usage

### initialize the server

`server-cli init <DIR>`

DIR is optional, if not defined the server will be created in the current
directory

### generate a route

`server-cli route <ARGS>`

ARGS:

- `--path=<PATH>` : the path of the route to create
- `--method=<METHOD>` : the HTTP verb to use for the path
- `--tsx` : (optional) if the route is returning an HTML page written in TSX
