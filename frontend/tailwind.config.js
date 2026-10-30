/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          lavender: '#E8DFFF',
          'lavender-dark': '#C9B8FF',
          blue: '#DCEBFA',
          'blue-dark': '#A3CCFA',
          pink: '#F9DDE8',
          'pink-dark': '#F0AEC9',
          mint: '#DDF3E4',
          'mint-dark': '#A8E3B9',
          cream: '#FFF9F0',
          dark: '#303047',
          muted: '#636380',
          light: '#F8FAFC',
          card: '#FFFFFF',
          border: '#EAEBF0'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'pastel': '0 4px 20px -2px rgba(48, 48, 71, 0.06), 0 2px 6px -1px rgba(48, 48, 71, 0.04)',
        'pastel-hover': '0 10px 25px -3px rgba(48, 48, 71, 0.1), 0 4px 10px -2px rgba(48, 48, 71, 0.05)',
        'pastel-inset': 'inset 0 2px 4px 0 rgba(48, 48, 71, 0.04)',
      }
    },
  },
  plugins: [],
}
