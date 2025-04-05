/** @type {import('tailwindcss').Config} */
import { mtConfig } from "@material-tailwind/react";

module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./components/ui/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
    },
  },
  plugins: [mtConfig, tailwind-scrollbar],
}
