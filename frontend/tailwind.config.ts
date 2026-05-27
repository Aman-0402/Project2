import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F8F4EC',
          50: '#FDFCF8',
          100: '#F8F4EC',
          200: '#F0E8D4',
        },
        gold: {
          DEFAULT: '#B08D57',
          light: '#C9A96E',
          dark: '#8C6D3F',
        },
        brown: {
          DEFAULT: '#4A3428',
          light: '#6B4C3B',
          dark: '#2E1F17',
        },
        beige: {
          DEFAULT: '#E8DED1',
          light: '#F2EDE4',
          dark: '#D4C4B0',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #F8F4EC 0%, #E8DED1 50%, #F8F4EC 100%)',
        'gold-gradient': 'linear-gradient(135deg, #B08D57 0%, #C9A96E 50%, #8C6D3F 100%)',
        'dark-gradient': 'linear-gradient(180deg, #2E1F17 0%, #4A3428 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      letterSpacing: {
        'luxury': '0.2em',
        'wide-luxury': '0.3em',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config
