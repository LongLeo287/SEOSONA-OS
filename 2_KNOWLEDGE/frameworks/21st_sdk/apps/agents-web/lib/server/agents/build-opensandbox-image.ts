import { execFile as execFileCallback } from "node:child_process"
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import https from "node:https"
import { promisify } from "node:util"

import type { RawSandboxConfig } from "./sandbox-config"

const execFile = promisify(execFileCallback)

type ProgressReporter = (message: string) => void

type KubernetesRequestOptions = {
  method: "GET" | "POST" | "DELETE"
  path: string
  body?: unknown
  expectedStatuses: number[]
}

type KubernetesResponse<T> = {
  status: number
  body: T | null
  rawBody: string
}

type KubernetesJob = {
  status?: {
    succeeded?: number
    failed?: number
  }
}

type KubernetesPodList = {
  items?: Array<{
    metadata?: {
      name?: string
    }
  }>
}

type KubernetesToleration = {
  key?: string
  operator?: string
  value?: string
  effect?: string
  tolerationSeconds?: number
}

type ExternalTokenCache = {
  token: string
  expiresAtMs: number
} | null

type EcrRepository = {
  registryId: string
  region: string
  repositoryName: string
}

type KubernetesConfig = {
  endpoint: string
  ca: string
  getToken(): Promise<string>
}

const SERVICE_ACCOUNT_TOKEN_PATH = "/var/run/secrets/kubernetes.io/serviceaccount/token"
const SERVICE_ACCOUNT_CA_PATH = "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"
const DEFAULT_NAMESPACE = "opensandbox"
const DEFAULT_BUILDER_IMAGE = "gcr.io/kaniko-project/executor:v1.24.0"
const DEFAULT_SERVICE_ACCOUNT = "opensandbox-image-builder"
const DEFAULT_BUILD_TIMEOUT_MS = 15 * 60 * 1000
const DEFAULT_BUILD_NODE_SELECTOR: Record<string, string> = {
  workload: "sandbox",
}
const DEFAULT_BUILD_TOLERATIONS: KubernetesToleration[] = [
  {
    key: "runtime",
    operator: "Equal",
    value: "kata-fc",
    effect: "NoSchedule",
  },
]

let cachedExternalToken: ExternalTokenCache = null

function getNamespace() {
  return process.env.OPENSANDBOX_BUILD_NAMESPACE?.trim() || DEFAULT_NAMESPACE
}

function getBuilderImage() {
  return process.env.OPENSANDBOX_BUILD_JOB_IMAGE?.trim() || DEFAULT_BUILDER_IMAGE
}

function getBuilderServiceAccount() {
  return process.env.OPENSANDBOX_BUILD_SERVICE_ACCOUNT?.trim() || DEFAULT_SERVICE_ACCOUNT
}

function getBuildTimeoutMs() {
  const raw = process.env.OPENSANDBOX_BUILD_TIMEOUT_MS?.trim()
  if (!raw) return DEFAULT_BUILD_TIMEOUT_MS
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_BUILD_TIMEOUT_MS
}

function parseJsonEnv<T>(name: string, fallback: T): T {
  const raw = process.env[name]?.trim()
  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    throw new Error(`${name} must be valid JSON`)
  }
}

function getBuilderNodeSelector() {
  return parseJsonEnv<Record<string, string>>(
    "OPENSANDBOX_BUILD_NODE_SELECTOR_JSON",
    DEFAULT_BUILD_NODE_SELECTOR,
  )
}

function getBuilderTolerations() {
  return parseJsonEnv<KubernetesToleration[]>(
    "OPENSANDBOX_BUILD_TOLERATIONS_JSON",
    DEFAULT_BUILD_TOLERATIONS,
  )
}

function getBaseImage() {
  const image =
    process.env.OPENSANDBOX_BUILD_BASE_IMAGE?.trim()
    || process.env.OPENSANDBOX_RUNTIME_IMAGE?.trim()
  if (!image) {
    throw new Error("OPENSANDBOX_BUILD_BASE_IMAGE or OPENSANDBOX_RUNTIME_IMAGE is required for OpenSandbox build")
  }
  return image
}

