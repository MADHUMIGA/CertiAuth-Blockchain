import { useState } from "react"
import { useWallet } from "../context/WalletContext"
import Card from "../components/ui/Card"
import ProcessSteps from "../components/ProcessSteps"

export default function Reissue() {
  const { account, connectWallet } = useWallet()

  const [oldCertHash, setOldCertHash] = useState("")
  const [file, setFile] = useState(null)
  const [newCertHash, setNewCertHash] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const steps = [
    "Enter Old Hash",
    "Upload New Certificate",
    "Reissued on Blockchain"
  ]

  // -------------------------
  // Wallet Guard
  // -------------------------
  if (!account) {
    return (
      <Card className="max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-semibold">
          Connect Wallet to Reissue Certificate
        </h2>

        <p className="text-muted">
          Reissuing requires blockchain authorization.
        </p>

        <button
          onClick={connectWallet}
          className="bg-primary hover:bg-primaryHover px-5 py-2 rounded-lg shadow-glow"
        >
          Connect Wallet
        </button>
      </Card>
    )
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    setFile(selectedFile)
  }

  // -------------------------
  // Handle Reissue
  // -------------------------
  const handleReissue = async () => {
    if (!oldCertHash || !file) return

    try {
      setLoading(true)
      setError("")
      setCurrentStep(2)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("oldCertHash", oldCertHash)

      const response = await fetch(
        "http://localhost:5000/university/reissue",
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Reissue failed")
      }

      setNewCertHash(data.newCertHash)
      setCurrentStep(3)
      setLoading(false)

    } catch (err) {
      setError(err.message)
      setLoading(false)
      setCurrentStep(1)
    }
  }

  const copyHash = () => {
    navigator.clipboard.writeText(newCertHash)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold">
        Reissue Certificate
      </h2>

      <ProcessSteps steps={steps} currentStep={currentStep} />

      <Card>
        <div className="space-y-6">

          {/* Old Hash Input */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Old Certificate Hash
            </label>

            <input
              type="text"
              value={oldCertHash}
              onChange={(e) => setOldCertHash(e.target.value)}
              placeholder="Enter old certificate hash"
              className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600"
            />
          </div>

          {/* Upload Section */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Upload New Certificate File
            </label>

            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600"
            />
          </div>

          {/* Reissue Button */}
          {oldCertHash && file && !newCertHash && (
            <button
              onClick={handleReissue}
              disabled={loading}
              className="w-full bg-primary hover:bg-primaryHover transition px-5 py-3 rounded-lg shadow-glow font-semibold"
            >
              {loading
                ? "Reissuing..."
                : "Reissue Certificate"}
            </button>
          )}

          {/* Success */}
          {newCertHash && (
            <div className="bg-green-900/30 border border-success p-4 rounded-lg space-y-3">
              <p className="font-semibold text-success">
                ✅ Certificate Reissued Successfully
              </p>

              <div className="bg-slate-900 p-3 rounded-lg flex justify-between items-center">
                <span className="text-xs break-all">
                  {newCertHash}
                </span>

                <button
                  onClick={copyHash}
                  className="text-primary text-sm ml-4"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg">
              <p className="text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}

        </div>
      </Card>
    </div>
  )
}