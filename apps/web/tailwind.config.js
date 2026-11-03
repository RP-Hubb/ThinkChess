/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#0B0D13',
        surface: {
          subtle: '#131722',
          elevated: '#1A1F2E',
          card: '#151926',
        },
        border: {
          subtle: '#242B3D',
          strong: '#36415D',
        },
        accent: {
          emerald: '#10B981',
          sky: '#0284C7',
          amber: '#F59E0B',
          rose: '#EF4444',
          violet: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

