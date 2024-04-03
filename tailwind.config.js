/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { primary: '#fb7299' },
      width: {
        128: '32rem',
        144: '36rem',
      },
      height: {
        128: '32rem',
        144: '36rem',
      },
    },
  },

  plugins: [],
}
