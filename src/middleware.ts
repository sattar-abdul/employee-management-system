import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the user info
  // In a real app use a JWT token. For now let's check a custom header or cookie.
  const userRole = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  // 2. Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'superadmin' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Protect User Dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// we are Only running middleware on these specific paths
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};