import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // ✅ 'token' কুকি ডিলিট করো
  cookies().delete('token'); // আলাদা করে path দেওয়া লাগবে না সাধারণত

  return NextResponse.json({ message: 'Logged out successfully' });
}
