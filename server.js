const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const documentRoutes = require("./routes/documentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();

const app = express();

// ===============================
// CORS
// Allows local dev, the deployed Vercel domain, and any Vercel
// preview URL (*.vercel.app). Set ALLOWED_ORIGIN in Vercel env
// vars to lock it down to a specific domain in production.
// ===============================
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://setuhealthai.vercel.app",
  // Dynamically allow any Vercel preview deployment
  /^https:\/\/.*\.vercel\.app$/,
  // Allow custom domain if set via env var  e.g. https://setuhealth.in
  process.env.ALLOWED_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, server-to-server, curl)
      if (!origin) return callback(null, true);

      const allowed = ALLOWED_ORIGINS.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin
      );

      if (allowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===============================
// DATABASE CONNECTION
// Awaited per-request on Vercel (connection is cached globally).
// ===============================
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error on request:", err.message);
    res.status(503).json({
      success: false,
      message: "Database unavailable. Please try again shortly.",
    });
  }
});

// ===============================
// ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);

// ===============================
// API HEALTH CHECK
// ===============================
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🏥 SetuHealth AI Backend is running",
  });
});

// ===============================
// SERVE REACT FRONTEND (dist/)
// All non-API routes return the React index.html so client-side
// routing (React Router) works correctly on Vercel.
// ===============================
const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ===============================
// 404 — API routes that don't exist
// ===============================
app.use(notFound);

// ===============================
// CENTRALISED ERROR HANDLER
// ===============================
app.use(errorHandler);

// ===============================
// LOCAL DEV — only bind a port when NOT running on Vercel
// On Vercel the file is imported as a serverless handler, not run directly.
// ===============================
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 SetuHealth AI Backend running on port ${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use.`);
      console.error(`   Run: Get-Process node | Stop-Process -Force`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

// Vercel needs the express app exported as the default module export
module.exports = app;
