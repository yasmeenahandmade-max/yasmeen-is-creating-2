import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Yasmeen Brand Palette — extracted from branding guide
        brand: {
          rose:      '#C4918A',  // dusty rose — primary accent
          blush:     '#EDDBD5',  // blush pink — soft backgrounds
          peach:     '#E8C5AD',  // peach — warm highlight
          sage:      '#C8CCAB',  // sage green — natural accent
          forest:    '#5B6E5D',  // forest green — deep contrast
          sky:       '#C5CDD8',  // light blue — cool accent
          charcoal:  '#4A4A4A',  // logo text color
          cream:     '#FAF8F5',  // off-white background
          white:     '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['Asterone', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
        arabic:  ['Tajawal', 'sans-serif'],
      },
      fontSize: {
        'hero':    ['4rem',   { lineHeight: '1.1', letterSpacing: '0.12em' }],
        'heading': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0.08em' }],
        'sub':     ['1.25rem',{ lineHeight: '1.5', letterSpacing: '0.06em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'brand': '2px', // sharp, minimal corners
      },
      boxShadow: {
        'soft':    '0 2px 20px rgba(196, 145, 138, 0.08)',
        'card':    '0 4px 30px rgba(74, 74, 74, 0.06)',
        'elevated':'0 8px 40px rgba(74, 74, 74, 0.10)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #FAF8F5 0%, #EDDBD5 100%)',
        'gradient-warm':  'linear-gradient(180deg, #FAF8F5 0%, #E8C5AD 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'slide-up':   'slideUp 0.6s ease-out forwards',
        'slide-in-r': 'slideInRight 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
