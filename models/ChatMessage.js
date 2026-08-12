const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // "health_worker" or "ai"
    senderType: {
      type: String,
      enum: ["health_worker", "ai"],
      required: true,
    },

    // Encrypted ciphertext stored as "iv:authTag:ciphertext"
    // Never stored as plaintext in the database
    encryptedMessage: {
      type: String,
      required: true,
    },

    // Message type for frontend rendering
    messageType: {
      type: String,
      enum: ["text", "ai_analysis", "risk_alert", "system"],
      default: "text",
    },

    // If this message is an AI analysis, store structured metadata
    // (these fields are NOT encrypted — they are safe summary fields)
    aiMetadata: {
      riskLevel:      String,
      urgency:        String,
      doctorRequired: Boolean,
      confidence:     Number,
    },

    // Whether the health worker has read this message
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast retrieval of all messages in a consultation
chatMessageSchema.index({ consultation: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
