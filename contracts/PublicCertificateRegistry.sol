// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PublicCertificateRegistry {

    // Address of the university (or backend wallet)
    address public issuer;

    // Mapping to store existence of certificate hashes
    mapping(bytes32 => bool) private certificates;

    // Event emitted when a certificate is registered
    event CertificateRegistered(bytes32 indexed certHash, address indexed issuer);

    // Modifier to restrict access to issuer only
    modifier onlyIssuer() {
        require(msg.sender == issuer, "Not authorized");
        _;
    }

    // Constructor runs once during deployment
    constructor(address _issuer) {
        issuer = _issuer;
    }

    // Register a certificate hash (existence proof)
    function registerCertificate(bytes32 certHash) external onlyIssuer {
        require(!certificates[certHash], "Certificate already registered");

        certificates[certHash] = true;
        emit CertificateRegistered(certHash, msg.sender);
    }

    // Check if a certificate hash exists
    function certificateExists(bytes32 certHash) external view returns (bool) {
        return certificates[certHash];
        }}
