export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-card/80 backdrop-blur-lg border border-slate-700 rounded-2xl p-6 shadow-xl ${className}`}
    >
      {children}
    </div>
  )
}