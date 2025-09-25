import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import Cart from '@/app/lib/models/Cart';
import { getUserFromToken } from '@/app/lib/auth';
import { cookies } from 'next/headers';

export async function DELETE() {
  await connectDB();

  const token = cookies().get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const user = await getUserFromToken(token);
  if (!user?._id) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

  const cart = await Cart.findOne({ userId: user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  return NextResponse.json({ message: 'Cart cleared successfully' });
}
