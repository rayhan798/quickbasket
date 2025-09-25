'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image: string;
  category?: string;
};

export default function ProductManager() {
  const [form, setForm] = useState({
    id: null as string | null,
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 new state

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setMessage('Could not load products');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ id: null, name: '', price: '', description: '', image: '', category: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.image || !form.category) {
      setMessage('Please fill all required fields including category.');
      return;
    }

    setLoading(true);

    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `/api/products/${form.id}` : '/api/products';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          description: form.description,
          image: form.image,
          category: form.category,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(form.id ? '✅ Product updated successfully!' : '✅ Product added successfully!');
        resetForm();
        fetchProducts();
      } else {
        setMessage(data.message || 'Failed to save product.');
      }
    } catch {
      setMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Product deleted successfully!');
        fetchProducts();
        if (form.id === id) resetForm();
      } else {
        setMessage(data.message || 'Failed to delete product.');
      }
    } catch {
      setMessage('Server error. Please try again later.');
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      id: product._id,
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      image: product.image,
      category: product.category || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 dark:text-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        🛍️ Product Manager Dashboard
      </h1>

      {message && (
        <p
          className={`mb-4 text-center ${
            message.includes('✅') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {message}
        </p>
      )}

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name *"
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (BDT) *"
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL *"
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category *"
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 h-full rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            rows={6}
          />
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? (form.id ? 'Updating...' : 'Adding...') : form.id ? '✏️ Update Product' : '➕ Add Product'}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded text-lg font-semibold transition"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📦 Product List</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search by name or category"
            className="w-full sm:w-72 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <p className="dark:text-gray-300">No matching products found.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600 dark:text-white">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Image</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Name</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Category</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Description</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Price (BDT)</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={80}
                      height={50}
                      className="object-cover rounded"
                    />
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{product.name}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{product.category || 'N/A'}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {product.description || 'No description'}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold">
                    BDT {product.price.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
