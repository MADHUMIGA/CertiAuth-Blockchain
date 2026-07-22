// blockchain/publicChain.js

const { ethers } = require("ethers");
const { provider, PUBLIC_CONTRACT } = require("../config");

const PublicABI =
  require("../../artifacts/contracts/PublicCertificateRegistry.sol/PublicCertificateRegistry.json").abi;

/**
 * Read-only contract instance
 * No wallet required (verification only)
 */
const publicRegistry = new ethers.Contract(
  PUBLIC_CONTRACT,
  PublicABI,
  provider
);

/**
 * Verify whether a certificate hash exists on public ledger
 * @param {string} certHash bytes32 hash
 * @returns {boolean}
 */
async function verifyCertificate(certHash) {
  return await publicRegistry.certificateExists(certHash);
}

module.exports = {
  verifyCertificate,
};
