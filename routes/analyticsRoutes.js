const express = require("express");
const {
  getSummary,
  getRiskDistribution,
  getStatusDistribution,
  getRecentActivity,
  getVillageHeatmap,
  getDiseaseTrends,
} = require("../controllers/analyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Platform-wide counts for the dashboard
router.get(
  "/summary",
  protect,
  authorize("doctor", "health_worker", "patient", "admin"),
  getSummary
);

// Count of consultations per risk level
router.get(
  "/risk",
  protect,
  authorize("doctor", "health_worker", "patient", "admin"),
  getRiskDistribution
);

// Count of consultations per status
router.get(
  "/status",
  protect,
  authorize("doctor", "health_worker", "patient", "admin"),
  getStatusDistribution
);

// 10 most recent consultations
router.get(
  "/recent",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getRecentActivity
);

// Village-level disease heatmap data
router.get(
  "/villages",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getVillageHeatmap
);

// Disease/symptom trends over last 6 months
router.get(
  "/disease-trends",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getDiseaseTrends
);

module.exports = router;
