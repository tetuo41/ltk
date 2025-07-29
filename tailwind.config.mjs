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
        // Soft, gentle color palette
        primary: '#fafbfc',        // Very light blue-gray background
        secondary: '#f1f4f8',      // Soft blue-gray secondary
        tertiary: '#e2e8f0',       // Light border color
        surface: '#ffffff',        // Pure white for cards
        dark: '#334155',           // Softer dark text
        'dark-light': '#64748b',   // Medium gray text
        accent: '#8b5cf6',         // Soft purple accent
        'accent-light': '#a78bfa', // Lighter purple
        'accent-hover': '#7c3aed', // Darker purple for hover
        success: '#10b981',        // Soft green
        'success-light': '#86efac',// Light green
        warning: '#f59e0b',        // Soft amber
        'warning-light': '#fcd34d',// Light amber
        danger: '#ef4444',         // Soft red
        'danger-light': '#fca5a5', // Light red
        gold: '#f59e0b',           // Softer gold
        silver: '#94a3b8',         // Softer gray text
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