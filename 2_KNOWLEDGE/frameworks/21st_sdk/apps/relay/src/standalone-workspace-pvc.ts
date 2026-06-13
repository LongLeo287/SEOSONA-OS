import { execFile as execFileCallback } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import https from 'node:https';
import { promisify } from 'node:util';
import { SandboxWorkspaceVolume } from './sandbox-backends/types';

const execFile = promisify(execFileCallback);

const IS_STANDALONE_APP = process.env.NEXT_PUBLIC_IS_STANDALONE_APP === 'true';
const DISABLE_STANDALONE_WORKSPACE_VOLUMES =
  process.env.STANDALONE_DISABLE_WORKSPACE_VOLUMES === 'true';
const DEFAULT_NAMESPACE = 'opensandbox';
const DEFAULT_STORAGE_CLASS = 'opensandbox-ebs-gp3';
const DEFAULT_STORAGE_SIZE = '1Gi';
const SERVICE_ACCOUNT_TOKEN_PATH = '/var/run/secrets/kubernetes.io/serviceaccount/token';
const SERVICE_ACCOUNT_CA_PATH = '/var/run/secrets/kubernetes.io/serviceaccount/ca.crt';

export const STANDALONE_WORKSPACE_DEVICE_PATH = '/dev/workspace-disk';

type KubernetesRequestOptions = {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  body?: unknown;
  expectedStatuses: number[];
};

type KubernetesResponse<T> = {
  status: number;
  body: T | null;
};

type PersistentVolumeClaim = {
  status?: {
    phase?: string;
  };
};

type ExternalTokenCache = {
  token: string;
  expiresAtMs: number;
} | null;

type ClusterAccessConfig = {
  endpoint: string;
  ca: string;
  namespace: string;
  storageClassName: string;
  storageSize: string;
  getToken(): Promise<string>;
};

let cachedExternalToken: ExternalTokenCache = null;

function getNamespace(): string {
  return process.env.STANDALONE_EKS_NAMESPACE?.trim() || DEFAULT_NAMESPACE;
}

function getStorageClassName(): string {
  return process.env.STANDALONE_WORKSPACE_STORAGE_CLASS?.trim() || DEFAULT_STORAGE_CLASS;
}

function getStorageSize(): string {
  return process.env.STANDALONE_WORKSPACE_STORAGE_SIZE?.trim() || DEFAULT_STORAGE_SIZE;
}

export function isStandaloneWorkspaceVolumesEnabled(
  provider: string | null | undefined,
): boolean {
  return IS_STANDALONE_APP
    && provider === 'opensandbox'
    && !DISABLE_STANDALONE_WORKSPACE_VOLUMES;
}

export function getStandaloneWorkspaceClaimName(sandboxId: string): string {
  const hash = createHash('sha256').update(sandboxId).digest('hex').slice(0, 24);
  return `ws-${hash}`;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}

async function getInClusterAccessConfig(): Promise<ClusterAccessConfig | null> {
  const host = process.env.KUBERNETES_SERVICE_HOST?.trim();
  if (!host) return null;

  const hasToken = await fileExists(SERVICE_ACCOUNT_TOKEN_PATH);
  const hasCa = await fileExists(SERVICE_ACCOUNT_CA_PATH);
  if (!hasToken || !hasCa) return null;

  const port = process.env.KUBERNETES_SERVICE_PORT_HTTPS?.trim() || '443';
  const ca = await readFile(SERVICE_ACCOUNT_CA_PATH, 'utf8');

  return {
    endpoint: `https://${host}:${port}`,
    ca,
    namespace: getNamespace(),
    storageClassName: getStorageClassName(),
    storageSize: getStorageSize(),
    async getToken() {
      return (await readFile(SERVICE_ACCOUNT_TOKEN_PATH, 'utf8')).trim();
    },
  };
}

async function getExternalEksToken(): Promise<string> {
  const now = Date.now();
  if (cachedExternalToken && cachedExternalToken.expiresAtMs > now + 60_000) {
    return cachedExternalToken.token;
  }

  const clusterName = process.env.STANDALONE_EKS_CLUSTER_NAME?.trim();
  if (!clusterName) {
    throw new Error('STANDALONE_EKS_CLUSTER_NAME is required for standalone PVC management');
  }

  const region =
    process.env.AWS_REGION?.trim()
    || process.env.AWS_DEFAULT_REGION?.trim();
  if (!region) {
    throw new Error('AWS_REGION or AWS_DEFAULT_REGION is required for standalone PVC management');
  }

  const { stdout } = await execFile('aws', [
    'eks',
    'get-token',
    '--cluster-name',
    clusterName,
    '--region',
    region,
    '--output',
    'json',
  ]);

  const parsed = JSON.parse(stdout) as {
    status?: {
      token?: string;
      expirationTimestamp?: string;
    };
  };

  const token = parsed.status?.token;
  if (!token) {
    throw new Error('aws eks get-token returned no token');
  }

  const expirationTimestamp = parsed.status?.expirationTimestamp;
  cachedExternalToken = {
    token,
    expiresAtMs: expirationTimestamp ? Date.parse(expirationTimestamp) : now + 10 * 60_000,
  };

  return token;
}

