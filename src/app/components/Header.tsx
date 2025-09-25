'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';

interface CartItem {
  quantity: number;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [cartQuantity, setCartQuantity] = useState(0);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include' });
      const data = await res.json();
      if (res.ok && Array.isArray(data.items)) {
        const total = data.items.reduce((sum: number, item: CartItem) => sum + (item.quantity || 1), 0);
        setCartQuantity(total);
      } else {
        setCartQuantity(0);
      }
    } catch {
      setCartQuantity(0);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        setUser(null);
        window.location.href = '/';
      } else {
        alert('Logout failed');
      }
    } catch {
      alert('Logout failed');
    }
  };

  useEffect(() => {
    fetchCart();
    fetchUser();
    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    alert(`Search for: ${search}`);
  };

  return (
    <header className="bg-white/30 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Quick<span>Basket</span>
        </Link>

        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
          <Link href="/" className="text-black hover:text-blue-600">Home</Link>
          <Link href="/shop" className="text-black hover:text-blue-600">Shop</Link>
          <Link href="/contact" className="text-black hover:text-blue-600">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-3 py-1 w-64"
          >
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent w-full outline-none text-sm placeholder-gray-500"
            />
            <button type="submit">
              <Search className="w-4 h-4 text-gray-500" />
            </button>
          </form>

          {/* Cart only for non-admin */}
          {user?.role !== 'admin' && (
            <Link href="/cart" className="relative text-black hover:text-blue-600">
              <ShoppingCart className="w-5 h-5" />
              <span
                className={`absolute -top-2 -right-2 text-white text-xs px-1 rounded-full ${
                  cartQuantity > 0 ? 'bg-red-500' : 'bg-gray-400'
                }`}
              >
                {cartQuantity}
              </span>
            </Link>
          )}

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin/dashboard" className="text-sm text-blue-600">
                  Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="text-sm text-red-500">
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur px-4 pb-4 space-y-2">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-1 w-full"
          >
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent w-full outline-none text-sm placeholder-gray-500"
            />
            <button type="submit">
              <Search className="w-4 h-4 text-gray-500" />
            </button>
          </form>

          <Link href="/" className="block text-black hover:text-blue-600">
            Home
          </Link>
          <Link href="/shop" className="block text-black hover:text-blue-600">
            Shop
          </Link>
          <Link href="/contact" className="block text-black hover:text-blue-600">
            Contact
          </Link>

          {user?.role !== 'admin' && (
            <Link href="/cart" className="block text-black hover:text-blue-600">
              Cart
            </Link>
          )}

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin/dashboard" className="block text-blue-600">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