function getOutputRepository() {
  const repository = process.env.OPENSANDBOX_BUILD_IMAGE_REPOSITORY?.trim()
  if (!repository) {
    throw new Error("OPENSANDBOX_BUILD_IMAGE_REPOSITORY is required for OpenSandbox build")
  }
  return repository
}

function parseEcrRepository(repository: string): EcrRepository | null {
  const match = repository.match(/^(\d+)\.dkr\.ecr\.([^.]+)\.amazonaws\.com(?:\.cn)?\/(.+)$/)
  if (!match) return null

  return {
    registryId: match[1]!,
    region: match[2]!,
    repositoryName: match[3]!,
  }
}

async function ecrImageTagExists(repository: string, imageTag: string) {
  const ecrRepository = parseEcrRepository(repository)
  if (!ecrRepository) return false

  try {
    await execFile("aws", [
      "ecr",
      "describe-images",
      "--region",
      ecrRepository.region,
      "--registry-id",
      ecrRepository.registryId,
      "--repository-name",
      ecrRepository.repositoryName,
      "--image-ids",
      `imageTag=${imageTag}`,
      "--output",
      "json",
    ])
    return true
  } catch (error) {
    const stderr = error && typeof error === "object" && "stderr" in error
      ? String(error.stderr)
      : ""
    const code = error && typeof error === "object" && "code" in error
      ? String(error.code)
      : ""
    if (
      code === "ENOENT"
      || stderr.includes("ImageNotFoundException")
      || stderr.includes("RepositoryNotFoundException")
      || stderr.includes("Unable to locate credentials")
    ) {
      return false
    }

    throw error
  }
}

function makeBuildHash(params: {
  baseImage: string
  apt: string[]
  build: string[]
  cwd?: string
}) {
  return createHash("sha256")
    .update(JSON.stringify({
      version: 1,
      baseImage: params.baseImage,
      apt: params.apt,
      build: params.build,
      cwd: params.cwd,
    }))
    .digest("hex")
    .slice(0, 16)
}

function makeDockerfile(params: {
  baseImage: string
  apt: string[]
  build: string[]
  cwd?: string
}) {
  const lines = [
    `FROM ${params.baseImage}`,
    "USER root",
    `SHELL ["/bin/bash", "-lc"]`,
    "ENV MISE_INSTALL_PATH=/usr/local/bin/mise",
    "ENV MISE_YES=1",
    "ENV MISE_NO_ANALYTICS=1",
  ]

  if (params.apt.length > 0) {
    lines.push(
      `RUN apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq ${params.apt.join(" ")} && rm -rf /var/lib/apt/lists/*`,
    )
  }

  if (params.cwd) {
    lines.push(`RUN mkdir -p ${JSON.stringify(params.cwd)}`)
    lines.push(`WORKDIR ${params.cwd}`)
  }

  for (const command of params.build) {
    lines.push(`RUN ${command}`)
  }

  return `${lines.join("\n")}\n`
}

async function fileExists(path: string) {
  try {
    await readFile(path)
    return true
  } catch {
    return false
  }
}

async function getInClusterKubernetesConfig(): Promise<KubernetesConfig | null> {
  const host = process.env.KUBERNETES_SERVICE_HOST?.trim()
  if (!host) return null

  if (!(await fileExists(SERVICE_ACCOUNT_TOKEN_PATH)) || !(await fileExists(SERVICE_ACCOUNT_CA_PATH))) {
    return null
  }

  const port = process.env.KUBERNETES_SERVICE_PORT_HTTPS?.trim() || "443"
  return {
    endpoint: `https://${host}:${port}`,
    ca: await readFile(SERVICE_ACCOUNT_CA_PATH, "utf8"),
    async getToken() {
      return (await readFile(SERVICE_ACCOUNT_TOKEN_PATH, "utf8")).trim()
    },
  }
}

