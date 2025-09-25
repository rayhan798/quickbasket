import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/app/lib/auth';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ user: null });

    const user = verifyToken(token);
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
