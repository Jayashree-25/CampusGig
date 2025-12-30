/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ye line check karo, it covers everything under src
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: '#22d3ee',
        }
      }
    },
  },
  plugins: [],
}