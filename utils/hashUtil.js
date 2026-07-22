//utils/hashUtil.js

const { ethers } = require("ethers");

function normalizeText(text) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function generateCertificateHash(text) {
  const normalized = normalizeText(text);
  return ethers.keccak256(
    ethers.toUtf8Bytes(normalized)
  );
}

module.exports = { generateCertificateHash };
