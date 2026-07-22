import { useNavigate } from "react-router-dom"
import Card from "../components/ui/Card"
import { useEffect, useState } from "react"
import { api } from "../services/api"
import CertificateTable from "../components/CertificateTable"

export default function Dashboard() {
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState([])

  const loadCertificates = async () => {
    try {
      const data = await api.getAllCertificates()
      setCertificates(data.certificates || [])
    } catch (err) {
      console.error("Failed to load certificates", err)
    }
  }

  useEffect(() => {
    loadCertificates()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold mb-2">
          Certificate Authentication
        </h2>
        <p className="text-xl text-muted">
          Blockchain-based secure certificate issuance and verification.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <Card>
          <h3 className="text-3xl font-semibold mb-3">
            🎓 For Universities
          </h3>
          <p className="text-lg text-muted mb-5">
            Issue tamper-proof certificates stored securely on blockchain.
          </p>
          <button
            onClick={() => navigate("/university")}
            className=" text-xl bg-primary hover:bg-primaryHover transition px-5 py-2 rounded-lg shadow-glow"
          >
            Start Issuing
          </button>
        </Card>

        <Card>
          <h3 className="text-3xl font-semibold mb-3">
            🏢 For Companies
          </h3>
          <p className="text-lg text-muted mb-5">
            Instantly verify certificates using blockchain hash comparison.
          </p>
          <button
            onClick={() => navigate("/verify")}
            className="text-xl bg-primary hover:bg-primaryHover transition px-5 py-2 rounded-lg shadow-glow"
          >
            Start Verification
          </button>
        </Card>
        {/* {certificates.length > 0 && (
          <Card>
            <h3 className="text-3xl font-semibold mb-4">
              📜 Issued Certificates
            </h3>

            <CertificateTable
              certificates={certificates}
              refresh={loadCertificates}
            />
          </Card>
        )} */}

      </div>
    </div>
  )
}