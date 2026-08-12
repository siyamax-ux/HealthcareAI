const MedicalDocument = require("../models/MedicalDocument");
const { extractText } = require("../services/ocrService");

// ========================================
// EXTRACT TEXT FROM DOCUMENT (OCR)
// POST /api/ocr/extract
// Body: { documentId }
// ========================================

const extractDocumentText = async (req, res) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "documentId is required",
      });
    }

    const document = await MedicalDocument.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (document.ocrProcessed) {
      // Already processed — return cached result instead of re-running OCR
      return res.json({
        success: true,
        message: "OCR already processed for this document",
        extractedText: document.extractedText,
        documentId,
        cached: true,
      });
    }

    // Run OCR on the file
    const ocrResult = await extractText({
      filePath: document.filePath,
      mimeType: document.mimeType,
    });

    // Save result back to database
    document.extractedText = ocrResult.text;
    document.ocrProcessed  = true;
    await document.save();

    res.json({
      success: true,
      message: "Text extracted successfully",
      extractedText: ocrResult.text,
      pageCount:     ocrResult.pageCount,
      confidence:    ocrResult.confidence,
      documentId,
      cached: false,
    });
  } catch (error) {
    console.error("OCR extract error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID",
      });
    }

    // File missing on disk
    if (error.message && error.message.includes("File not found")) {
      return res.status(404).json({
        success: false,
        message: "Document file not found on server",
      });
    }

    res.status(500).json({
      success: false,
      message: "OCR processing failed",
    });
  }
};

// ========================================
// GET OCR RESULT FOR A DOCUMENT
// GET /api/ocr/:documentId
// ========================================

const getOcrResult = async (req, res) => {
  try {
    const document = await MedicalDocument.findById(req.params.documentId)
      .select("originalName ocrProcessed extractedText mimeType createdAt");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (!document.ocrProcessed) {
      return res.status(400).json({
        success: false,
        message: "OCR has not been run on this document yet. Call POST /api/ocr/extract first.",
      });
    }

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Get OCR result error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch OCR result",
    });
  }
};

module.exports = { extractDocumentText, getOcrResult };
