const express = require("express");

const {
  uploadDocument,
  getDocumentsByPatient,
  getDocument,
  deleteDocument,
} = require("../controllers/documentController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const { uploadSingle } = require("../middleware/uploadMiddleware");

const router = express.Router();

// Upload a document
// "document" is the form-data field name the frontend must use
router.post(
  "/",
  protect,
  authorize("doctor", "health_worker", "admin"),
  uploadSingle("document"),
  uploadDocument
);

// Get all documents for a specific patient
router.get(
  "/patient/:patientId",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getDocumentsByPatient
);

// Get a single document by its ID
router.get(
  "/:id",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getDocument
);

// Delete a document
router.delete(
  "/:id",
  protect,
  authorize("doctor", "admin"),
  deleteDocument
);

module.exports = router;
