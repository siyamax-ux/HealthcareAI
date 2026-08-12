const express = require("express");

const {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create patient
router.post(
  "/",
  protect,
  authorize("doctor", "health_worker", "admin"),
  createPatient
);

// Get all patients
router.get(
  "/",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getPatients
);

// Get one patient
router.get(
  "/:id",
  protect,
  getPatient
);

// Update patient
router.put(
  "/:id",
  protect,
  authorize("doctor", "health_worker", "admin"),
  updatePatient
);

// Delete patient
router.delete(
  "/:id",
  protect,
  authorize("doctor", "admin"),
  deletePatient
);

module.exports = router;