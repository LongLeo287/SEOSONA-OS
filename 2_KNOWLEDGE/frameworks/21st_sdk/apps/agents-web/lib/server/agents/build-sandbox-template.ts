import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import { basename, dirname, join } from "path"

export interface SandboxTemplateBuildConfig {
  teamId: string
  bundle: ArrayBuffer
  bundleHash: string
  templateArchive?: ArrayBuffer
  mcpConfig?: ArrayBuffer
  sandboxConfig?: {
    cpuCount?: number
    memoryMB?: number
    apt?: string[]
    build?: string[]
    files?: Record<string, string>
    cwd?: string
  } | null
  onProgress?: (message: string) => void
}

export interface SandboxTemplateBuildResult {
  templateId: string
  alias: string
  baseTemplateId: string
}

type SandboxCopyItem = {
  src: string
  dest: string
  forceUpload: true
}

function makeTemplateAlias(teamId: string, bundleHash: string): string {
  const teamPrefix = teamId.replace(/-/g, "").slice(0, 8)

  return `agent-${teamPrefix}-${bundleHash.slice(0, 8)}-${Date.now()}`
}

function getLogMessage(log: unknown): string | null {
  if (!log || typeof log !== "object") return null

  const message = (log as { message?: unknown }).message
  if (typeof message === "string" && message.length > 0) return message

  try {
    return JSON.stringify(log)
  } catch {
    return null
  }
}

function prepareTemplateArchive(
  tempDir: string,
  templateArchive: ArrayBuffer,
): string {
  const archivePath = join(tempDir, "template.tar.gz")

  writeFileSync(archivePath, new Uint8Array(templateArchive))
  return archivePath
}

function prepareBinaryFile(
  tempDir: string,
  filename: string,
  contents: ArrayBuffer,
): string {
  const filePath = join(tempDir, filename)

  writeFileSync(filePath, new Uint8Array(contents))
  return filePath
}

function prepareTextFile(
  tempDir: string,
  filename: string,
  contents: string,
): string {
  const filePath = join(tempDir, filename)

  writeFileSync(filePath, contents)
  return filePath
}

function getVaultProxyCaCertPem(): string | null {
  const cert = process.env.VAULT_PROXY_CA_CERT_PEM
  if (!cert) return null

  const normalized = `${cert.replace(/\\n/g, "\n").trim()}\n`
  if (!normalized.includes("-----BEGIN CERTIFICATE-----")) {
    throw new Error("VAULT_PROXY_CA_CERT_PEM must contain a PEM certificate")
  }

  return normalized
}

function prepareSandboxFiles(
  tempDir: string,
  files: Record<string, string>,
): SandboxCopyItem[] {
  const filesDir = join(tempDir, "sandbox-files")

  return Object.entries(files).map(([filePath, content], index) => {
    const itemDir = join(filesDir, String(index))
    const filename = basename(filePath)
    const destinationDir = dirname(filePath)

    mkdirSync(itemDir, { recursive: true })
    writeFileSync(join(itemDir, filename), content)

    return {
      src: join(itemDir, filename),
      dest: destinationDir === "." ? "/home/user/" : `${destinationDir}/`,
      forceUpload: true as const,
    }
  })
}

const INSTALL_VAULT_CA_CMD = `set -eu
mkdir -p /usr/local/share/ca-certificates /etc/vault-tls
cp /tmp/21st-vault.crt /usr/local/share/ca-certificates/21st-vault.crt
cp /tmp/21st-vault.crt /etc/vault-tls/ca.pem
if command -v update-ca-certificates >/dev/null 2>&1; then
  update-ca-certificates
fi
if [ -f /etc/ssl/certs/ca-certificates.crt ]; then
  cat /etc/ssl/certs/ca-certificates.crt /etc/vault-tls/ca.pem > /etc/vault-tls/ca-bundle.pem
else
  cp /etc/vault-tls/ca.pem /etc/vault-tls/ca-bundle.pem
fi
cat > /etc/profile.d/vault-ca.sh <<'EOF'
export NODE_EXTRA_CA_CERTS="/etc/vault-tls/ca.pem"
export SSL_CERT_FILE="/etc/vault-tls/ca-bundle.pem"
export REQUESTS_CA_BUNDLE="/etc/vault-tls/ca-bundle.pem"
export CURL_CA_BUNDLE="/etc/vault-tls/ca-bundle.pem"
export GIT_SSL_CAINFO="/etc/vault-tls/ca-bundle.pem"
export NODE_USE_ENV_PROXY="1"
EOF
chmod 0644 /etc/profile.d/vault-ca.sh
rm -f /tmp/21st-vault.crt`

