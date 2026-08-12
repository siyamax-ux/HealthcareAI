const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

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

dotenv.config();

const app = express();

// ===============================
// DATABASE CONNECTION
// ===============================
connectDB();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/analytics", analyticsRoutes);

// ===============================
// HEALTH CHECK / TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🏥 SetuHealth AI Backend is running",
  });
});

// ===============================
// 404 — unknown routes
// ===============================
app.use(notFound);

// ===============================
// CENTRALISED ERROR HANDLER
// ===============================
app.use(errorHandler);

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SetuHealth AI Backend running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Kill the existing process and try again.`);
    console.error(`   Run this in PowerShell: Get-Process node | Stop-Process -Force`);
    process.exit(1);
  } else {
    throw err;
  }
});