/**
 * Framework Detection Service
 *
 * Detects the framework and package manager used in a GitHub repository
 * by analyzing lockfiles and package.json dependencies.
 */

import { getInstallationAccessToken } from "./github-app-auth"
import { githubApiRequest } from "./github-api.service"

export type FrameworkPreset = {
  framework: string // 'nextjs', 'vite', 'remix', 'astro', 'vue', 'angular', 'svelte', 'unknown'
  packageManager: string // 'npm', 'pnpm', 'yarn', 'bun'
  installCommand: string // 'pnpm install', etc.
  startCommand: string // 'pnpm dev', etc.
  workingDirectory: string // '/' by default
  isMonorepo?: boolean // Whether this is a monorepo (Turborepo, etc.)
}

// Framework detection rules based on dependencies
const FRAMEWORK_RULES: Array<{
  packages: string[]
  framework: string
  startCommand?: string // Override for specific frameworks
}> = [
  { packages: ["next"], framework: "nextjs" },
  { packages: ["vite"], framework: "vite" },
  { packages: ["@remix-run/react", "@remix-run/node"], framework: "remix" },
  { packages: ["astro"], framework: "astro" },
  { packages: ["nuxt", "nuxt3"], framework: "nuxt" },
  { packages: ["vue"], framework: "vue" },
  {
    packages: ["@angular/core"],
    framework: "angular",
    startCommand: "ng serve",
  },
  { packages: ["@sveltejs/kit"], framework: "sveltekit" },
  { packages: ["svelte"], framework: "svelte" },
  { packages: ["gatsby"], framework: "gatsby" },
  { packages: ["solid-js"], framework: "solid" },
  { packages: ["qwik", "@builder.io/qwik"], framework: "qwik" },
]

// Lockfile to package manager mapping
const LOCKFILE_MAP: Record<string, string> = {
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "yarn",
  "bun.lockb": "bun",
  "package-lock.json": "npm",
}

// Package manager specific commands
function getCommands(packageManager: string): {
  install: string
  dev: string
} {
  switch (packageManager) {
    case "pnpm":
      return { install: "pnpm install", dev: "pnpm dev" }
    case "yarn":
      return { install: "yarn", dev: "yarn dev" }
    case "bun":
      return { install: "bun install", dev: "bun dev" }
    default:
      return { install: "npm install", dev: "npm run dev" }
  }
}

/**
 * Check if a file exists in the repository
 */
async function fileExists(
  repository: string,
  filePath: string,
  accessToken: string,
): Promise<boolean> {
  try {
    const url = `https://api.github.com/repos/${repository}/contents/${filePath}`
    await githubApiRequest(url, accessToken, "21st-dev-framework-detect")
    return true
  } catch {
    return false
  }
}

/**
 * Get file content from repository
 */
async function getFileContent(
  repository: string,
  filePath: string,
  accessToken: string,
): Promise<string | null> {
  try {
    const url = `https://api.github.com/repos/${repository}/contents/${filePath}`
    const data = await githubApiRequest<{
      content?: string
      encoding?: string
      type?: string
    }>(url, accessToken, "21st-dev-framework-detect")

    if (data.type === "file" && data.encoding === "base64" && data.content) {
      return Buffer.from(data.content, "base64").toString("utf-8")
    }
    return null
  } catch {
    return null
  }
}

/**
 * Detect package manager by checking lockfiles
 * Always checks root first (for monorepos), then working directory
 */
async function detectPackageManager(
  repository: string,
  accessToken: string,
  workingDirectory: string = "/",
): Promise<string> {
  // Always check root first (monorepos have lockfile in root)
  const rootChecks = await Promise.all(
    Object.entries(LOCKFILE_MAP).map(async ([lockfile, pm]) => {
      const exists = await fileExists(repository, lockfile, accessToken)
      return { lockfile, pm, exists }
    }),
  )

  const foundInRoot = rootChecks.find((c) => c.exists)
  if (foundInRoot) {
    return foundInRoot.pm
  }

  // If not in root and working directory is different, check there too
  if (workingDirectory !== "/") {
    const basePath = workingDirectory.replace(/^\//, "")
    const prefix = `${basePath}/`

    const checks = await Promise.all(
      Object.entries(LOCKFILE_MAP).map(async ([lockfile, pm]) => {
        const exists = await fileExists(
          repository,
          `${prefix}${lockfile}`,
          accessToken,
        )
        return { lockfile, pm, exists }
      }),
    )

    const found = checks.find((c) => c.exists)
    if (found) {
      return found.pm
    }
  }

  return "npm"
}

/**
 * Detect framework from package.json dependencies
 */
function detectFrameworkFromPackageJson(packageJson: {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}): { framework: string; startCommand?: string } {
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  }

  for (const rule of FRAMEWORK_RULES) {
    const hasFramework = rule.packages.some((pkg) => pkg in allDeps)
    if (hasFramework) {
      return {
        framework: rule.framework,
        startCommand: rule.startCommand,
      }
    }
  }

  return { framework: "unknown" }
}

