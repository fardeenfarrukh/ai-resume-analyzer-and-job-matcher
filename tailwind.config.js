/** @type {import('tailwindcss').Config} */
export default {
  // Files to scan for Tailwind classes.
  content: [
    "./index.html",
    "./{App,index}.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  // Enable dark mode using a class.
  darkMode: 'class',

  theme: {
    extend: {
      // Custom font family.
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      // Custom color palette for dark and light themes.
      colors: {
        // Dark Theme (Celeste)
        'celeste-dark': '#1a1a2e',
        'celeste-deep-blue': '#1f224e',
        'celeste-pink': '#ff69b4',
        'celeste-cyan': '#00ffff',
        'celeste-text': '#e0e0fc',
        'celeste-muted': '#9a9ae1',

        // Light Theme
        'celeste-light-bg': '#f0f2f5',
        'celeste-light-card': '#ffffff',
        'celeste-light-text': '#1a1a2e',
        'celeste-light-muted': '#5a5a7e',
      },

      // Custom animations.
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
      },

      // Keyframe definitions for custom animations.
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 105, 180, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(255, 105, 180, 0.8)' },
        }
      },
    },
  },
  // No custom plugins are currently used.
  plugins: [],
}