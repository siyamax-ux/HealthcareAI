const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    referredTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // doctor
    },

    // Where the patient is being sent (hospital name, clinic, etc.)
    referralFacility: {
      type: String,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    urgency: {
      type: String,
      enum: ["routine", "urgent", "emergency"],
      default: "routine",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Referral", referralSchema);
