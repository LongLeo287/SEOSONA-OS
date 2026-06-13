const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette")
const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/an-docs/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      "min-420": "420px",
      "min-720": "720px",
      "min-1280": "1280px",
      "min-1536": "1536px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem", // 16px на мобайле (в 2 раза меньше)
        sm: "2rem", // 32px на экранах ≥640px
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "Geist",
          "Geist Fallback",
          "Arial",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
        ],
        mono: ["var(--font-geist-mono)"],
        pixel: ["var(--font-geist-pixel-square)"],
        line: ["var(--font-geist-pixel-line)"],
        arial: ["Arial", "sans-serif"],
      },
      zIndex: {
        9999: "9999",
      },
      borderColor: {
        border: "hsl(var(--border))",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "tl-background": "hsl(var(--tl-background))",
        "plan-mode": {
          DEFAULT: "hsl(var(--plan-mode))",
          foreground: "hsl(var(--plan-mode-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        base: "0 0 0 1px hsl(var(--alpha-300)), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000)",
        "base/30":
          "0 0 0 1px hsl(var(--alpha-300) / 0.3), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000)",
        "canvas-border":
          "0 1px 2px 0 rgb(0 0 0 / 0.05), inset 0 0 0 0.5px rgba(255, 255, 255, 0.2), inset 0 0.5px 0 0 rgba(255, 255, 255, 0.3), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000)",
        "canvas-border-theme":
          "0 1px 2px 0 rgb(0 0 0 / 0.05), inset 0 0 0 0.5px var(--canvas-border-color), inset 0 0.5px 0 0 var(--canvas-border-highlight), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000)",
      },
      keyframes: {
        "pulse-custom": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.2)",
            opacity: "0.8",
          },
        },
        "ping-slow": {
          "75%, 100%": {
            transform: "scale(1.5)",
            opacity: "0",
          },
        },
        "scale-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.3)",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "success-pulse": {
          "0%": {
            opacity: 0,
          },
          "50%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
        "success-ring": {
          "0%": {
            outline: "2px solid hsl(var(--primary))",
            outlineOffset: "2px",
            opacity: "0",
          },
          "30%": {
            opacity: "1",
          },
          "100%": {
            outline: "2px solid hsl(var(--primary))",
            outlineOffset: "2px",
            opacity: "0",
          },
        },
        "copy-success": {
          "0%": {
            opacity: "0",
          },
          "15%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
        "border-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "star-movement-bottom": {
          "0%": { transform: "translate(0%, 0%)", opacity: "1" },
          "100%": { transform: "translate(-100%, 0%)", opacity: "0" },
        },
        "star-movement-top": {
          "0%": { transform: "translate(0%, 0%)", opacity: "1" },
          "100%": { transform: "translate(100%, 0%)", opacity: "0" },
        },
        "shine-pulse": {
          "0%": { "background-position": "0% 0%" },
          "50%": { "background-position": "100% 100%" },
          "100%": { "background-position": "0% 0%" },
        },
        "text-shimmer": {
          "0%": { "background-position": "100% center" },
          "100%": { "background-position": "0% center" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast":
          "pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s",
        aurora: "aurora 60s linear infinite",
        "shimmer-slide":
          "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        "success-ring": "success-ring 850ms ease-out forwards",
        "copy-success": "copy-success 1000ms ease-out forwards",
        "ping-slow": "ping-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scale-pulse": "scale-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "border-rotate": "border-rotate var(--duration) linear infinite",
        "star-movement-bottom":
          "star-movement-bottom linear infinite alternate",
        "star-movement-top": "star-movement-top linear infinite alternate",
        "text-shimmer": "text-shimmer 0.8s ease-out forwards",
      },
      backgroundImage: {
        "grid-white/[0.02]": `
          linear-gradient(to right, rgb(255 255 255 / 0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(255 255 255 / 0.02) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        grid: "30px 30px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    plugin(function ({ addUtilities, addVariant, addBase }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".shadow-text": {
          "text-shadow":
            "0 0 16px rgba(255, 255, 255, 0.4), 0 2px 12px rgba(255, 255, 255, 0.3), 0 1px 6px rgba(255, 255, 255, 0.5)",
        },
        ".dark .shadow-text": {
          "text-shadow":
            "0 0 16px rgba(0, 0, 0, 0.4), 0 2px 12px rgba(0, 0, 0, 0.3), 0 1px 6px rgba(0, 0, 0, 0.6)",
        },
      })

      // Add backdrop-filter fallbacks
      addUtilities({
        ".backdrop-filter-fallback": {
          "@supports not (backdrop-filter: blur(1px))": {
            "background-color": "rgba(var(--background), 0.95) !important",
          },
        },
      })

      // Add canvas border theme variables
      addBase({
        ":root": {
          "--canvas-border-color": "rgba(0, 0, 0, 0.1)",
          "--canvas-border-highlight": "rgba(0, 0, 0, 0.15)",
        },
        ".dark": {
          "--canvas-border-color": "rgba(255, 255, 255, 0.2)",
          "--canvas-border-highlight": "rgba(255, 255, 255, 0.3)",
        },
      })

      // Add supports variant for backdrop-filter
      addVariant(
        "supports-backdrop-filter",
        "@supports (backdrop-filter: blur(1px))",
      )
      addVariant(
        "no-backdrop-filter",
        "@supports not (backdrop-filter: blur(1px))",
      )
    }),
    addVariablesForColors,
  ],
}

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"))
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  )

  addBase({
    ":root": newVars,
  })
}
