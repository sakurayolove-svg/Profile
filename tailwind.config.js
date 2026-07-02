/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#224b8d',
        secondary: '#64748b',
        background: '#ffffff',
        surface: '#ffffff',
        text: '#494e52',
        'text-light': '#7a8288',
        border: '#f2f3f3',
      },
      fontFamily: {
        sans: ['"Trebuchet MS"', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 1px rgba(0,0,0,0.125)',
      }
    },
  },
  plugins: [],
}
