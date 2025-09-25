// lib/checkAdmin.ts
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/app/lib/auth';



export async function isAdminUser() {
  const token = cookies().get('token')?.value;
  if (!token) return false;

  const user = await getUserFromToken(token);
  return user?.role === 'admin';
}
