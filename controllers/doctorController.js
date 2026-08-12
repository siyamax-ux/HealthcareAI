const User = require("../models/User");
const Consultation = require("../models/Consultation");
const Referral = require("../models/Referral");
const Appointment = require("../models/Appointment");

// ========================================
// GET ALL DOCTORS
// GET /api/doctors
// ========================================

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", isActive: true })
      .select("-password")
      .sort({ name: 1 });

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctors" });
  }
};

// ========================================
// CREATE REFERRAL
// POST /api/doctors/referrals
// Body: { consultationId, patientId, referredToId, reason, urgency, referralFacility, notes }
// ========================================

const createReferral = async (req, res) => {
  try {
    const {
      consultationId,
      patientId,
      referredToId,
      reason,
      urgency,
      referralFacility,
      notes,
    } = req.body;

    if (!consultationId || !patientId || !reason) {
      return res.status(400).json({
        success: false,
        message: "consultationId, patientId and reason are required",
      });
    }

    const referral = await Referral.create({
      consultation:     consultationId,
      patient:          patientId,
      referredBy:       req.user.id,
      referredTo:       referredToId || undefined,
      reason,
      urgency:          urgency || "routine",
      referralFacility: referralFacility || "",
      notes:            notes || "",
    });

    // Update the consultation status to "referred"
    await Consultation.findByIdAndUpdate(consultationId, {
      status: "referred",
      doctorRequired: true,
    });

    const populated = await Referral.findById(referral._id)
      .populate("patient", "name age gender village")
      .populate("referredBy", "name role")
      .populate("referredTo", "name role");

    res.status(201).json({
      success: true,
      message: "Referral created successfully",
      referral: populated,
    });
  } catch (error) {
    console.error("Create referral error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID provided" });
    }

    res.status(500).json({ success: false, message: "Failed to create referral" });
  }
};

// ========================================
// GET ALL REFERRALS
// GET /api/doctors/referrals
// ========================================

const getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate("patient", "name age gender village")
      .populate("referredBy", "name role")
      .populate("referredTo", "name role")
      .populate("consultation", "status riskLevel createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    console.error("Get referrals error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch referrals" });
  }
};

// ========================================
// CREATE APPOINTMENT
// POST /api/doctors/appointments
// Body: { patientId, doctorId, consultationId, scheduledAt, reason, notes }
// ========================================

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, consultationId, scheduledAt, reason, notes } = req.body;

    if (!patientId || !doctorId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "patientId, doctorId and scheduledAt are required",
      });
    }

    const appointment = await Appointment.create({
      patient:      patientId,
      doctor:       doctorId,
      scheduledBy:  req.user.id,
      consultation: consultationId || undefined,
      scheduledAt:  new Date(scheduledAt),
      reason:       reason || "",
      notes:        notes || "",
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("patient", "name age gender village")
      .populate("doctor", "name role")
      .populate("scheduledBy", "name role");

    res.status(201).json({
      success: true,
      message: "Appointment scheduled successfully",
      appointment: populated,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID provided" });
    }

    res.status(500).json({ success: false, message: "Failed to create appointment" });
  }
};

// ========================================
// GET ALL APPOINTMENTS
// GET /api/doctors/appointments
// ========================================

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name age gender village")
      .populate("doctor", "name role")
      .populate("scheduledBy", "name role")
      .sort({ scheduledAt: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
};

module.exports = {
  getDoctors,
  createReferral,
  getReferrals,
  createAppointment,
  getAppointments,
};
