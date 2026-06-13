# AWS Agents Stack Terraform

Terraform for the current `agents-web` stack with an `EKS`-based sandbox plane.

## What it creates

- one `VPC`
- two public subnets
- two private subnets
- one internet gateway
- one app `EC2` VM for `agents-web`, `relay`, `proxy`, and `nginx`
- one `EKS` cluster for sandbox workloads
- one self-managed sandbox node autoscaling group
- one encrypted `EFS` filesystem for persistent sandbox volumes
- one private `ECR` repository for the OpenSandbox runtime image
- one private PostgreSQL `RDS` instance
- one private Redis `ElastiCache` instance
- one Elastic IP for the app VM

Current target architecture:

- app plane stays on one `EC2` VM
- sandbox plane moves to `EKS`
- OpenSandbox should run in `kubernetes` runtime mode
- outer sandbox runtime should use `firecracker` via Kubernetes `RuntimeClass`
- long-lived workspace state for the working Firecracker path should live on block `PVC`s, not on sandbox rootfs
- the working persistence path is:
  - `EBS`-backed `PVC`
  - `volumeMode: Block`
  - raw disk attached into guest
  - guest mounts it to `/home/user/workspace`

Current sandbox nodes use `m8i.xlarge` by default.
Reason: `kata-fc` needs KVM / nested virtualization support, and the working path turned out to be `self-managed` EKS nodes with `NestedVirtualization=enabled`, not managed node groups.

## What Terraform does right now

Terraform now prepares the AWS base for:

- `EKS` cluster + worker nodes
- self-managed sandbox node bootstrap for:
  - KVM / `vsock` modules
  - `devmapper`
  - `kata-fc` kernel override
  - `public.ecr.aws` IAM access
- `EFS` storage for sandbox `PVC`s
- `EBS CSI` addon for block volumes
- `ECR` repository for `packages/agent-runtime`
- OpenSandbox API key generation
- OpenSandbox server deployment via the vendored Helm chart
- baseline cluster resources for the working standalone path:
  - `opensandbox` namespace
  - `opensandbox-ebs-gp3` `StorageClass`
  - `relay-pvc-manager` RBAC
  - `opensandbox-image-builder` RBAC for deploy-time derived runtime image builds
  - `opensandbox-server-internal` service
- ECR push permissions for sandbox worker nodes to publish derived OpenSandbox runtime images
- outputs for the future OpenSandbox server config

Terraform does **not** yet:

- install `Kata` / `Firecracker` runtime on the sandbox nodes
- install OpenSandbox controller into the cluster
- apply `RuntimeClass`
- build or publish `packages/agent-runtime`
- configure runtime env files on the app VM

For the current `relay -> OpenSandbox -> EKS` path, `/etc/21st/relay.env` is still managed manually.
In particular, the current working setup expects:

- `OPENSANDBOX_DOMAIN=<opensandbox-server-internal NLB DNS>`
- `OPENSANDBOX_PROTOCOL=http`
- `OPENSANDBOX_API_KEY=<terraform output -raw opensandbox_api_key>`
- `OPENSANDBOX_RUNTIME_IMAGE=<terraform output opensandbox_runtime_ecr_repository_url>:<tag>`
- `OPENSANDBOX_USE_SERVER_PROXY=true`
- `OPENSANDBOX_READY_TIMEOUT_SECONDS=120`
- `STANDALONE_EKS_CLUSTER_NAME=<terraform output -raw sandbox_cluster_name>`
- `STANDALONE_EKS_CLUSTER_ENDPOINT=<terraform output -raw sandbox_cluster_endpoint>`
- `STANDALONE_EKS_CLUSTER_CA_BASE64=<terraform output -raw sandbox_cluster_certificate_authority_data>`
- `AWS_REGION=<terraform tfvars aws_region>`

For OpenSandbox `sandbox.apt` / `sandbox.build` deploy-time image builds, `/etc/21st/agents-web.env` must also include:

