const express = require("express");
const { sendMessage, getChatHistory, getUnreadCount } = require("../controllers/chatController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Send a message and get AI reply (encrypted round-trip)
router.post(
  "/send",
  protect,
  authorize("doctor", "health_worker", "admin"),
  sendMessage
);

// Get full decrypted chat history for a consultation
router.get(
  "/:consultationId",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getChatHistory
);

// Get unread AI message count
router.get(
  "/:consultationId/unread",
  protect,
  authorize("doctor", "health_worker", "admin"),
  getUnreadCount
);

module.exports = router;
