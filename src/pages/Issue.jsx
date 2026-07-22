import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import Card from "../components/ui/Card";
import ProcessSteps from "../components/ProcessSteps";

export default function Issue() {
    const { account, isAuthorized, connectWallet } = useWallet();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    
    const [certHash, setCertHash] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [rollNo, setRollNo] = useState("");
    const [error, setError] = useState("");

    const steps = [
        "Upload Certificate",
        "Generate Certificate Proof",
        "Register on Blockchain"
    ];

    // -------------------------
    // Wallet Guard
    // -------------------------
    if (!account) {
        return (
            <Card className="text-2xl text-center space-y-4">
                <p>Connect university wallet to issue certificates</p>
                <button
                    onClick={connectWallet}
                    className="bg-primary px-4 py-2 rounded-lg"
                >
                    Connect Wallet
                </button>
            </Card>
        );
    }

    if (!isAuthorized) {
        return (
            <Card className="text-center space-y-4">
                <p className="text-red-500 font-medium">
                    This wallet is not authorized to issue certificates.
                </p>

                <button
                    onClick={connectWallet}
                    className="bg-primary px-4 py-2 rounded-lg"
                >
                    Switch Wallet
                </button>
            </Card>
        );
    }

    // -------------------------
    // File Upload
    // -------------------------
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setCertHash("");
        setError("");
        setCurrentStep(1);
    };

    // -------------------------
    // Issue Certificate
    // -------------------------
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleIssue = async () => {
        if (!file) return;

        try {
            setLoading(true);
            setError("");

            // Step 2 – Generate Secure Hash
            setCurrentStep(2);
            await delay(800); // small UX delay

            const formData = new FormData();
            formData.append("file", file);
            formData.append("rollNo", rollNo);

            const response = await fetch("http://localhost:5000/university/issue", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Issuing failed");
            }

            // Step 3 – Blockchain Registration
            setCurrentStep(3);
            await delay(800); // simulate blockchain confirmation

            setCertHash(data.certHash);
            setCurrentStep(4);

        } catch (err) {
            setError(err.message || "Something went wrong.");
            setCurrentStep(1);
        } finally {
            setLoading(false);
        }
    };

    const copyHash = () => {
        navigator.clipboard.writeText(certHash);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold">Issue Certificate</h2>

            <ProcessSteps steps={steps} currentStep={currentStep} />

            <Card>
                <div className="space-y-6">
                    <div>
                        <label className="block mb-2 text-2xl font-medium">
                            Student Roll Number
                        </label>

                        <input
                            type="text"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            className="text-2xl w-full p-3 bg-slate-700 rounded-lg border border-slate-600"
                            placeholder="Enter roll number"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-2xl font-medium">
                            Upload Certificate (PDF / Image)
                        </label>

                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="text-2xl w-full p-3 bg-slate-700 rounded-lg border border-slate-600"
                        />
                    </div>

                    {file && (
                        <div className="text-xl bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <p className="text-2xl text-muted">Selected File:</p>
                            <p className="font-medium">{file.name}</p>
                        </div>
                    )}

                    {file && !certHash && (
                        <button
                            onClick={handleIssue}
                            disabled={loading}
                            className="text-xl w-full bg-primary hover:bg-primaryHover transition px-5 py-3 rounded-lg shadow-glow font-semibold"
                        >
                            {loading ? "Processing & Issuing..." : "Issue Certificate"}
                        </button>
                    )}

                    {certHash && (
                        <div className="bg-green-900/30 border border-success p-4 rounded-lg space-y-4">
                            <p className="text-xl font-semibold text-success">
                                ✅ Certificate Successfully Anchored to Blockchain
                            </p>

                            <div className="bg-slate-900 p-3 rounded-lg flex justify-between items-center">
                                <span className="text-xl break-all">{certHash}</span>
                                <button onClick={copyHash} className="text-primary text-xl ml-4">
                                    Copy
                                </button>
                            </div>

                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setCertHash("");
                                        setCurrentStep(1);
                                        setError("");
                                    }}
                                    className="text-xl flex-1 bg-primary hover:bg-primaryHover transition px-4 py-2 rounded-lg font-semibold"
                                >
                                    Issue Another Certificate
                                </button>

                                <button
                                    onClick={() => navigate("/certificates")}
                                    className="text-xl flex-1 bg-slate-700 hover:bg-slate-600 transition px-4 py-2 rounded-lg font-semibold"
                                >
                                    View Certificates
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg max-w-full">
                            <div className="max-h-40 overflow-y-auto">
                                <p className="text-red-400 text-lg break-all whitespace-pre-wrap">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}