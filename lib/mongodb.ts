import mongoose from "mongoose";

// ============================================================
// MONGODB CONFIGURATION
// ============================================================

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGO_URI environment variable is not configured."
  );
}

// After the runtime check above, explicitly narrow the type.
const MONGODB_CONNECTION_STRING =
  MONGODB_URI as string;

// ============================================================
// MONGOOSE CACHE TYPE
// ============================================================

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// ============================================================
// GLOBAL CACHE
// ============================================================

const cached: MongooseCache =
  global.mongooseCache ?? {
    conn: null,
    promise: null,
  };

global.mongooseCache = cached;

// ============================================================
// DATABASE CONNECTION
// ============================================================

async function connectDB(): Promise<typeof mongoose> {
  // Already connected
  if (cached.conn) {
    return cached.conn;
  }

  // Connection already in progress
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_CONNECTION_STRING, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,

        maxPoolSize: 20,
        minPoolSize: 2,

        maxIdleTimeMS: 30000,
        socketTimeoutMS: 45000,

        // Prefer IPv4 for local/deployment network compatibility.
        family: 4,

        // Do not allow queries to silently buffer
        // while MongoDB is unavailable.
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully");

        return mongooseInstance;
      })
      .catch((error: unknown) => {
        cached.promise = null;

        console.error(
          "MongoDB connection failed:",
          error instanceof Error
            ? error.message
            : error
        );

        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default connectDB;