//routes/university.js


const express = require("express");
const multer = require("multer");
const { extractTextFromFile } = require("../services/ocrService");
const { generateCertificateHash } = require("../utils/hashUtil");
const blockchain = require("../blockchain/privateChain");
const { getIssuedCertificates } = require("../blockchain/privateChain");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * ISSUE certificate
 */
router.post("/issue", upload.single("file"), async (req, res) => {
  try {
    const text = await extractTextFromFile(
      req.file.buffer,
      req.file.mimetype
    );
   const { rollNo } = req.body;

if (!rollNo) {
  return res.status(400).json({ error: "Roll number required" });
}

const certHash = generateCertificateHash(text);

await blockchain.issueCertificate(certHash, rollNo);

    res.status(201).json({
      message: "Certificate issued",
      certHash: certHash,
    });
  } catch (err) {
    console.error("Issue endpoint error:", err.message);
    res.status(500).json({ 
      error: err.message || "Failed to issue certificate",
      reason: err.reason || null
    });
  }
});

/**
 * 🔁 REISSUE certificate (FINAL)
 * Requires:
 *  - old certificate hash
 *  - new certificate file
 */
router.post("/reissue", upload.single("file"), async (req, res) => {
  try {
    const { oldCertHash, rollNo } = req.body;
    if (!oldCertHash) {
      return res.status(400).json({ error: "oldCertHash required" });
    }
    if (!rollNo) {
      return res.status(400).json({ error: "rollNo required" });
    }

    const text = await extractTextFromFile(req.file.buffer);
    const newHash = generateCertificateHash(text);

    await blockchain.reissueCertificate(oldCertHash, newHash, rollNo);

    res.json({
      message: "Certificate reissued",
      oldCertHash,
      newCertHash: newHash,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * REVOKE
 */
router.post("/revoke", async (req, res) => {
  try {
    const { certHash } = req.body;

    if (!certHash) {
      return res.status(400).json({ error: "certHash required" });
    }

    await blockchain.revokeCertificate(certHash);

    return res.status(200).json({
      success: true,
      message: "Certificate revoked successfully",
    });

  } catch (err) {
    console.error("Revoke error:", err);
    return res.status(500).json({
      success: false,
      error: err.reason || err.message || "Revoke failed",
    });
  }
});

/**
 * SUSPEND
 */
router.post("/suspend", async (req, res) => {
  try {
    const { certHash } = req.body;

    if (!certHash) {
      return res.status(400).json({ error: "certHash required" });
    }

    await blockchain.suspendCertificate(certHash);

    return res.status(200).json({
      success: true,
      message: "Certificate suspended successfully",
    });

  } catch (err) {
    console.error("Suspend error:", err);
    return res.status(500).json({
      success: false,
      error: err.reason || err.message || "Suspend failed",
    });
  }
});

//issued
router.get("/issued", async (req, res) => {
  try {
    const hashes = await getIssuedCertificates();
    res.json(hashes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
