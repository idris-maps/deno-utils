import type { Endpoint } from "../deps.ts";

export interface RouteToCreate extends Omit<Endpoint, "handler"> {
  file: { name: string; path: string };
}
