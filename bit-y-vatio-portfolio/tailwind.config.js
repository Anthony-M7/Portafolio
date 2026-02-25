/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background-dark": "#121212",
        "bit-cyan": "#00FFFF",
        "vatio-yellow": "#FFD700",
        "text-secondary": "#E0E0E0",
      },
      fontFamily: {
        "bit": ['"Roboto Mono"', "monospace"],
        "vatio": ['"Russo One"', "sans-serif"],
      }
    },
  },
  plugins: [],
}