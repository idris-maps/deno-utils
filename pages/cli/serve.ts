import { startServer } from "../server/mod.ts";
import { initDb as initFormsDb } from "../../forms/db/mod.ts";
import { initPageDb } from "../../pages/db/fs/mod.ts";
import { readFormsFolder } from "../../pages/scripts/read-forms-folder.ts";
import { readArgs } from "../../args/mod.ts";
import { isInteger, isString } from "../../is/mod.ts";

interface Config {
  adminPath: string; // default "admin"
  apiPath: string; // default "/api"
  assetsFolder: string; // default "assets"
  formsDbName: string; // default "forms.db"
  formsFolder: string; // default "forms"
  layoutConfig: string;
  pagesFolder: string; // default "pages"
  port: number; // default 3333
}

const defaultConfig: Config = {
  adminPath: "admin",
  apiPath: "api",
  assetsFolder: "assets",
  formsDbName: "forms.db",
  formsFolder: "forms",
  layoutConfig: "layout-config.yaml",
  pagesFolder: "pages",
  port: 3333,
};

const getConfig = () => {
  const args = readArgs();
  const config = defaultConfig;
  if (args.port && isInteger(Number(args.port))) {
    config.port = Number(args.port);
  }
  if (isString(args.adminPath)) config.adminPath = args.adminPath;
  if (isString(args.apiPath)) config.apiPath = args.apiPath;
  if (isString(args.assetsFolder)) config.assetsFolder = args.assetsFolder;
  if (isString(args.formsDbName)) config.formsDbName = args.formsDbName;
  if (isString(args.pagesFolder)) config.pagesFolder = args.pagesFolder;
  if (isString(args.layoutConfig)) config.layoutConfig = args.layoutConfig;
  return config;
};

export const serve = async () => {
  const conf = getConfig();

  console.log(`
Config:
=======
  
${Object.entries(conf).map(([k, v]) => `  ${k}: ${v}`).join("\n")}
  
  `);

  const formsDb = await initFormsDb(conf.formsDbName, { cacheForms: true });
  const pageDb = await initPageDb({ folder: conf.pagesFolder });

  await readFormsFolder({ formsDb, folder: conf.formsFolder });

  startServer({ ...conf, pageDb, formsDb });
};
