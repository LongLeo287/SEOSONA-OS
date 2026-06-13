import { createHash, randomUUID } from 'crypto';
import { SignJWT, importPKCS8 } from 'jose';
import {
  LegacySandboxSetupConfig,
  ResolvedSandboxConfig,
} from './deployment-metadata';
import { getSandboxBackend, getSandboxBackendForConfig } from './sandbox-backends';
import { SandboxHandle } from './sandbox-backends/types';
import { SANDBOX_TIMEOUT_MS } from './sandbox-constants';
import { SandboxKeepAliveHelper } from './sandbox-keepalive';
import {
  deleteStandaloneWorkspacePvc,
  ensureStandaloneWorkspacePvc,
  isStandaloneWorkspaceVolumesEnabled,
} from './standalone-workspace-pvc';

export const CLAUDE_PROXY_URL = process.env.CLAUDE_PROXY_URL || '';
export const VAULT_PROXY_URL = process.env.VAULT_PROXY_URL || '';
const DEFAULT_RELAY_URL = 'https://relay.an.dev';
const SETUP_COMMAND_TIMEOUT_MS = 120_000; // 2m per command
// 30 min — sandboxes are stateful, JWT lifetime sized to avoid re-issuance
// during normal session lengths.
const PROXY_TOKEN_TTL_SECONDS = 1800;
const PROXY_TOKEN_TTL_JWT = `${PROXY_TOKEN_TTL_SECONDS}s`;
const SETUP_ENV = { HOME: '/home/user' };
const PRIVATE_ENV_PATH = '/home/user/.env';
const MCP_CONFIG_PATH = '/home/user/runtime/mcp-source.json';

export interface SandboxSetupConfig extends LegacySandboxSetupConfig {
  timeoutMs?: number;
  networkAllowOut?: string[];
  networkDenyOut?: string[];
}

function getSetupConfig(
  sandboxConfig: ResolvedSandboxConfig,
): SandboxSetupConfig {
  return sandboxConfig as ResolvedSandboxConfig & SandboxSetupConfig;
}

export function buildPrivateEnvVars(
  agentEnvVars?: Record<string, string> | null,
): Record<string, string> {
  return {
    ...(agentEnvVars && typeof agentEnvVars === 'object' ? agentEnvVars : {}),
    ...(process.env.RELAY_URL ? { RELAY_URL: process.env.RELAY_URL } : {}),
  };
}

function parsePrivateEnvString(content: string): Record<string, string> {
  const envVars: Record<string, string> = {};

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    if (!key) continue;

    envVars[key] = line.slice(separatorIndex + 1);
  }

  return envVars;
}

export async function readPrivateEnvVars(sandbox: SandboxHandle): Promise<Record<string, string>> {
  try {
    const content = await sandbox.readText(PRIVATE_ENV_PATH);
    if (typeof content !== 'string' || content.trim().length === 0) {
      return {};
    }

    return parsePrivateEnvString(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('no such file') || message.includes('not found')) {
      return {};
    }
    throw err;
  }
}

