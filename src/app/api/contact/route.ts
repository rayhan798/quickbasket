// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import Contact from '@/app/lib/models/Contact';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

    await Contact.create({ name, email, message });

    return NextResponse.json({ message: 'Message saved successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('❌ Contact error:', err.message);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
