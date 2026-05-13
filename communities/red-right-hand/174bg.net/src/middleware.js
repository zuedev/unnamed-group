import { NextResponse } from "next/server";

export async function middleware(request) {
  let session = null;

  try {
    const res = await fetch(
      new URL("/api/auth/get-session", request.nextUrl.origin),
      {
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
      },
    );
    session = await res.json();
  } catch {
    // If session check fails, treat as unauthenticated
  }

  if (!session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/secure/:path*"],
};
