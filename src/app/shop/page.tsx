'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
};

const categories = ['All', 'Electronics', 'Clothing', 'Books'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('Unexpected format:', data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
      });
  }, []);

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      alert(res.ok ? '✅ যোগ হয়েছে' : '❌ ' + data.message);
    } catch (error) {
      alert('Error adding to cart');
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Shop Products</h1>

        {/* Category Filter Dropdown */}
        <section className="mb-8 flex justify-center">
          <div className="relative inline-block text-left">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex justify-center w-48 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {selectedCategory}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-blue-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Product Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(filteredProducts) && filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No products available.</p>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p._id}
                className="border rounded-lg p-4 flex flex-col shadow-md hover:shadow-xl transition group"
              >
                <div className="relative w-full h-48 overflow-hidden rounded-md">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                    className="object-cover rounded-md group-hover:scale-105 transition-transform"
                  />
                </div>
                <h2 className="mt-4 font-semibold text-lg truncate">{p.name}</h2>
                <p className="text-blue-600 font-bold">${p.price.toFixed(2)}</p>
                <p className="text-gray-600 text-sm mb-2 truncate">{p.description}</p>
                <button
                  onClick={() => addToCart(p._id)}
                  className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
