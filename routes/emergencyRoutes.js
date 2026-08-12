const express = require("express");
const { flagEmergency, getAlerts } = require("../controllers/emergencyController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Manually flag a consultation as a critical emergency
router.post(
  "/flag",
  protect,
  authorize("doctor", "health_worker", "admin"),
  flagEmergency
);

// Get all active high/critical consultations
router.get(
  "/alerts",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getAlerts
);

module.exports = router;
