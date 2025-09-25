// lib/db.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || (() => {
  // fallback to username/password format if MONGODB_URI is not provided
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const dbName = process.env.MONGODB_DBNAME;

  if (!username || !password || !dbName) {
    throw new Error('MongoDB connection environment variables missing');
  }

  return `mongodb+srv://${username}:${password}@cluster0.r6yal4c.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
})();

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    // Already connected or connecting
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw new Error('Database connection failed');
  }
}
