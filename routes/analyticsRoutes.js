const express = require("express");
const {
  getSummary,
  getRiskDistribution,
  getStatusDistribution,
  getRecentActivity,
} = require("../controllers/analyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Platform-wide counts for the dashboard
router.get(
  "/summary",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getSummary
);

// Count of consultations per risk level
router.get(
  "/risk",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getRiskDistribution
);

// Count of consultations per status
router.get(
  "/status",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getStatusDistribution
);

// 10 most recent consultations
router.get(
  "/recent",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getRecentActivity
);

module.exports = router;
