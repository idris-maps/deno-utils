export const readArg = (name: string) => {
  const arg = Deno.args.find((d) => d.startsWith(`--${name}`));
  if (!arg) return undefined;
  const value = arg.split("=")[1];
  return value || true;
};

export const readArgs = () =>
  Deno.args
    .filter((d) => d.startsWith("--"))
    .reduce(
      (
        r: Record<string, string | boolean>,
        d: string,
      ): Record<string, string | boolean> => {
        const [arg, value] = d.split("=");
        return { ...r, [arg.substring(2)]: value || true };
      },
      {},
    );
