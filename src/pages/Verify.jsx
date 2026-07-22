import { useState } from "react";
import Card from "../components/ui/Card";

export default function Verify() {
    const [file, setFile] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerify = async () => {
        if (!file) {
            setError("Please upload a certificate file");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setCertificate(null);

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(
                "http://localhost:5000/company/verify",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Verification failed");
            }

            setCertificate(data);
        } catch (err) {
            setError(err.message || "Unable to verify certificate");
        } finally {
            setLoading(false);
        }
    };

    const getStatusUI = (status) => {
        switch (status) {
            case "ISSUED":
                return {
                    color: "text-green-400",
                    bg: "bg-green-900/30 border-green-500",
                    label: "Certificate Issued",
                };
            case "SUSPENDED":
                return {
                    color: "text-yellow-400",
                    bg: "bg-yellow-900/30 border-yellow-500",
                    label: "Certificate Suspended",
                };
            case "REVOKED":
                return {
                    color: "text-red-400",
                    bg: "bg-red-900/30 border-red-500",
                    label: "Certificate Revoked",
                };
            case "REISSUED":
                return {
                    color: "text-blue-400",
                    bg: "bg-blue-900/30 border-blue-500",
                    label: "Certificate Reissued",
                };
            default:
                return {
                    color: "text-gray-400",
                    bg: "bg-gray-900/30 border-gray-500",
                    label: "Unknown Status",
                };
        }
    };

    const statusUI = certificate ? getStatusUI(certificate.status) : null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">Verify Certificate</h2>

            <Card>
                <div className="space-y-6">
                    <div>
                        <label className="block mb-2 text-xl font-medium">
                            Upload Certificate
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 text-lg"
                        />
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primaryHover transition px-5 py-3 rounded-lg font-semibold"
                    >
                        {loading ? "Verifying..." : "Verify Certificate"}
                    </button>

                    {error && (
                        <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg">
                            <p className="text-red-400 break-all whitespace-pre-wrap">
                                {error}
                            </p>
                        </div>
                    )}

                    {certificate && (
                        <div
                            className={`p-5 rounded-lg border ${certificate.valid
                                    ? statusUI?.bg
                                    : "bg-red-900/20 border-red-500"
                                }`}
                        >
                            <h3
                                className={`text-2xl font-semibold ${certificate.valid
                                        ? statusUI?.color
                                        : "text-red-400"
                                    }`}
                            >
                                {certificate.valid
                                    ? statusUI?.label
                                    : "Certificate Not Found"}
                            </h3>

                            <div className="mt-4 space-y-2 text-lg">
                                {/* Always show hash */}
                                <p>
                                    <strong>Certificate Hash:</strong>{" "}
                                    <span className="break-all">
                                        {certificate.certHash || "N/A"}
                                    </span>
                                </p>

                                {/* Show extra details only if valid */}
                                {certificate.valid && (
                                    <>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <span className={statusUI?.color}>
                                                {certificate.status}
                                            </span>
                                        </p>

                                        {certificate.rollNo && (
                                            <p>
                                                <strong>Roll Number:</strong>{" "}
                                                {certificate.rollNo}
                                            </p>
                                        )}

                                        {certificate.issuedAt && (
                                            <p>
                                                <strong>Issued At:</strong>{" "}
                                                {new Date(
                                                    certificate.issuedAt
                                                ).toLocaleString()}
                                            </p>
                                        )}

                                        {certificate.transactionHash && (
                                            <p>
                                                <strong>Blockchain Tx:</strong>{" "}
                                                <span className="break-all">
                                                    {certificate.transactionHash}
                                                </span>
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}