function getAllowOutHost(url: string): string | null {
  if (!url) return null;

  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function resolveSandboxTimeoutMs(
  sandboxConfig: ResolvedSandboxConfig,
  timeoutMs?: number | null,
): number {
  return timeoutMs ?? getSetupConfig(sandboxConfig).timeoutMs ?? SANDBOX_TIMEOUT_MS;
}

function resolveSandboxNetworkPolicy(params: {
  sandboxConfig: ResolvedSandboxConfig;
  networkAllowOut?: string[] | null;
  networkDenyOut?: string[] | null;
}): { networkAllowOut?: string[]; networkDenyOut?: string[] } {
  const setupConfig = getSetupConfig(params.sandboxConfig);
  const denyOut =
    params.networkDenyOut ?? setupConfig.networkDenyOut;
  const allowOut =
    params.networkAllowOut ?? setupConfig.networkAllowOut;

  const effectiveDenyOut = denyOut && denyOut.length > 0 ? denyOut : undefined;
  const requiredAllowOut = [
    getAllowOutHost(CLAUDE_PROXY_URL),
    getAllowOutHost(process.env.RELAY_URL || DEFAULT_RELAY_URL),
  ].filter((host): host is string => Boolean(host));

  const effectiveAllowOut =
    (allowOut !== undefined && allowOut !== null) || effectiveDenyOut
      ? [...new Set([...(allowOut ?? []), ...requiredAllowOut])]
      : undefined;

  return {
    ...(effectiveAllowOut ? { networkAllowOut: effectiveAllowOut } : {}),
    ...(effectiveDenyOut ? { networkDenyOut: effectiveDenyOut } : {}),
  };
}

let cachedPrivateKey: CryptoKey | null = null;
async function getPrivateKey() {
  if (cachedPrivateKey) return cachedPrivateKey;
  const pem = process.env.CLAUDE_PROXY_PRIVATE_JWT?.replace(/\\n/g, '\n') || '';
  cachedPrivateKey = await importPKCS8(pem, 'RS256');
  return cachedPrivateKey;
}

async function signRegistrationCode(sandboxId: string): Promise<string> {
  const key = await getPrivateKey();
  return new SignJWT({ sandboxId, purpose: 'ip-register' })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setExpirationTime('60s')
    .sign(key);
}

async function getSandboxOutboundIp(sandbox: SandboxHandle, sandboxId: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const code = await signRegistrationCode(sandboxId);
      const result = await sandbox.exec(
        `curl -s --max-time 5 -X POST ${CLAUDE_PROXY_URL}/ip/register/${code}`,
        { timeoutMs: 10_000 },
      );
      const parsed = JSON.parse(result.stdout) as { ip?: string };
      if (parsed.ip) return parsed.ip;
      console.warn(`[SANDBOX] Attempt ${attempt}/${retries}: empty IP in response`);
    } catch (err) {
      console.warn(`[SANDBOX] Attempt ${attempt}/${retries}: failed to resolve outbound IP:`, err);
    }
    if (attempt < retries) await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('Failed to resolve sandbox outbound IP after all retries');
}

async function signProxyJwt(
  userId: string,
  sandboxId: string,
  allowedIp: string,
  clientSandboxId?: string,
  teamId?: string,
): Promise<string> {
  const key = await getPrivateKey();
  return new SignJWT({
    userId,
    sandboxId,
    allowedIp,
    ...(clientSandboxId && { clientSandboxId }),
    ...(teamId && { teamId }),
  })
    .setProtectedHeader({ alg: 'RS256' })
    .setAudience('relay-proxy')
    .setIssuedAt()
    .setExpirationTime(PROXY_TOKEN_TTL_JWT)
    .sign(key);
}

async function signVaultProxyJwt(
  userId: string,
  sandboxId: string,
  allowedIp: string,
  teamId: string,
  vaultIds: string[],
  clientSandboxId?: string,
): Promise<string> {
  const key = await getPrivateKey();
  return new SignJWT({
    userId,
    sandboxId,
    allowedIp,
    teamId,
    vault_ids: vaultIds,
    jti: randomUUID(),
    ...(clientSandboxId && { clientSandboxId }),
  })
    .setProtectedHeader({ alg: 'RS256' })
    .setAudience('vault-proxy')
    .setIssuedAt()
    .setExpirationTime(PROXY_TOKEN_TTL_JWT)
    .sign(key);
}

function getVaultIdsHash(vaultIds: string[]): string {
  return createHash('sha256').update(JSON.stringify(vaultIds)).digest('hex');
}

