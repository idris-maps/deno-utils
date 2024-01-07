export interface Session {
  name: string;
  expires: number;
}

export interface User {
  passwordHash: string;
  roles?: string[];
}

export interface AuthDb {
  roles: {
    get: (name: string) => Promise<{ roles: string[] }>;
    add: (name: string, role: string) => Promise<{ roles: string[] }>;
    remove: (name: string, role: string) => Promise<{ roles: string[] }>;
  };
  sessions: {
    create: (
      name: string,
      validityInHours?: number,
    ) => Promise<{ sessionId: string }>;
    get: (
      sessionId: string,
      validityInHours?: number,
    ) => Promise<{ name: string; roles: string[] } | undefined>;
  };
  users: {
    create: (
      name: string,
      passwordHash: string,
      roles?: string[],
    ) => Promise<{ created: boolean }>;
    getAllNames: () => Promise<{ names: string[] }>;
    getAllWithRoles: () => Promise<{ name: string; roles: string[] }[]>;
    getPasswordHash: (name: string) => Promise<string | undefined>;
  };
}

export interface Auth {
  cookies: {
    create: (headers: Headers, name: string) => Promise<void>;
    delete: (headers: Headers) => void;
  };
  admin: {
    addRole: (name: string, role: string) => Promise<{ roles: string[] }>;
    removeRole: (name: string, role: string) => Promise<{ roles: string[] }>;
    getAllUsersWithRoles: () => Promise<{ name: string; roles: string[] }[]>;
  };
  user: {
    create: (
      user?: { name?: unknown; password?: unknown },
      roles?: string[],
    ) => Promise<{ created: boolean; name?: string; error?: string }>;
    getFromCookie: (
      headers: Headers,
    ) => Promise<{ name: string; roles: string[] } | undefined>;
    getAll: () => Promise<{ names: string[] }>;
    verifyPassword: (
      user?: { name?: unknown; password?: unknown },
    ) => Promise<boolean>;
  };
}
