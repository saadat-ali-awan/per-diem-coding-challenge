import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const host = req.headers.get('host') || '';
  const [sub] = host.split('.');

  if (sub && sub !== 'localhost' && sub !== 'www') {
    const res = NextResponse.next();
    res.headers.set('x-tenant', sub);
    res.cookies.set('tenant', sub, { sameSite: 'lax', path: '/' });
    return res;
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
