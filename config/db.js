const mongoose = require("mongoose");

// Cache the connection across Vercel serverless invocations
let cached = global._mongoConn || null;

const connectDB = async () => {
  // Already connected — reuse the cached connection
  if (cached && mongoose.connection.readyState === 1) {
    return cached;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    // In serverless environments process.exit kills the Lambda — throw instead
    throw new Error("MONGO_URI environment variable is not set.");
  }

  try {
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      // Recommended settings for serverless to avoid connection pool exhaustion
      maxPoolSize: 10,
      bufferCommands: false,
    });
    cached = conn;
    global._mongoConn = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // Throw — let the caller (server.js) handle it gracefully without process.exit
    throw error;
  }
};

module.exports = connectDB;