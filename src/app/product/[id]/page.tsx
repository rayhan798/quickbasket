'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Feedback = {
  name: string;
  rating: number;
  comment: string;
};

export default function ProductDetails({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || !data?._id) return notFound();
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  // Fetch product feedbacks
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`/api/feedback?productId=${params.id}`);
        const data = await res.json();
        setFeedbacks(data);
      } catch {
        setFeedbacks([]);
      }
    };
    fetchFeedback();
  }, [params.id]);

  // Fetch current logged in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user || null);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Add to cart handler with credentials included for cookies
  const addToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      router.push(`/auth/login?redirect=/product/${params.id}`);
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important for sending cookies
        body: JSON.stringify({ productId: product._id, quantity, price: product.price }),
      });
      const data = await res.json();
      alert(res.ok ? '✅ Added to cart' : '❌ ' + data.message);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      alert('Error adding to cart');
    }
  };

  // Submit feedback handler
  const submitFeedback = async () => {
    if (!newName.trim() || !newComment.trim()) {
      alert('Please enter your name and comment');
      return;
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: params.id,
          name: newName.trim(),
          comment: newComment.trim(),
          rating: newRating,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit feedback');

      // Reload feedbacks after submit
      const res2 = await fetch(`/api/feedback?productId=${params.id}`);
      const data = await res2.json();
      setFeedbacks(data);
      setNewName('');
      setNewComment('');
      setNewRating(5);
    } catch {
      alert('Error submitting feedback');
    }
  };

  if (loading || !product) return <p className="text-center py-10">Loading...</p>;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative w-full h-96 rounded overflow-hidden shadow">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-gray-800 font-bold mb-2">{product.description || 'No description available.'}</p>
          <p className="text-yellow-500 text-sm mb-2">{'★'.repeat(4)}{'☆'} <span className="text-gray-500 ml-1">(4.0)</span></p>
          <p className="text-sm text-gray-600 mb-2">Brand: <span className="font-semibold">{product.brand || 'N/A'}</span></p>
          <p className="text-xl text-blue-600 font-semibold mb-2">Price: ৳{product.price}</p>
          <p className="text-sm text-gray-500 mb-4">Installment: ৳{Math.round(product.price / 12)}/month × 12 months</p>
          <div className="flex items-center mb-4 gap-2">
            <label className="text-sm">Quantity:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-16 border px-2 py-1 rounded text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={addToCart} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded">
              ⚡ Buy Now
            </button>
            <button onClick={addToCart} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-3">Product Details</h2>
        <p className="text-gray-700 leading-relaxed">{product.longDescription || 'No additional product information available.'}</p>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Customer Feedback</h2>
        <div className="mb-6 border border-gray-200 p-4 rounded">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Your name"
            className="w-full border px-3 py-2 text-sm rounded mb-2"
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your feedback..."
            className="w-full border px-3 py-2 text-sm rounded mb-2"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <div>
              <label className="mr-2 text-sm">Rating:</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="border px-2 py-1 text-sm rounded"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={submitFeedback}
              className="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded"
            >
              Submit Feedback
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <p>No feedback yet. Be the first to review!</p>
          ) : (
            feedbacks.map((fb, i) => (
              <div key={i} className="border border-gray-200 p-4 rounded shadow-sm">
                <p className="font-semibold">{fb.name}</p>
                <p className="text-yellow-500 text-sm">
                  {'★'.repeat(fb.rating)}
                  {'☆'.repeat(5 - fb.rating)}
                </p>
                <p className="text-sm text-gray-700">{fb.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
