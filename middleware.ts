import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'cdc_session';

// Routes that require authentication
const PROTECTED = ['/schedule', '/profile', '/onboarding', '/admin'];

// Decode the base64 session cookie set by /api/auth/session.
// atob is a Web API available in Edge runtime — no Node.js Buffer needed.
function parseSession(value: string | undefined): { uid: string; role: string } | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(atob(value)) as unknown;
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof (parsed as Record<string, unknown>).uid === 'string' &&
      typeof (parsed as Record<string, unknown>).role === 'string'
    ) {
      return parsed as { uid: string; role: string };
    }
    return null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Next.js internals, static files, and the session API always pass through
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/login'
  ) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = parseSession(request.cookies.get(COOKIE_NAME)?.value);

  // Not authenticated → login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Authenticated but not admin → bounce to /schedule
  if (pathname.startsWith('/admin') && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/schedule', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static assets
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
