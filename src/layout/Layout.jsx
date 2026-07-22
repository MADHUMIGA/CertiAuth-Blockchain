import Navbar from "./Navbar"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-600 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      <Navbar />

      <main className="relative z-10 pt-28 px-3 sm:px-6 lg:px-8 w-full">
        <div className="max-w-[1700px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}