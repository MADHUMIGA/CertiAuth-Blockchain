const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  // -------- PUBLIC LEDGER --------
  const PublicRegistry = await hre.ethers.getContractFactory(
    "PublicCertificateRegistry"
  );
  const publicRegistry = await PublicRegistry.deploy(deployer.address);
  await publicRegistry.waitForDeployment();
  const publicAddress = await publicRegistry.getAddress();
  console.log("PublicCertificateRegistry deployed to:", publicAddress);

  // -------- PRIVATE LEDGER --------
  const PrivateGovernance = await hre.ethers.getContractFactory(
    "PrivateCertificateGovernance"
  );
  const privateGovernance = await PrivateGovernance.deploy(deployer.address);
  await privateGovernance.waitForDeployment();
  const privateAddress = await privateGovernance.getAddress();
  console.log("PrivateCertificateGovernance deployed to:", privateAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
