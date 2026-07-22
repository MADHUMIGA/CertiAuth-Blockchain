const { ethers } = require("ethers");
const { wallet, PUBLIC_CONTRACT } = require("../config");

const PublicABI =
  require("../../artifacts/contracts/PublicCertificateRegistry.sol/PublicCertificateRegistry.json").abi;

/**
 * University write access → public chain
 */
const publicWithSigner = new ethers.Contract(
  PUBLIC_CONTRACT,
  PublicABI,
  wallet
);

async function registerCertificate(certHash) {
  const tx = await publicWithSigner.registerCertificate(certHash);
  await tx.wait();
}

module.exports = {
  registerCertificate,
};
