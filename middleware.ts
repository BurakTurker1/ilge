import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  if (!isAdminPath || isLogin) return NextResponse.next();

  const session = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (session) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"]
};
