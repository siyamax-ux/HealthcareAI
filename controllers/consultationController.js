const Consultation = require("../models/Consultation");
const Patient = require("../models/Patient");

// ========================================
// CREATE CONSULTATION
// ========================================

const createConsultation = async (req, res) => {
  try {
    const {
      patient,
      symptoms,
      vitals,
      medicalNotes,
    } = req.body;

    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    // Check patient exists
    const existingPatient = await Patient.findById(patient);

    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const consultation = await Consultation.create({
      patient,
      healthWorker: req.user.id,
      symptoms,
      vitals,
      medicalNotes,
      status: "pending",
    });

    const populatedConsultation =
      await Consultation.findById(consultation._id)
        .populate("patient", "name age gender village")
        .populate("healthWorker", "name role");

    res.status(201).json({
      success: true,
      message: "Consultation created successfully",
      consultation: populatedConsultation,
    });
  } catch (error) {
    console.error("Create consultation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create consultation",
    });
  }
};

// ========================================
// GET ALL CONSULTATIONS
// ========================================

const getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate("patient", "name age gender village")
      .populate("healthWorker", "name role")
      .populate("doctor", "name role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    console.error("Get consultations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch consultations",
    });
  }
};

// ========================================
// GET SINGLE CONSULTATION
// ========================================

const getConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(
      req.params.id
    )
      .populate("patient", "name age gender village phone")
      .populate("healthWorker", "name role")
      .populate("doctor", "name role");

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    res.json({
      success: true,
      consultation,
    });
  } catch (error) {
    console.error("Get consultation error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch consultation",
    });
  }
};

// ========================================
// UPDATE CONSULTATION
// ========================================

const updateConsultation = async (req, res) => {
  try {
    // Whitelist only the fields a human user is allowed to update.
    // Fields like patient, healthWorker, and aiAnalysis are managed
    // by the system/AI and must never be overwritten from raw req.body.
    const {
      symptoms,
      vitals,
      medicalNotes,
      diagnosis,
      treatment,
      riskLevel,
      status,
      doctorRequired,
      doctor,
    } = req.body;

    const allowedUpdates = {
      ...(symptoms !== undefined && { symptoms }),
      ...(vitals !== undefined && { vitals }),
      ...(medicalNotes !== undefined && { medicalNotes }),
      ...(diagnosis !== undefined && { diagnosis }),
      ...(treatment !== undefined && { treatment }),
      ...(riskLevel !== undefined && { riskLevel }),
      ...(status !== undefined && { status }),
      ...(doctorRequired !== undefined && { doctorRequired }),
      ...(doctor !== undefined && { doctor }),
    };

    const consultation =
      await Consultation.findByIdAndUpdate(
        req.params.id,
        allowedUpdates,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("patient", "name age gender village")
        .populate("healthWorker", "name role")
        .populate("doctor", "name role");

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    res.json({
      success: true,
      message: "Consultation updated successfully",
      consultation,
    });
  } catch (error) {
    console.error("Update consultation error:", error);

    // Invalid MongoDB ObjectId (e.g. /api/consultations/abc)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update consultation",
    });
  }
};

module.exports = {
  createConsultation,
  getConsultations,
  getConsultation,
  updateConsultation,
};
