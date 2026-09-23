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
        palmtree: {
          yellow: '#fee000',
          yellowHover: '#f5d600',
          yellowLight: '#fffde6',
          dark: '#1d1d1d',
          darkMuted: '#333333',
          green: '#108474',
          greenHover: '#0c695c',
          greenLight: '#e6f4f1',
          gold: '#d4af37',
          gray: {
            50: '#fbfbfb',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121'
          }
        },
        choco: {
          bg: {
            light: '#FFFFFF',
            dark: '#141414'
          },
          surface: {
            light: '#FBFBFB',
            dark: '#1F1F1F'
          },
          border: {
            light: '#E5E7EB',
            dark: '#2E2E2E'
          },
          text: {
            primary: {
              light: '#1D1D1D',
              dark: '#F5F5F5'
            },
            secondary: {
              light: '#616161',
              dark: '#B0B0B0'
            }
          },
          accent: {
            DEFAULT: '#1D1D1D',
            hover: '#333333',
            light: '#F5F5F5',
            dark: '#fee000'
          },
          status: {
            success: '#108474',
            warning: '#f59e0b',
            error: '#ef4444'
          }
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'Noto Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'Noto Sans', 'serif'],
        heading: ['DM Sans', 'Noto Sans', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'palm-card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'palm-card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'palm-glow': '0 0 20px rgba(254, 224, 0, 0.4)'
      },
      borderRadius: {
        'card': '12px',
        'button': '9999px',
        'input': '8px'
      }
    },
  },
  plugins: [],
}
