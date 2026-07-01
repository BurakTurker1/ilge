import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ message: "Yetkisiz erisim." }, { status: 401 });
  return NextResponse.json({ ok: true, session });
}
