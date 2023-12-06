/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1c1b19',
        lessDark: '#353530',
        gold: '#fcd462',
        white: '#fff',
      },
    },
  },
  plugins: [require("daisyui")],
}

