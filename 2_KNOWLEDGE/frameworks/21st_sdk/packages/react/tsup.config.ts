import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "@ai-sdk/react", "ai"],
  noExternal: ["motion", "motion/react"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    }
  },
})
