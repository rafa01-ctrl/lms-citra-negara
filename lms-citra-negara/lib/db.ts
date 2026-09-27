import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI belum diisi di .env.local");

type GlobalWithMongoose = typeof globalThis & { mongooseCache?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } };
const g = globalThis as GlobalWithMongoose;
const cache = g.mongooseCache ?? { conn: null, promise: null };
g.mongooseCache = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;
  if (!cache.promise) cache.promise = mongoose.connect(uri);
  cache.conn = await cache.promise;
  return cache.conn;
}
