/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1a1f2e',
          900: '#0f1419',
          950: '#0a0d12',
        },
        gold: {
          50: '#fdfbf7',
          100: '#f9f5ed',
          200: '#f1e8d6',
          300: '#e8d9bc',
          400: '#d4bb8a',
          500: '#c19d58',
          600: '#a37f3f',
          700: '#856632',
          800: '#6b522a',
          900: '#594426',
        },
        platinum: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elegant-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elegant-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-elegant': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'splash-zoom': 'splashZoom 5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'splash-fade-out': 'splashFadeOut 0.5s ease-in-out 5s forwards',
        'splash-glow': 'splashGlow 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        splashZoom: {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0',
            filter: 'blur(10px)',
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: '1',
            filter: 'blur(0px)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
            filter: 'blur(0px)',
          },
        },
        splashFadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0', visibility: 'hidden' },
        },
        splashGlow: {
          '0%, 100%': {
            transform: 'scale(0.8)',
            opacity: '0.2',
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: '0.4',
          },
        },
      },
    },
  },
  plugins: [],
}
