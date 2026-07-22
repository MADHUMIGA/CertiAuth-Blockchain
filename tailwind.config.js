/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // slate-900 base
        card: "#1e293b",       // slate-800
        primary: "#4f46e5",    // indigo-600
        primaryHover: "#4338ca",
        success: "#22c55e",
        danger: "#ef4444",
        muted: "#94a3b8"
      },
      boxShadow: {
        glow: "0 0 20px rgba(79,70,229,0.35)"
      }
    },
  },
  plugins: [],
}