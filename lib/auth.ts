export const SESSION_COOKIE_NAME = "clones_session";

export type AuthUser = {
  email: string;
  name: string;
};

export type SessionPayload = {
  email: string;
  name: string;
  exp: number;
};

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;
const MAGIC_LINK_DURATION_SECONDS = 60 * 15;

export function getAuthUsers(): AuthUser[] {
  const usersJson = process.env.AUTH_USERS;

  if (usersJson) {
    try {
      const parsedUsers = JSON.parse(usersJson) as Partial<AuthUser>[];
      return parsedUsers
        .filter((user): user is AuthUser => Boolean(user.email))
        .map((user) => ({
          email: user.email.trim().toLowerCase(),
          name: user.name?.trim() || user.email.trim()
        }));
    } catch {
      return [];
    }
  }

  if (!process.env.AUTH_EMAIL) {
    return [];
  }

  return [
    {
      email: process.env.AUTH_EMAIL.trim().toLowerCase(),
      name: process.env.AUTH_NAME?.trim() || process.env.AUTH_EMAIL.trim()
    }
  ];
}

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? process.env.AUTH_EMAIL ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function findAuthUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return getAuthUsers().find((user) => user.email === normalizedEmail);
}

export async function createSessionToken(user: Pick<AuthUser, "email" | "name">) {
  const payload: SessionPayload = {
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export async function createMagicLinkToken(user: Pick<AuthUser, "email" | "name">, nextPath: string) {
  const payload = {
    email: user.email,
    name: user.name,
    next: nextPath,
    purpose: "magic-link",
    exp: Math.floor(Date.now() / 1000) + MAGIC_LINK_DURATION_SECONDS
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export async function verifyMagicLinkToken(token?: string | null) {
  const payload = await verifySignedPayload<{
    email: string;
    name: string;
    next: string;
    purpose: string;
    exp: number;
  }>(token);

  if (!payload || payload.purpose !== "magic-link") {
    return null;
  }

  return payload;
}

export async function verifySessionToken(token?: string | null): Promise<SessionPayload | null> {
  const payload = await verifySignedPayload<SessionPayload>(token);

  if (!payload || !payload.email || !payload.name) {
    return null;
  }

  return payload;
}

async function verifySignedPayload<T extends { exp: number }>(token?: string | null): Promise<T | null> {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = await sign(encodedPayload);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as T;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getSessionMaxAge() {
  return SESSION_DURATION_SECONDS;
}

export function getMagicLinkMaxAge() {
  return MAGIC_LINK_DURATION_SECONDS;
}

function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.OPENAI_API_KEY || "development-auth-secret";
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function base64UrlEncode(value: string) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function base64UrlEncodeBytes(bytes: Uint8Array) {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  const base64 = typeof btoa === "function" ? btoa(binary) : Buffer.from(bytes).toString("base64");
  return base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");

  if (typeof atob === "function") {
    const binary = atob(base64);
    return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
  }

  return Buffer.from(base64, "base64").toString("utf8");
}
