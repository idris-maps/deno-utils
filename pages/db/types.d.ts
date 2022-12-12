import { LayoutConfig } from "../deps.ts";
import type { Route } from "./get-route.ts";

export interface PageDb {
  getRoute: (path: string) => Promise<Route | undefined>;
  getPageLines: (path: string) => AsyncGenerator<string>;
  getLayoutConfig: (path?: string) => Promise<Partial<LayoutConfig>>
}
