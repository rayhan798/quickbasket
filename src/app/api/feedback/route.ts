import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import Feedback from '@/app/lib/models/Feedback';

export async function GET(req: NextRequest) {
  await connectDB();
  const productId = req.nextUrl.searchParams.get('productId');

  if (!productId) return NextResponse.json({ message: 'Product ID missing' }, { status: 400 });

  const feedbacks = await Feedback.find({ productId }).sort({ createdAt: -1 });
  return NextResponse.json(feedbacks);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { productId, name, comment, rating } = body;

  if (!productId || !name || !comment || !rating) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const newFeedback = new Feedback({ productId, name, comment, rating });
  await newFeedback.save();

  return NextResponse.json({ message: 'Feedback added' }, { status: 201 });
}
