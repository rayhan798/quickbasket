'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
}

export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include' });
      const data = await res.json();
      setCart(data.items || []);
    } catch (error) {
      console.error('❌ Failed to load cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 60 : 0;
  const total = subtotal + shipping;

  const handleSubmit = async () => {
    if (!name || !email || !phone || !address) {
      return alert('⚠️ সব ঘর পূরণ করুন');
    }

    try {
      setLoading(true);

      // ✅ Step 1: Send order
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          items: cart.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
          })),
          total,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Order placed successfully!');
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setCart([]);

        // ✅ Step 2: Clear cart from backend
        await fetch('/api/cart/clear', {
          method: 'DELETE',
          credentials: 'include',
        });

        // ✅ Step 3: Notify CartPage to refresh
        window.dispatchEvent(new Event('cartUpdated'));

        // ✅ Step 4: Slight delay then redirect
        setTimeout(() => {
          router.push('/');
        }, 200);
      } else {
        alert('❌ Order failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('❌ Server error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📝 Shipping Info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="border px-4 py-2 rounded" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border px-4 py-2 rounded" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="border px-4 py-2 rounded" />
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="border px-4 py-2 rounded col-span-1 md:col-span-2" />
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">🛒 Cart Summary</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">No items in cart.</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {cart.map((item) => (
            <li key={item._id} className="border p-2 rounded flex justify-between">
              <span>{item.productId.name} x {item.quantity}</span>
              <span>৳{item.productId.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="text-right font-semibold space-y-1">
        <div>Subtotal: ৳{subtotal}</div>
        <div>Shipping: ৳{shipping}</div>
        <div>Total: <span className="text-blue-600">৳{total}</span></div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? '⏳ Placing Order...' : '✅ Confirm Order'}
      </button>
    </main>
  );
}
