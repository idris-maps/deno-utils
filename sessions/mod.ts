import { Cookie, deleteCookie, getCookies, setCookie } from "./deps.ts";
import { initDb } from "./db.ts";

interface Props {
  dbPath: string;
  cookie?: Omit<Partial<Cookie>, "value">;
  usernameValidation?: (d: string) => boolean;
  passwordValidation?: (d: string) => boolean;
}

const cookieDefaults: Pick<Cookie, "name" | "secure" | "httpOnly"> = {
  name: "session",
  secure: true,
  httpOnly: true,
};

const defaultValidation = (d: string) => d.length >= 3;

/**
 * @param {Props} props
 * @param {string} props.dbPath
 * @param {Omit<Partial<Cookie>, 'value'>} [props.cookie] default: { name: 'session', secure: true, httpOnly: true }
 * @param {(d: string) => boolean} [props.usernameValidation] default: d => d.length >= 3
 * @param {(d: string) => boolean} [props.passwordValidation] default: d => d.length >= 3
 */
export const initSessions = (
  { cookie, dbPath, usernameValidation, passwordValidation }: Props,
) => {
  const cookieConfig = { ...cookieDefaults, ...(cookie || {}) };
  const db = initDb(dbPath);
  const isValidUsername = usernameValidation || defaultValidation;
  const isValidPassword = passwordValidation || defaultValidation;

  const signIn = async (
    username: string,
    password: string,
    headers?: Headers,
  ): Promise<[Headers] | [undefined, string]> => {
    if (!isValidUsername(username)) {
      return [undefined, "invalid username"];
    }

    if (!isValidPassword(password)) {
      return [undefined, "invalid password"];
    }

    if (db.user.nameIsInUse(username)) {
      return [undefined, `user name "${username}" is already in use`];
    }

    const user_id = await db.user.create(username, password);
    const session_id = db.session.create(user_id);

    const H = headers || new Headers();
    setCookie(H, { ...cookieConfig, value: session_id });
    return [H];
  };

  const logIn = async (
    username: string,
    password: string,
    headers?: Headers,
  ) => {
    const user_id = await db.user.verify(username, password);

    if (!user_id) {
      return undefined;
    }

    const session_id = db.session.create(user_id);

    const H = headers || new Headers();
    setCookie(H, { ...cookieConfig, value: session_id });
    return H;
  };

  const getUserIdFromSession = (req: Request, headers?: Headers) => {
    const { session } = getCookies(req.headers);
    const H = headers || new Headers();
    if (!session) {
      return { headers: H };
    }
    const user = session ? db.session.getUser(session) : undefined;

    if (session && !user) {
      deleteCookie(H, cookieConfig.name);
      return { headers };
    }

    return { user, headers };
  };

  const logOut = (req: Request, headers?: Headers) => {
    const { session } = getCookies(req.headers);
    const H = headers || new Headers(req.headers);
    if (session) {
      db.session.remove(session);
      deleteCookie(H, cookieConfig.name);
    }
    return H;
  };

  return {
    deleteUser: db.user.remove,
    getUserIdFromSession,
    logIn,
    logOut,
    removeSessionsOlderThan: db.session.removeOlderThan,
    signIn,
  };
};
