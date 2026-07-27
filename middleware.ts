import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
    const session = request.cookies.get("eteyvat_admin_session")?.value;
    
    if (!session || session !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  
  if (request.nextUrl.pathname === "/admin/login") {
    const session = request.cookies.get("eteyvat_admin_session")?.value;
    if (session === "authenticated") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
