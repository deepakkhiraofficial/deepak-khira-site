import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is missing in .env.local");
}

// After the check above, this value is guaranteed to be a string.
const MONGODB_URI: string = mongoUri;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseCache ?? {
    conn: null,
    promise: null,
  };

global.mongooseCache = cached;

async function connectDB(): Promise<typeof mongoose> {
  // Already connected
  if (cached.conn) {
    return cached.conn;
  }

  // Connection already in progress
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 0,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully");

        return mongooseInstance;
      })
      .catch((error) => {
        // Allow next request to retry
        cached.promise = null;

        console.error(
          "MongoDB connection failed:",
          error instanceof Error ? error.message : error
        );

        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default connectDB;