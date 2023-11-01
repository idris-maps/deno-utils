import { compare, DB, hash } from "./deps.ts";

const now = () => Math.floor(new Date().getTime() / 1000);

const createTables = (db: DB) => {
  db.execute(`
    CREATE TABLE IF NOT EXISTS __users (
      _id TEXT PRIMARY KEY,
      name TEXT UNIQUE,
      password_hash TEXT,
      timestamp INTEGER
    );

    CREATE TABLE IF NOT EXISTS __sessions (
      _id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES __users(_id),
      timestamp INTEGER
    )
  `);
};

const userNameExists = (db: DB) => (name: string) => {
  const rows = db.queryEntries<{ count: number }>(
    `
      SELECT COUNT(name) as count FROM __users WHERE name = :name
    `,
    { name },
  );
  return rows[0]?.count !== 0;
};

const insertUser = (db: DB) => async (name: string, password: string) => {
  const _id = crypto.randomUUID();
  const password_hash = await hash(password);
  db.query(
    `
      INSERT INTO __users (_id, name, password_hash, timestamp)
      VALUES (:_id, :name, :password_hash, :timestamp)
    `,
    { _id, name, password_hash, timestamp: now() },
  );
  return _id;
};

const verifyUser = (db: DB) =>
/** returns user id if exists and password is correct */
async (name: string, password: string) => {
  const rows = db.queryEntries<{ _id: string; password_hash: string }>(
    "SELECT _id, password_hash FROM __users WHERE name = :name",
    { name },
  );

  const row = rows[0];
  if (!row) return undefined;
  const correctPass = await compare(password, row.password_hash);
  return correctPass && row._id ? row._id : undefined;
};

const deleteUser = (db: DB) => (user_id: string) => {
  db.query(
    `
      DELETE FROM __sessions
      WHERE user_id = :user_id
    `,
    { user_id },
  );
  db.query(
    `
      DELETE FROM __users
      WHERE _id = :user_id
    `,
    { user_id },
  );
};

const createSession = (db: DB) =>
/** returns session_id */
(user_id: string) => {
  db.query(
    `
      DELETE FROM __sessions
      WHERE user_id = :user_id
    `,
    { user_id },
  );

  const _id = crypto.randomUUID();
  db.query(
    `
      INSERT INTO __sessions (_id, user_id, timestamp)
      VALUES (:_id, :user_id, :timestamp)
    `,
    { _id, user_id, timestamp: now() },
  );

  return _id;
};

const getUserFromSessionId = (db: DB) =>
/** if exists returns { user_id, username } else undefined */
(session_id: string) => {
  const rows = db.queryEntries<{ user_id: string; username: string }>(
    `
      SELECT __sessions.user_id, __users.name AS username
      FROM __sessions, __users
      WHERE __sessions.user_id = __users._id
      AND __sessions._id = :session_id
    `,
    { session_id },
  );

  const row = rows[0];
  if (!row) return undefined;

  db.query(
    `
      UPDATE __sessions
      SET timestamp = :timestamp
      WHERE _id = :session_id
    `,
    { session_id, timestamp: now() },
  );

  return row;
};

const deleteSession = (db: DB) => (session_id: string) => {
  db.query(
    `
      DELETE FROM __sessions
      WHERE _id = :session_id
    `,
    { session_id },
  );
};

const deleteSessionsOlderThan = (db: DB) => (days: number) => {
  db.query(
    `
      DELETE FROM __sessions
      WHERE timestamp < :date
    `,
    { date: now() - 60 * 60 * 24 * days },
  );
};

export const initDb = (path: string) => {
  const db = new DB(path);
  createTables(db);

  return {
    user: {
      create: insertUser(db),
      verify: verifyUser(db),
      nameIsInUse: userNameExists(db),
      remove: deleteUser(db),
    },
    session: {
      create: createSession(db),
      getUser: getUserFromSessionId(db),
      remove: deleteSession(db),
      removeOlderThan: deleteSessionsOlderThan(db),
    },
  };
};
