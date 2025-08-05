// middleware.js
import { createSupabaseMiddlewareClient } from "@/lib/supabase/utils";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { supabase, response } = await createSupabaseMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && pathname !== "/login" && pathname !== "/signup") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
