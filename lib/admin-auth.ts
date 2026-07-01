import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "ilge_admin_session";

type AdminSession = {
  sub: string;
  role: "admin" | "editor";
  iat: number;
  exp: number;
};

function base64UrlEncode(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return atob(padded);
}

async function hmac(message: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME?.trim() || "admin",
    password: process.env.ADMIN_PASSWORD?.trim() || "admin123"
  };
}

export function getAdminSecret() {
  return process.env.ADMIN_JWT_SECRET?.trim() || "ilge-local-admin-secret-change-me";
}

export async function createAdminToken(username: string, role: AdminSession["role"] = "admin") {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(JSON.stringify({ sub: username, role, iat: now, exp: now + 60 * 60 * 8 }));
  const body = `${header}.${payload}`;
  const signature = await hmac(body, getAdminSecret());
  return `${body}.${signature}`;
}

export async function verifyAdminToken(token?: string | null): Promise<AdminSession | null> {
  if (!token) return null;

  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;

  const expected = await hmac(`${header}.${payload}`, getAdminSecret());
  if (signature !== expected) return null;

  const session = JSON.parse(base64UrlDecode(payload)) as AdminSession;
  if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;
  if (session.role !== "admin" && session.role !== "editor") return null;

  return session;
}

export async function requireAdmin(request: NextRequest) {
  return verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
}
