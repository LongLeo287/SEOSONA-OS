const GO_MCP_PORT = 3210

type GoAgentManifest = {
  runtime: string
  model: string
  systemPrompt?: unknown
  permissionMode: string
  maxTurns: number
  maxBudgetUsd?: number
  maxSandboxBudgetUsd?: number
  sandbox?: {
    apt?: string[]
    build?: string[]
    setup?: string[]
    files?: Record<string, string>
    cwd?: string
  }
  tools?: Record<string, { description: string }>
}

function buildGoRuntimeBundle(manifest: GoAgentManifest): Buffer {
  const tools = Object.fromEntries(
    Object.entries(manifest.tools || {}).map(([name, tool]) => [
      name,
      { description: tool.description },
    ]),
  )

  const config = {
    _type: "agent",
    runtime: manifest.runtime,
    model: manifest.model,
    ...(manifest.systemPrompt !== undefined && { systemPrompt: manifest.systemPrompt }),
    permissionMode: manifest.permissionMode,
    maxTurns: manifest.maxTurns,
    ...(manifest.maxBudgetUsd !== undefined && { maxBudgetUsd: manifest.maxBudgetUsd }),
    ...(manifest.maxSandboxBudgetUsd !== undefined && { maxSandboxBudgetUsd: manifest.maxSandboxBudgetUsd }),
    ...(manifest.sandbox && {
      sandbox: {
        _type: "sandbox",
        ...manifest.sandbox,
      },
    }),
    tools,
    mcpBackend: {
      kind: "local-http",
      command: "/home/user/runtime/go-agent-mcp",
      args: [],
      cwd: "/home/user/runtime",
      port: GO_MCP_PORT,
      path: "/mcp",
      healthPath: "/healthz",
    },
  }

  return Buffer.from(`export default ${JSON.stringify(config, null, 2)}\n`)
}

async function readGoModulePath(): Promise<string> {
  const { existsSync, readFileSync } = await import("fs")

  if (!existsSync("go.mod")) {
    throw new Error("Go agents require a go.mod file in the current working directory.")
  }

  const content = readFileSync("go.mod", "utf8")
  const match = content.match(/^module\s+(\S+)/m)
  if (!match) {
    throw new Error("Failed to read Go module path from go.mod.")
  }

  return match[1]!.replace(/^"(.*)"$/, "$1")
}

async function assertGoEntrypointIsImportable(entryPoint: string): Promise<void> {
  const { readFileSync } = await import("fs")

  const content = readFileSync(entryPoint, "utf8")
  const match = content.match(/^\s*package\s+(\w+)/m)
  if (!match) {
    throw new Error(`Failed to read Go package declaration from ${entryPoint}.`)
  }

  if (match[1] === "main") {
    throw new Error(
      `Go agent entrypoint ${entryPoint} must be an importable package, not package main.\n` +
      `Export var Agent from agents/<slug>/index.go using a non-main package name.`,
    )
  }
}

function createGoWrapperSource(importPath: string, mode: "manifest" | "worker") {
  const runtimeImport = "github.com/21st-dev/agent-runtime-go/runtime"

  if (mode === "manifest") {
    return `package main

import (
  "log"
  "os"

  userpkg ${JSON.stringify(importPath)}
  agentruntime ${JSON.stringify(runtimeImport)}
)

func main() {
  if err := agentruntime.WriteManifest(os.Stdout, userpkg.Agent); err != nil {
    log.Fatal(err)
  }
}
`
  }

  return `package main

import (
  "log"

  userpkg ${JSON.stringify(importPath)}
  agentruntime ${JSON.stringify(runtimeImport)}
)

func main() {
  if err := agentruntime.ServeMCP(userpkg.Agent, agentruntime.ServeOptions{
    Host: "127.0.0.1",
    Port: ${GO_MCP_PORT},
  }); err != nil {
    log.Fatal(err)
  }
}
`
}

