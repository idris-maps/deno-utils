import { parseVega, vegalite, VegaView } from "./deps.ts";

export const renderVega = async (json: object): Promise<string> => {
  const view = new VegaView(parseVega(json));
  // @ts-ignore
  return await view.toSVG();
};

export const renderVegalite = async (json: object): Promise<string> => {
  const { spec } = vegalite.compile(json);
  return await renderVega(spec);
};
