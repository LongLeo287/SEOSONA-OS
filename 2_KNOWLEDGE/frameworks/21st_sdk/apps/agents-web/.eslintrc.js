/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "@next/next/no-img-element": "off",
  },
  overrides: [
    {
      files: ["tailwind.config.js"],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
    // Warn about using Clerk's useAuth directly in agents/canvas sections
    // Desktop auth requires useCombinedAuth() instead
    {
      files: [
        "app/(alpha)/agents/**/*.{ts,tsx}",
        "app/agents/**/*.{ts,tsx}",
        "app/(alpha)/canvas/**/*.{ts,tsx}",
      ],
      rules: {
        "no-restricted-imports": [
          "warn",
          {
            paths: [
              {
                name: "@clerk/nextjs",
                importNames: ["useAuth"],
                message:
                  "Use useCombinedAuth() from '@/lib/hooks/use-combined-auth' instead for desktop auth support.",
              },
            ],
          },
        ],
      },
    },
  ],
}
