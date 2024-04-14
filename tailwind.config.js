/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { primary: '#fb7299' },
      width: {
        128: '32rem',
        144: '36rem',
        256: '64rem',
        512: '128rem',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      height: {
        128: '32rem',
        144: '36rem',
        256: '64rem',
        512: '128rem',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

      maxWidth: {
        128: '32rem',
        144: '36rem',
        256: '64rem',
        512: '128rem',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      maxHeight: {
        128: '32rem',
        144: '36rem',
        256: '64rem',
        512: '128rem',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },

  plugins: [],
}
