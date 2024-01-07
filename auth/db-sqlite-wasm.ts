import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";
import { AuthDb } from "./types.ts";

const init = (dbPath: string) => {
  // deno-lint-ignore require-await
  return async <T>(run: (db: DB) => T) => {
    const db = new DB(dbPath);
    const res = run(db);
    db.close();
    return res;
  };
};

const createTables = (db: DB) => {
  db.execute(`
    CREATE TABLE IF NOT EXISTS __users (
      name TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL
    )
  `);
  db.execute(`
    CREATE TABLE IF NOT EXISTS __sessions (
      _id TEXT PRIMARY KEY,
      expires INTEGER,
      name TEXT,
      FOREIGN KEY (name) REFERENCES __users (name) 
    )
  `);
  db.execute(`
    CREATE TABLE IF NOT EXISTS __roles (
      role TEXT,
      name TEXT,
      FOREIGN KEY (name) REFERENCES __users (name)
    ) 
  `);
  return undefined;
};

const userExists = (name: string) => (db: DB): boolean => {
  const exists = db.queryEntries<{ name: string }>(
    `
      SELECT name FROM __users
      WHERE name = ?
    `,
    [name],
  );
  return exists.length > 0;
};

const createUser =
  (name: string, passwordHash: string, roles?: string[]) => (db: DB) => {
    const exists = userExists(name)(db);
    if (exists) return { created: false };

    db.query(
      `
      INSERT INTO __users (name, password_hash)
      VALUES (?, ?)
    `,
      [name, passwordHash],
    );

    if (roles && roles.length) {
      for (const role of roles) {
        db.query(
          `
          INSERT INTO __roles (name, role)
          VALUES (?, ?)
        `,
          [name, role],
        );
      }
    }

    return { created: true };
  };

const getUserNames = (db: DB) => {
  const res = db.queryEntries<{ name: string }>(`
    SELECT name FROM __users
  `);
  return { names: res.map((d) => d.name) };
};

const getUsersWithRoles = (db: DB) => {
  const { names } = getUserNames(db);
  const roles = db.queryEntries<{ name: string; role: string }>(`
    SELECT name, role FROM __roles
  `);
  return names.map((name) => ({
    name,
    roles: roles.reduce((r: string[], d) => {
      if (d.name === name) r.push(d.role);
      return r;
    }, []),
  }));
};

const getPasswordHash = (name: string) => (db: DB) => {
  const res = db.queryEntries<{ password_hash: string }>(
    `
      SELECT password_hash FROM __users
      WHERE name = ?
    `,
    [name],
  );
  return res[0] ? res[0].password_hash : undefined;
};

const getUserRoles = (name: string) => (db: DB): { roles: string[] } => {
  const res = db.queryEntries<{ role: string }>(
    `
      SELECT role FROM __roles
      WHERE name = ?
    `,
    [name],
  );

  return { roles: res.map((d) => d.role) };
};

const addRole = (name: string, role: string) => (db: DB) => {
  const exists = userExists(name)(db);
  if (!exists) return { roles: [] };

  db.query(
    `
      INSERT INTO __roles (name, role)
      VALUES (?, ?)
    `,
    [name, role],
  );

  return getUserRoles(name)(db);
};

const removeRole = (name: string, role: string) => (db: DB) => {
  const exists = userExists(name)(db);
  if (!exists) return { roles: [] };

  db.query(
    `
      DELETE FROM __roles
      WHERE name = ?
      AND role = ?
    `,
    [name, role],
  );

  return getUserRoles(name)(db);
};

const deleteExpiredSessions = (db: DB) => {
  db.query(
    `
    DELETE FROM __sessions
    AND expires > ?
  `,
    [name, new Date().getTime()],
  );
};

const createSession = (name: string, validityInHours = 1) => (db: DB) => {
  deleteExpiredSessions(db);
  const sessionId = crypto.randomUUID();
  const expires = new Date(
    new Date().getTime() + validityInHours * (1000 * 60 * 60),
  ).getTime();
  db.query(
    `
      INSERT INTO __sessions (_id, name, expires)
      VALUES (?, ?, ?)
    `,
    [sessionId, name, expires],
  );
  return { sessionId };
};

const getSession = (sessionId: string, validityInHours = 1) => (db: DB) => {
  const sessions = db.queryEntries<
    { _id: string; name: string; expires: number }
  >(
    `
      SELECT * FROM __sessions
      WHERE _id = ?
    `,
    [sessionId],
  );
  const session = sessions[0];
  if (!session) return undefined;

  if (session.expires < new Date().getTime()) {
    db.query(
      `
        DELETE FROM __sessions
        WHERE _id = ?
      `,
      [sessionId],
    );
    return undefined;
  }

  db.query(
    `
      UPDATE __sessions
      SET expires = ?
      WHERE _id = ?
    `,
    [
      new Date(new Date().getTime() + validityInHours * (1000 * 60 * 60))
        .getTime(),
      sessionId,
    ],
  );

  const { roles } = getUserRoles(session.name)(db);

  return { name: session.name, roles };
};

export const initAuthDb = async (dbPath: string): Promise<AuthDb> => {
  const run = init(dbPath);

  await run(createTables);

  return {
    roles: {
      get: (name: string) => run(getUserRoles(name)),
      add: (name: string, role: string) => run(addRole(name, role)),
      remove: (name: string, role: string) => run(removeRole(name, role)),
    },
    sessions: {
      create: (name: string, validityInHours = 1) =>
        run(createSession(name, validityInHours)),
      get: (sessionId: string, validityInHours = 1) =>
        run(getSession(sessionId, validityInHours)),
    },
    users: {
      create: (name: string, passwordHash: string, roles?: string[]) =>
        run(createUser(name, passwordHash, roles)),
      getAllNames: () => run(getUserNames),
      getAllWithRoles: () => run(getUsersWithRoles),
      getPasswordHash: (name: string) => run(getPasswordHash(name)),
    },
  };
};