- `OPENSANDBOX_BUILD_IMAGE_REPOSITORY=<terraform output opensandbox_runtime_ecr_repository_url>`
- `OPENSANDBOX_BUILD_BASE_IMAGE=<same base image currently used by relay OPENSANDBOX_RUNTIME_IMAGE>`
- `STANDALONE_EKS_CLUSTER_NAME=<terraform output -raw sandbox_cluster_name>`
- `STANDALONE_EKS_CLUSTER_ENDPOINT=<terraform output -raw sandbox_cluster_endpoint>`
- `STANDALONE_EKS_CLUSTER_CA_BASE64=<terraform output -raw sandbox_cluster_certificate_authority_data>`
- `AWS_REGION=<terraform tfvars aws_region>`

Kaniko layer cache uses a separate ECR repository named
`<opensandbox runtime ECR repository name>/cache`. Terraform creates this cache
repository and grants the sandbox EKS node role push/pull permissions on both
the runtime repository and the cache repository. Without this, final derived
image pushes still work, but cache layer pushes fail and every build re-runs
expensive `apt` / `mise install` layers.

## Current OpenSandbox Runtime Base Image

The base runtime image is built from `packages/agent-runtime/Dockerfile` and published to the private OpenSandbox runtime `ECR` repository. `relay` uses this image through `OPENSANDBOX_RUNTIME_IMAGE`; `agents-web` uses the same image as `OPENSANDBOX_BUILD_BASE_IMAGE` for derived sandbox images.

Base OS and environment:

- `ubuntu:22.04`
- `mise` installed at `/usr/local/bin/mise`
- global mise config at `/opt/mise/config/config.toml`
- mise shims are first in `PATH`
- workspace-level `mise.toml` files can add or override project tools

Derived OpenSandbox images must inherit the base image mise environment instead of
redeclaring it. In practice this means the image builder should not override
`MISE_DATA_DIR`, `MISE_CONFIG_DIR`, `MISE_CACHE_DIR`, or `PATH`; those values come
from the base image. Workflow-specific mise settings should be written as a
project config at `/home/user/workspace/mise.toml` and installed from
`/home/user/workspace`, so mise merges the base global config with the workflow
project config.

Derived image tags are deterministic: `env-<buildHash>`, where the hash includes
the base image, apt packages, build commands, and cwd. The app checks ECR for
that tag before creating a Kubernetes builder job; if it already exists, the
existing image is reused and no build job is created.

Programming languages and runtimes:

- Node.js `20.20.2`
- Python `3.12.13`
- Go `1.22.12`
- Rust `1.77.2`
- Java / OpenJDK `21.0.2`

Package managers and build tools:

- npm `10.8.2`
- pnpm `8.15.6`
- yarn `1.22.22`
- uv `0.11.11`
- pip
- Cargo
- Maven `3.9.15`
- Gradle `8.14.5`
- GCC/G++ `13.4.0`
- `make`
- `cmake`
- `build-essential`

CLI and system utilities:

- `git`
- `gh`
- `curl`
- `wget`
- `jq`
- `ripgrep`
- `sqlite3`
- `psql`
- `redis-cli`
- `ssh` / `scp`
- `tmux`
- `screen`
- `tree`
- `htop`
- `vim`
- `nano`
- `zip` / `unzip` / `tar`
- `docker.io`
- `runsc`

Not included by default:

- Ruby
- PHP
- Composer
- Bundler

The detailed reproducible flow for `relay.env` and the remaining manual pieces lives in [STANDALONE-RUNBOOK.md](/Users/daniil/Work/21st-copy/apps/agents-web/infra/STANDALONE-RUNBOOK.md).

That is intentional: this change moves infra from “dedicated OpenSandbox EC2 VM” to “EKS-ready sandbox plane”, but does not pretend the whole Kubernetes install is finished.

## Repo artifacts for the next step

Prepared files / Terraform-managed sources:

- Helm values:
  - [helm/kata-deploy.values.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/helm/kata-deploy.values.yaml)
  - [helm/opensandbox-controller.values.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/helm/opensandbox-controller.values.yaml)
  - [helm/opensandbox-server.values.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/helm/opensandbox-server.values.yaml)
- Kubernetes manifests:
  - [k8s/runtimeclass-kata-fc.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/runtimeclass-kata-fc.yaml)
  - [k8s/opensandbox-efs-storageclass.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/opensandbox-efs-storageclass.yaml)
  - [k8s/opensandbox-ebs-gp3-storageclass.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/opensandbox-ebs-gp3-storageclass.yaml)
  - [k8s/opensandbox-server-internal-service.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/opensandbox-server-internal-service.yaml)
  - [k8s/relay-pvc-manager-rbac.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/relay-pvc-manager-rbac.yaml)
  - [k8s/opensandbox-image-builder-rbac.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/opensandbox-image-builder-rbac.yaml)

