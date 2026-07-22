//services/ocrService.js



const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const sharp = require("sharp");

/**
 * Extract text from image or PDF
 * @param {Buffer} fileBuffer
 * @param {string} mimeType
 */
async function extractTextFromFile(fileBuffer, mimeType) {
  if (!fileBuffer) {
    throw new Error("File buffer missing");
  }

  // -------- PDF --------
  if (mimeType === "application/pdf") {
    const pdfData = await pdfParse(fileBuffer);

    if (pdfData.text && pdfData.text.trim().length > 20) {
      return pdfData.text;
    }

    throw new Error("PDF text extraction failed");
  }

  // -------- IMAGE --------
  const processedImage = await sharp(fileBuffer)
    .grayscale()
    .normalize()
    .toBuffer();

  const {

    
    data: { text },
  } = await Tesseract.recognize(processedImage, "eng");

  if (!text || text.trim().length === 0) {
    throw new Error("No text detected");
  }

  return text;
}

module.exports = { extractTextFromFile };
