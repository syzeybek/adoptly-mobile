// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FF85A1',
          purple: '#9B5DE5',
          yellow: '#FEE440',
          cyan: '#00BBF9',
          green: '#00F5D4',
        },
      },
    },
  },
  plugins: [],
}
