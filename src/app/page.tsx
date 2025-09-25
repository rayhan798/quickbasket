'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
};

const categories = ['All', 'Electronics', 'Accessories', 'Clothing', 'Books'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const handleProductClick = (id: string) => {
    router.push(`/product/${id}`);
  };

  return (
    <main className="w-full bg-white min-h-screen">
      {/* Carousel */}
      <div className="mb-10 overflow-hidden shadow-lg w-full">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={3000}
        >
          {[1, 2, 3].map((num) => (
            <div key={num} className="w-full h-[80vh] relative">
              <Image
                src={`/slider${num}.jpg`}
                alt={`Slide ${num}`}
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-end mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No products available.
            </p>
          ) : (
            filteredProducts.map((product) => {
              const bdtPrice = product.price;
              const rating = Math.floor(Math.random() * 2 + 4); // Random 4 or 5

              return (
                <div
                  key={product._id}
                  className="border rounded-xl shadow-sm hover:shadow-lg bg-white overflow-hidden transition-all"
                >
                  <div className="relative h-52 w-full bg-gray-50 p-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-base font-medium text-center line-clamp-2 mb-1">
                      {product.name}
                    </h2>
                    <p className="text-green-600 text-center font-bold mb-1">
                      ৳{bdtPrice}
                    </p>
                    <p className="text-yellow-500 text-center text-sm mb-3">
                      {'★'.repeat(rating)}
                      {'☆'.repeat(5 - rating)}
                      <span className="text-gray-400 ml-1">({rating}.0)</span>
                    </p>

                    <div className="flex justify-center">
                      <button
                        onClick={() => handleProductClick(product._id)}
                        className="bg-indigo-600 text-white px-4 py-1 text-sm rounded hover:bg-indigo-700"
                      >
                        🔍 View Product
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
