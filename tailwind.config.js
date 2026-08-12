import defaultTheme from 'tailwindcss/defaultTheme'

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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#38b0f8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
        purpleAcc: {
          500: '#8b5cf6',
          600: '#7c3aed',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'pulse-slow':    'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':         'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'wave':          'wave 1.5s ease-in-out infinite',
        'glow':          'glow 3s infinite alternate',
        'ping-slow':     'pingSlow 2s cubic-bezier(0,0,0.2,1) infinite',
        'slide-up':      'slideUp 0.35s ease-out forwards',
        'spin-slow':     'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        wave: {
          '0%, 100%': { height: '10px' },
          '50%': { height: '40px' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 15px rgba(14, 165, 233, 0.3)' },
          '100%': { boxShadow: '0 0 35px rgba(14, 165, 233, 0.8), 0 0 15px rgba(139, 92, 246, 0.5)' },
        },
        pingSlow: {
          '0%':   { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
