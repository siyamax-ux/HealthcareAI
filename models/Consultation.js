const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    healthWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],

    vitals: {
      temperature: {
        type: Number,
      },

      bloodPressure: {
        type: String,
      },

      heartRate: {
        type: Number,
      },

      oxygenLevel: {
        type: Number,
      },

      weight: {
        type: Number,
      },
    },

    medicalNotes: {
      type: String,
      trim: true,
    },

    diagnosis: {
      type: String,
      trim: true,
    },

    treatment: {
      type: String,
      trim: true,
    },

    aiAnalysis: {
      summary: String,

      possibleConditions: [
        {
          type: String,
        },
      ],

      recommendation: String,
    },

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "referred"],
      default: "pending",
    },

    doctorRequired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Consultation", consultationSchema);
