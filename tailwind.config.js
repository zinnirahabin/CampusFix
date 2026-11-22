/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        uniten: {
          blue: '#174D91',
          blueDark: '#0E3666',
          blueLight: '#205CA8',
          blueTint: '#EBF2FA',
          red: '#E9432B',
          redDark: '#C7321C',
          redLight: '#FCECE9',
          grey: '#F3F5F8',
          dark: '#1F2937',
          muted: '#64748B',
        },
        brand: {
          50: '#ebf2fa',
          100: '#d7e5f5',
          200: '#afcceb',
          300: '#87b2e1',
          400: '#4f8ed1',
          500: '#174D91', // UNITEN Primary Blue
          600: '#154582',
          700: '#11396b',
          800: '#0e2d54',
          900: '#0a223e',
          950: '#061528',
        }
      }
    },
  },
  plugins: [],
}