async function createArchiveFromDirectory(sourceDir: string): Promise<Buffer> {
  const { readFileSync, readdirSync, mkdtempSync, rmSync } = await import("fs")
  const { tmpdir } = await import("os")
  const { join } = await import("path")
  const { create: tarCreate } = await import("tar")

  const tempDir = mkdtempSync(join(tmpdir(), "agent-template-"))
  const archivePath = join(tempDir, "template.tar.gz")

  try {
    const entries = readdirSync(sourceDir)
    await tarCreate({
      cwd: sourceDir,
      file: archivePath,
      gzip: true,
      portable: true,
    }, entries)

    return readFileSync(archivePath)
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
}

export async function buildGoAgent(entryPoint: string): Promise<{
  bundle: Buffer
  templateArchive: Buffer
}> {
  const { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } =
    await import("fs")
  const { execFileSync } = await import("child_process")
  const { tmpdir } = await import("os")
  const { dirname, join, relative, resolve } = await import("path")
  const { fileURLToPath } = await import("url")

  const projectRoot = process.cwd()
  await assertGoEntrypointIsImportable(entryPoint)
  const modulePath = await readGoModulePath()
  const entryDir = dirname(entryPoint)
  const importPath = [
    modulePath.replace(/\/$/, ""),
    relative(projectRoot, entryDir).replace(/\\/g, "/"),
  ].filter(Boolean).join("/")

  const tempDir = mkdtempSync(join(tmpdir(), "go-agent-build-"))
  const buildDir = join(tempDir, "build")
  mkdirSync(buildDir, { recursive: true })

  const manifestWrapperPath = join(buildDir, "manifest-main.go")
  const workerWrapperPath = join(buildDir, "worker-main.go")
  const buildGoModPath = join(buildDir, "go.mod")
  const vendoredRuntimeDir = join(buildDir, "agent-runtime-go")
  const vendoredSdkDir = join(buildDir, "21st-sdk-go")
  const binaryPath = join(tempDir, "go-agent-mcp-linux-amd64")
  const archiveRoot = join(tempDir, "archive")
  const runtimeDir = join(archiveRoot, "runtime")
  const templateDir = join(entryDir, "template")
  const cliSrcDir = dirname(fileURLToPath(import.meta.url))
  const runtimeSourceDir = resolve(cliSrcDir, "../../../agent-runtime/go-runtime")
  const sdkSourceDir = resolve(cliSrcDir, "../../golang-sdk")

  try {
    cpSync(runtimeSourceDir, vendoredRuntimeDir, { recursive: true })
    cpSync(sdkSourceDir, vendoredSdkDir, { recursive: true })

    writeFileSync(buildGoModPath, `module angoagentbuild

go 1.23.0

require (
  ${modulePath} v0.0.0
  github.com/21st-dev/21st-sdk-go v0.0.0
  github.com/21st-dev/agent-runtime-go v0.0.0
)

replace ${modulePath} => ${projectRoot}
replace github.com/21st-dev/21st-sdk-go => ./21st-sdk-go
replace github.com/21st-dev/agent-runtime-go => ./agent-runtime-go
`)
    writeFileSync(manifestWrapperPath, createGoWrapperSource(importPath, "manifest"))
    writeFileSync(workerWrapperPath, createGoWrapperSource(importPath, "worker"))

    execFileSync("go", ["mod", "tidy"], {
      cwd: buildDir,
      env: {
        ...process.env,
        GOWORK: "off",
      },
      stdio: "pipe",
    })

    const manifestRaw = execFileSync("go", ["run", "./manifest-main.go"], {
      cwd: buildDir,
      env: {
        ...process.env,
        GOWORK: "off",
      },
      encoding: "utf8",
    })
    const manifest = JSON.parse(manifestRaw) as GoAgentManifest

    execFileSync("go", ["build", "-o", binaryPath, "./worker-main.go"], {
      cwd: buildDir,
      env: {
        ...process.env,
        CGO_ENABLED: "0",
        GOOS: "linux",
        GOARCH: "amd64",
        GOWORK: "off",
      },
      stdio: "pipe",
    })

    mkdirSync(runtimeDir, { recursive: true })

    if (existsSync(templateDir)) {
      for (const entry of readdirSync(templateDir)) {
        cpSync(join(templateDir, entry), join(archiveRoot, entry), { recursive: true })
      }
    }

    const launcherPath = join(runtimeDir, "go-agent-mcp")
    const manifestPath = join(runtimeDir, "agent-manifest.json")
    const packagedBinaryPath = join(runtimeDir, "go-agent-mcp-linux-amd64")

    writeFileSync(
      launcherPath,
      "#!/bin/sh\nexec /home/user/runtime/go-agent-mcp-linux-amd64 \"$@\"\n",
    )
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
    writeFileSync(packagedBinaryPath, readFileSync(binaryPath))
    chmodSync(launcherPath, 0o755)
    chmodSync(packagedBinaryPath, 0o755)

    return {
      bundle: buildGoRuntimeBundle(manifest),
      templateArchive: await createArchiveFromDirectory(archiveRoot),
    }
  } catch (error: any) {
    const details = error?.stderr?.toString?.() || error?.stdout?.toString?.() || error?.message || String(error)
    const hint = details.includes('command not found') || details.includes('executable file not found')
      ? "\nInstall Go locally and try again."
      : ""
    throw new Error(`Failed to build Go agent at ${entryPoint}:\n${details}${hint}`)
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
}
