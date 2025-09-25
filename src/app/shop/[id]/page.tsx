import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function ProductDetails({ params }: { params: { id: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products/${params.id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return notFound();
  }

  const product = await res.json();

  if (!product?._id) {
    return notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative w-full h-96 rounded overflow-hidden shadow">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized // যদি লোকাল ইমেজ হয় এবং domains না দেয়, এটা দিতে পারো
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-blue-600 font-semibold mt-2">${product.price.toFixed(2)}</p>
          <p className="mt-4 text-gray-700">{product.description || 'No description available.'}</p>
        </div>
      </div>
    </main>
  );
}
