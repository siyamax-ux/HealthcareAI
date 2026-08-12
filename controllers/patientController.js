const Patient = require("../models/Patient");

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

module.exports = {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
};