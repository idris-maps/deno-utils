import {
  compare,
  Cookie,
  deleteCookie,
  getCookies,
  hash,
  setCookie,
} from "./deps.ts";
import { Auth, AuthDb } from "./types.ts";

type CookieOptions = Omit<Cookie, "value">;

export interface InitSessionProps {
  db: AuthDb;
  cookieOptions?: CookieOptions;
  sessionValidityInHours?: number;
}

const isString = (d: unknown): d is string => Boolean(d && String(d) === d);

const validateName = (name: unknown): [undefined, string] | [string] => {
  if (!isString(name)) return [undefined, "name is not a string"];
  if (name.length < 2) {
    return [undefined, "name is too short (min 3 characters)"];
  }
  if (name.length > 15) {
    return [undefined, "name is too long (max 15 characters)"];
  }
  if (name.includes(" ")) return [undefined, "name may not include spaces"];
  return [name];
};

const validatePassword = (
  password: unknown,
): [undefined, string] | [string] => {
  if (!isString(password)) return [undefined, "password is not a string"];
  if (password.length < 6) {
    return [undefined, "password is too short (min 3 characters)"];
  }
  if (password.length > 120) {
    return [undefined, "password is too long (max 120 characters)"];
  }
  if (password.includes(" ")) {
    return [undefined, "password may not include spaces"];
  }
  return [password];
};

const createUser = (db: AuthDb) =>
async (
  user: { name?: unknown; password?: unknown } = {},
  roles?: string[],
): Promise<{ created: boolean; name?: string; error?: string }> => {
  const [name, nameError] = validateName(user.name);
  if (!name) return { created: false, error: String(nameError) };

  const [password, passwordError] = validatePassword(user.password);
  if (!password) return { created: false, error: String(passwordError) };

  const { created } = await db.users.create(
    name,
    await hash(password),
    roles,
  );

  return created
    ? { created, name }
    : { created, error: "name is already used" };
};

const verifyPassword =
  (db: AuthDb) => async (user: { name?: unknown; password?: unknown } = {}) => {
    const [name] = validateName(user.name);
    if (!name) return false;
    const [password] = validatePassword(user.password);
    if (!password) return false;

    const hash = await db.users.getPasswordHash(name);
    if (!hash) return false;
    return compare(password, hash);
  };

// deno-lint-ignore require-await
const getSession = async (
  db: AuthDb,
  sessionId: unknown,
  validityInHours = 1,
) => {
  if (!sessionId || !isString(sessionId)) return undefined;
  return db.sessions.get(sessionId, validityInHours);
};

const createCookie =
  (db: AuthDb, cookieOptions: CookieOptions, validityInHours: number) =>
  async (headers: Headers, name: string) => {
    const { sessionId } = await db.sessions.create(name, validityInHours);
    const cookie: Cookie = { ...cookieOptions, value: sessionId };
    setCookie(headers, cookie);
  };

const getUserFromCookie =
  (db: AuthDb, cookieName: string, validityInHours: number) =>
  (headers: Headers) =>
    getSession(db, getCookies(headers)[cookieName], validityInHours);

export const initAuth = (props: InitSessionProps): Auth => {
  const cookieOptions: CookieOptions = props.cookieOptions || {
    name: "session",
    secure: true,
    httpOnly: true,
  };
  const validityInHours = props.sessionValidityInHours || 1;

  return {
    cookies: {
      create: createCookie(props.db, cookieOptions, validityInHours),
      delete: (headers: Headers) => deleteCookie(headers, cookieOptions.name),
    },
    admin: {
      addRole: (name: string, role: string) => props.db.roles.add(name, role),
      removeRole: (name: string, role: string) =>
        props.db.roles.remove(name, role),
      getAllUsersWithRoles: props.db.users.getAllWithRoles,
    },
    user: {
      create: createUser(props.db),
      getFromCookie: getUserFromCookie(
        props.db,
        cookieOptions.name,
        validityInHours,
      ),
      getAll: props.db.users.getAllNames,
      verifyPassword: verifyPassword(props.db),
    },
  };
};
