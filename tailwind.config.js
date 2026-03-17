/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — Fiery Terracotta as primary
        purr: {
          50:  '#fefef5',
          100: '#F2F3AE', // Vanilla Custard
          200: '#EDD382', // Light Gold
          300: '#F5C46A',
          400: '#FC9E4F', // Sandy Brown
          500: '#F4442E', // Fiery Terracotta  ← main brand
          600: '#d93520',
          700: '#b02818',
          800: '#7a1a0e',
          900: '#020122', // Prussian Blue
          950: '#010011',
        },
        // Override Tailwind orange → warm palette (subtle backgrounds & borders)
        orange: {
          50:  '#fefef5',
          100: '#F2F3AE', // Vanilla Custard
          200: '#EDD382', // Light Gold
          300: '#F5C46A',
          400: '#FC9E4F', // Sandy Brown
          500: '#F4442E', // Fiery Terracotta
          600: '#d93520',
          700: '#b02818',
          800: '#7a1a0e',
          900: '#020122', // Prussian Blue
          950: '#010011',
        },
      },
      fontFamily: {
        sans:    ['Comfortaa', 'system-ui', 'sans-serif'],
        display: ['Comfortaa', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
