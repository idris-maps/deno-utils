import { decode, encode, HmacSha256 } from "./deps.ts";

const create = <T>(secret: string, payload: T) => {
  const header = { alg: "HS256", typ: "JWT" };
  const tokenHead = encode(JSON.stringify(header));
  const tokenPayload = encode(JSON.stringify(payload));
  const tokenSign = new HmacSha256(secret)
    .update(`${tokenHead}.${tokenPayload}`)
    .toString();

  return [tokenHead, tokenPayload, tokenSign].join(".");
};

const ERR = {
  notToken: "Not a token",
  invalid: "Invalid token",
  expired: "Token is expired",
};

const check = <T>(secret: string, token: string): T => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw ERR.notToken;
  }

  const [head, payload, sign] = parts;
  const checkSign = new HmacSha256(secret)
    .update(head + "." + payload)
    .toString();

  if (checkSign !== sign) {
    throw ERR.invalid;
  }

  try {
    return JSON.parse(new TextDecoder().decode(decode(payload)));
  } catch {
    throw ERR.invalid;
  }
};

interface Props {
  secret: string;
  validityInMs?: number;
}

const init = <T>({ secret, validityInMs }: Props) => {
  return {
    create: (d: T) => {
      const payload = validityInMs
        ? { ...d, exp: Date.now() + validityInMs }
        : d;

      return create(secret, payload);
    },
    check: (token: string) => {
      const payload = check<T & { exp?: number }>(secret, token);
      if (!validityInMs) {
        return payload;
      }
      const { exp, ...rest } = payload;
      if (!exp || exp < Date.now()) {
        throw ERR.expired;
      }
      return rest;
    },
  };
};

export default init;
