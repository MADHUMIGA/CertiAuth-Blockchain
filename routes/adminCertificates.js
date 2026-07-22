const express = require("express");
const router = express.Router();

const {
  getIssuedCertificates,
  getCertificateDetails
} = require("../blockchain/privateChain");

/**
 * GET /admin/certificates
 * List all issued certificates with details
 */
router.get("/certificates", async (req, res) => {
  try {
    const hashes = await getIssuedCertificates();

    const detailedCertificates = await Promise.all(
      hashes.map(async (hash) => {
        const details = await getCertificateDetails(hash);
        return {
          certHash: hash,
          ...details
        };
      })
    );

    res.json({
      total: detailedCertificates.length,
      certificates: detailedCertificates
    });

  } catch (err) {
    console.error("Admin listing error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;