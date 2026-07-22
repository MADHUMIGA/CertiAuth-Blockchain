import { useState } from "react";
import { api } from "../services/api";

export default function CertificateTable({ certificates, refresh }) {
  const [loadingHash, setLoadingHash] = useState(null);

  const statusLabel = {
    0: "NONE",
    1: "ISSUED",
    2: "SUSPENDED",
    3: "REVOKED",
    4: "REISSUED",
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 1: return "text-green-400";
      case 2: return "text-yellow-400";
      case 3: return "text-red-400";
      case 4: return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  const handleSuspend = async (hash) => {
    if (!window.confirm("Suspend this certificate?")) return;

    try {
      setLoadingHash(hash);
      await api.suspendCertificate(hash);
      await refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingHash(null);
    }
  };

  const handleRevoke = async (hash) => {
    if (!window.confirm("Revoke this certificate?")) return;

    try {
      setLoadingHash(hash);
      await api.revokeCertificate(hash);
      await refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingHash(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-2xl">
        <thead className="border-b border-slate-600">
          <tr>
            <th className="py-3">Roll No</th>
            <th>Hash</th>
            <th>Status</th>
            <th>Issued</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {certificates.map((cert) => (
            <tr key={cert.certHash} className="border-b border-slate-700">
              <td className="py-3">{cert.rollNo}</td>

              <td className="truncate max-w-xs">
                {cert.certHash.slice(0, 10)}...
              </td>

              <td className={`font-semibold ${getStatusStyle(cert.status)}`}>
                {statusLabel[cert.status]}
              </td>

              <td>
                {new Date(cert.issuedAt).toLocaleDateString()}
              </td>

              <td className="space-x-2">

                {/* Suspend only if ISSUED */}
                {cert.status === 1 && (
                  <button
                    disabled={loadingHash === cert.certHash}
                    onClick={() => handleSuspend(cert.certHash)}
                    className="bg-yellow-600 px-3 py-1 rounded disabled:opacity-50"
                  >
                    {loadingHash === cert.certHash ? "Processing..." : "Suspend"}
                  </button>
                )}

                {/* Revoke if ISSUED or SUSPENDED */}
                {(cert.status === 1 || cert.status === 2) && (
                  <button
                    disabled={loadingHash === cert.certHash}
                    onClick={() => handleRevoke(cert.certHash)}
                    className="bg-red-600 px-3 py-1 rounded disabled:opacity-50"
                  >
                    {loadingHash === cert.certHash ? "Processing..." : "Revoke"}
                  </button>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}