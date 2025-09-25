// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost','example.com','images.unsplash.com', 'res.cloudinary.com'], // ← এখানেই localhost অ্যাড করো
  },
};

module.exports = nextConfig;
