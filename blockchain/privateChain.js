// blockchain/privateChain.js

const { ethers } = require("ethers");
const { Wallet, provider, PRIVATE_CONTRACT, PUBLIC_CONTRACT, getNextNonce, resetNonce } = require("../config");

const PrivateABI =
  require("../../artifacts/contracts/PrivateCertificateGovernance.sol/PrivateCertificateGovernance.json").abi;

  const PublicABI =
  require("../../artifacts/contracts/PublicCertificateRegistry.sol/PublicCertificateRegistry.json").abi;

/**
 * With wallet → university actions
 */
const privateWithSigner = new ethers.Contract(
  PRIVATE_CONTRACT,
  PrivateABI,
  Wallet
);

/**
 * Read-only → company verification
 */
const privateReadOnly = new ethers.Contract(
  PRIVATE_CONTRACT,
  PrivateABI,
  provider
);

const publicWithSigner = new ethers.Contract(
  PUBLIC_CONTRACT,
  PublicABI,
  Wallet
);

async function issueCertificate(certHash, rollNo) {
  try {
    await resetNonce(); 
    
    // 1. Issue in private chain
    const nonce1 = await getNextNonce();
    console.log(`Issuing certificate on private chain with nonce: ${nonce1}`);

    const privateTx = await privateWithSigner.issueCertificate(
      certHash,
      rollNo,
      { nonce: nonce1 }
    );

    const privateReceipt = await privateTx.wait();
    console.log(`Private chain tx confirmed: ${privateReceipt.hash}`);

    // 2. Register in public chain
    const nonce2 = await getNextNonce();
    console.log(`Registering certificate on public chain with nonce: ${nonce2}`);

    const publicTx = await publicWithSigner.registerCertificate(
      certHash,
      { nonce: nonce2 }
    );

    const publicReceipt = await publicTx.wait();
    console.log(`Public chain tx confirmed: ${publicReceipt.hash}`);

    return true;

  } catch (err) {
    console.error("Issuance error:", err);
    throw err;
  }
}

async function reissueCertificate(oldHash, newHash, rollNo) {
  try {
    await resetNonce(); 

    const nonce1 = await getNextNonce();
    console.log(`Reissuing certificate on private chain with nonce: ${nonce1}`);
    const tx1 = await privateWithSigner.reissueCertificate(oldHash, newHash, rollNo, { nonce: nonce1 });
    await tx1.wait();
    
    const nonce2 = await getNextNonce();
    console.log(`Registering new hash on public chain with nonce: ${nonce2}`);
    const tx2 = await publicWithSigner.registerCertificate(newHash, { nonce: nonce2 });
    await tx2.wait();
  } catch (err) {
    console.error("Reissuance error:", err);
    throw err;
  }
}

async function suspendCertificate(certHash) {
  try {
    await resetNonce(); 

    const nonce = await getNextNonce();
    const tx = await privateWithSigner.suspendCertificate(certHash, { nonce });
    await tx.wait();
  } catch (err) {
    console.error("Suspend error:", err);
    throw err;
  }
}

async function revokeCertificate(certHash) {
  try {
    await resetNonce(); 
    
    const nonce = await getNextNonce();
    const tx = await privateWithSigner.revokeCertificate(certHash, { nonce });
    await tx.wait();
  } catch (err) {
    console.error("Revoke error:", err);
    throw err;
  }
}

async function getCertificateStatus(certHash) {
  try {
    return await privateReadOnly.getStatus(certHash);
  } catch (err) {
    console.error("Error getting certificate status:", err);
    return 0; // Return NONE status if cert doesn't exist
  }
}

async function getIssuedCertificates() {
  try {
    const hashes = await privateReadOnly.getIssuedCertificates();
    return hashes;
  } catch (err) {
    console.error("Fetch issued certificates error:", err);
    throw err;
  }
}
 
async function getCertificateDetails(certHash) {
  try {
    const [status, previousCertHash, issuedAt, updatedAt, rollNo] = await privateReadOnly.getCertificate(certHash);
    
    // Check if certificate exists (status 0 = NONE = does not exist)
    if (Number(status) === 0) {
      return null;
    }
    
    // Fetch transaction hash from blockchain events
    let transactionHash = null;
    try {
      const filter = privateReadOnly.filters.CertificateIssued(certHash);
      const events = await provider.getLogs({
        address: PRIVATE_CONTRACT,
        topics: filter.topics,
        fromBlock: 0,
      });

      if (events.length > 0) {
        const latestEvent = events[events.length - 1];
        transactionHash = latestEvent.transactionHash;
      }
    } catch (eventErr) {
      console.warn("Could not fetch transaction hash from events:", eventErr.message);
    }
    
    return {
      status: Number(status),
      previousCertHash,
      issuedAt: Number(issuedAt),
      updatedAt: Number(updatedAt),
      rollNo,
      transactionHash
    };
  } catch (err) {
    console.error("Fetch certificate details error:", err);
    return null;
  }
}

module.exports = {
  issueCertificate,
  suspendCertificate,
  revokeCertificate,
  reissueCertificate,
  getCertificateStatus,
  getCertificateDetails,
  getIssuedCertificates,
};