async function getExternalAccessConfig(): Promise<ClusterAccessConfig> {
  const endpoint = process.env.STANDALONE_EKS_CLUSTER_ENDPOINT?.trim();
  if (!endpoint) {
    throw new Error('STANDALONE_EKS_CLUSTER_ENDPOINT is required for standalone PVC management');
  }

  const caBase64 = process.env.STANDALONE_EKS_CLUSTER_CA_BASE64?.trim();
  if (!caBase64) {
    throw new Error('STANDALONE_EKS_CLUSTER_CA_BASE64 is required for standalone PVC management');
  }

  return {
    endpoint,
    ca: Buffer.from(caBase64, 'base64').toString('utf8'),
    namespace: getNamespace(),
    storageClassName: getStorageClassName(),
    storageSize: getStorageSize(),
    getToken: getExternalEksToken,
  };
}

async function getClusterAccessConfig(): Promise<ClusterAccessConfig> {
  const inCluster = await getInClusterAccessConfig();
  if (inCluster) return inCluster;
  return getExternalAccessConfig();
}

async function kubernetesRequest<T>(
  options: KubernetesRequestOptions,
): Promise<KubernetesResponse<T>> {
  const config = await getClusterAccessConfig();
  const token = await config.getToken();
  const url = new URL(options.path, config.endpoint);
  const body = options.body ? JSON.stringify(options.body) : null;

  const response = await new Promise<KubernetesResponse<T>>((resolve, reject) => {
    const request = https.request(url, {
      method: options.method,
      ca: config.ca,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
    }, (res) => {
      const chunks: Buffer[] = [];

      res.on('data', (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });

      res.on('end', () => {
        const rawBody = Buffer.concat(chunks).toString('utf8').trim();
        let parsedBody: T | null = null;
        if (rawBody) {
          try {
            parsedBody = JSON.parse(rawBody) as T;
          } catch {
            parsedBody = null;
          }
        }
        const status = res.statusCode ?? 0;

        if (!options.expectedStatuses.includes(status)) {
          reject(new Error(
            `Kubernetes ${options.method} ${options.path} failed with ${status}: ${rawBody.slice(0, 400)}`,
          ));
          return;
        }

        resolve({ status, body: parsedBody });
      });
    });

    request.on('error', reject);

    if (body) {
      request.write(body);
    }

    request.end();
  });

  return response;
}

async function getPersistentVolumeClaim(
  claimName: string,
): Promise<PersistentVolumeClaim | null> {
  const namespace = getNamespace();
  const response = await kubernetesRequest<PersistentVolumeClaim>({
    method: 'GET',
    path: `/api/v1/namespaces/${namespace}/persistentvolumeclaims/${claimName}`,
    expectedStatuses: [200, 404],
  });

  return response.status === 404 ? null : response.body;
}

export async function ensureStandaloneWorkspacePvc(
  sandboxId: string,
): Promise<{ volume: SandboxWorkspaceVolume; created: boolean }> {
  const claimName = getStandaloneWorkspaceClaimName(sandboxId);
  let created = false;
  const namespace = getNamespace();
  const config = await getClusterAccessConfig();

  const existing = await getPersistentVolumeClaim(claimName);
  if (!existing) {
    const response = await kubernetesRequest({
      method: 'POST',
      path: `/api/v1/namespaces/${namespace}/persistentvolumeclaims`,
      expectedStatuses: [201, 409],
      body: {
        apiVersion: 'v1',
        kind: 'PersistentVolumeClaim',
        metadata: {
          name: claimName,
        },
        spec: {
          accessModes: ['ReadWriteOnce'],
          storageClassName: config.storageClassName,
          volumeMode: 'Block',
          resources: {
            requests: {
              storage: config.storageSize,
            },
          },
        },
      },
    });
    created = response.status === 201;
  }

  return {
    created,
    volume: {
      claimName,
      devicePath: STANDALONE_WORKSPACE_DEVICE_PATH,
    },
  };
}

export async function deleteStandaloneWorkspacePvc(
  sandboxId: string,
): Promise<void> {
  const claimName = getStandaloneWorkspaceClaimName(sandboxId);
  const namespace = getNamespace();

  await kubernetesRequest({
    method: 'DELETE',
    path: `/api/v1/namespaces/${namespace}/persistentvolumeclaims/${claimName}`,
    expectedStatuses: [200, 202, 404],
  });
}
