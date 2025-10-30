// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/login", "/signup", "/api/auth"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir rotas públicas
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") || // assets do Next
    pathname.startsWith("/favicon") ||
    pathname === "/"
  ) {
    // Se estiver logado e entrar em "/" → manda para o dashboard certo
    if (pathname === "/") {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (token?.role === "PSYCHOLOGIST") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      if (token?.role === "PATIENT") {
        return NextResponse.redirect(new URL("/patient", req.url));
      }
    }
    return NextResponse.next();
  }

  // Checar se está logado
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Controle de acesso por papel
  if (pathname.startsWith("/dashboard") && token.role !== "PSYCHOLOGIST") {
    return NextResponse.redirect(new URL("/patient", req.url));
  }

  if (pathname.startsWith("/patient") && token.role !== "PATIENT") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Definir onde o middleware roda
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // todas rotas menos assets
  ],
};
