import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Safely expire the token cookie (recommended way)
  cookies().set('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // Immediately expire the cookie
  });

  return NextResponse.json({ message: 'Logged out' });
}
