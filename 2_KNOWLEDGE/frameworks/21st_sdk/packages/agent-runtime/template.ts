import { Template, waitForPort } from "e2b"

const RUNTIME = "/home/user/runtime"
const PERSISTENT_MOAT_RUN_NAME = "agents-runtime"
const PERSISTENT_MOAT_STATE_PATH = `${RUNTIME}/moat-persistent-run.json`
const PERSISTENT_MOAT_LOG_PATH = `${RUNTIME}/moat-persistent-run.log`
const WRITE_MOAT_CONFIG_CMD = `node - <<'"'"'EOF'"'"'
const fs = require("node:fs")
const configPath = process.env.MOAT_CONFIG_PATH
const lines = [
  "dependencies:",
  "  - node@20",
  "  - claude-code",
  "  - git",
  "",
  "hooks:",
  "  post_build_root: apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq bubblewrap socat && npm install -g @agentclientprotocol/claude-agent-acp@0.26.0 @zed-industries/codex-acp@0.9.3",
  "",
  "network:",
  "  policy: permissive",
  "",
  "ports:",
  "  proxy-bridge: 65535",
  "",
  "command: [\\"claude\\"]",
  "interactive: false",
  "",
  "grants:",
  "  - github",
]

fs.writeFileSync(configPath, lines.join("\\n") + "\\n")
EOF`
const PREBUILD_MOAT_IMAGE_CMD = `bash -lc '
  if ! docker info >/dev/null 2>&1; then
    dockerd >/tmp/dockerd-template.log 2>&1 &
  fi
  for _ in $(seq 1 30); do
    if docker info >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
  docker info >/dev/null 2>&1 || {
    cat /tmp/dockerd-template.log >&2
    exit 1
  }
  WORKSPACE=/home/user/workspace
  HOME=/home/user
  MOAT_CONFIG_PATH="$WORKSPACE/moat.yaml"
  MOAT_HOME=/home/user/.moat
  MOAT_KEY_PATH="$MOAT_HOME/encryption.key"
  MOAT_CREDENTIALS_DIR="$MOAT_HOME/credentials"
  MOAT_GITHUB_CREDENTIAL_PATH="$MOAT_CREDENTIALS_DIR/github.enc"
  MOAT_DUMMY_GITHUB_TOKEN="dummy-github-token-for-moat-bootstrap"
  export MOAT_HOME MOAT_KEY_PATH MOAT_CREDENTIALS_DIR MOAT_GITHUB_CREDENTIAL_PATH MOAT_DUMMY_GITHUB_TOKEN MOAT_CONFIG_PATH
  mkdir -p "$MOAT_CREDENTIALS_DIR"
  run_prebuild() {
    /home/user/.local/bin/moat run "$WORKSPACE" -- sh -lc true >/tmp/moat-prebuild.log 2>&1 || {
      cat /tmp/moat-prebuild.log >&2
      rm -f "$MOAT_CONFIG_PATH"
      exit 1
    }
  }
  node - <<'"'"'EOF'"'"'
const { createCipheriv, randomBytes } = require("node:crypto")
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs")
const MOAT_HOME = process.env.MOAT_HOME
const MOAT_KEY_PATH = process.env.MOAT_KEY_PATH
const MOAT_CREDENTIALS_DIR = process.env.MOAT_CREDENTIALS_DIR
const MOAT_GITHUB_CREDENTIAL_PATH = process.env.MOAT_GITHUB_CREDENTIAL_PATH
const token = process.env.MOAT_DUMMY_GITHUB_TOKEN
if (!existsSync(MOAT_HOME)) {
  mkdirSync(MOAT_HOME, { recursive: true, mode: 0o700 })
}
if (!existsSync(MOAT_CREDENTIALS_DIR)) {
  mkdirSync(MOAT_CREDENTIALS_DIR, { recursive: true, mode: 0o700 })
}
let key
if (existsSync(MOAT_KEY_PATH)) {
  key = Buffer.from(readFileSync(MOAT_KEY_PATH, "utf8").trim(), "base64")
} else {
  key = randomBytes(32)
  writeFileSync(MOAT_KEY_PATH, key.toString("base64"), { mode: 0o600 })
}
const payload = Buffer.from(JSON.stringify({
  provider: "github",
  token,
  created_at: new Date().toISOString(),
}))
const nonce = randomBytes(12)
const cipher = createCipheriv("aes-256-gcm", key, nonce)
const ciphertext = Buffer.concat([cipher.update(payload), cipher.final(), cipher.getAuthTag()])
writeFileSync(MOAT_GITHUB_CREDENTIAL_PATH, Buffer.concat([nonce, ciphertext]), { mode: 0o600 })
EOF
  ${WRITE_MOAT_CONFIG_CMD}
  run_prebuild
  rm -f "$MOAT_CONFIG_PATH"
'`

