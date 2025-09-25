import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import Cart from '@/app/lib/models/Cart';
import { getUserFromToken } from '@/app/lib/auth';
import { cookies } from 'next/headers';

interface CartItem {
  productId: { toString: () => string } | string;
  quantity: number;
}

export async function GET() {
  await connectDB();
  const token = cookies().get('token')?.value;

  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const user = await getUserFromToken(token);
  if (!user?._id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const userId = user._id;

  const cart = await Cart.findOne({ userId }).populate('items.productId');
  return NextResponse.json(cart || { items: [] });
}

export async function POST(req: Request) {
  await connectDB();

  const token = cookies().get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const user = await getUserFromToken(token);
  if (!user?._id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const userId = user._id;

  const { productId, quantity } = await req.json();
  if (!productId || !quantity) {
    return NextResponse.json({ message: 'Product ID and quantity required' }, { status: 400 });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ productId, quantity }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item: CartItem) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
  }

  return NextResponse.json({ message: 'Product added to cart', cart });
}

export async function DELETE(req: Request) {
  await connectDB();

  const token = cookies().get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const user = await getUserFromToken(token);
  if (!user?._id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const userId = user._id;

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ message: 'Cart not found' }, { status: 404 });

  cart.items = cart.items.filter(
    (item: CartItem) => item.productId.toString() !== productId
  );

  await cart.save();
  return NextResponse.json({ message: 'Product removed from cart', cart });
}
