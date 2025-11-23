import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env');

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Add connection pool limit
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4, // Use IPv4
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;

    // Add connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      cached.conn = null;
      cached.promise = null;
    });
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`Connected to database`);
  }

  return cached.conn;
};
