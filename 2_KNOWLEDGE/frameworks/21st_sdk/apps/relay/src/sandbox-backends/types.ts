import type { ResolvedSandboxConfig, SandboxProvider } from '../deployment-metadata';

export type RuntimeTransport = {
  baseUrl: string;
  headers?: Record<string, string>;
};

export type SandboxExecOptions = {
  cwd?: string;
  envs?: Record<string, string>;
  timeoutMs?: number;
  runAs?: 'default' | 'root';
};

export type SandboxExecResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
};

export type SandboxFileData =
  | string
  | Blob
  | ArrayBuffer
  | ReadableStream<Uint8Array>
  | Uint8Array;

export type SandboxWorkspaceVolume = {
  claimName: string;
  devicePath: string;
};

export interface SandboxHandle {
  provider: SandboxProvider;
  sandboxId: string;
  close(): Promise<void>;
  destroy(): Promise<void>;
  renew(ttlMs: number): Promise<void>;
  getRuntimeTransport(port: number): Promise<RuntimeTransport>;
  exec(command: string, options?: SandboxExecOptions): Promise<SandboxExecResult>;
  writeFile(path: string, data: SandboxFileData): Promise<void>;
  writeFiles(entries: Array<{ path: string; data: SandboxFileData }>): Promise<void>;
  readText(path: string): Promise<string>;
  readBlob(path: string): Promise<Blob>;
  readStream(path: string): Promise<ReadableStream<Uint8Array>>;
}

export type CreateSandboxParams = {
  sandboxConfig: ResolvedSandboxConfig;
  runtime: string;
  userId: string;
  teamId?: string;
  clientSandboxId?: string;
  envVars?: Record<string, string> | null;
  timeoutMs?: number;
  networkAllowOut?: string[];
  networkDenyOut?: string[];
  workspaceVolume?: SandboxWorkspaceVolume | null;
};

export interface SandboxBackend {
  provider: SandboxProvider;
  create(params: CreateSandboxParams): Promise<SandboxHandle>;
  connect(sandboxId: string): Promise<SandboxHandle>;
  destroy(sandboxId: string): Promise<void>;
  renew(sandboxId: string, ttlMs: number): Promise<void>;
}