export async function injectProxyConfig(
  sandbox: SandboxHandle,
  runtime: string,
  userId: string,
  sandboxId: string,
  clientSandboxId?: string,
  teamId?: string,
  vaultIds: string[] = [],
) {
  const allowedIp = await getSandboxOutboundIp(sandbox, sandboxId);
  console.log(`[SANDBOX] Binding proxy token to IP ${allowedIp} for sandbox ${sandboxId}`);

  const jwt = await signProxyJwt(userId, sandboxId, allowedIp, clientSandboxId, teamId);

  // Vault proxy config — E2B only (relies on the CA cert baked into the E2B
  // template). On OpenSandbox we skip silently; chat.ts validates that
  // vaultIds aren't passed for OpenSandbox runs.
  if (sandbox.provider === 'e2b' && VAULT_PROXY_URL && teamId) {
    const vaultJwt = await signVaultProxyJwt(
      userId,
      sandboxId,
      allowedIp,
      teamId,
      vaultIds,
      clientSandboxId,
    );
    await sandbox.writeFile(
      '/home/user/.vault-proxy-config',
      `VAULT_PROXY_URL=${VAULT_PROXY_URL}\nVAULT_PROXY_JWT=${vaultJwt}\n`,
    );
  }

  if (runtime === 'codex') {
    // Codex path — exact mirror of the Anthropic pair below. The JWT acts as
    // the user identity token; codex-acp uses it as a bearer when calling
    // OPENAI_BASE_URL, which points at claude-proxy /openai/v1, which validates
    // the JWT and forwards to api.openai.com with the real OpenAI key.
    // We only support the openai-api-key auth method, so only OpenAI env vars.
    const codexConfig = `OPENAI_BASE_URL=${CLAUDE_PROXY_URL}/openai/v1\nOPENAI_API_KEY=${jwt}`;
    await sandbox.writeFile('/home/user/.codex-proxy-config', codexConfig);
    await sandbox.writeFile('/home/user/workspace/.codex-proxy-config', codexConfig);
    tokenExpiryCache.set(sandboxId, {
      exp: Date.now() / 1000 + PROXY_TOKEN_TTL_SECONDS,
      vaultIdsHash: getVaultIdsHash(vaultIds),
    });
    return;
  }

  const claudeConfig = `ANTHROPIC_BASE_URL=${CLAUDE_PROXY_URL}\nANTHROPIC_API_KEY=${jwt}`;
  await sandbox.writeFile('/home/user/.claude-proxy-config', claudeConfig);
  await sandbox.writeFile('/home/user/workspace/.claude-proxy-config', claudeConfig);

  tokenExpiryCache.set(sandboxId, {
    exp: Date.now() / 1000 + PROXY_TOKEN_TTL_SECONDS,
    vaultIdsHash: getVaultIdsHash(vaultIds),
  });
}

const envHashCache = new Map<string, string>();

export async function syncPrivateEnvVars(
  sandbox: SandboxHandle,
  envVars?: Record<string, string> | null,
): Promise<void> {
  if (!envVars || Object.keys(envVars).length === 0) {
    return;
  }

  const privateEnvString = Object.entries(envVars)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const hash = createHash('sha256').update(privateEnvString).digest('hex');
  const cacheKey = sandbox.sandboxId;
  if (envHashCache.get(cacheKey) === hash) {
    return; // env vars unchanged, skip file write
  }

  await sandbox.writeFile(PRIVATE_ENV_PATH, privateEnvString);
  envHashCache.set(cacheKey, hash);
}

