'use client';

import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Github,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">QuickBasket</h2>
          <p className="text-sm">
            সাশ্রয়ী দামে নির্ভরযোগ্য পণ্য সরবরাহকারী একটি বিশ্বস্ত ই-কমার্স প্ল্যাটফর্ম।
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-blue-600 transition">Home</Link></li>
            <li><Link href="/shop" className="hover:text-blue-600 transition">Shop</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition">Contact</Link></li>
            <li><Link href="/login" className="hover:text-blue-600 transition">Login</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> mdrayhan0474@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> +880 01518979553
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Chattogram, Bangladesh
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-blue-600 dark:text-blue-400">
            <a href="https://www.facebook.com/RxUnknownCreations7" target="_blank" rel="noopener noreferrer">
              <Facebook className="hover:scale-110 transition" />
            </a>
            <a href="https://www.instagram.com/rx__rayhan__7" target="_blank" rel="noopener noreferrer">
              <Instagram className="hover:scale-110 transition" />
            </a>
            <a href="https://github.com/rayhan798" target="_blank" rel="noopener noreferrer">
              <Github className="hover:scale-110 transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="hover:scale-110 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-xs py-5 border-t border-gray-200 dark:border-gray-700">
        © {new Date().getFullYear()} QuickBasket. All rights reserved.
      </div>
    </footer>
  );
}
