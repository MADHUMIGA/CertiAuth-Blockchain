import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import Card from "../components/ui/Card";

export default function UniversityHome() {
  const navigate = useNavigate();
  const { account, isAuthorized, connectWallet } = useWallet();

  // Wallet Guard
  if (!account) {
    return (
      <Card className="text-2xl text-center space-y-4">
        <p>Connect university wallet to continue</p>
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
          This wallet is not authorized.
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h2 className="text-5xl font-bold">University Panel</h2>

      <div className="grid md:grid-cols-2 gap-6">

        <Card>
          <h3 className="text-3xl font-semibold mb-3">
            Issue Certificate
          </h3>
          <p className="text-lg text-muted mb-5">
            Issue new blockchain-backed certificate.
          </p>
          <button
            onClick={() => navigate("/issue")}
            className="text-xl bg-primary hover:bg-primaryHover transition px-5 py-2 rounded-lg"
          >
            Go to Issue
          </button>
        </Card>

        <Card>
          <h3 className="text-3xl font-semibold mb-3">
            View Certificates
          </h3>
          <p className="text-lg text-muted mb-5">
            View all issued certificates and manage status.
          </p>
          <button
            onClick={() => navigate("/certificates")}
            className="text-xl bg-primary hover:bg-primaryHover transition px-5 py-2 rounded-lg"
          >
            View Certificates
          </button>
        </Card>

      </div>
    </div>
  );
}