export async function syncMcpConfig(
  sandbox: SandboxHandle,
  mcpConfigUrl?: string | null,
): Promise<void> {
  if (!mcpConfigUrl) {
    return;
  }

  const response = await fetch(mcpConfigUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch MCP config from ${mcpConfigUrl}`);
  }

  await sandbox.writeFile(MCP_CONFIG_PATH, await response.arrayBuffer());
}

async function applySandboxConfig(
  sandbox: SandboxHandle,
  config: SandboxSetupConfig,
  options: { skipApt?: boolean } = {},
) {
  if (!options.skipApt && config.apt && config.apt.length > 0) {
    const packages = config.apt.join(' ');
    await sandbox.exec(`apt-get update -qq && apt-get install -y -qq ${packages}`, {
      runAs: 'root',
      timeoutMs: SETUP_COMMAND_TIMEOUT_MS,
    });
  }

  if (config.files && Object.keys(config.files).length > 0) {
    const fileEntries = Object.entries(config.files).map(([path, data]) => ({ path, data }));
    await sandbox.writeFiles(fileEntries);
  }

  if (config.cwd) {
    await sandbox.exec(`mkdir -p "${config.cwd}"`, {
      runAs: 'root',
      envs: SETUP_ENV,
      timeoutMs: 5_000,
    });
  }

  if (config.setup && config.setup.length > 0) {
    for (const cmd of config.setup) {
      await sandbox.exec(cmd, {
        runAs: 'root',
        cwd: config.cwd || '/home/user',
        envs: SETUP_ENV,
        timeoutMs: SETUP_COMMAND_TIMEOUT_MS,
      });
    }
  }
}

type TokenCacheEntry = { exp: number; vaultIdsHash: string };
const tokenExpiryCache = new Map<string, TokenCacheEntry>();

export async function refreshProxyTokenIfNeeded(
  sandbox: SandboxHandle,
  runtime: string,
  userId: string,
  sandboxId: string,
  clientSandboxId?: string,
  teamId?: string,
  vaultIds: string[] = [],
): Promise<void> {
  const now = Date.now() / 1000;
  for (const [id, entry] of tokenExpiryCache) {
    if (entry.exp <= now) tokenExpiryCache.delete(id);
  }

  const cacheEntry = tokenExpiryCache.get(sandboxId);
  const vaultIdsHash = getVaultIdsHash(vaultIds);
  if (
    cacheEntry &&
    cacheEntry.exp > now + 60 &&
    cacheEntry.vaultIdsHash === vaultIdsHash
  ) {
    return;
  }

  console.log(`[SANDBOX] Refreshing proxy token for sandbox ${sandboxId}`);
  await injectProxyConfig(sandbox, runtime, userId, sandboxId, clientSandboxId, teamId, vaultIds);
}

export async function createProvisionedSandbox(params: {
  runtime: string;
  userId: string;
  sandboxConfig: ResolvedSandboxConfig;
  bundleUrl?: string | null;
  mcpConfigUrl?: string | null;
  envVars?: Record<string, string> | null;
  timeoutMs?: number | null;
  networkAllowOut?: string[] | null;
  networkDenyOut?: string[] | null;
  clientSandboxId?: string;
  teamId?: string;
  nocodeAgentConfig?: Record<string, unknown> | null;
  vaultIds?: string[];
}): Promise<SandboxHandle> {
  const {
    runtime,
    userId,
    sandboxConfig,
    bundleUrl,
    mcpConfigUrl,
    envVars,
    timeoutMs,
    networkAllowOut,
    networkDenyOut,
    clientSandboxId,
    teamId,
    nocodeAgentConfig,
    vaultIds = [],
  } = params;

  const sandboxEnvVars = buildPrivateEnvVars(envVars);
  const effectiveTimeoutMs = resolveSandboxTimeoutMs(sandboxConfig, timeoutMs);
  const effectiveNetworkPolicy = resolveSandboxNetworkPolicy({
    sandboxConfig,
    networkAllowOut,
    networkDenyOut,
  });

  const backend = getSandboxBackendForConfig(sandboxConfig);
  let createdWorkspacePvc = false;
  const workspaceVolume =
    isStandaloneWorkspaceVolumesEnabled(sandboxConfig.provider)
      ? (() => {
        if (!clientSandboxId) {
          throw new Error('Standalone OpenSandbox sandboxes require clientSandboxId for workspace PVCs');
        }
        return clientSandboxId;
      })()
      : null;

  const ensuredWorkspaceVolume = workspaceVolume
    ? await ensureStandaloneWorkspacePvc(workspaceVolume)
    : null;
  createdWorkspacePvc = ensuredWorkspaceVolume?.created ?? false;
  let sandbox: SandboxHandle | null = null;
  try {
    sandbox = await backend.create({
      sandboxConfig,
      runtime,
      userId,
      teamId,
      clientSandboxId,
      envVars: sandboxEnvVars,
      timeoutMs: effectiveTimeoutMs,
      ...(ensuredWorkspaceVolume ? { workspaceVolume: ensuredWorkspaceVolume.volume } : {}),
      ...effectiveNetworkPolicy,
    });
    const provisionedSandbox = sandbox;
    const sandboxId = provisionedSandbox.sandboxId;

    const keepAlive = new SandboxKeepAliveHelper({
      renew: (ttlMs) => provisionedSandbox.renew(ttlMs),
      ttlMs: effectiveTimeoutMs,
      logTag: `[SANDBOX_PROVISION][${sandboxId}]`,
    });

    await keepAlive.start();

    try {
      await injectProxyConfig(sandbox, runtime, userId, sandboxId, clientSandboxId, teamId, vaultIds);

      if (bundleUrl) {
        const bundleResponse = await fetch(bundleUrl);
        if (bundleResponse.ok) {
          const bundleBuffer = await bundleResponse.arrayBuffer();
          await sandbox.writeFile('/home/user/runtime/agent-bundle.js', bundleBuffer);
        } else {
          console.error(`[SANDBOX] Bundle download failed for ${sandboxId}: ${bundleResponse.status} ${bundleResponse.statusText}`);
        }
      }

      if (nocodeAgentConfig && !bundleUrl) {
        const bundleJs = `export default ${JSON.stringify({
          _type: 'agent',
          runtime: nocodeAgentConfig.runtime || 'claude-code',
          model: nocodeAgentConfig.model || 'claude-sonnet-4-6',
          systemPrompt: nocodeAgentConfig.systemPrompt || '',
          permissionMode: nocodeAgentConfig.permissionMode || 'bypassPermissions',
          maxTurns: nocodeAgentConfig.maxTurns || 50,
          maxBudgetUsd: nocodeAgentConfig.maxBudgetUsd,
          maxSandboxBudgetUsd: nocodeAgentConfig.maxSandboxBudgetUsd,
          tools: {},
        }, null, 2)};`;
        await sandbox.writeFile('/home/user/runtime/agent-bundle.js', bundleJs);
      }

      await syncMcpConfig(sandbox, mcpConfigUrl);
      await syncPrivateEnvVars(sandbox, sandboxEnvVars);

      const setupConfig = getSetupConfig(sandboxConfig);
      const runtimeSandboxConfig = sandboxConfig.provider === 'e2b' && sandboxConfig.templateId
        ? { ...setupConfig, files: undefined }
        : setupConfig;

      await applySandboxConfig(sandbox, runtimeSandboxConfig, {
        skipApt: sandboxConfig.provider === 'e2b' && !!sandboxConfig.templateId,
      });
    } finally {
      keepAlive.stop();
    }

    return sandbox;
  } catch (error) {
    if (sandbox) {
      await sandbox.destroy().catch(() => {});
      await sandbox.close().catch(() => {});
    }
    if (createdWorkspacePvc && clientSandboxId && isStandaloneWorkspaceVolumesEnabled(sandboxConfig.provider)) {
      await deleteStandaloneWorkspacePvc(clientSandboxId).catch(() => {});
    }
    throw error;
  }
}

export async function connectToSandbox(
  provider: ResolvedSandboxConfig['provider'],
  sandboxId: string,
): Promise<SandboxHandle> {
  const backend = getSandboxBackend(provider);
  return backend.connect(sandboxId);
}

export async function renewSandbox(
  provider: ResolvedSandboxConfig['provider'],
  sandboxId: string,
  ttlMs = SANDBOX_TIMEOUT_MS,
): Promise<void> {
  const backend = getSandboxBackend(provider);
  await backend.renew(sandboxId, ttlMs);
}

export async function destroySandbox(
  provider: ResolvedSandboxConfig['provider'],
  sandboxId: string,
): Promise<void> {
  const backend = getSandboxBackend(provider);
  await backend.destroy(sandboxId);
}
