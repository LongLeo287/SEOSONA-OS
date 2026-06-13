#!/bin/bash
set -euo pipefail

RUNTIME_DIR="/home/user/runtime"
WORKSPACE="/home/user/workspace"
WORKSPACE_DEVICE="/dev/workspace-disk"
MOAT_HOME="/home/user/.moat"
MOAT_KEY_PATH="${MOAT_HOME}/encryption.key"
MOAT_CREDENTIALS_DIR="${MOAT_HOME}/credentials"
MOAT_GITHUB_CREDENTIAL_PATH="${MOAT_CREDENTIALS_DIR}/github.enc"
MOAT_DUMMY_GITHUB_TOKEN="dummy-github-token-for-moat-bootstrap"

mount_workspace_disk() {
  if [ ! -b "${WORKSPACE_DEVICE}" ]; then
    return 0
  fi

  mkdir -p "${WORKSPACE}"

  if awk -v target="${WORKSPACE}" '$2 == target { found=1 } END { exit found ? 0 : 1 }' /proc/mounts; then
    return 0
  fi

  if ! blkid "${WORKSPACE_DEVICE}" >/dev/null 2>&1; then
    mkfs.ext4 -F "${WORKSPACE_DEVICE}"
  fi

  mount "${WORKSPACE_DEVICE}" "${WORKSPACE}"
}

mount_workspace_disk

if [ "${AGENTS_USE_MOAT:-true}" = "false" ]; then
  chown -R 5000:5000 "${WORKSPACE}" || true
  cd "${RUNTIME_DIR}"
  exec npm run dev
fi

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

mkdir -p "${MOAT_CREDENTIALS_DIR}"

node - <<'EOF'
const { createCipheriv, randomBytes } = require("node:crypto")
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs")

const moatHome = "/home/user/.moat"
const keyPath = "/home/user/.moat/encryption.key"
const credentialsDir = "/home/user/.moat/credentials"
const githubCredentialPath = "/home/user/.moat/credentials/github.enc"
const token = "dummy-github-token-for-moat-bootstrap"

if (!existsSync(moatHome)) {
  mkdirSync(moatHome, { recursive: true, mode: 0o700 })
}
if (!existsSync(credentialsDir)) {
  mkdirSync(credentialsDir, { recursive: true, mode: 0o700 })
}

let key
if (existsSync(keyPath)) {
  key = Buffer.from(readFileSync(keyPath, "utf8").trim(), "base64")
} else {
  key = randomBytes(32)
  writeFileSync(keyPath, key.toString("base64"), { mode: 0o600 })
}

const payload = Buffer.from(JSON.stringify({
  provider: "github",
  token,
  created_at: new Date().toISOString(),
}))
const nonce = randomBytes(12)
const cipher = createCipheriv("aes-256-gcm", key, nonce)
const ciphertext = Buffer.concat([cipher.update(payload), cipher.final(), cipher.getAuthTag()])
writeFileSync(githubCredentialPath, Buffer.concat([nonce, ciphertext]), { mode: 0o600 })
EOF

chown -R 5000:5000 "${WORKSPACE}" || true

cd "${RUNTIME_DIR}"
exec npm run dev
