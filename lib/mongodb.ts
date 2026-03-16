import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const cached = globalForMongoose.mongooseConnection || { conn: null, promise: null };

if (!globalForMongoose.mongooseConnection) {
  globalForMongoose.mongooseConnection = cached;
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
