export interface SandboxProviderSettings {
  sandboxBaseURL: string;
  relayBaseURL: string;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
}

export interface SandboxConfig {
  provider: string;
  sandboxBaseURL: string;
  relayBaseURL: string;
  headers: () => Record<string, string>;
  fetch?: typeof fetch;
  generateId: () => string;
}

export interface SandboxImage {
  base64: string;
  mediaType: string;
  filename?: string;
}

export interface SandboxProviderOptions {
  sessionId?: string;
  images?: SandboxImage[];
}
