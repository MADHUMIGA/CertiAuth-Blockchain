// config.js
require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const Wallet = new ethers.Wallet(
  process.env.UNIVERSITY_PRIVATE_KEY,
  provider
);

// Track nonce to prevent conflicts
let nonceCache = null;

async function initializeNonce() {
  nonceCache = await provider.getTransactionCount(Wallet.address, 'latest');
}

async function resetNonce() {
  nonceCache = await provider.getTransactionCount(Wallet.address, 'latest');
}

async function getNextNonce() {
  if (nonceCache === null) {
    await initializeNonce();
  }
  return nonceCache++;
}


module.exports = {
  provider,
  Wallet,
  PUBLIC_CONTRACT: process.env.PUBLIC_CONTRACT,
  PRIVATE_CONTRACT: process.env.PRIVATE_CONTRACT,
  getNextNonce,
  initializeNonce,
  resetNonce
};


