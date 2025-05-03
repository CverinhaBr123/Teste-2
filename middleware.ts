import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Se o usuário acessar /index.html, redirecione para a página inicial
  if (request.nextUrl.pathname === "/index.html") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/index.html"],
}
