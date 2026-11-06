/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        airtel: {
          red:       '#ED1C24',
          'red-hover': '#D41920',
          'red-light': '#FEE8E9',
          charcoal:  '#2D2D2D',
          slate:     '#6B7280',
          muted:     '#9CA3AF',
          border:    '#E5E7EB',
          surface:   '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
}