async function getExternalEksToken() {
  const now = Date.now()
  if (cachedExternalToken && cachedExternalToken.expiresAtMs > now + 60_000) {
    return cachedExternalToken.token
  }

  const clusterName = process.env.STANDALONE_EKS_CLUSTER_NAME?.trim()
  if (!clusterName) {
    throw new Error("STANDALONE_EKS_CLUSTER_NAME is required for OpenSandbox image build")
  }

  const region =
    process.env.AWS_REGION?.trim()
    || process.env.AWS_DEFAULT_REGION?.trim()
  if (!region) {
    throw new Error("AWS_REGION or AWS_DEFAULT_REGION is required for OpenSandbox image build")
  }

  const { stdout } = await execFile("aws", [
    "eks",
    "get-token",
    "--cluster-name",
    clusterName,
    "--region",
    region,
    "--output",
    "json",
  ])

  const parsed = JSON.parse(stdout) as {
    status?: {
      token?: string
      expirationTimestamp?: string
    }
  }
  const token = parsed.status?.token
  if (!token) {
    throw new Error("aws eks get-token returned no token for OpenSandbox image build")
  }

  cachedExternalToken = {
    token,
    expiresAtMs: parsed.status?.expirationTimestamp
      ? Date.parse(parsed.status.expirationTimestamp)
      : now + 10 * 60_000,
  }

  return token
}

async function getExternalKubernetesConfig(): Promise<KubernetesConfig> {
  const endpoint = process.env.STANDALONE_EKS_CLUSTER_ENDPOINT?.trim()
  if (!endpoint) {
    throw new Error("STANDALONE_EKS_CLUSTER_ENDPOINT is required for OpenSandbox image build")
  }

  const caBase64 = process.env.STANDALONE_EKS_CLUSTER_CA_BASE64?.trim()
  if (!caBase64) {
    throw new Error("STANDALONE_EKS_CLUSTER_CA_BASE64 is required for OpenSandbox image build")
  }

  return {
    endpoint,
    ca: Buffer.from(caBase64, "base64").toString("utf8"),
    getToken: getExternalEksToken,
  }
}

async function getKubernetesConfig() {
  const inCluster = await getInClusterKubernetesConfig()
  if (inCluster) return inCluster
  return getExternalKubernetesConfig()
}

async function kubernetesRequest<T>(
  options: KubernetesRequestOptions,
): Promise<KubernetesResponse<T>> {
  const config = await getKubernetesConfig()
  const token = await config.getToken()
  const url = new URL(options.path, config.endpoint)
  const body = options.body ? JSON.stringify(options.body) : null

  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      method: options.method,
      ca: config.ca,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
    }, (res) => {
      const chunks: Buffer[] = []

      res.on("data", (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      })

      res.on("end", () => {
        const rawBody = Buffer.concat(chunks).toString("utf8").trim()
        let parsedBody: T | null = null
        if (rawBody) {
          try {
            parsedBody = JSON.parse(rawBody) as T
          } catch {
            parsedBody = null
          }
        }

        const status = res.statusCode ?? 0
        if (!options.expectedStatuses.includes(status)) {
          reject(new Error(
            `Kubernetes ${options.method} ${options.path} failed with ${status}: ${rawBody.slice(0, 400)}`,
          ))
          return
        }

        resolve({ status, body: parsedBody, rawBody })
      })
    })

    request.on("error", reject)

    if (body) {
      request.write(body)
    }

    request.end()
  })
}

function buildConfigMap(params: {
  namespace: string
  name: string
  dockerfile: string
}) {
  return {
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name: params.name,
      namespace: params.namespace,
    },
    data: {
      Dockerfile: params.dockerfile,
    },
  }
}

