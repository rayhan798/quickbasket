import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import Product from '@/app/lib/models/Product';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: 'Failed to fetch product', error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const id = params.id;
    const { name, price, description, image, category } = await req.json();

    if (!name || !price || !image || !category) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, image, category },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated', product: updatedProduct }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: 'Failed to update product', error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const id = params.id;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: 'Failed to delete product', error: err.message }, { status: 500 });
  }
}
