// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PrivateCertificateGovernance {

    // University authority (admin)
    address public university;

    // Certificate lifecycle states
    enum Status {
        NONE,
        ISSUED,
        SUSPENDED,
        REVOKED,
        REISSUED
    }


    // Certificate structure
    struct Certificate {
        Status status;
        bytes32 previousCertHash; // used only for reissue
        uint256 issuedAt;
        uint256 updatedAt;
        string rollNo;
    }

    // Mapping from certificate hash to Certificate data
    mapping(bytes32 => Certificate) private certificates;

bytes32[] private issuedCertificateHashes;

    // Events for audit trail
    event CertificateIssued(bytes32 indexed certHash);
    event CertificateSuspended(bytes32 indexed certHash);
    event CertificateRevoked(bytes32 indexed certHash);
    event CertificateReissued(bytes32 indexed oldHash, bytes32 indexed newHash);

    // Access control modifier
    modifier onlyUniversity() {
        require(msg.sender == university, "Unauthorized");
        _;
    }

    // Constructor
    constructor(address _university) {
        university = _university;
    }

    // Issue a new certificate
    function issueCertificate(bytes32 certHash, string calldata rollNo)
    external
    onlyUniversity
{
    require(certificates[certHash].status == Status.NONE, "Already exists");

    certificates[certHash] = Certificate({
        status: Status.ISSUED,
        previousCertHash: bytes32(0),
        issuedAt: block.timestamp,
        updatedAt: block.timestamp,
        rollNo: rollNo
    });

    issuedCertificateHashes.push(certHash);

    emit CertificateIssued(certHash);
}

    // Suspend a certificate
    function suspendCertificate(bytes32 certHash) external onlyUniversity {
        require(certificates[certHash].status == Status.ISSUED, "Cannot suspend");

        certificates[certHash].status = Status.SUSPENDED;
        certificates[certHash].updatedAt = block.timestamp;

        emit CertificateSuspended(certHash);
    }

    // Revoke a certificate
    function revokeCertificate(bytes32 certHash) external onlyUniversity {
        require(
            certificates[certHash].status == Status.ISSUED ||
            certificates[certHash].status == Status.SUSPENDED,
            "Cannot revoke"
        );

        certificates[certHash].status = Status.REVOKED;
        certificates[certHash].updatedAt = block.timestamp;

        emit CertificateRevoked(certHash);
    }

    // Reissue a certificate (linking old to new)
    function reissueCertificate(bytes32 oldHash, bytes32 newHash, string calldata rollNo) external onlyUniversity {
        require(certificates[oldHash].status == Status.REVOKED, "Old must be revoked");
        require(certificates[newHash].status == Status.NONE, "New already exists");

        certificates[newHash] = Certificate({
            status: Status.REISSUED,
            previousCertHash: oldHash,
            issuedAt: block.timestamp,
            updatedAt: block.timestamp,
            rollNo: rollNo
        });

        emit CertificateReissued(oldHash, newHash);
    }

    // Get current status of a certificate
    function getStatus(bytes32 certHash) external view returns (Status) {
        return certificates[certHash].status;
    }

    // Get certificate details - return individual fields
    function getCertificate(bytes32 certHash) external view returns (
        uint8 status,
        bytes32 previousCertHash,
        uint256 issuedAt,
        uint256 updatedAt,
        string memory rollNo
    ) {
        Certificate memory cert = certificates[certHash];
        return (
            uint8(cert.status),
            cert.previousCertHash,
            cert.issuedAt,
            cert.updatedAt,
            cert.rollNo
        );
    }

    function getIssuedCertificates()
    external
    view
    returns (bytes32[] memory)
         {
    return issuedCertificateHashes;
        }
}
