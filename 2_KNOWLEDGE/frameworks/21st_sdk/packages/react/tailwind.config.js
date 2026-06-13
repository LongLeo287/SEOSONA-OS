/** @type {import('tailwindcss').Config} */

// Helper: wrap a CSS variable so Tailwind can apply opacity modifiers (bg-X/50, text-X/[0.06], etc.)
function withOpacity(varName) {
  return `color-mix(in srgb, var(${varName}) calc(<alpha-value> * 100%), transparent)`
}

export default {
  important: ".an-root",
  corePlugins: { preflight: false },
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: withOpacity("--an-background"),
        foreground: withOpacity("--an-foreground"),
        muted: {
          DEFAULT: withOpacity("--an-background-secondary"),
          foreground: withOpacity("--an-foreground-muted"),
        },
        accent: {
          DEFAULT: withOpacity("--an-background-secondary"),
          foreground: withOpacity("--an-foreground"),
        },
        border: withOpacity("--an-border-color"),
        destructive: { DEFAULT: "#ef4444", foreground: "#ffffff" },
        popover: {
          DEFAULT: withOpacity("--an-background"),
          foreground: withOpacity("--an-foreground"),
        },
      },
    },
  },
  plugins: [],
}
