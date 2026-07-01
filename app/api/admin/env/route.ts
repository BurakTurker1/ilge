import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { dbQuery, getLocalStackEnv } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ message: "Yetkisiz erisim." }, { status: 401 });

  const env = getLocalStackEnv();
  let databaseConnected = false;
  let databaseError: string | null = null;

  if (env.ok) {
    try {
      await dbQuery("select 1 as ok");
      databaseConnected = true;
    } catch (error) {
      databaseError = error instanceof Error ? error.message : String(error);
    }
  }

  const result = {
    ...env,
    databaseConnected,
    databaseError,
    fallbackMode: env.ok && !databaseConnected
  };

  console.info("[admin-env:check]", { ok: env.ok, databaseConnected, missing: env.missing, user: session.sub });
  return NextResponse.json(result, { status: env.ok ? 200 : 503 });
}