Terraform now applies the `opensandbox-server` and `opensandbox-controller` Helm releases plus the block-PVC baseline resources above. `kata-deploy` and `relay.env` are still intentionally manual.

## Usage

```bash
cd /Users/daniil/Work/21st-copy/apps/agents-web/infra
cp terraform.tfvars.example terraform.tfvars
terraform init
eval "$(aws configure export-credentials --format env)" && terraform plan
eval "$(aws configure export-credentials --format env)" && terraform apply
```

## Useful outputs

```bash
terraform output app_public_ip
terraform output app_url
terraform output relay_url
terraform output proxy_url
terraform output sandbox_cluster_name
terraform output sandbox_cluster_endpoint
terraform output sandbox_cluster_certificate_authority_data
terraform output sandbox_node_group_name
terraform output sandbox_k8s_runtime_class
terraform output sandbox_efs_file_system_id
terraform output sandbox_efs_dns_name
terraform output opensandbox_runtime_ecr_repository_url
terraform output opensandbox_runtime_image_example
terraform output -raw opensandbox_api_key
terraform output -raw opensandbox_server_config
terraform output -raw database_url
terraform output -raw redis_url
```

## Important constraints

- this stack now assumes stateful Firecracker sandboxes will use `template mode + block PVC`
- `poolRef + volumes` is not a good fit for the target design
- sandbox nodes are kept in public subnets for now so the cluster can pull images without adding `NAT` at this step
- the old dedicated OpenSandbox VM path is removed from Terraform

The historical `EFS` / filesystem-`PVC` path is still documented in the runbook, but it is **not** the working Firecracker persistence path.
The current working path is documented in [STANDALONE-RUNBOOK.md](/Users/daniil/Work/21st-copy/apps/agents-web/infra/STANDALONE-RUNBOOK.md):

- OpenSandbox server patched for `devicePath`
- block `PVC` with `volumeMode: Block`
- runtime mount inside guest

## Existing manual ECR repo

If the runtime repository was already created manually, import it before the next apply:

```bash
cd /Users/daniil/Work/21st-copy/apps/agents-web/infra
terraform import aws_ecr_repository.opensandbox_runtime 21st-agent-runtime-opensandbox
```

Terraform creates the repository, but it still does **not** build or push the runtime image.

## First apply on an existing cluster

If these resources already exist from the manual rollout, import them before the first apply:

```bash
cd /Users/daniil/Work/21st-copy/apps/agents-web/infra
terraform import helm_release.opensandbox_controller opensandbox-system/opensandbox-controller
terraform import helm_release.opensandbox_server opensandbox-system/opensandbox-server
terraform import kubernetes_namespace_v1.opensandbox opensandbox
terraform import kubernetes_storage_class_v1.opensandbox_ebs_gp3 opensandbox-ebs-gp3
terraform import kubernetes_role_v1.relay_pvc_manager opensandbox/relay-pvc-manager
terraform import kubernetes_role_binding_v1.relay_pvc_manager opensandbox/relay-pvc-manager
terraform import kubernetes_service_v1.opensandbox_server_internal opensandbox-system/opensandbox-server-internal
```

## Next manual step after Terraform

After apply, the expected next step is:

1. install `Kata` / `Firecracker` runtime on sandbox nodes
   - current intended path: `kata-deploy` Helm chart with [helm/kata-deploy.values.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/helm/kata-deploy.values.yaml)
   - Terraform already prepares the host side for that runtime:
     - nested virtualization
     - `devmapper`
     - `kata-fc` drop-ins
     - `ecr-public` IAM
2. deploy OpenSandbox controller into `EKS`
3. set OpenSandbox to:
   - `runtime.type = kubernetes`
   - `secure_runtime.type = firecracker`
   - `secure_runtime.k8s_runtime_class = <terraform output sandbox_k8s_runtime_class>`
4. relay now creates workspace `PVC`s dynamically at runtime for standalone OpenSandbox sandboxes

## Schema

The SQL schema file lives at [agents-schema.sql](/Users/daniil/Work/21st-copy/apps/agents-web/infra/agents-schema.sql).
