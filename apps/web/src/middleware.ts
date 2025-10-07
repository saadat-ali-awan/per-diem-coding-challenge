import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const host = req.headers.get('host') || '';
  const [sub] = host.split('.');
  // dev: a.localhost:3000 -> sub = "a"
  // if host === "localhost:3000", you could fall back to a query ?tenant=a for testing.

  if (sub && sub !== 'localhost' && sub !== 'www') {
    // forward the tenant to API via header proxy or cookies
    const res = NextResponse.next();
    res.headers.set('x-tenant', sub);
    res.cookies.set('tenant', sub, { sameSite: 'lax', path: '/' });
    return res;
  }

  // Optional: redirect bare domain to a demo tenant
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
