const express = require("express");
const { analyze, riskCheck, getSupportedLanguages } = require("../controllers/aiController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Full AI + Risk Engine analysis on an existing consultation
router.post(
  "/analyze",
  protect,
  authorize("doctor", "health_worker", "admin"),
  analyze
);

// Instant deterministic risk-only check (no AI call, no DB write)
// Useful for real-time frontend feedback while a health worker fills in vitals
router.post(
  "/risk",
  protect,
  authorize("doctor", "health_worker", "admin"),
  riskCheck
);

// Get list of supported languages
router.get(
  "/languages",
  protect,
  getSupportedLanguages
);

module.exports = router;
