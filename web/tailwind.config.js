/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lunar: {
          950: '#06080d',
          900: '#0b0f17',
          850: '#101622',
          800: '#172033',
          700: '#26344f',
          600: '#3d4f73',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        sun: {
          DEFAULT: '#F59E0B',
          glow: '#FBBF24',
          dark: '#B45309',
          surface: '#78350F'
        },
        earth: {
          DEFAULT: '#06B6D4',
          glow: '#38BDF8',
          dark: '#0369A1',
          surface: '#082F49'
        },
        overlap: {
          DEFAULT: '#10B981',
          glow: '#34D399',
          dark: '#047857'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
