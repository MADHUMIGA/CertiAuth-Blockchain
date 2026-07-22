import { useEffect, useState } from "react";
import { api } from "../services/api";
import CertificateTable from "../components/CertificateTable";
import Card from "../components/ui/Card";
import { useWallet } from "../context/WalletContext";

export default function ViewCertificates() {
  const { account, isAuthorized } = useWallet();
  const [certificates, setCertificates] = useState([]);

  const loadCertificates = async () => {
    try {
      const data = await api.getAllCertificates();
      setCertificates(data.certificates || []);
    } catch (err) {
      console.error("Failed to load certificates", err);
    }
  };

  useEffect(() => {
    if (account && isAuthorized) {
      loadCertificates();
    }
  }, [account, isAuthorized]);

  if (!account || !isAuthorized) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-5xl font-bold">Issued Certificates</h2>

      <Card>
        <CertificateTable
          certificates={certificates}
          refresh={loadCertificates}
        />
      </Card>
    </div>
  );
}