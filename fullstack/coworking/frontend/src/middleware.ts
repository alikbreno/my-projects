import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const session = request.cookies.get("userLoged");

  // No Edge verificamos somente a presença do cookie. A assinatura e a
  // expiração do JWT são validadas pelo backend em todas as requisições.
  if (!session?.value) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/salas/:path*", "/minhas-reservas/:path*", "/minha-conta/:path*", "/administrador/:path*"],
};
