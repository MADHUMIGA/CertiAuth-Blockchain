import { Link, useLocation } from "react-router-dom"
import { useWallet } from "../context/WalletContext"

export default function Navbar() {
    const location = useLocation()
    const { account, connectWallet } = useWallet()

    
    const navItem = (path, label) => (
        <Link
            to={path}
            className={`px-4 py-2 rounded-lg text-lg font-medium transition-all duration-300 ${location.pathname === path
                    ? "bg-primary text-white shadow-glow"
                    : "text-muted hover:text-white hover:bg-slate-700"
                }`}
        >
            {label}
        </Link>
    )

    return (
        <div className="fixed top-0 w-full z-50 backdrop-blur-lg bg-background/80 border-b border-slate-800">
            <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="text-3xl">{'\u{1F393}'}</div>
                    <h1 className="text-2xl font-bold tracking-wide">CertiAuth</h1>
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                    {navItem("/", "Dashboard")}
                    {navItem("/issue", "Issue Certificate")}
                    {navItem("/verify", "Verify Certificate")}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* <span className="text-xs px-3 py-1 bg-slate-700 rounded-full text-muted">
                        Hardhat Network
                    </span> */}

                    <span
                        // onClick={connectWallet}
                        className="bg-primary hover:bg-primaryHover transition px-4 py-2 rounded-lg text-base font-semibold shadow-glow"
                    >
                        {account
                            ? `${account.slice(0, 6)}...${account.slice(-4)}`
                            : "Wallet"}
                    </span>
                </div>
            </div>
        </div>
    )
}