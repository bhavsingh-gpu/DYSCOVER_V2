/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        lexend: ['Lexend', 'system-ui', 'sans-serif']
      },
      colors: {
        cream: '#FDFBD4',
        dysGray: '#898989',
        ink: '#30343F',
        softSlate: '#4A4F63',
        accent: '#FF8A4A',
        accentSoft: '#FFE0C7'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      }
    }
  },
  plugins: []
};


