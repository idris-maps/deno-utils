const initCurrent = `
  server was initialized in the current directory

  RUN:
  chmod u+x start.sh
  ./start.sh
`;

const initInDir = (dir: string) => `
  server was initialized in "${dir}" directory

  RUN:
  cd ${dir}
  chmod u+x start.sh
  ./start.sh
`;

export const init = (dir?: string) => dir ? initInDir(dir) : initCurrent;

export const missingPath = `
  the "path" needs to defined

  example: --path=api/resources
`;

export const missingMethod = `
  the "method" needs to be defined

  example: --method=GET
`;

export const routeCreated = (path: string, method: string) => `
  wrote file ${path}/${method.toLowerCase()}.ts
  added route ${method.toUpperCase()} ${path}
`;

export const generatedRoutesFile = `
  generated "routes.ts" file
`

export const help = (version: string) => `
  ------------------------------
   server-cli version: ${version}
  ------------------------------

  COMMANDS:

  server-cli init <DIR>
    initialize server
    DIR is optional
    if not defined the server will be created in the current directory

  server-cli route <ARGS>
    generate a route
    ARGS:
      * --path=PATH : the path of the route to create
      * --method=METHOD : the HTTP verb to use for the path
 
  server-cli generate-routes-file
    generates the "routes.ts" file

    to be run after manually adding routes
`;
