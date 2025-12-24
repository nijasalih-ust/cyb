/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
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
          bg: "rgb(var(--bg-primary) / <alpha-value>)", 
          card: "rgb(var(--bg-secondary) / <alpha-value>)",
          input: "rgb(var(--bg-tertiary) / <alpha-value>)",
          border: "rgb(var(--border-color) / <alpha-value>)",
          
          text: {
            primary: "rgb(var(--text-primary) / <alpha-value>)",
            secondary: "rgb(var(--text-secondary) / <alpha-value>)",
            muted: "rgb(var(--text-muted) / <alpha-value>)",
          },
          
          purple: "rgb(var(--accent-purple) / <alpha-value>)",
          blue: "rgb(var(--accent-blue) / <alpha-value>)",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(var(--accent-purple), 0.35)",
        blueglow: "0 0 20px rgba(var(--accent-blue), 0.35)",
      },
    },
  },
  plugins: [],
};