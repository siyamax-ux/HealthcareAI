const express = require("express");
const {
  getDoctors,
  createReferral,
  getReferrals,
  createAppointment,
  getAppointments,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get list of all active doctors
router.get(
  "/",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getDoctors
);

// Referrals
router.post(
  "/referrals",
  protect,
  authorize("doctor", "health_worker", "admin"),
  createReferral
);

router.get(
  "/referrals",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getReferrals
);

// Appointments
router.post(
  "/appointments",
  protect,
  authorize("doctor", "health_worker", "admin"),
  createAppointment
);

router.get(
  "/appointments",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getAppointments
);

module.exports = router;
