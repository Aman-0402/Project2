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
          DEFAULT: '#F6F1EA',   // Primary Background
          50:  '#FDFCFA',
          100: '#F6F1EA',
          200: '#EDE4D5',
        },
        gold: {
          DEFAULT: '#C6A062',   // Luxury Gold
          light:   '#D4AE74',
          dark:    '#A07240',
        },
        brown: {
          DEFAULT: '#2A1610',   // Deep Chocolate
          light:   '#4A2A1C',
          dark:    '#1E1008',
          deeper:  '#140B08',   // Rich Espresso
        },
        beige: {
          DEFAULT: '#E9D8BE',   // Soft Champagne
          light:   '#F2E6CE',
          dark:    '#D0BC9A',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #F5EFE7 0%, #E9DED1 50%, #F5EFE7 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C6A16E 0%, #D4AF7F 50%, #A07848 100%)',
        'dark-gradient': 'linear-gradient(135deg, #2A1812 0%, #3B2419 60%, #4A2D20 100%)',
        'depth-gradient': 'linear-gradient(180deg, #1C0F0A 0%, #2A1812 40%, #3B2419 100%)',
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
