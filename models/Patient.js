const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    village: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],

    medicalHistory: [
      {
        type: String,
        trim: true,
      },
    ],

    allergies: [
      {
        type: String,
        trim: true,
      },
    ],

    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", patientSchema);