const START_RUNTIME_CMD = `bash -lc '
  if ! docker info >/dev/null 2>&1; then
    dockerd >/tmp/dockerd.log 2>&1 &
  fi
  for _ in $(seq 1 30); do
    if docker info >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
  docker info >/dev/null 2>&1 || {
    cat /tmp/dockerd.log >&2
    exit 1
  }
  export HOME=/home/user
  WORKSPACE=/home/user/workspace
  MOAT_CONFIG_PATH="$WORKSPACE/moat.yaml"
  STATE_PATH="${PERSISTENT_MOAT_STATE_PATH}"
  LOG_PATH="${PERSISTENT_MOAT_LOG_PATH}"
  PERSISTENT_RUN_NAME="${PERSISTENT_MOAT_RUN_NAME}"
  MOAT_HOME=/home/user/.moat
  MOAT_KEY_PATH="$MOAT_HOME/encryption.key"
  MOAT_CREDENTIALS_DIR="$MOAT_HOME/credentials"
  MOAT_GITHUB_CREDENTIAL_PATH="$MOAT_CREDENTIALS_DIR/github.enc"
  MOAT_DUMMY_GITHUB_TOKEN="dummy-github-token-for-moat-bootstrap"
  export STATE_PATH LOG_PATH PERSISTENT_RUN_NAME MOAT_CONFIG_PATH
  chown -R 5000:5000 "$WORKSPACE"
  mkdir -p "$MOAT_CREDENTIALS_DIR"
  node - <<'"'"'EOF'"'"'
const { createCipheriv, randomBytes } = require("node:crypto")
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs")
const MOAT_HOME = "/home/user/.moat"
const MOAT_KEY_PATH = "/home/user/.moat/encryption.key"
const MOAT_CREDENTIALS_DIR = "/home/user/.moat/credentials"
const MOAT_GITHUB_CREDENTIAL_PATH = "/home/user/.moat/credentials/github.enc"
const token = "dummy-github-token-for-moat-bootstrap"
if (!existsSync(MOAT_HOME)) {
  mkdirSync(MOAT_HOME, { recursive: true, mode: 0o700 })
}
if (!existsSync(MOAT_CREDENTIALS_DIR)) {
  mkdirSync(MOAT_CREDENTIALS_DIR, { recursive: true, mode: 0o700 })
}
let key
if (existsSync(MOAT_KEY_PATH)) {
  key = Buffer.from(readFileSync(MOAT_KEY_PATH, "utf8").trim(), "base64")
} else {
  key = randomBytes(32)
  writeFileSync(MOAT_KEY_PATH, key.toString("base64"), { mode: 0o600 })
}
const payload = Buffer.from(JSON.stringify({
  provider: "github",
  token,
  created_at: new Date().toISOString(),
}))
const nonce = randomBytes(12)
const cipher = createCipheriv("aes-256-gcm", key, nonce)
const ciphertext = Buffer.concat([cipher.update(payload), cipher.final(), cipher.getAuthTag()])
writeFileSync(MOAT_GITHUB_CREDENTIAL_PATH, Buffer.concat([nonce, ciphertext]), { mode: 0o600 })
EOF
  ${WRITE_MOAT_CONFIG_CMD}
  REUSED_PERSISTENT_RUN=0
  if [ -f "$STATE_PATH" ]; then
    EXISTING_CONTAINER_ID=$(node - <<'"'"'EOF'"'"'
const fs = require("node:fs")
try {
  const state = JSON.parse(fs.readFileSync(process.env.STATE_PATH, "utf8"))
  process.stdout.write(state.containerId || "")
} catch {}
EOF
)
    if [ -n "$EXISTING_CONTAINER_ID" ] && docker inspect "$EXISTING_CONTAINER_ID" >/dev/null 2>&1; then
      docker start "$EXISTING_CONTAINER_ID" >/dev/null 2>&1 || true
    fi
  fi
  /home/user/.local/bin/moat proxy start >/tmp/moat-proxy.log 2>&1 || {
    cat /tmp/moat-proxy.log >&2
    exit 1
  }
  if [ -f "$STATE_PATH" ]; then
    EXISTING_RUN_ID=$(node - <<'"'"'EOF'"'"'
const fs = require("node:fs")
try {
  const state = JSON.parse(fs.readFileSync(process.env.STATE_PATH, "utf8"))
  process.stdout.write(state.runId || "")
} catch {}
EOF
)
    EXISTING_CONTAINER_ID=$(node - <<'"'"'EOF'"'"'
const fs = require("node:fs")
try {
  const state = JSON.parse(fs.readFileSync(process.env.STATE_PATH, "utf8"))
  process.stdout.write(state.containerId || "")
} catch {}
EOF
)
    if [ -n "$EXISTING_RUN_ID" ] && [ -n "$EXISTING_CONTAINER_ID" ] && docker inspect "$EXISTING_CONTAINER_ID" >/dev/null 2>&1; then
      for _ in $(seq 1 30); do
        if docker exec "$EXISTING_CONTAINER_ID" sh -lc "test -f /home/moatuser/.claude.json" >/dev/null 2>&1 \
          && grep -q "\"run_id\": \"$EXISTING_RUN_ID\"" /home/user/.moat/proxy/runs.json 2>/dev/null; then
          REUSED_PERSISTENT_RUN=1
          break
        fi
        sleep 1
      done
    fi
  fi
  if [ "$REUSED_PERSISTENT_RUN" != "1" ]; then
    if [ -f "$STATE_PATH" ]; then
      OLD_RUN_ID=$(node - <<'"'"'EOF'"'"'
const fs = require("node:fs")
try {
  const state = JSON.parse(fs.readFileSync(process.env.STATE_PATH, "utf8"))
  process.stdout.write(state.runId || "")
} catch {}
EOF
)
      if [ -n "$OLD_RUN_ID" ]; then
        /home/user/.local/bin/moat stop "$OLD_RUN_ID" >/dev/null 2>&1 || true
        /home/user/.local/bin/moat destroy "$OLD_RUN_ID" >/dev/null 2>&1 || true
      fi
    fi
    /home/user/.local/bin/moat stop "$PERSISTENT_RUN_NAME" >/dev/null 2>&1 || true
    /home/user/.local/bin/moat destroy "$PERSISTENT_RUN_NAME" >/dev/null 2>&1 || true
    rm -f "$STATE_PATH" "$LOG_PATH"
    nohup /home/user/.local/bin/moat run --keep --name "$PERSISTENT_RUN_NAME" "$WORKSPACE" -- sh -lc "trap : TERM INT; while :; do sleep 3600; done" >"$LOG_PATH" 2>&1 &
    node - <<'"'"'EOF'"'"'
const fs = require("node:fs")
const { execFileSync } = require("node:child_process")

const statePath = process.env.STATE_PATH
const logPath = process.env.LOG_PATH
const deadline = Date.now() + 30_000

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function findRunId() {
  if (!fs.existsSync(logPath)) return null
  const log = fs.readFileSync(logPath, "utf8")
  const match = log.match(/Started\\s+[^(]+\\((run_[^)]+)\\)/)
  return match?.[1] ?? null
}

function getContainerId(runId) {
  if (!runId) return null
  try {
    return execFileSync("docker", ["inspect", runId, "--format", "{{.Id}}"], { encoding: "utf8" }).trim() || null
  } catch {
    return null
  }
}

function isContainerReady(containerId) {
  if (!containerId) return false
  try {
    execFileSync("docker", ["exec", containerId, "sh", "-lc", "test -f /home/moatuser/.claude.json"], {
      stdio: "ignore",
    })
    return true
  } catch {
    return false
  }
}

while (Date.now() < deadline) {
  const runId = findRunId()
  const containerId = getContainerId(runId)
  if (runId && containerId && isContainerReady(containerId)) {
    fs.writeFileSync(statePath, JSON.stringify({
      runId,
      containerId,
    }, null, 2))
    process.exit(0)
  }
  sleep(250)
}

if (fs.existsSync(logPath)) {
  process.stderr.write(fs.readFileSync(logPath, "utf8"))
}
console.error("Timed out waiting for persistent Moat startup state.")
process.exit(1)
EOF
  fi
  rm -f "$MOAT_CONFIG_PATH"
  cd /home/user/runtime
  exec npm run dev
'`

