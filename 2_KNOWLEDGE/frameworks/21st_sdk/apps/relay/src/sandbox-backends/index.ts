import { ResolvedSandboxConfig, SandboxProvider } from '../deployment-metadata';
import { E2BSandboxBackend } from './e2b';
import { OpenSandboxBackend } from './opensandbox';
import { SandboxBackend } from './types';

const backends: Record<SandboxProvider, SandboxBackend> = {
  e2b: new E2BSandboxBackend(),
  opensandbox: new OpenSandboxBackend(),
};

export function getSandboxBackend(provider: SandboxProvider): SandboxBackend {
  return backends[provider];
}

export function getSandboxBackendForConfig(
  sandboxConfig: ResolvedSandboxConfig,
): SandboxBackend {
  return getSandboxBackend(sandboxConfig.provider);
}
