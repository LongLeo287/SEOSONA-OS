import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"
import { tmpdir } from "os"
import { fileURLToPath } from "url"
import NextBundleAnalyzer from "@next/bundle-analyzer"
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin"

// Create e2b webpack loader in a temp directory so it works on Vercel too.
// Patches e2b's `import(variable)` to use native import() instead of webpack's
// __webpack_require__, which can't resolve dynamic import(variable) at runtime.
const e2bLoaderDir = join(tmpdir(), "e2b-webpack-loader")
mkdirSync(e2bLoaderDir, { recursive: true })
const e2bLoaderPath = join(e2bLoaderDir, "loader.cjs")
writeFileSync(
  e2bLoaderPath,
  `module.exports = function(source) {
  return source.replace(
    /return\\s+await\\s+import\\((\\w+)\\)/g,
    "return await import(/* webpackIgnore: true */ $1)"
  )
}
`,
)

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const tracingRoot = fileURLToPath(new URL("../..", import.meta.url))
const agentsWebAssetUrl = process.env.NEXT_PUBLIC_AGENTS_WEB_URL?.replace(
  /\/$/,
  "",
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  assetPrefix: agentsWebAssetUrl || undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
    formats: ["image/webp"],
    minimumCacheTTL: 365 * 24 * 3600, // 1 year, default is 1 min.
    // imageSizes: [], // Default: [16, 32, 48, 64, 96, 128, 256, 384]
    // deviceSizes: [], // Default: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
    // Default: qualities: [25, 50, 75],
  },
  reactStrictMode: false,
  transpilePackages: ["ui", "@21st-sdk/react"],
  webpack: (config, { isServer, dev }) => {
    // Throttle file watching to reduce HMR spam when code agents make rapid changes
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        aggregateTimeout: 300, // Wait 300ms after last change before rebuilding
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/logs/**',
        ],
      }
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    } else {
      config.plugins = [...config.plugins, new PrismaPlugin()]
      // Patch e2b's dynamicImport() to use native import() instead of webpack's
      // __webpack_require__, which can't resolve import(variable) at runtime.
      config.module.rules.push({
        test: /[\\/]node_modules[\\/]e2b[\\/]dist[\\/]index\.(m?js)$/,
        enforce: 'post',
        use: [e2bLoaderPath],
      })
    }

    config.ignoreWarnings = [
      /Package @smithy\/.* can't be external/,
      /The request @smithy\/.* matches serverExternalPackages/,
      /Packages that should be external need to be installed/,
      /Try to install it into the project directory/,
      /Package prettier can't be external/,
      /The request prettier\/.* matches serverExternalPackages/,
    ]

    return config
  },
  async redirects() {
    return [
      {
        source: "/agents/mcps",
        destination: "/agents/vaults",
        permanent: true,
      },
      {
        source: "/agents/mcps/:path*",
        destination: "/agents/vaults/:path*",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/community/blog",
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: "/community/blog/:path*",
        permanent: true,
      },
      {
        source: "/s/:slug",
        destination: "/community/components/s/:slug",
        permanent: true,
      },
      {
        source: "/c/:slug",
        destination: "/community/components/c/:slug",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/canvas/homepage",
        destination: "https://21st-dev-waitlist.vercel.app/",
      },
      {
        source: "/waitlist-static/:path*",
        destination:
          "https://21st-dev-waitlist.vercel.app/waitlist-static/:path*",
      },
      {
        source: "/waitlist-assets/:path*",
        destination:
          "https://21st-dev-waitlist.vercel.app/waitlist-assets/:path*",
      },
      {
        source: "/waitlist-assets-original/:path*",
        destination:
          "https://21st-dev-waitlist.vercel.app/waitlist-assets-original/:path*",
      },
      {
        source: "/docs",
        destination: "https://21st-docs.vercel.app",
      },
      {
        source: "/docs/:path*",
        destination: "https://21st-docs.vercel.app/docs/:path*",
      },
      {
        source: "/docs-static/_next/:path+",
        destination: `https://21st-docs.vercel.app/docs-static/_next/:path+`,
      },
      {
        source: "/r/:path*",
        destination: "/api/r/:path*",
      },
    ]
  },
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  // Turbopack watch config (may help reduce HMR spam from rapid file changes)
  turbopack: {
    resolveAlias: {
      "@21st-sdk/react/styles.css": "@21st-sdk/react/dist/styles.css",
    },
    watchOptions: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/logs/**',
      ],
    },
  },
  outputFileTracingRoot: tracingRoot,
  outputFileTracingIncludes: {
    "/*": [
      "./lib/agent-templates/**/*",
    ],
  },
  outputFileTracingExcludes: {
    "*": [
      // Exclude local logs directory from serverless bundles
      "./logs/**",
      "./logs/variants/**",
      // Exclude electron and desktop app from serverless bundles
      "node_modules/.pnpm/electron*/**",
      "node_modules/.pnpm/@electron*/**",
      "node_modules/electron/**",
      "node_modules/@electron-toolkit/**",
      "**/apps/desktop/**",
    ],
  },
  serverExternalPackages: [
    "@smithy/*",
    "@aws-sdk/*",
    "util-stream",
    // Heavy packages excluded to reduce serverless function bundle size
    "playwright",
    "playwright-core",
    "sharp",
    "@img/sharp-libvips-linuxmusl-x64",
    "@img/sharp-libvips-linux-x64",
    "@img/sharp-linux-x64",
    "@img/sharp-linuxmusl-x64",
    "prettier",
    // CSS parsing (requires JSON files that don't bundle correctly)
    "css-tree",
    // Additional heavy packages
    "happy-dom",
    "shiki",
    "@shikijs/*",
    // Electron packages (should never be in web serverless functions)
    "electron",
    "electron-vite",
    "@electron-toolkit/*",
    "electron-builder",
    // htmltojsx and its dependencies (contain Node.js-only modules like sshpk/asn1)
    "htmltojsx",
    "jsdom-no-contextify",
    "request",
    "sshpk",
    // E2B dynamically imports these at runtime during template builds.
    "glob",
    "tar",
  ],
}

export default withBundleAnalyzer(nextConfig)
