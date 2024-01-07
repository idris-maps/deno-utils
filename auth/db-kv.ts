import { AuthDb, Session, User } from "./types.ts";

const isString = (d: unknown): d is string => Boolean(d && String(d) === d);

const createUser =
  (dbPath?: string) =>
  async (name: string, passwordHash: string, roles?: string[]) => {
    const kv = await Deno.openKv(dbPath);
    const user = await kv.get<User>(["users", name]);
    if (user?.value) return { created: false };
    await kv.set(["users", name], { passwordHash, roles });
    return { created: true };
  };

const getUserNames = (dbPath?: string) => async () => {
  const kv = await Deno.openKv(dbPath);
  const users = kv.list<User>({ prefix: ["users"] });
  const names: string[] = [];
  for await (const user of users) {
    const name = user.key[1];
    if (isString(name)) names.push(name);
  }
  return { names };
};

const getUsersWithRoles = (dbPath?: string) => async () => {
  const kv = await Deno.openKv(dbPath);
  const users = kv.list<User>({ prefix: ["users"] });
  const response: { name: string; roles: string[] }[] = [];
  for await (const user of users) {
    const name = user.key[1];
    if (isString(name)) response.push({ name, roles: user.value.roles || [] });
  }
  return response;
};

const getPasswordHash = (dbPath?: string) => async (name: string) => {
  const kv = await Deno.openKv(dbPath);
  const user = await kv.get<User>(["users", name]);
  return user?.value?.passwordHash;
};

const getUserRoles = (dbPath?: string) => async (name: string) => {
  const kv = await Deno.openKv(dbPath);
  const user = await kv.get<User>(["users", name]);
  return { roles: user?.value?.roles || [] };
};

const addUserRole = (dbPath?: string) => async (name: string, role: string) => {
  const kv = await Deno.openKv(dbPath);
  const user = await kv.get<User>(["users", name]);
  if (!user.value) return { roles: [] };
  const roles = Array.from(new Set([...user.value.roles || [], role]));
  await kv.set(["users", name], { ...user.value, roles });
  return { roles };
};

const removeUserRole =
  (dbPath?: string) => async (name: string, role: string) => {
    const kv = await Deno.openKv(dbPath);
    const user = await kv.get<User>(["users", name]);
    if (!user.value || !user.value.roles) return { roles: [] };
    const roles = (user.value.roles || []).filter((d) => d !== role);
    await kv.set(["users", name], { ...user.value, roles });
    return { roles };
  };

const createSession =
  (dbPath?: string) => async (name: string, validityInHours = 1) => {
    const kv = await Deno.openKv(dbPath);
    const sessionId = crypto.randomUUID();
    const expires = new Date(
      new Date().getTime() + validityInHours * (1000 * 60 * 60),
    ).getTime();
    const session: Session = { name, expires };
    await kv.set(["sessions", sessionId], session);
    return { sessionId };
  };

const getSession =
  (dbPath?: string) => async (sessionId: string, validityInHours = 1) => {
    const kv = await Deno.openKv(dbPath);
    const session = await kv.get<Session>(["sessions", sessionId]);
    if (!session.value) return undefined;

    const name = session.value?.name;
    const expires = session.value?.expires;
    if (!name || !expires || expires < new Date().getTime()) {
      await kv.delete(["sessions", sessionId]);
      return undefined;
    }

    const newExpires = new Date(
      new Date().getTime() + validityInHours * (1000 * 60 * 60),
    ).getTime();
    await kv.set(["sessions", sessionId], { name, expires: newExpires });

    const user = await kv.get<User>(["users", name]);
    return { name, roles: user.value?.roles || [] };
  };

export const initAuthDb = (dbPath?: string): AuthDb => {
  return {
    roles: {
      get: getUserRoles(dbPath),
      add: addUserRole(dbPath),
      remove: removeUserRole(dbPath),
    },
    sessions: {
      create: createSession(dbPath),
      get: getSession(dbPath),
    },
    users: {
      create: createUser(dbPath),
      getAllNames: getUserNames(dbPath),
      getAllWithRoles: getUsersWithRoles(dbPath),
      getPasswordHash: getPasswordHash(dbPath),
    },
  };
};
