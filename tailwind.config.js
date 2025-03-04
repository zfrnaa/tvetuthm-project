/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./components/ui/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        geistSansRegular: ["GeistSans-Regular", "sans-serif"],
        geistSansMedium: ["GeistSans-Medium", "sans-serif"],
        geistSansBold: ["GeistSans-Bold", "sans-serif"],
        geistMonoLight: ["GeistMono-Light", "sans-serif"],
        geistMonoRegular: ["GeistMono-Regular", "sans-serif"],
        geistMonoMedium: ["GeistMono-Medium", "sans-serif"],
        geistMonoBold: ["GeistMono-Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
}
