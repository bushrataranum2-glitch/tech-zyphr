/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: "#F8F9FD",
          surface: "#FFFFFF",
          card: "rgba(255, 255, 255, 0.85)",
          border: "#E2E8F0",
          lavender: "#F5F3FF",
          paleBlue: "#F0F7FF",
          lightCyan: "#E0F7FA",
          cream: "#FFFDF7",
          // Accents
          cyan: "#06B6D4",
          violet: "#8B5CF6",
          magenta: "#EC4899",
          gold: "#F59E0B",
          emerald: "#10B981",
          crimson: "#EF4444",
          // Dark Hero tones
          onyx: "#0F172A",
          slate: "#1E293B",
          charcoal: "#090D16"
        }
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        rpg: ["Rajdhani", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(112, 144, 176, 0.12)",
        glow: "0 0 25px rgba(6, 182, 212, 0.3)",
        goldGlow: "0 0 25px rgba(245, 158, 11, 0.3)",
        violetGlow: "0 0 25px rgba(139, 92, 246, 0.3)"
      }
    }
  },
  plugins: []
};
