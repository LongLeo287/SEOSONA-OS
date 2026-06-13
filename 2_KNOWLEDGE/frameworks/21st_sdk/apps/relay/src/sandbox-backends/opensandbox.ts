import { ConnectionConfig, Sandbox as OpenSandbox, type NetworkPolicy } from '@alibaba-group/opensandbox';
import { SANDBOX_TIMEOUT_MS } from '../sandbox-constants';
import {
  CreateSandboxParams,
  SandboxBackend,
  SandboxExecOptions,
  SandboxExecResult,
  SandboxHandle,
} from './types';

const OPEN_SANDBOX_MIN_TIMEOUT_MS = 2 * 60_000;
const OPEN_SANDBOX_RUNTIME_ENTRYPOINT = ['/bin/bash', '/home/user/runtime/start-runtime.sh'];
const DEFAULT_OPEN_SANDBOX_RESOURCE_CPU = '500m';
const DEFAULT_OPEN_SANDBOX_RESOURCE_MEMORY = '512Mi';

function getReadyTimeoutSeconds(): number | undefined {
  const raw = process.env.OPENSANDBOX_READY_TIMEOUT_SECONDS?.trim();
  if (!raw) return undefined;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('OPENSANDBOX_READY_TIMEOUT_SECONDS must be a positive integer');
  }

  return parsed;
}

function getConnectionConfig(): ConnectionConfig {
  const readyTimeoutSeconds = getReadyTimeoutSeconds();
  return new ConnectionConfig({
    domain: process.env.OPENSANDBOX_DOMAIN,
    protocol: process.env.OPENSANDBOX_PROTOCOL === 'https' ? 'https' : undefined,
    apiKey: process.env.OPENSANDBOX_API_KEY,
    // Keep the transport timeout aligned with sandbox readiness timeout.
    ...(readyTimeoutSeconds ? { requestTimeoutSeconds: readyTimeoutSeconds } : {}),
    useServerProxy: process.env.OPENSANDBOX_USE_SERVER_PROXY === 'true',
  });
}

function getRuntimeImage(): string {
  const image = process.env.OPENSANDBOX_RUNTIME_IMAGE;
  if (!image) {
    throw new Error('OPENSANDBOX_RUNTIME_IMAGE env var is required for OpenSandbox sandboxes');
  }
  return image;
}

function resolveRuntimeImage(params: CreateSandboxParams): string {
  if (params.sandboxConfig.provider === 'opensandbox' && params.sandboxConfig.runtimeImage) {
    return params.sandboxConfig.runtimeImage;
  }

  return getRuntimeImage();
}

function getResourceLimitEnv(name: 'OPENSANDBOX_RESOURCE_CPU' | 'OPENSANDBOX_RESOURCE_MEMORY'): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function getSandboxResourceLimits(): Record<string, string> {
  return {
    cpu: getResourceLimitEnv('OPENSANDBOX_RESOURCE_CPU') ?? DEFAULT_OPEN_SANDBOX_RESOURCE_CPU,
    memory: getResourceLimitEnv('OPENSANDBOX_RESOURCE_MEMORY') ?? DEFAULT_OPEN_SANDBOX_RESOURCE_MEMORY,
  };
}

function toTimeoutSeconds(timeoutMs?: number): number | undefined {
  if (!timeoutMs || timeoutMs <= 0) return undefined;
  return Math.ceil(timeoutMs / 1000);
}

function toExecOptions(options?: SandboxExecOptions) {
  return {
    ...(options?.cwd ? { workingDirectory: options.cwd } : {}),
    ...(options?.envs ? { envs: options.envs } : {}),
    ...(toTimeoutSeconds(options?.timeoutMs)
      ? { timeoutSeconds: toTimeoutSeconds(options?.timeoutMs) }
      : {}),
    ...(options?.runAs === 'root' ? { uid: 0, gid: 0 } : {}),
  };
}

function toExecAbortSignal(timeoutMs?: number): AbortSignal | undefined {
  if (!timeoutMs || timeoutMs <= 0) return undefined;
  return AbortSignal.timeout(timeoutMs + 1_000);
}

function toNetworkPolicy(params: CreateSandboxParams): NetworkPolicy | undefined {
  if (params.networkAllowOut === undefined && params.networkDenyOut === undefined) {
    return undefined;
  }

  return {
    defaultAction: 'deny',
    egress: [
      ...(params.networkAllowOut ?? []).map((target) => ({ action: 'allow' as const, target })),
      ...(params.networkDenyOut ?? []).map((target) => ({ action: 'deny' as const, target })),
    ],
  };
}

async function waitForSandboxNetworkReady(sandbox: OpenSandbox) {
  const execdReady = await sandbox.health.ping();
  if (!execdReady) return false;

  await sandbox.getEgressPolicy();
  return true;
}

function toCommandResult(execution: Awaited<ReturnType<OpenSandbox['commands']['run']>>): SandboxExecResult {
  return {
    stdout: execution.logs.stdout.map((entry) => entry.text).join(''),
    stderr: execution.logs.stderr.map((entry) => entry.text).join(''),
    exitCode: execution.exitCode ?? 0,
  };
}

