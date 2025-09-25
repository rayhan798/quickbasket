import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  (() => {
    const username = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;
    const dbName = process.env.MONGODB_DBNAME;

    if (!username || !password || !dbName) {
      throw new Error('MongoDB connection environment variables missing');
    }

    return `mongodb+srv://${username}:${password}@cluster0.r6yal4c.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
  })();

if (!MONGODB_URI) throw new Error('MongoDB URI not defined');

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  } | undefined;
}

// initialize global mongoose if undefined
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

let cached = global.mongoose;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('✅ MongoDB connected');
      return mongoose.connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
