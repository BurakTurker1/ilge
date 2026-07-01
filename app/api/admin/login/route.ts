import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, createAdminToken, getAdminCredentials } from "@/lib/admin-auth";

const attempts = new Map<string, { count: number; lockedUntil: number }>();

function getClientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

export async function POST(request: NextRequest) {
  const key = getClientKey(request);
  const record = attempts.get(key);
  const now = Date.now();

  if (record && record.lockedUntil > now) {
    return NextResponse.json({ message: "Cok fazla deneme. Lutfen biraz sonra tekrar deneyin." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const { username, password } = getAdminCredentials();
  const valid = body?.username === username && body?.password === password;

  if (!valid) {
    const nextCount = (record?.count ?? 0) + 1;
    attempts.set(key, {
      count: nextCount,
      lockedUntil: nextCount >= 5 ? now + 1000 * 60 * 10 : 0
    });
    return NextResponse.json({ message: "Kullanici adi veya sifre hatali." }, { status: 401 });
  }

  attempts.delete(key);
  const token = await createAdminToken(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.ADMIN_COOKIE_SECURE === "true",
    maxAge: 60 * 60 * 8,
    path: "/"
  });
  return response;
}
