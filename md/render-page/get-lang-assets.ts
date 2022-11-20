const uniq = <T>(arr: T[]) => Array.from(new Set(arr));

const getLangAssets = (type: "css" | "scripts") =>
(
  langs: string[] = [],
  codeblockAssets: { [key: string]: { css?: string[]; scripts?: string[] } } =
    {},
) =>
  uniq(langs).reduce((r: string[], lang: string) => {
    const langAssets = codeblockAssets[lang];
    if (!langAssets) return r;
    const assets = langAssets[type] || [];
    assets.forEach((d) => {
      r.push(d);
    });
    return r;
  }, []);

export const getCodeblocksCss = getLangAssets("css");

export const getCodeblocksScripts = getLangAssets("scripts");
