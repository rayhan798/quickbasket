'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type CartItem = {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  // ✅ Fetch Cart Items
  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include' });
      const data = await res.json();
      setCart(data.items || []);
    } catch (error) {
      console.error('🛑 Cart fetch failed', error);
    }
  };

  // ✅ Remove Item from Cart
  const handleRemove = async (productId: string) => {
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      });
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      alert('❌ Failed to remove item');
    }
  };

  // ✅ Listen for cartUpdated & tab visibility
  useEffect(() => {
    fetchCart();

    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cartUpdated', handleCartUpdate);

    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') fetchCart();
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  const shipping = cart.length ? 60 : 0;
  const total = subtotal + shipping;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">🛍️ Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="flex items-center gap-4 border p-4 rounded mb-4 shadow-sm">
              <Image
                src={item.productId.image}
                alt={item.productId.name}
                width={80}
                height={80}
                className="rounded object-contain"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.productId.name}</h2>
                <p className="text-gray-600">
                  ৳{item.productId.price} x {item.quantity}
                </p>
              </div>
              <button
                onClick={() => handleRemove(item.productId._id)}
                className="text-red-500 hover:underline"
              >
                🗑 Remove
              </button>
            </div>
          ))}

          <div className="mt-6 border-t pt-4 text-right text-lg font-medium space-y-2">
            <div>Subtotal: <span className="text-green-600">৳{subtotal}</span></div>
            <div>Shipping: <span className="text-orange-500">৳{shipping}</span></div>
            <div className="text-xl font-bold">Total: <span className="text-blue-600">৳{total}</span></div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={() => router.push('/order')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              📦 Proceed to Order
            </button>
          </div>
        </>
      )}
    </main>
  );
}
