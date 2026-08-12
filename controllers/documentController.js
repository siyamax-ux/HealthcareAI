const path = require("path");
const fs = require("fs");
const MedicalDocument = require("../models/MedicalDocument");
const Patient = require("../models/Patient");

// ========================================
// UPLOAD DOCUMENT
// ========================================
// Multer has already validated and saved the file to disk by the time
// this handler runs. req.file contains the file metadata.

const uploadDocument = async (req, res) => {
  try {
    // req.file is set by uploadMiddleware if a file was provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please attach a file.",
      });
    }

    const { patient, consultation, documentType, notes } = req.body;

    if (!patient) {
      // File was saved to disk but patient ID is missing — clean it up
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    // Verify patient exists
    const existingPatient = await Patient.findById(patient);
    if (!existingPatient) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const document = await MedicalDocument.create({
      patient,
      uploadedBy: req.user.id,
      consultation: consultation || undefined,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      documentType: documentType || "other",
      notes: notes || "",
    });

    const populated = await MedicalDocument.findById(document._id)
      .populate("patient", "name age gender")
      .populate("uploadedBy", "name role");

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: populated,
    });
  } catch (error) {
    console.error("Upload document error:", error);

    // If DB save failed but file is on disk, remove the orphaned file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid patient or consultation ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload document",
    });
  }
};

// ========================================
// GET ALL DOCUMENTS FOR A PATIENT
// ========================================

const getDocumentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const documents = await MedicalDocument.find({ patient: patientId })
      .populate("uploadedBy", "name role")
      .populate("consultation", "status createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Get documents error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};

// ========================================
// GET SINGLE DOCUMENT
// ========================================

const getDocument = async (req, res) => {
  try {
    const document = await MedicalDocument.findById(req.params.id)
      .populate("patient", "name age gender village")
      .populate("uploadedBy", "name role")
      .populate("consultation", "status riskLevel createdAt");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Get document error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch document",
    });
  }
};

// ========================================
// DELETE DOCUMENT
// ========================================

const deleteDocument = async (req, res) => {
  try {
    const document = await MedicalDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete the physical file from disk first
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await MedicalDocument.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete document",
    });
  }
};

module.exports = {
  uploadDocument,
  getDocumentsByPatient,
  getDocument,
  deleteDocument,
};