export async function buildSandboxTemplate(
  config: SandboxTemplateBuildConfig,
): Promise<SandboxTemplateBuildResult> {
  const baseTemplateId = process.env.RELAY_SANDBOX_TEMPLATE
  if (!baseTemplateId) {
    throw new Error("RELAY_SANDBOX_TEMPLATE env var is required")
  }

  const alias = makeTemplateAlias(config.teamId, config.bundleHash)
  const sandboxConfig = config.sandboxConfig
  const vaultProxyCaCertPem = getVaultProxyCaCertPem()

  config.onProgress?.("Preparing sandbox template...")

  // Force Next/Vercel to trace E2B's runtime-only dependencies.
  await Promise.all([import("glob"), import("tar")])
  const { Template } = await import("e2b")
  let builder = Template().fromTemplate(baseTemplateId)
  const tempDir = mkdtempSync(join(tmpdir(), "agent-template-"))

  try {
    if (vaultProxyCaCertPem) {
      const caCertPath = prepareTextFile(
        tempDir,
        "21st-vault.crt",
        vaultProxyCaCertPem,
      )
      config.onProgress?.("Adding vault proxy CA...")
      builder = builder.copyItems([
        {
          src: caCertPath,
          dest: "/tmp/",
          forceUpload: true,
        },
      ])
      builder = builder.runCmd(INSTALL_VAULT_CA_CMD, { user: "root" })
      builder = builder.setEnvs({
        NODE_EXTRA_CA_CERTS: "/etc/vault-tls/ca.pem",
        SSL_CERT_FILE: "/etc/vault-tls/ca-bundle.pem",
        REQUESTS_CA_BUNDLE: "/etc/vault-tls/ca-bundle.pem",
        CURL_CA_BUNDLE: "/etc/vault-tls/ca-bundle.pem",
        GIT_SSL_CAINFO: "/etc/vault-tls/ca-bundle.pem",
        NODE_USE_ENV_PROXY: "1",
      })
    }

    if (sandboxConfig?.apt && sandboxConfig.apt.length > 0) {
      config.onProgress?.(
        `Adding apt packages: ${sandboxConfig.apt.join(", ")}`,
      )
      builder = builder.aptInstall(sandboxConfig.apt)
    }

    if (config.templateArchive) {
      const archivePath = prepareTemplateArchive(
        tempDir,
        config.templateArchive,
      )
      config.onProgress?.("Adding template archive...")
      builder = builder.copyItems([
        {
          src: archivePath,
          dest: "/tmp/",
          forceUpload: true,
        },
      ])
      config.onProgress?.("Extracting template files...")
      builder = builder.runCmd(
        "mkdir -p /home/user/workspace && tar -xzf /tmp/template.tar.gz -C /home/user/workspace && rm /tmp/template.tar.gz && if [ -d /home/user/workspace/runtime ] && { [ -f /home/user/workspace/runtime/agent-manifest.json ] || [ -f /home/user/workspace/runtime/go-agent-mcp ]; }; then mkdir -p /home/user/runtime && cp -a /home/user/workspace/runtime/. /home/user/runtime/ && rm -rf /home/user/workspace/runtime; fi && chown -R user:user /home/user/workspace",
        { user: "root" },
      )
    }

    if (config.mcpConfig) {
      config.onProgress?.("Adding MCP config...")
      const mcpConfigPath = prepareBinaryFile(
        tempDir,
        "mcp-source.json",
        config.mcpConfig,
      )
      builder = builder.copyItems([
        {
          src: mcpConfigPath,
          dest: "/home/user/runtime/",
          forceUpload: true,
        },
      ])
    }

    if (sandboxConfig?.files && Object.keys(sandboxConfig.files).length > 0) {
      config.onProgress?.("Adding sandbox files...")
      builder = builder.copyItems(
        prepareSandboxFiles(tempDir, sandboxConfig.files),
      )
    }

    config.onProgress?.("Adding agent bundle...")
    const bundlePath = prepareBinaryFile(
      tempDir,
      "agent-bundle.js",
      config.bundle,
    )
    builder = builder.copyItems([
      {
        src: bundlePath,
        dest: "/home/user/runtime/",
        forceUpload: true,
      },
    ])

    if (sandboxConfig?.cwd) {
      config.onProgress?.(
        `Setting sandbox working directory: ${sandboxConfig.cwd}`,
      )
      builder = builder.runCmd(`mkdir -p ${JSON.stringify(sandboxConfig.cwd)}`)
      builder = builder.setWorkdir(sandboxConfig.cwd)
    }

    if (sandboxConfig?.build && sandboxConfig.build.length > 0) {
      config.onProgress?.("Adding sandbox build commands...")
      for (const command of sandboxConfig.build) {
        builder = builder.runCmd(command)
      }
    }

    config.onProgress?.("Building sandbox template...")

    const buildInfo = await Template.build(builder, {
      alias,
      cpuCount: sandboxConfig?.cpuCount ?? 2,
      memoryMB: sandboxConfig?.memoryMB ?? 8192,
      onBuildLogs: (log: unknown) => {
        const message = getLogMessage(log)
        if (message) config.onProgress?.(message)
      },
    })

    config.onProgress?.("Sandbox template ready.")

    return {
      templateId: buildInfo.templateId,
      alias: buildInfo.alias || alias,
      baseTemplateId,
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
}
