import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

function secret(): string {
  return (
    process.env.ACADEMIA_DEVFULLSTACK_SECRET ??
    process.env.FORJA_SECRET ??
    "academia-devfullstack-dev-secret-troque-em-producao"
  );
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) {
    return false;
  }
  const next = scryptSync(password, salt, 64);
  const previous = Buffer.from(hash, "hex");
  if (next.length !== previous.length) {
    return false;
  }
  return timingSafeEqual(next, previous);
}

type TokenPayload = {
  sub: number;
  email: string;
  exp: number;
};

export function signToken(student: { id: number; email: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({
      sub: student.id,
      email: student.email,
      exp: Math.floor(Date.now() / 1000) + WEEK_IN_SECONDS,
    } satisfies TokenPayload),
  ).toString("base64url");
  const signature = createHmac("sha256", secret()).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): { sub: number; email: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  const [header, body, signature] = parts;
  if (!header || !body || !signature) {
    return null;
  }
  const expected = createHmac("sha256", secret()).update(`${header}.${body}`).digest();
  const received = Buffer.from(signature, "base64url");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Partial<TokenPayload>;
    if (typeof payload.sub !== "number" || typeof payload.email !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
