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
        primary: {
          DEFAULT: '#0A84FF',
          dark: '#001F3F',
          light: '#5AB4FF'
        },
        accent: {
          DEFAULT: '#FFD60A',
          light: '#FFEB3B',
          dark: '#FFC107'
        },
        background: {
          dark: '#000814',
          darker: '#000000',
          card: '#001D3D'
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
        alt: ['Exo 2', 'sans-serif']
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #001F3F 0%, #000814 50%, #000000 100%)',
        'gradient-card': 'linear-gradient(135deg, #001D3D 0%, #001F3F 100%)',
        'gradient-primary': 'linear-gradient(135deg, #0A84FF 0%, #5AB4FF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FFD60A 0%, #FFEB3B 100%)'
      },
      boxShadow: {
        'glow': '0 0 20px rgba(10, 132, 255, 0.4)',
        'glow-accent': '0 0 20px rgba(255, 214, 10, 0.4)',
        'glow-lg': '0 0 40px rgba(10, 132, 255, 0.6)',
        'neon': '0 0 5px theme(colors.primary.DEFAULT), 0 0 20px theme(colors.primary.DEFAULT)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(10, 132, 255, 0.2), 0 0 10px rgba(10, 132, 255, 0.2)' },
          '100%': { boxShadow: '0 0 10px rgba(10, 132, 255, 0.4), 0 0 20px rgba(10, 132, 255, 0.4)' }
        }
      }
    },
  },
  plugins: [],
}
