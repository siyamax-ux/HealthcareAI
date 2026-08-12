const express = require("express");
const { extractDocumentText, getOcrResult } = require("../controllers/ocrController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Run OCR on an uploaded document
router.post(
  "/extract",
  protect,
  authorize("doctor", "health_worker", "admin"),
  extractDocumentText
);

// Retrieve cached OCR result for a document
router.get(
  "/:documentId",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getOcrResult
);

module.exports = router;
