/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purr: {
          50:  '#fdf6f0',
          100: '#fbeadb',
          200: '#f5cfb2',
          300: '#efad82',
          400: '#e7864f',
          500: '#e16930',
          600: '#d35224',
          700: '#af3e1f',
          800: '#8c3320',
          900: '#722c1e',
          950: '#3d130c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
