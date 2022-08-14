// fake async database

const map = new Map<string, Record<string, unknown>>();

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const db = {
  insert: async (data: Record<string, unknown>) => {
    const _id = crypto.randomUUID();
    map.set(_id, data);
    await wait(100);
    return { ...data, _id };
  },
  getById: async (_id: string) => {
    const data = map.get(_id);
    await wait(100);
    return data ? { ...data, _id } : undefined;
  },
  getAll: async () => {
    const all = Array.from(map.entries());
    await wait(100);
    return all.map(([_id, data]) => ({ ...data, _id }));
  },
};

export default db;
