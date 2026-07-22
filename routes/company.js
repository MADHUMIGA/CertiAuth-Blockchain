// routes/company.js

const express = require("express");
const router = express.Router();
const multer = require("multer");

const { verifyCertificate } = require("../blockchain/publicChain");
const { getCertificateStatus, getCertificateDetails } = require("../blockchain/privateChain");
const statusMap = require("../utils/statusMap");
const { extractTextFromFile } = require("../services/ocrService");
const { generateCertificateHash } = require("../utils/hashUtil");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/verify", upload.single("file"), async (req, res) => {
  try {
    let certHash;

    if (req.file) {
      const text = await extractTextFromFile(req.file.buffer, req.file.mimetype);
      certHash = generateCertificateHash(text);
    } else if (req.body.certHash) {
      certHash = req.body.certHash;
    } else {
      return res.status(400).json({ error: "Either file or certHash required" });
    }

    const exists = await verifyCertificate(certHash);

    if (!exists) {
      return res.json({
        valid: false,
        certHash
      });
    }

    const statusCode = await getCertificateStatus(certHash);
    const certDetails = await getCertificateDetails(certHash);

    // If details not found in private chain but exists in public, it may be invalid
    if (!certDetails) {
      return res.json({
        valid: false,
        certHash,
        message: "Certificate not found in private ledger"
      });
    }

    res.json({
      valid: true,
      certHash, 
      statusCode: Number(statusCode),
      status: statusMap[Number(statusCode)],
      issuedAt: certDetails.issuedAt * 1000, 
      rollNo: certDetails.rollNo,
      transactionHash: certDetails.transactionHash
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
