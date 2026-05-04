import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED = ['/dashboard', '/issue', '/settings'];
const AUTH_PAGES = ['/login', '/register'];

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(s);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('session')?.value;

  let authed = false;
  if (token) {
    try {
      await jwtVerify(token, secret());
      authed = true;
    } catch {
      authed = false;
    }
  }

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (isProtected && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (AUTH_PAGES.includes(pathname) && authed) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/issue/:path*', '/settings/:path*', '/login', '/register'],
};