/**
 * Detect working directory by finding package.json location
 * For monorepos, finds the actual app directory (not root with turbo)
 * Returns both the working directory and whether it's a monorepo
 */
async function detectWorkingDirectory(
  repository: string,
  accessToken: string,
): Promise<{ workingDirectory: string; isMonorepo: boolean }> {
  // First check if this is a monorepo by looking for turbo.json or workspaces
  const [turboExists, rootPackageJson] = await Promise.all([
    fileExists(repository, "turbo.json", accessToken),
    getFileContent(repository, "package.json", accessToken),
  ])

  let isMonorepo = turboExists

  if (rootPackageJson) {
    try {
      const pkg = JSON.parse(rootPackageJson)
      // Check for workspaces field (npm/yarn workspaces or pnpm workspaces)
      if (pkg.workspaces || pkg.pnpm?.overrides) {
        isMonorepo = true
      }
    } catch {
      // Invalid JSON
    }
  }

  // If it's a monorepo, check common app locations first
  if (isMonorepo) {
    const monorepoAppPaths = [
      "apps/web",
      "apps/app",
      "apps/frontend",
      "packages/web",
      "packages/app",
    ]

    // Check all monorepo paths in parallel
    const results = await Promise.all(
      monorepoAppPaths.map(async (path) => {
        const content = await getFileContent(
          repository,
          `${path}/package.json`,
          accessToken,
        )
        if (content) {
          try {
            const pkg = JSON.parse(content)
            // Check if this is a real app with a framework
            const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }
            const hasFramework = FRAMEWORK_RULES.some((rule) =>
              rule.packages.some((p) => p in allDeps),
            )
            if (hasFramework && (pkg.scripts?.dev || pkg.scripts?.start)) {
              return { path, pkg, hasFramework: true }
            }
          } catch {
            // Invalid JSON
          }
        }
        return null
      }),
    )

    // Return the first found app with a framework
    const foundApp = results.find((r) => r?.hasFramework)
    if (foundApp) {
      return { workingDirectory: `/${foundApp.path}`, isMonorepo: true }
    }
  }

  // Not a monorepo or no app found - check root
  if (rootPackageJson) {
    try {
      const pkg = JSON.parse(rootPackageJson)
      if (pkg.scripts?.dev || pkg.scripts?.start) {
        return { workingDirectory: "/", isMonorepo }
      }
    } catch {
      // Invalid JSON
    }
  }

  return { workingDirectory: "/", isMonorepo }
}

/**
 * Main function to detect framework and package manager for a repository
 */
export async function detectFramework(
  installationId: string,
  repository: string,
): Promise<FrameworkPreset> {
  const accessToken = await getInstallationAccessToken(installationId)

  // First, detect working directory and monorepo status
  const { workingDirectory, isMonorepo } = await detectWorkingDirectory(
    repository,
    accessToken,
  )

  // Detect package manager from lockfiles
  const packageManager = await detectPackageManager(
    repository,
    accessToken,
    workingDirectory,
  )

  // Get package.json content
  const basePath =
    workingDirectory === "/" ? "" : workingDirectory.replace(/^\//, "")
  const packageJsonPath = basePath ? `${basePath}/package.json` : "package.json"
  const packageJsonContent = await getFileContent(
    repository,
    packageJsonPath,
    accessToken,
  )

  let framework = "unknown"
  let customStartCommand: string | undefined

  if (packageJsonContent) {
    try {
      const packageJson = JSON.parse(packageJsonContent)
      const detected = detectFrameworkFromPackageJson(packageJson)
      framework = detected.framework
      customStartCommand = detected.startCommand
    } catch {
      // Invalid JSON, use defaults
    }
  }

  // Get commands based on package manager
  const commands = getCommands(packageManager)

  return {
    framework,
    packageManager,
    installCommand: commands.install,
    startCommand: customStartCommand || commands.dev,
    workingDirectory,
    isMonorepo,
  }
}
