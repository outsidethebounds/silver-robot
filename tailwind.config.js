/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f5',
          100: '#e0f0e7',
          200: '#b9ddc7',
          300: '#8ac2a3',
          400: '#56a077',
          500: '#37855b',
          600: '#296a48',
          700: '#23563b',
          800: '#1e4531',
          900: '#10251a',
        },
      },
    },
  },
  plugins: [],
};
