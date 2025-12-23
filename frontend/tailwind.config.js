// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",   // all React/Vite files
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        cyber: {
          bg: "#0B0F1A",        // main background
          card: "#12182A",      // cards / panels
          border: "#1E2645",
          purple: "#7C3AED",   // primary accent
          blue: "#38BDF8",     // secondary accent
          neon: "#A78BFA",
          text: "#E5E7EB",
          muted: "#9CA3AF",
        },
        // Optional aliases for easier usage
        'cyber-bg': '#0a0a23',
        'cyber-card': '#11112a',
        'cyber-border': '#2f2f5f',
        'cyber-neon': '#8a2be2',
        'cyber-purple': '#a855f7',
        'cyber-blue': '#3b82f6',
        'cyber-muted': '#a1a1aa',
      },
      boxShadow: {
        glow: "0 0 25px rgba(124,58,237,0.35)",
        blueglow: "0 0 25px rgba(56,189,248,0.35)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
