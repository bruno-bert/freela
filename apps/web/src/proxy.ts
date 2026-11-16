import { NextResponse, type NextRequest } from 'next/server';
export function proxy(request: NextRequest) {
 const path = request.nextUrl.pathname;
 if (path === '/login' || path.startsWith('/api/auth/') || path === '/api/health') return NextResponse.next();
 if (!request.cookies.has('freela-session')) { if (path.startsWith('/api/')) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 }); const url = new URL('/login', request.url); url.searchParams.set('returnTo', path); return NextResponse.redirect(url); }
 return NextResponse.next();
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
