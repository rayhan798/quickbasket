import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { connectDB } from '@/app/lib/db';
import Order from '@/app/lib/models/Order';
import { getUserFromToken } from '@/app/lib/auth';

export async function POST(req: Request) {
  try {
    await connectDB();

    // Cookie থেকে token নিয়ে আসা
    const allHeaders = headers();
    const cookieHeader = allHeaders.get('cookie') || '';
    const token = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token found' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user?._id) {
      return NextResponse.json({ message: 'Unauthorized: Invalid user' }, { status: 401 });
    }

    // এখন user._id অবশ্যই থাকবে
    const body = await req.json();
    const { name, email, phone, address, items, total } = body;

    if (!name || !email || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const newOrder = await Order.create({
      userId: user._id,
      name,
      email,
      phone,
      address,
      items,
      total,
      status: 'Pending',
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
