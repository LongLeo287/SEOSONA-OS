/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        // claudekit.cc coral/bronze palette
        background: '#0E0E0E',
        surface: '#1A1A1A',
        'surface-elevated': '#252525',
        primary: '#D97757',        // Coral
        'primary-hover': '#C66747',
        secondary: '#D4A27F',      // Bronze
        accent: '#E8A87C',
        border: '#2A2A2A',
        'border-strong': '#3A3A3A',
        foreground: '#FFFFFF',
        'foreground-secondary': '#A0A0A0',
        'foreground-muted': '#666666',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        'text-muted': '#666666',
      },
    },
  },
  plugins: [],
}