export const template = Template()
  .fromNodeImage("24-trixie")
  .setUser("root")
  .setWorkdir(RUNTIME)

  // System dependencies
  .aptInstall(["git", "curl", "ripgrep", "wget", "libdbus-1-3", "iproute2", "docker.io", "gnupg"])

  // gVisor (runsc)
  .runCmd(
    `bash -lc 'curl -fsSL https://gvisor.dev/archive.key \
      | gpg --dearmor -o /usr/share/keyrings/gvisor.gpg \
      && echo "deb [signed-by=/usr/share/keyrings/gvisor.gpg] https://storage.googleapis.com/gvisor/releases release main" \
      > /etc/apt/sources.list.d/gvisor.list \
      && apt-get update -qq \
      && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq runsc \
      && runsc install'`,
  )

  // Moat CLI
  .runCmd(
    `bash -lc 'ARCH=$(uname -m | sed "s/x86_64/amd64/;s/aarch64/arm64/") \
      && mkdir -p /home/user/.local/bin /tmp/moat-install \
      && curl -fsSL "https://github.com/majorcontext/moat/releases/download/v0.4.0/moat_0.4.0_linux_\${ARCH}.tar.gz" \
      | tar -xz -C /tmp/moat-install \
      && mv /tmp/moat-install/moat /home/user/.local/bin/moat \
      && chmod +x /home/user/.local/bin/moat'`,
  )

  // GitHub CLI
  .runCmd("mkdir -p /home/user/.local/bin && curl -sSL https://github.com/cli/cli/releases/download/v2.67.0/gh_2.67.0_linux_amd64.tar.gz | tar -xz -C /tmp && mv /tmp/gh_2.67.0_linux_amd64/bin/gh /home/user/.local/bin/gh")

  // Install dependencies
  .copy("sandbox-package.json", `${RUNTIME}/package.json`)
  .runCmd(`cd ${RUNTIME} && npm install`)

  // Copy runtime source
  .copy("src/index.ts", `${RUNTIME}/src/index.ts`)
  .copy("src/env.ts", `${RUNTIME}/src/env.ts`)
  .copy("src/mcp.ts", `${RUNTIME}/src/mcp.ts`)
  .copy("src/runtime.ts", `${RUNTIME}/src/runtime.ts`)
  .copy("src/stream.ts", `${RUNTIME}/src/stream.ts`)
  .copy("src/tools.ts", `${RUNTIME}/src/tools.ts`)
  .copy("src/tracing.ts", `${RUNTIME}/src/tracing.ts`)
  .copy("src/acp-bridge.ts", `${RUNTIME}/src/acp-bridge.ts`)
  .copy("tsconfig.json", `${RUNTIME}/tsconfig.json`)

  // Required directories
  .runCmd("mkdir -p /home/user/repo")
  .runCmd("mkdir -p /home/user/workspace")
  .runCmd(PREBUILD_MOAT_IMAGE_CMD)
  // Environment
  .setEnvs({
    NODE_ENV: "production",
    PORT: "3003",
    MCP_PORT: "3004",
    PATH: "/home/user/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
  })

  // Auto-start Docker and runtime server
  .setStartCmd(
    START_RUNTIME_CMD,
    waitForPort(3003),
  )
