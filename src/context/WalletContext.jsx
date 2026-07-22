import { createContext, useContext, useEffect, useState } from "react";

const WalletContext = createContext();

// ✅ Only the imported Hardhat account is allowed
const AUTHORIZED_UNIVERSITY = "0xf39fd6e51aad88f6f4ce6ab8827279cfff b92266"
  .replace(/\s/g, "")
  .toLowerCase();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // ✅ Always start disconnected on reload
  useEffect(() => {
    setAccount(null);
    setIsAuthorized(false);
  }, []);

  // ✅ Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      console.log("accountsChanged event:", accounts);
      if (!accounts || accounts.length === 0) {
        setAccount(null);
        setIsAuthorized(false);
        return;
      }

      const selected = accounts[0].toLowerCase().trim();
      console.log("Selected account:", selected);

      if (selected === AUTHORIZED_UNIVERSITY) {
        setAccount(selected);
        setIsAuthorized(true);
      } else {
        setAccount(null);
        setIsAuthorized(false);
        // alert(
        //   "Wrong account selected! Please select the imported Hardhat university account."
        // );
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };
  }, []);

  // ✅ Connect wallet popup, force user to select
  const connectWallet = async () => {
    if (!window.ethereum) {
    //   alert("MetaMask not installed");
      return;
    }

    try {
      setIsConnecting(true);

      // Force account selection popup
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Accounts returned by request:", accounts);

      if (!accounts || accounts.length === 0) {
        setAccount(null);
        setIsAuthorized(false);
        return;
      }

      const selected = accounts[0].toLowerCase().trim();
      console.log("Selected account after connect:", selected);

      if (selected === AUTHORIZED_UNIVERSITY) {
        setAccount(selected);
        setIsAuthorized(true);
      } else {
        setAccount(null);
        setIsAuthorized(false);
        // alert(
        //   "Wrong account selected! Please select the imported Hardhat university account."
        // );
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setAccount(null);
      setIsAuthorized(false);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{ account, isAuthorized, connectWallet, isConnecting }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);