// ============================================================
// SETUHEALTH AI — CENTRALISED ERROR MIDDLEWARE
// Must be registered AFTER all routes in server.js.
// Express identifies it as an error handler because it has
// exactly 4 parameters: (err, req, res, next).
// ============================================================

const errorHandler = (err, req, res, next) => {
  // Always log the full error on the server for debugging
  console.error("❌ Error:", err);

  // Default values
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // -------------------------------------------------------
  // Mongoose: document not found via findById etc.
  // -------------------------------------------------------
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  // -------------------------------------------------------
  // Mongoose: unique index violation (e.g. duplicate email)
  // -------------------------------------------------------
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // -------------------------------------------------------
  // Mongoose: schema validation failed
  // -------------------------------------------------------
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Collect all field-level messages into one readable string
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // -------------------------------------------------------
  // JWT: token is malformed or expired
  // -------------------------------------------------------
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please log in again.";
  }

  // -------------------------------------------------------
  // Multer: file too large (safety net — uploadMiddleware
  // already handles this, but keep it here as a fallback)
  // -------------------------------------------------------
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File too large. Maximum allowed size is 10 MB.";
  }

  // -------------------------------------------------------
  // Build response
  // -------------------------------------------------------
  const response = {
    success: false,
    message,
  };

  // Include stack trace only in development — never in production
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// -------------------------------------------------------
// 404 handler — for routes that don't exist at all
// Register this BEFORE errorHandler in server.js
// -------------------------------------------------------
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error); // passes to errorHandler above
};

module.exports = { errorHandler, notFound };