function buildJob(params: {
  namespace: string
  name: string
  configMapName: string
  imageRef: string
}) {
  return {
    apiVersion: "batch/v1",
    kind: "Job",
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: {
        app: "opensandbox-image-builder",
      },
    },
    spec: {
      backoffLimit: 0,
      ttlSecondsAfterFinished: 3600,
      template: {
        spec: {
          serviceAccountName: getBuilderServiceAccount(),
          nodeSelector: getBuilderNodeSelector(),
          tolerations: getBuilderTolerations(),
          restartPolicy: "Never",
          containers: [
            {
              name: "kaniko",
              image: getBuilderImage(),
              args: [
                "--dockerfile=/workspace/Dockerfile",
                "--context=dir:///workspace",
                `--destination=${params.imageRef}`,
                "--cache=true",
              ],
              volumeMounts: [
                {
                  name: "build-context",
                  mountPath: "/workspace",
                },
              ],
            },
          ],
          volumes: [
            {
              name: "build-context",
              configMap: {
                name: params.configMapName,
              },
            },
          ],
        },
      },
    },
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function readJobLogs(namespace: string, jobName: string) {
  const pods = await kubernetesRequest<KubernetesPodList>({
    method: "GET",
    path: `/api/v1/namespaces/${namespace}/pods?labelSelector=${encodeURIComponent(`job-name=${jobName}`)}`,
    expectedStatuses: [200],
  })
  const podName = pods.body?.items?.[0]?.metadata?.name
  if (!podName) return ""

  const logs = await kubernetesRequest<string>({
    method: "GET",
    path: `/api/v1/namespaces/${namespace}/pods/${podName}/log?container=kaniko&tailLines=80`,
    expectedStatuses: [200, 404],
  })

  return logs.rawBody
}

async function waitForJob(params: {
  namespace: string
  jobName: string
  onProgress?: ProgressReporter
}) {
  const timeoutAt = Date.now() + getBuildTimeoutMs()
  while (Date.now() < timeoutAt) {
    const job = await kubernetesRequest<KubernetesJob>({
      method: "GET",
      path: `/apis/batch/v1/namespaces/${params.namespace}/jobs/${params.jobName}`,
      expectedStatuses: [200],
    })
    const status = job.body?.status
    if (status?.succeeded && status.succeeded > 0) return
    if (status?.failed && status.failed > 0) {
      const logs = await readJobLogs(params.namespace, params.jobName)
      throw new Error(`OpenSandbox image build failed${logs ? `: ${logs}` : ""}`)
    }

    await sleep(3000)
  }

  throw new Error(`OpenSandbox image build timed out after ${getBuildTimeoutMs()}ms`)
}

export async function buildOpenSandboxImage(params: {
  sandboxConfig?: RawSandboxConfig | null
  onProgress?: ProgressReporter
}) {
  const apt = params.sandboxConfig?.apt ?? []
  const build = params.sandboxConfig?.build ?? []
  const cwd = params.sandboxConfig?.cwd
  if (apt.length === 0 && build.length === 0) return null

  const baseImage = getBaseImage()
  const repository = getOutputRepository()
  const buildHash = makeBuildHash({ baseImage, apt, build, cwd })
  const imageTag = `env-${buildHash}`
  const imageRef = `${repository}:${imageTag}`
  const namespace = getNamespace()
  const name = `osb-img-${buildHash}-${Date.now().toString(36)}`

  if (await ecrImageTagExists(repository, imageTag)) {
    params.onProgress?.(`Reusing cached OpenSandbox runtime image: ${imageRef}`)
    return {
      imageRef,
      buildHash,
      baseImage,
    }
  }

  params.onProgress?.("Building OpenSandbox runtime image...")

  await kubernetesRequest({
    method: "POST",
    path: `/api/v1/namespaces/${namespace}/configmaps`,
    body: buildConfigMap({
      namespace,
      name,
      dockerfile: makeDockerfile({ baseImage, apt, build, cwd }),
    }),
    expectedStatuses: [201],
  })

  let completed = false
  try {
    await kubernetesRequest({
      method: "POST",
      path: `/apis/batch/v1/namespaces/${namespace}/jobs`,
      body: buildJob({
        namespace,
        name,
        configMapName: name,
        imageRef,
      }),
      expectedStatuses: [201],
    })

    await waitForJob({
      namespace,
      jobName: name,
      onProgress: params.onProgress,
    })
    completed = true
  } finally {
    if (!completed) {
      await kubernetesRequest({
        method: "DELETE",
        path: `/apis/batch/v1/namespaces/${namespace}/jobs/${name}`,
        expectedStatuses: [200, 202, 404],
      }).catch(() => {})
    }

    await kubernetesRequest({
      method: "DELETE",
      path: `/api/v1/namespaces/${namespace}/configmaps/${name}`,
      expectedStatuses: [200, 202, 404],
    }).catch(() => {})
  }

  params.onProgress?.(`OpenSandbox runtime image ready: ${imageRef}`)

  return {
    imageRef,
    buildHash,
    baseImage,
  }
}
