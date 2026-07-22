import { useState } from "react"
import { useWallet } from "../context/WalletContext"
import Card from "../components/ui/Card"

export default function Manage() {
  const { account, connectWallet } = useWallet()

  const [certHash, setCertHash] = useState("")
  const [status, setStatus] = useState(null)
  const [statusCode, setStatusCode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // -------------------------
  // Wallet Guard
  // -------------------------
  if (!account) {
    return (
      <Card className="max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-semibold">
          Connect Wallet to Manage Certificates
        </h2>
        <button
          onClick={connectWallet}
          className="bg-primary hover:bg-primaryHover px-5 py-2 rounded-lg shadow-glow"
        >
          Connect Wallet
        </button>
      </Card>
    )
  }

  // -------------------------
  // Check Status
  // -------------------------
  const checkStatus = async () => {
    if (!certHash) return

    try {
      setChecking(true)
      setError("")
      setMessage("")
      setStatus(null)

      const response = await fetch(
        "http://localhost:5000/company/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ certHash }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Status check failed")
      }

      if (!data.valid) {
        setStatus("NOT FOUND")
        setStatusCode(0)
      } else {
        setStatus(data.status)
        setStatusCode(data.statusCode)
      }

      setChecking(false)
    } catch (err) {
      setError(err.message)
      setChecking(false)
    }
  }

  // -------------------------
  // Update Status
  // -------------------------
  const updateStatus = async (type) => {
    try {
      setLoading(true)
      setError("")
      setMessage("")

      const response = await fetch(
        `http://localhost:5000/university/${type}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ certHash }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Operation failed")
      }

      setMessage(data.message)

      // Refresh status after update
      await checkStatus()

      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // -------------------------
  // Permission Logic
  // -------------------------
  const canSuspend =
    statusCode === 1 || statusCode === 4

  const canRevoke =
    statusCode === 1 ||
    statusCode === 2 ||
    statusCode === 4

  const getStatusColor = () => {
    switch (status) {
      case "ISSUED":
        return "text-green-400"
      case "SUSPENDED":
        return "text-yellow-400"
      case "REVOKED":
        return "text-red-400"
      case "REISSUED":
        return "text-blue-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold">
        Manage Certificate Status
      </h2>

      <Card>
        <div className="space-y-6">

          {/* Hash Input */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Certificate Hash
            </label>

            <input
              type="text"
              value={certHash}
              onChange={(e) => setCertHash(e.target.value)}
              placeholder="Enter certificate hash"
              className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600"
            />
          </div>

          {/* Check Button */}
          <button
            onClick={checkStatus}
            disabled={checking}
            className="w-full bg-primary hover:bg-primaryHover px-5 py-3 rounded-lg font-semibold"
          >
            {checking ? "Checking..." : "Check Status"}
          </button>

          {/* Status Display */}
          {status && (
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-sm text-muted">Current Status:</p>
              <p className={`font-semibold mt-1 ${getStatusColor()}`}>
                {status}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {status && status !== "REVOKED" && status !== "NOT FOUND" && (
            <div className="flex gap-4">

              <button
                onClick={() => updateStatus("suspend")}
                disabled={!canSuspend || loading}
                className={`flex-1 px-5 py-3 rounded-lg font-semibold ${
                  canSuspend
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Suspend
              </button>

              <button
                onClick={() => updateStatus("revoke")}
                disabled={!canRevoke || loading}
                className={`flex-1 px-5 py-3 rounded-lg font-semibold ${
                  canRevoke
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Revoke
              </button>

            </div>
          )}

          {/* Success */}
          {message && (
            <div className="bg-green-900/30 border border-success p-4 rounded-lg">
              <p className="text-success font-semibold">
                ✅ {message}
              </p>
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