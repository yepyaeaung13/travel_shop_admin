import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
    // return NextResponse.next();

  if (publicRoutes.includes(pathname) && pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;
  // console.log("token", token);
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
    
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|images).*)"],
};
