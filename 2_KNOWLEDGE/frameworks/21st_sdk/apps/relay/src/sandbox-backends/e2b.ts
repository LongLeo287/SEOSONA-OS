import { Sandbox } from '@e2b/code-interpreter';
import { ResolvedE2BSandboxConfig } from '../deployment-metadata';
import { SANDBOX_TIMEOUT_MS } from '../sandbox-constants';
import { getSandboxTimeoutMs } from '../sandbox-keepalive';
import {
  CreateSandboxParams,
  SandboxBackend,
  SandboxExecOptions,
  SandboxExecResult,
  SandboxFileData,
  SandboxHandle,
} from './types';

const ROOT_USER = 'root';

function getTemplateId(config: ResolvedE2BSandboxConfig): string {
  return process.env.RELAY_FORCE_TEMPLATE ?? config.templateId ?? process.env.RELAY_SANDBOX_TEMPLATE ?? '';
}

function toBaseUrl(sandboxId: string, port: number): string {
  return `https://${port}-${sandboxId}.e2b.app`;
}

function toRunOptions(options?: SandboxExecOptions) {
  return {
    ...(options?.cwd ? { cwd: options.cwd } : {}),
    ...(options?.envs ? { envs: options.envs } : {}),
    ...(options?.timeoutMs ? { timeoutMs: options.timeoutMs } : {}),
    ...(options?.runAs === 'root' ? { user: ROOT_USER } : {}),
  };
}

async function runCommand(
  sandbox: Sandbox,
  command: string,
  options?: SandboxExecOptions,
): Promise<SandboxExecResult> {
  try {
    const result = await sandbox.commands.run(command, toRunOptions(options));
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode ?? 0,
    };
  } catch (error: any) {
    if (error?.stdout !== undefined || error?.stderr !== undefined) {
      return {
        stdout: error.stdout ?? '',
        stderr: error.stderr ?? '',
        exitCode: error.exitCode ?? 1,
      };
    }

    throw error;
  }
}

function toHandle(sandbox: Sandbox): SandboxHandle {
  return {
    provider: 'e2b',
    sandboxId: sandbox.sandboxId,
    async close() {},
    async destroy() {
      await Sandbox.kill(sandbox.sandboxId);
    },
    async renew(ttlMs: number) {
      await Sandbox.setTimeout(sandbox.sandboxId, ttlMs);
    },
    async getRuntimeTransport(port: number) {
      return { baseUrl: toBaseUrl(sandbox.sandboxId, port) };
    },
    async exec(command, options) {
      return runCommand(sandbox, command, options);
    },
    async writeFile(path, data) {
      await sandbox.files.write(path, data as any, { user: ROOT_USER });
    },
    async writeFiles(entries) {
      await sandbox.files.write(
        entries.map((entry) => ({ path: entry.path, data: entry.data as any })),
        { user: ROOT_USER },
      );
    },
    async readText(path) {
      return sandbox.files.read(path, { format: 'text', user: ROOT_USER }) as Promise<string>;
    },
    async readBlob(path) {
      return sandbox.files.read(path, { format: 'blob', user: ROOT_USER }) as Promise<Blob>;
    },
    async readStream(path) {
      return sandbox.files.read(path, { format: 'stream', user: ROOT_USER }) as Promise<ReadableStream<Uint8Array>>;
    },
  };
}

export class E2BSandboxBackend implements SandboxBackend {
  provider = 'e2b' as const;

  async create(params: CreateSandboxParams): Promise<SandboxHandle> {
    if (params.sandboxConfig.provider !== 'e2b') {
      throw new Error('E2BSandboxBackend requires an E2B sandbox config');
    }

    const templateId = getTemplateId(params.sandboxConfig);
    if (!templateId) {
      throw new Error('RELAY_SANDBOX_TEMPLATE env var is required for E2B sandboxes');
    }

    const effectiveTimeoutMs = params.timeoutMs ?? SANDBOX_TIMEOUT_MS;
    const effectiveAllowOut = params.networkAllowOut && params.networkAllowOut.length > 0
      ? params.networkAllowOut
      : undefined;
    const effectiveDenyOut = params.networkDenyOut && params.networkDenyOut.length > 0
      ? params.networkDenyOut
      : undefined;

    const sandbox = await Sandbox.betaCreate(templateId, {
      timeoutMs: effectiveTimeoutMs,
      autoPause: true,
      ...(params.envVars ? { envs: params.envVars } : {}),
      ...((effectiveAllowOut || effectiveDenyOut) && {
        network: {
          ...(effectiveAllowOut ? { allowOut: effectiveAllowOut } : {}),
          ...(effectiveDenyOut ? { denyOut: effectiveDenyOut } : {}),
        },
      }),
      metadata: {
        ...(params.teamId ? { teamId: params.teamId } : {}),
        ...(params.clientSandboxId ? { clientSandboxId: params.clientSandboxId } : {}),
        ...(params.runtime ? { runtime: params.runtime } : {}),
        ...(params.userId ? { userId: params.userId } : {}),
        timeoutMs: String(effectiveTimeoutMs),
      },
    });

    return toHandle(sandbox);
  }

  async connect(sandboxId: string): Promise<SandboxHandle> {
    const sandbox = await Sandbox.connect(sandboxId, { timeoutMs: await getSandboxTimeoutMs(sandboxId) });
    return toHandle(sandbox);
  }

  async destroy(sandboxId: string): Promise<void> {
    await Sandbox.kill(sandboxId);
  }

  async renew(sandboxId: string, ttlMs: number): Promise<void> {
    await Sandbox.setTimeout(sandboxId, ttlMs);
  }
}
