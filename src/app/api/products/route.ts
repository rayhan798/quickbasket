import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import Product from '@/app/lib/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: 'Failed to fetch products', error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, price, description, image, category } = await req.json();

    if (!name || !price || !image || !category) {
      return NextResponse.json(
        { message: 'Missing required fields: name, price, image, category' },
        { status: 400 }
      );
    }

    if (typeof price !== 'number') {
      return NextResponse.json({ message: 'Price must be a number' }, { status: 400 });
    }

    const newProduct = await Product.create({
      name,
      price,
      description: description || '',
      image,
      category,
    });

    return NextResponse.json(
      { message: 'Product added successfully', product: newProduct },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: 'Failed to add product', error: err.message },
      { status: 500 }
    );
  }
}
