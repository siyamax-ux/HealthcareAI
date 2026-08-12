const Patient = require("../models/Patient");
const Consultation = require("../models/Consultation");
const MedicalDocument = require("../models/MedicalDocument");
const Referral = require("../models/Referral");
const Appointment = require("../models/Appointment");

// CREATE PATIENT
const createPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      village,
      address,
      bloodGroup,
      symptoms,
      medicalHistory,
      allergies,
      emergencyContact,
    } = req.body;

    if (!name || age === undefined || !gender) {
      return res.status(400).json({
        success: false,
        message: "Name, age and gender are required",
      });
    }

    const patient = await Patient.create({
      user: req.user.id,
      name,
      age,
      gender,
      phone,
      village,
      address,
      bloodGroup,
      symptoms,
      medicalHistory,
      allergies,
      emergencyContact,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    console.error("Create patient error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create patient",
    });
  }
};

// GET ALL PATIENTS
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("user", "name email role")
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Get patients error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
    });
  }
};

// GET SINGLE PATIENT
const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("user", "name email role")
      .populate("createdBy", "name role");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Get patient error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
    });
  }
};

// UPDATE PATIENT
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    console.error("Update patient error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update patient",
    });
  }
};

// DELETE PATIENT
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Delete patient error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete patient",
    });
  }
};

// ========================================
// GET PATIENT HEALTH TIMELINE
// GET /api/patients/:id/timeline
// Returns full history: consultations, documents,
// referrals, appointments sorted by date
// ========================================

const getPatientTimeline = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Verify patient exists
    const patient = await Patient.findById(patientId)
      .populate("createdBy", "name role");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Fetch all records in parallel
    const [consultations, documents, referrals, appointments] = await Promise.all([
      Consultation.find({ patient: patientId })
        .populate("healthWorker", "name role")
        .populate("doctor", "name role")
        .sort({ createdAt: -1 }),

      MedicalDocument.find({ patient: patientId })
        .populate("uploadedBy", "name role")
        .sort({ createdAt: -1 }),

      Referral.find({ patient: patientId })
        .populate("referredBy", "name role")
        .populate("referredTo", "name role")
        .sort({ createdAt: -1 }),

      Appointment.find({ patient: patientId })
        .populate("doctor", "name role")
        .populate("scheduledBy", "name role")
        .sort({ scheduledAt: -1 }),
    ]);

    // Build unified timeline — every event gets a type + date
    const timelineEvents = [
      ...consultations.map((c) => ({
        type:      "consultation",
        date:      c.createdAt,
        riskLevel: c.riskLevel,
        status:    c.status,
        symptoms:  c.symptoms,
        diagnosis: c.diagnosis || null,
        aiSummary: c.aiAnalysis?.summary || null,
        healthWorker: c.healthWorker,
        doctor:    c.doctor,
        _id:       c._id,
      })),

      ...documents.map((d) => ({
        type:         "document",
        date:         d.createdAt,
        documentType: d.documentType,
        originalName: d.originalName,
        ocrProcessed: d.ocrProcessed,
        uploadedBy:   d.uploadedBy,
        _id:          d._id,
      })),

      ...referrals.map((r) => ({
        type:             "referral",
        date:             r.createdAt,
        urgency:          r.urgency,
        status:           r.status,
        reason:           r.reason,
        referralFacility: r.referralFacility,
        referredBy:       r.referredBy,
        referredTo:       r.referredTo,
        _id:              r._id,
      })),

      ...appointments.map((a) => ({
        type:        "appointment",
        date:        a.scheduledAt,
        status:      a.status,
        reason:      a.reason,
        doctor:      a.doctor,
        scheduledBy: a.scheduledBy,
        _id:         a._id,
      })),
    ];

    // Sort all events newest first
    timelineEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Build health trend from consultations — track risk level changes over time
    const healthTrend = consultations
      .slice()
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((c) => ({
        date:      c.createdAt,
        riskLevel: c.riskLevel,
        status:    c.status,
      }));

    // Compute summary stats
    const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
    consultations.forEach((c) => {
      if (riskCounts[c.riskLevel] !== undefined) riskCounts[c.riskLevel]++;
    });

    res.json({
      success: true,
      patient: {
        _id:              patient._id,
        name:             patient.name,
        age:              patient.age,
        gender:           patient.gender,
        village:          patient.village,
        bloodGroup:       patient.bloodGroup,
        medicalHistory:   patient.medicalHistory,
        allergies:        patient.allergies,
        emergencyContact: patient.emergencyContact,
      },
      summary: {
        totalConsultations: consultations.length,
        totalDocuments:     documents.length,
        totalReferrals:     referrals.length,
        totalAppointments:  appointments.length,
        riskBreakdown:      riskCounts,
        lastVisit:          consultations[0]?.createdAt || null,
      },
      healthTrend,
      timeline: timelineEvents,
    });
  } catch (error) {
    console.error("Get patient timeline error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid patient ID" });
    }

    res.status(500).json({ success: false, message: "Failed to fetch patient timeline" });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getPatientTimeline,
};