function toReadableStream(source: AsyncIterable<Uint8Array>): ReadableStream<Uint8Array> {
  const iterator = source[Symbol.asyncIterator]();
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await iterator.next();
      if (done) {
        controller.close();
        return;
      }
      if (value) {
        controller.enqueue(value);
      }
    },
    async cancel() {
      if (typeof iterator.return === 'function') {
        await iterator.return();
      }
    },
  });
}

function toHandle(sandbox: OpenSandbox): SandboxHandle {
  return {
    provider: 'opensandbox',
    sandboxId: sandbox.id,
    async close() {
      await sandbox.close();
    },
    async destroy() {
      await sandbox.kill();
    },
    async renew(ttlMs: number) {
      await sandbox.renew(Math.ceil(ttlMs / 1000));
    },
    async getRuntimeTransport(port: number) {
      const endpoint = await sandbox.getEndpoint(port);
      const baseUrl = await sandbox.getEndpointUrl(port);
      return {
        baseUrl,
        ...(endpoint.headers ? { headers: endpoint.headers } : {}),
      };
    },
    async exec(command, options) {
      const execution = await sandbox.commands.run(
        command,
        toExecOptions(options),
        undefined,
        toExecAbortSignal(options?.timeoutMs),
      );
      return toCommandResult(execution);
    },
    async writeFile(path, data) {
      await sandbox.files.writeFiles([{ path, data: data as any }]);
    },
    async writeFiles(entries) {
      await sandbox.files.writeFiles(entries.map((entry) => ({
        path: entry.path,
        data: entry.data as any,
      })));
    },
    async readText(path) {
      return sandbox.files.readFile(path);
    },
    async readBlob(path) {
      const bytes = await sandbox.files.readBytes(path);
      return new Blob([Buffer.from(bytes)]);
    },
    async readStream(path) {
      return toReadableStream(sandbox.files.readBytesStream(path));
    },
  };
}

export function isOpenSandboxNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const candidate = error as {
    statusCode?: unknown;
    error?: { code?: unknown } | null;
    rawBody?: { code?: unknown } | null;
  };

  if (candidate.statusCode === 404) return true;
  if (candidate.error?.code === 'KUBERNETES::SANDBOX_NOT_FOUND') return true;
  if (candidate.rawBody?.code === 'KUBERNETES::SANDBOX_NOT_FOUND') return true;
  return false;
}

export class OpenSandboxBackend implements SandboxBackend {
  provider = 'opensandbox' as const;

  async create(params: CreateSandboxParams): Promise<SandboxHandle> {
    const effectiveTimeoutMs = Math.max(
      params.timeoutMs ?? SANDBOX_TIMEOUT_MS,
      OPEN_SANDBOX_MIN_TIMEOUT_MS,
    );
    const networkPolicy = toNetworkPolicy(params);
    const sandbox = await OpenSandbox.create({
      connectionConfig: getConnectionConfig(),
      image: resolveRuntimeImage(params),
      resource: getSandboxResourceLimits(),
      ...(getReadyTimeoutSeconds() ? { readyTimeoutSeconds: getReadyTimeoutSeconds() } : {}),
      ...(networkPolicy ? { healthCheck: waitForSandboxNetworkReady } : {}),
      entrypoint: OPEN_SANDBOX_RUNTIME_ENTRYPOINT,
      ...(networkPolicy ? { networkPolicy } : {}),
      env: {
        ...(params.envVars ?? {}),
        AGENTS_USE_MOAT: 'false',
      },
      ...(params.workspaceVolume
        ? {
          volumes: [
            {
              name: 'workspace',
              pvc: {
                claimName: params.workspaceVolume.claimName,
              },
              devicePath: params.workspaceVolume.devicePath,
            } as any,
          ],
        }
        : {}),
      metadata: {
        ...(params.teamId ? { teamId: params.teamId } : {}),
        ...(params.clientSandboxId ? { clientSandboxId: params.clientSandboxId } : {}),
        ...(params.runtime ? { runtime: params.runtime } : {}),
        ...(params.userId ? { userId: params.userId } : {}),
        timeoutMs: String(effectiveTimeoutMs),
      },
      timeoutSeconds: Math.ceil(effectiveTimeoutMs / 1000),
    });

    return toHandle(sandbox);
  }

  async connect(sandboxId: string): Promise<SandboxHandle> {
    const sandbox = await OpenSandbox.connect({
      connectionConfig: getConnectionConfig(),
      sandboxId,
    });
    return toHandle(sandbox);
  }

  async destroy(sandboxId: string): Promise<void> {
    let sandbox: OpenSandbox | null = null;
    try {
      sandbox = await OpenSandbox.connect({
        connectionConfig: getConnectionConfig(),
        sandboxId,
      });
    } catch (error) {
      if (isOpenSandboxNotFoundError(error)) {
        return;
      }
      throw error;
    }

    try {
      await sandbox.kill();
    } catch (error) {
      if (!isOpenSandboxNotFoundError(error)) {
        throw error;
      }
    } finally {
      await sandbox.close().catch(() => {});
    }
  }

  async renew(sandboxId: string, ttlMs: number): Promise<void> {
    const sandbox = await OpenSandbox.connect({
      connectionConfig: getConnectionConfig(),
      sandboxId,
    });

    try {
      await sandbox.renew(Math.ceil(ttlMs / 1000));
    } finally {
      await sandbox.close();
    }
  }
}
