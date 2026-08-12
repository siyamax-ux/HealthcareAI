const express = require("express");

const {
  createConsultation,
  getConsultations,
  getConsultation,
  updateConsultation,
} = require("../controllers/consultationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create consultation
router.post(
  "/",
  protect,
  authorize("doctor", "health_worker", "admin"),
  createConsultation
);

// Get all consultations
router.get(
  "/",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getConsultations
);

// Get single consultation
router.get(
  "/:id",
  protect,
  getConsultation
);

// Update consultation
router.put(
  "/:id",
  protect,
  authorize("doctor", "health_worker", "admin"),
  updateConsultation
);

module.exports = router;
