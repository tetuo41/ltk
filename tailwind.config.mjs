/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // LTK Team colors
        precision: '#0596aa',
        domination: '#ff4444', 
        sorcery: '#8a2be2',
        resolve: '#228b22',
        // ZETA-inspired modern theme colors
        primary: '#ffffff',        // Clean white background
        secondary: '#f8f9fa',      // Light gray background
        tertiary: '#e9ecef',       // Subtle gray for borders
        dark: '#212529',           // Dark text
        accent: '#ceff00',         // ZETA neon green/yellow
        'accent-hover': '#b8e600', // Darker accent for hover states
        gold: '#ffd700',           // Keep for tournament elements
        silver: '#6c757d',         // Muted gray text
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'japanese': ['Noto Sans JP', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}