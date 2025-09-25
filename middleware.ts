// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/utils/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // ✅ যদি টোকেন না থাকে → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decoded = verifyToken(token);

  // ✅ যদি টোকেন invalid হয় → redirect
  if (!decoded) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); // ✅ allow access
}
