// ============================================================
// SETUHEALTH AI — OCR SERVICE
// Extracts text from uploaded medical documents.
// Images  → Tesseract.js (runs locally, no API key needed)
// PDFs    → pdf-parse   (runs locally, no API key needed)
// ============================================================

const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");

// Supported MIME types
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const PDF_TYPE = "application/pdf";

// -------------------------------------------------------
// Extract text from an image file using Tesseract.js
// -------------------------------------------------------
const extractFromImage = async (filePath) => {
  const result = await Tesseract.recognize(filePath, "eng", {
    // Suppress verbose Tesseract logs in production
    logger: () => {},
  });

  return result.data.text.trim();
};

// -------------------------------------------------------
// Extract text from a PDF file using pdf-parse
// -------------------------------------------------------
const extractFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text.trim();
};

// -------------------------------------------------------
// MAIN EXPORT: extractText({ filePath, mimeType })
//
// Returns:
// {
//   text: "extracted text content...",
//   pageCount: 1,       (PDFs only, otherwise 1)
//   confidence: 0-100   (images only, Tesseract confidence)
// }
// -------------------------------------------------------
const extractText = async ({ filePath, mimeType }) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  if (IMAGE_TYPES.includes(mimeType)) {
    const result = await Tesseract.recognize(filePath, "eng", {
      logger: () => {},
    });

    return {
      text: result.data.text.trim(),
      pageCount: 1,
      confidence: Math.round(result.data.confidence),
    };
  }

  if (mimeType === PDF_TYPE) {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);

    return {
      text: data.text.trim(),
      pageCount: data.numpages,
      confidence: null, // pdf-parse doesn't provide a confidence score
    };
  }

  throw new Error(
    `Unsupported file type for OCR: ${mimeType}. Only images and PDFs are supported.`
  );
};

module.exports = { extractText };
