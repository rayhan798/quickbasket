'use client';

import Image from 'next/image';

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  // অন্য প্রপার্টি চাইলে এখানে যোগ করো
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onClick?: () => void;
};

export default function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  if (!product || !product.image) return null;

  return (
    <div
      onClick={onClick}
      className="border rounded-lg p-4 flex flex-col shadow-md hover:shadow-xl transition cursor-pointer group"
    >
      <div className="relative w-full h-48 overflow-hidden rounded-md">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 20vw"
          className="object-cover rounded-md group-hover:scale-105 transition-transform"
          unoptimized={true} // যদি লোকাল ইমেজ হয় তবে এটা লাগতে পারে
        />
      </div>
      <h2 className="mt-4 font-semibold text-lg truncate">{product.name}</h2>
      <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
      {product.description && (
        <p className="text-gray-600 text-sm mb-2 truncate">{product.description}</p>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation(); // ক্লিক ইভেন্ট প্যারেন্টকে যাওয়া বন্ধ করবে (যেমন লিংকে বা কার্ডে)
          onAddToCart && onAddToCart(product._id);
        }}
        className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
