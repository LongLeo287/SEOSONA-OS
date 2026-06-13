# Agents Standalone AWS Runbook

Этот файл описывает текущий standalone-контур `agents-web` на AWS и фиксирует ошибки, которые нельзя повторять.

## 0. Current Sandbox Plane

Ниже в файле остались старые operational notes про EC2-based OpenSandbox rollout.  
Их **не удаляем**, потому что там уже накоплены полезные debug/ops детали.

Но для **текущего целевого sandbox-plane** source of truth теперь такой:

- app plane всё ещё живёт на одной `EC2` VM
- sandbox plane должен идти через `EKS`
- OpenSandbox должен работать в `kubernetes` runtime
- outer runtime должен идти через `Firecracker`-like `RuntimeClass`
- persistent state для рабочего Firecracker path должен жить через `EBS`-backed block `PVC`
- этот block `PVC` должен attach-иться в sandbox как raw device и монтироваться уже inside guest
- stateful sandbox-ы должны идти через `template mode`, не через `pool`
- sandbox nodes должны быть на instance family с KVM / nested virtualization support; текущий target по умолчанию = `m8i.xlarge`

Если дальше по файлу встречается старый path:

- отдельная OpenSandbox VM
- Docker runtime на отдельной VM
- `relay -> <opensandbox_private_ip>:8080`

то это **legacy notes**, а не target architecture для нового rollout.

### Что уже покрыто Terraform

Сейчас Terraform уже поднимает:

- `EKS` cluster
- sandbox node group
- label `workload=sandbox` на sandbox nodes
- `EFS`
- `EBS CSI` addon
- `aws-efs-csi-driver`
- `opensandbox-server` Helm release
- `opensandbox` namespace
- `opensandbox-ebs-gp3` `StorageClass`
- `relay-pvc-manager` RBAC
- `opensandbox-server-internal` service
- outputs для OpenSandbox k8s config

### Что Terraform ещё не покрывает

Пока Terraform **не** делает:

- install `Kata` / `Firecracker` runtime на sandbox nodes
- create `RuntimeClass`
- deploy OpenSandbox controller в кластер
- configure runtime env files on the app VM
- build/push custom runtime images
- create runtime `PVC`s at relay request time

### Какие файлы уже подготовлены в repo

Helm values:

- [helm/kata-deploy.values.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/helm/kata-deploy.values.yaml)
- [helm/opensandbox-controller.values.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/helm/opensandbox-controller.values.yaml)
- [helm/opensandbox-server.values.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/helm/opensandbox-server.values.yaml)

Kubernetes manifests:

- [k8s/runtimeclass-kata-fc.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/runtimeclass-kata-fc.yaml)
- [k8s/opensandbox-efs-storageclass.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/opensandbox-efs-storageclass.yaml)
- [k8s/opensandbox-ebs-gp3-storageclass.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/opensandbox-ebs-gp3-storageclass.yaml)
- [k8s/opensandbox-server-internal-service.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/opensandbox-server-internal-service.yaml)
- [k8s/relay-pvc-manager-rbac.yaml](/Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/relay-pvc-manager-rbac.yaml)

### Что теперь считается intended Terraform state

Минимальный state, который мы решили зафиксировать в Terraform:

- custom `opensandbox-server` image
  - `308657715298.dkr.ecr.us-east-1.amazonaws.com/21st-opensandbox-server:block-pvc-poc-20260416-02`
- `opensandbox-server` deploy через vendored Helm chart
- cluster resources, которые уже стали частью рабочего standalone path:
  - `opensandbox` namespace
  - `opensandbox-ebs-gp3` `StorageClass`
  - `relay-pvc-manager` namespaced RBAC
  - `opensandbox-server-internal` `Service`

Что мы сознательно **не** тащим в Terraform на этом шаге:

- `opensandbox-controller`
- `kata-deploy`
- `/etc/21st/relay.env`
- временные debug flags
- runtime image rollout на app VM

### Что делать после `terraform apply`

1. Подключить `kubectl` к новому `EKS` cluster.
2. Если cluster уже был собран вручную, сначала импортировать в state live ресурсы:
   - `helm_release.opensandbox_server`
   - `kubernetes_namespace_v1.opensandbox`
   - `kubernetes_storage_class_v1.opensandbox_ebs_gp3`
   - `kubernetes_role_v1.relay_pvc_manager`
   - `kubernetes_role_binding_v1.relay_pvc_manager`
   - `kubernetes_service_v1.opensandbox_server_internal`
3. Поставить `Kata` / `Firecracker` runtime на sandbox nodes через `kata-deploy`.
4. Применить `RuntimeClass`.
5. Поставить OpenSandbox controller через Helm values из repo.
6. Только после этого подключать `relay` к новому OpenSandbox endpoint.

Практически это значит:

- для **нового rollout** ориентироваться на этот раздел и на [README.md](/Users/daniil/Work/21st-copy/apps/agents-web/infra/README.md)
- старые EC2/OpenSandbox notes ниже сохраняем как reference/debug history

Текущая схема простая:

- одна app VM
- одна отдельная OpenSandbox VM
- отдельный managed Postgres
- отдельный managed Redis
- на VM крутятся `agents-web`, `relay`, `proxy`
- на OpenSandbox VM крутится `opensandbox-server`
- `nginx` стоит перед `agents-web`, `relay` и `proxy`
- публичный web сейчас должен идти через домен и `https`, а не через raw IP

Если `README.md` в этой папке расходится с этим документом, ориентироваться нужно на этот файл.

## 1. Что поднято

### AWS ресурсы

- `EC2` app VM
- `EC2` OpenSandbox VM
- `RDS Postgres`
- `ElastiCache Redis`
- `Elastic IP` для app VM
- сеть и security groups
- `SSM` доступ к обеим VM

Краткий словарь AWS:

- `EC2` = обычная Linux VM в AWS
- `RDS` = managed Postgres, AWS сама держит БД-инстанс
- `ElastiCache` = managed Redis
- `VPC` = изолированная сеть в AWS
- `subnet` = кусок сети внутри `VPC`
- `security group` = firewall на уровне VM
- `Elastic IP` = постоянный публичный IP
- `SSM` = удалённый доступ без SSH-порта

### Текущие размеры VM

На текущем `miro-dev` контуре:

- app VM = `t3.xlarge` (`4 vCPU`, `16 GiB RAM`, root volume `80 GB gp3`)
- OpenSandbox VM = `m7i.xlarge` (`4 vCPU`, `16 GiB RAM`, root volume `100 GB gp3`)

Почему так:

- `t3.large` оказалось мало для `agents-web` в режиме `next dev`
- `m7i.xlarge` достаточно для `opensandbox-server` и примерно `~2` одновременно активных sandbox container

### Что крутится на VM

- `nginx` на `80` и `443`
- `agents-web` на `3000`
- `relay` на `3001`
- `proxy` на `3002`

### Что крутится на OpenSandbox VM

- `opensandbox-server` на `8080`
- Docker daemon на хосте
- sandbox containers на том же хосте

Замечание по портам:

- наружу открыты только `80` и `443`
- `3001` и `3002` должны быть доступны только локально на VM через `127.0.0.1`
- `8080` на OpenSandbox VM должен быть доступен только от app VM по private IP внутри `VPC`
- внешний трафик в `relay` и `proxy` должен идти только через `https://<app_domain>/relay` и `https://<app_domain>/proxy`

### Как идет трафик

- `https://<app_domain>/...` -> `nginx` -> `agents-web:3000`
- `https://<app_domain>/relay/...` -> `nginx` -> `relay:3001`
- `https://<app_domain>/proxy/...` -> `nginx` -> `proxy:3002`
- `relay` -> `http://<opensandbox_private_ip>:8080` -> `opensandbox-server`
- `opensandbox-server` -> Docker on OpenSandbox VM -> sandbox container

Важно:

- browser-side chat не должен ходить в `http://<app_ip>:3001`
- OpenSandbox VM не должна торчать наружу по `8080`
- `relay` и `proxy` должны торчать наружу через тот же HTTPS домен
- raw-порты `3001/3002` наружу больше не считать поддержанным path

### Канонические адреса для env

Если контур поднят на домене, базовые значения должны быть такими:

- `NEXT_PUBLIC_APP_URL=https://<app_domain>`
- `BETTER_AUTH_URL=https://<app_domain>`
- `NEXT_PUBLIC_BETTER_AUTH_URL=https://<app_domain>`
- `NEXT_PUBLIC_AGENTS_WEB_URL=https://<app_domain>`
- `NEXT_PUBLIC_ONECODE_APP_URL=https://<app_domain>`
- `NEXT_PUBLIC_RELAY_URL=https://<app_domain>/relay`
- `RELAY_URL=https://<app_domain>/relay`
- `CLAUDE_PROXY_URL=https://<app_domain>/proxy`

Для data-plane:

- `DATABASE_URL` и `DIRECT_DATABASE_URL` брать из `terraform output -raw database_url`
- `REDIS_URL` брать из `terraform output -raw redis_url`

Нельзя:

- ставить browser-facing URL на raw IP
- ставить `CLAUDE_PROXY_URL=http://127.0.0.1:3002`, если sandbox живёт вне VM
- мешать старые значения от другого контура с новыми Terraform outputs

### Где что лежит

- код: `/srv/21st`
- env web: `/etc/21st/agents-web.env`
- env relay: `/etc/21st/relay.env`
- env proxy: `/etc/21st/proxy.env`
- OpenSandbox config: `/etc/opensandbox/sandbox.toml`

Важно:

- source of truth для runtime env на VM это `/etc/21st/*.env`
- Terraform больше не пишет runtime env в `/etc/21st/*.env`
- app env нужно загружать отдельно после `terraform apply`
- `systemd` подхватывает их через `EnvironmentFile=...`
- repo-файлы вроде `/srv/21st/apps/agents-web/.env` могут быть пустыми, и это нормально
- для build и runtime `agents-web` всё равно должен брать нужные env из `/etc/21st/agents-web.env`, а не из repo `.env`

### systemd сервисы

- `agents-web.service`
- `relay.service`
- `proxy.service`
- `opensandbox.service`

Важно:

- `nginx` enabled и переживает reboot сам
- `agents-web`, `relay`, `proxy` сейчас `disabled`
- после `EC2 stop/start`, resize или reboot их нужно стартовать вручную:

```bash
sudo systemctl start proxy relay agents-web
```

- если этого не сделать, снаружи будет `502` от `nginx`, потому что upstream-процессы мёртвые

## 2. Terraform

Работаем из:

```bash
cd /Users/daniil/Work/21st-copy/apps/agents-web/infra
```

Применение:

```bash
terraform init
eval "$(aws configure export-credentials --format env)" && terraform plan
eval "$(aws configure export-credentials --format env)" && terraform apply
```

Полезные outputs:

```bash
terraform output app_instance_id
terraform output app_public_ip
terraform output app_domain
terraform output app_url
terraform output relay_url
terraform output proxy_url
terraform output opensandbox_instance_id
terraform output opensandbox_domain
terraform output opensandbox_private_url
terraform output -raw opensandbox_api_key
terraform output database_url
terraform output redis_url
```

Важно:

- runtime app secrets больше не хранить в `deploy.auto.tfvars.json`
- runtime app secrets больше не тащить через `user_data`
- `deploy.auto.tfvars.json` должен оставаться пустым по app env или содержать только несекретные infra-параметры
- Terraform state всё ещё содержит infra-секреты, которые сам Terraform генерирует: пароль Postgres, auth token Redis и OpenSandbox API key

Если хотим, чтобы `app_url` сразу был доменным и `https`, надо задать:

```bash
terraform apply -var='app_domain=miro-dev.21st.dev'
```

Важно:

- использовать один и тот же workspace
- не плодить новые workspace без необходимости
- не тащить руками старые адреса в `.env.prod`, если Terraform уже выдал новые
- `443` должен быть открыт в security group app VM

### Что Terraform делает для OpenSandbox VM

При `terraform apply` OpenSandbox VM поднимается сразу и сама bootstrap-ится через `user_data`.

Это значит:

- ставится Docker Engine
- ставится `python3.11`
- ставится `uv`
- в `/opt/opensandbox/venv` ставится `opensandbox-server`
- в `/etc/opensandbox/sandbox.toml` пишется готовый config
- `opensandbox.service` включается и стартует автоматически
- VM сидит в `public subnet`, чтобы без `NAT` уметь тянуть пакеты и Docker images наружу
- наружу API всё равно не публикуем: firewall пускает `8080` только от app VM
- на Amazon Linux 2023 нельзя пытаться ставить обычный `curl` пакетом поверх `curl-minimal`, иначе bootstrap падает в самом начале

Проверка после apply:

```bash
terraform output opensandbox_instance_id
terraform output opensandbox_domain
terraform output opensandbox_private_url
terraform output -raw opensandbox_api_key
```

Что значит каждый output:

- `opensandbox_instance_id` = id VM в AWS, нужен для `SSM`
- `opensandbox_domain` = значение для `relay.env:OPENSANDBOX_DOMAIN`
- `opensandbox_private_url` = удобный health URL для curl внутри `VPC`
- `opensandbox_api_key` = секрет для заголовка `OPEN-SANDBOX-API-KEY`

### Что Terraform не делает для OpenSandbox

Terraform поднимает VM и сам `opensandbox-server`, но не делает две вещи:

- не собирает `packages/agent-runtime` image
- не пушит runtime image в registry

Для текущего тестового контура используется более простой path:

- runtime image собирается прямо на OpenSandbox VM
- image живёт только локально на этой VM
- `relay.env:OPENSANDBOX_RUNTIME_IMAGE` смотрит на локальный tag

Каноничный tag сейчас:

- `21st-agent-runtime-opensandbox:dev`

Практический смысл:

- private registry пока не нужен
- OpenSandbox сначала ищет image локально в Docker cache
- если image уже на VM, наружу ничего pull-ить не нужно

## 3. Доступ к VM

Используем `AWS SSM`, не `SSH`.

Это значит:

- SSH-порт можно не открывать
- Postgres и Redis остаются приватными
- команды на обеих VM выполняются через AWS

Базовый шаблон:

```bash
eval "$(aws configure export-credentials --format env)"
aws ssm send-command \
  --region us-east-1 \
  --instance-ids <instance_id> \
  --document-name AWS-RunShellScript \
  --parameters commands='["pwd","whoami"]'
```

Полезные debug tunneling-команды:

OpenSandbox API локально:

```bash
aws ssm start-session \
  --target <opensandbox_instance_id> \
  --document-name AWS-StartPortForwardingSession \
  --parameters '{"portNumber":["8080"],"localPortNumber":["18080"]}'
```

После этого локально:

```bash
curl http://127.0.0.1:18080/health
```

RDS локально через app VM:

```bash
aws ssm start-session \
  --target <app_instance_id> \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters '{"host":["<rds_endpoint>"],"portNumber":["5432"],"localPortNumber":["15432"]}'
```

## 4. Как деплоим код

Сейчас деплой идет через прямой Git checkout на VM.

Требования:

- VM имеет доступ к GitHub
- deploy key уже установлен
- repo лежит в `/srv/21st`

Первый clone:

```bash
sudo -u ec2-user git clone --depth 1 --branch <branch> git@github.com:21st-dev/21st.git /srv/21st
```

Обычное обновление:

```bash
cd /srv/21st
sudo -u ec2-user git fetch origin
sudo -u ec2-user git checkout <branch>
sudo -u ec2-user git pull --ff-only origin <branch>
```

Важно:

- repo в `/srv/21st` принадлежит `ec2-user`, не `root`
- `git pull` надо делать от `ec2-user`, а не от `root`
- если запускать `git` от `root` через `SSM`, можно сломать ownership внутри `.git`
- после этого следующий pull может падать на `Permission denied` для `.git/FETCH_HEAD`

Базовая подготовка Git на VM:

```bash
sudo mkdir -p /home/ec2-user/.ssh
sudo chmod 700 /home/ec2-user/.ssh
sudo -u ec2-user ssh-keyscan github.com >> /home/ec2-user/.ssh/known_hosts
sudo chmod 600 /home/ec2-user/.ssh/known_hosts
sudo git config --system --add safe.directory /srv/21st
```

Если `git pull` уже сломан, чеклист такой:

- `fatal: detected dubious ownership in repository at '/srv/21st'`
  починка: `sudo git config --system --add safe.directory /srv/21st`
- `Host key verification failed`
  починка: добавить `github.com` в `/home/ec2-user/.ssh/known_hosts`
- `Permission denied (publickey)`
  проверить, что deploy key реально лежит у `ec2-user`, а pull идёт через `sudo -u ec2-user`
- `error: cannot open '.git/FETCH_HEAD': Permission denied`
  починка: `sudo chown -R ec2-user:ec2-user /srv/21st/.git`

Нормальный flow:

1. Запушить код в GitHub.
2. Обновить `/srv/21st` на VM до нужного branch/commit.
3. Взять из Terraform только infra outputs.
4. Обновить `/etc/21st/*.env` отдельно, вне Terraform.
4. Пересобрать только то, что реально изменилось.
5. Перезапустить только нужные сервисы.
6. Проверить health и auth flow.

### Как собираем OpenSandbox runtime image

Для текущего EKS/OpenSandbox контура runtime image публикуется в приватный `ECR`.

Логика такая:

1. взять build context из `packages/agent-runtime`
2. собрать `linux/amd64` image
3. запушить image в `ECR`
4. обновить `relay.env:OPENSANDBOX_RUNTIME_IMAGE`
5. обновить `agents-web.env:OPENSANDBOX_RUNTIME_IMAGE`
6. обновить `agents-web.env:OPENSANDBOX_BUILD_BASE_IMAGE`
7. перезапустить `relay` и `agents-web`

Команда сборки:

```bash
cd /Users/daniil/Work/21st-copy

REPO=<opensandbox_runtime_ecr_repository_url>
TAG=ubuntu22-mise-gcc13-$(date -u +%Y%m%d%H%M%S)
IMAGE="$REPO:$TAG"

aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin "${REPO%/*}"

docker buildx build \
  --platform linux/amd64 \
  --progress=plain \
  -t "$IMAGE" \
  --push \
  packages/agent-runtime
```

Проверка:

```bash
aws ecr describe-images \
  --region us-east-1 \
  --repository-name 21st-agent-runtime-opensandbox \
  --image-ids imageTag="$TAG"
```

Важно:

- если сборка запускается с Mac, всегда явно указывать `--platform linux/amd64`
- не пушить multi-arch image без необходимости
- `relay.env` должен указывать на immutable tag, а не на плавающий `latest`
- `agents-web.env:OPENSANDBOX_BUILD_BASE_IMAGE` должен указывать на тот же base image, чтобы derived images строились поверх актуальной базы

### Текущий OpenSandbox runtime base image

Base OS и окружение:

- `ubuntu:22.04`
- `mise` установлен в `/usr/local/bin/mise`
- global mise config лежит в `/opt/mise/config/config.toml`
- mise shims стоят первыми в `PATH`
- project-level `mise.toml` внутри workspace может добавлять или переопределять project tools

Для derived OpenSandbox images важно не переопределять mise env из base image:

- не задавать заново `MISE_DATA_DIR`, `MISE_CONFIG_DIR`, `MISE_CACHE_DIR` и `PATH` в image builder
- inherited значения из base image сейчас: `MISE_DATA_DIR=/opt/mise/data`, `MISE_CONFIG_DIR=/opt/mise/config`, `MISE_CACHE_DIR=/opt/mise/cache`
- workflow-specific config писать как project config в `/home/user/workspace/mise.toml`
- запускать `mise install` / `mise exec` из `/home/user/workspace`
- trust path должен покрывать workspace: `MISE_TRUSTED_CONFIG_PATHS=/home/user/workspace`

Так mise сам мержит:

- base/global config из `/opt/mise/config/config.toml`
- workflow/project config из `/home/user/workspace/mise.toml`

Если один и тот же tool задан в обоих местах, project config workflow переопределяет base config только для этого tool. Остальные tools остаются из base config.

Derived image tags deterministic:

- tag format: `env-<buildHash>`
- hash includes base image, apt packages, build commands and cwd
- before creating a Kubernetes builder job, `agents-web` checks ECR for the same tag
- if the tag exists, `agents-web` reuses the image and does not create a new build job
- app EC2 IAM role needs `ecr:DescribeImages` on the OpenSandbox runtime ECR repository

Required `agents-web.env` for deploy-time derived images:

- `OPENSANDBOX_BUILD_IMAGE_REPOSITORY=<terraform output opensandbox_runtime_ecr_repository_url>`
- `OPENSANDBOX_BUILD_BASE_IMAGE=<same immutable image tag used by relay OPENSANDBOX_RUNTIME_IMAGE>`
- `STANDALONE_EKS_CLUSTER_NAME=<terraform output -raw sandbox_cluster_name>`
- `STANDALONE_EKS_CLUSTER_ENDPOINT=<terraform output -raw sandbox_cluster_endpoint>`
- `STANDALONE_EKS_CLUSTER_CA_BASE64=<terraform output -raw sandbox_cluster_certificate_authority_data>`
- `AWS_REGION=<terraform tfvars aws_region>`

Required infra/RBAC:

- `opensandbox-image-builder` Kubernetes service account, role and role binding
- ECR runtime repository plus `<runtime repo>/cache` repository
- sandbox EKS node role can push/pull both runtime and cache repositories
- app EC2 IAM role can call `ecr:DescribeImages` for cache lookup

Kaniko layer cache:

- `agents-web` включает Kaniko cache через `--cache=true`
- Kaniko по умолчанию пишет cache layers в ECR repository `<runtime repo>/cache`
- для runtime repo `21st-agent-runtime-opensandbox` cache repo будет
  `21st-agent-runtime-opensandbox/cache`
- Terraform должен создавать оба ECR repo и выдавать sandbox EKS node role
  push/pull права на оба ARN

Если cache repo или IAM policy отсутствуют, во время Kaniko build появляется
warning вида:

```text
Error uploading layer to cache ... repository/21st-agent-runtime-opensandbox/cache ... ecr:InitiateLayerUpload
```

Это не блокирует rollout, если финальный push image tag в
`21st-agent-runtime-opensandbox:<tag>` завершился успешно, но каждый следующий
build будет снова выполнять дорогие слои (`apt`, `mise install`, etc.). После
создания cache repo и обновления IAM policy повторный build с тем же Dockerfile
должен использовать cached layers.

Языки и runtime:

- Node.js `20.20.2`
- Python `3.12.13`
- Go `1.22.12`
- Rust `1.77.2`
- Java / OpenJDK `21.0.2`

Package managers и build tools:

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

CLI и системные утилиты:

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

Не входит в base image по умолчанию:

- Ruby
- PHP
- Composer
- Bundler

## 5. Standalone mode

Standalone mode сейчас означает `better-auth`, а не старый flow.

Обязательные переключатели:

- `NEXT_PUBLIC_IS_STANDALONE_APP=true`
- `NEXT_PUBLIC_AGENTS_AUTH_MODE=better-auth`

Если эти флаги включены, env для Better Auth и Okta должны быть заполнены полностью.

## 6. Env: что обязательно и что нельзя делать

### agents-web

Минимально важное:

- `NEXT_PUBLIC_IS_STANDALONE_APP=true`
- `NEXT_PUBLIC_AGENTS_AUTH_MODE=better-auth`
- `BETTER_AUTH_SECRET`
- `DATABASE_URL`
- `REDIS_URL`
- `NEXT_PUBLIC_APP_URL`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- `NEXT_PUBLIC_RELAY_URL`
- `SANDBOX_PROVIDER`

Важно:

- `SANDBOX_PROVIDER` влияет только на **новые** deployments
- уже созданный deployment не переключится с `e2b` на `opensandbox` или обратно только из-за смены env
- на текущем `miro-dev` после OpenSandbox smoke-test значение временно возвращено на `SANDBOX_PROVIDER=e2b`, но OpenSandbox VM и весь связанный конфиг сохранены

Build-time нюанс:

- текущий production build `agents-web` всё ещё задевает часть legacy route-ов и интеграций, даже если standalone path их не использует на runtime
- поэтому для standalone сейчас недостаточно просто "не использовать Supabase/R2/CSB"
- если такие импорты дёргаются на build-time, в `/etc/21st/agents-web.env` должны быть непустые dummy значения
- рабочее правило:
  - URL-подобные переменные -> `https://standalone.invalid`
  - остальные секреты/ключи -> `disabled`
- это build workaround, а не поддержка этих интеграций в standalone

### Better Auth + Okta

Standalone mode сейчас фактически требует Okta SAML env.

Нужны:

- `NEXT_PUBLIC_BETTER_AUTH_OKTA_PROVIDER_ID`
- `BETTER_AUTH_OKTA_DOMAIN` или `BETTER_AUTH_OKTA_SSO_DOMAIN`
- `BETTER_AUTH_OKTA_CALLBACK_URL`
- `BETTER_AUTH_OKTA_SAML_ISSUER`
- `BETTER_AUTH_OKTA_SAML_ENTRY_POINT`
- `BETTER_AUTH_OKTA_SAML_CERT`
- опционально, но в нашем случае реально нужно: `BETTER_AUTH_OKTA_SAML_AUDIENCE`

Если их нет, `agents-web` может падать уже на `next build`, а не только на runtime.

Критично:

- `BETTER_AUTH_OKTA_SAML_CERT` лучше хранить как одну base64-строку без `-----BEGIN CERTIFICATE-----` и без `\n`
- старый PEM с буквальными `\n` уже ломал нам SAML validation
- `BETTER_AUTH_OKTA_SAML_AUDIENCE` должен совпадать с текущим HTTPS SP metadata URL
- `BETTER_AUTH_OKTA_DOMAIN` не должен оставаться `localhost`

### Env preflight перед запуском нового контура

Перед первым запуском или после нового `terraform apply` обязательно перепроверить:

- `agents-web.env` и `relay.env` должны указывать на один и тот же `DATABASE_URL`
- `agents-web.env:DIRECT_DATABASE_URL` должен совпадать с актуальным standalone RDS, а не со старым инстансом
- `agents-web.env` и `relay.env` должны указывать на один и тот же `REDIS_URL`
- `agents-web.env:NEXT_PUBLIC_RELAY_URL` должен совпадать с `relay.env:RELAY_URL`
- `agents-web.env:NEXT_PUBLIC_RELAY_URL` должен быть `https://<domain>/relay`, а не `http://<ip>:3001`
- `agents-web.env:NEXT_PUBLIC_ONECODE_APP_URL` не должен оставаться `https://1code.dev`, если standalone контур должен сам обслуживать эти редиректы
- `relay.env:NEXT_PUBLIC_IS_STANDALONE_APP=true`, иначе `relay` продолжит делать billing check
- `relay.env:CLAUDE_PROXY_URL` должен быть `https://<domain>/proxy`, а не `http://127.0.0.1:3002`
- `relay.env:OPENSANDBOX_DOMAIN` должен указывать на internal NLB DNS сервиса `opensandbox-server-internal`, а не на старую OpenSandbox VM и не на `localhost`
- `relay.env:OPENSANDBOX_PROTOCOL=http`
- `relay.env:OPENSANDBOX_USE_SERVER_PROXY=true`
- `relay.env:OPENSANDBOX_API_KEY` должен совпадать с `terraform output -raw opensandbox_api_key`
- `relay.env:OPENSANDBOX_READY_TIMEOUT_SECONDS=120`, иначе первый cold start на `kata-fc` может не уложиться в дефолтные `30s`
- `relay.env:STANDALONE_EKS_CLUSTER_NAME` должен совпадать с `terraform output -raw sandbox_cluster_name`
- `relay.env:STANDALONE_EKS_CLUSTER_ENDPOINT` должен совпадать с `terraform output -raw sandbox_cluster_endpoint`
- `relay.env:STANDALONE_EKS_CLUSTER_CA_BASE64` должен совпадать с `terraform output -raw sandbox_cluster_certificate_authority_data`
- `relay.env:AWS_REGION` должен совпадать с регионом текущего standalone AWS-контура
- `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`, `NEXT_PUBLIC_AGENTS_WEB_URL` должны указывать на текущий публичный HTTPS домен
- `NEXT_PUBLIC_IS_STANDALONE_APP=true`
- `NEXT_PUBLIC_AGENTS_AUTH_MODE=better-auth`
- `BETTER_AUTH_OKTA_SAML_AUDIENCE` должен совпадать с `https://<domain>/api/auth/sso/saml2/sp/metadata`

Быстрая проверка на VM:

```bash
grep -E '^(DATABASE_URL|DIRECT_DATABASE_URL|REDIS_URL|NEXT_PUBLIC_RELAY_URL|NEXT_PUBLIC_APP_URL|NEXT_PUBLIC_ONECODE_APP_URL|BETTER_AUTH_URL|NEXT_PUBLIC_BETTER_AUTH_URL|NEXT_PUBLIC_AGENTS_WEB_URL|NEXT_PUBLIC_IS_STANDALONE_APP|NEXT_PUBLIC_AGENTS_AUTH_MODE)=' /etc/21st/agents-web.env
grep -E '^(DATABASE_URL|REDIS_URL|RELAY_URL|CLAUDE_PROXY_URL|NEXT_PUBLIC_IS_STANDALONE_APP|OPENSANDBOX_DOMAIN|OPENSANDBOX_PROTOCOL|OPENSANDBOX_API_KEY|OPENSANDBOX_RUNTIME_IMAGE|OPENSANDBOX_USE_SERVER_PROXY|OPENSANDBOX_READY_TIMEOUT_SECONDS|STANDALONE_EKS_CLUSTER_NAME|STANDALONE_EKS_CLUSTER_ENDPOINT|STANDALONE_EKS_CLUSTER_CA_BASE64|AWS_REGION)=' /etc/21st/relay.env
```

Если тут есть расхождение, сначала чинить env, потом уже смотреть код.

Какой порядок считать каноничным:

1. `terraform apply`
2. `terraform output -raw database_url`, `terraform output -raw redis_url`, `terraform output -raw opensandbox_api_key`, `terraform output opensandbox_runtime_ecr_repository_url`
3. локально обновить `.env.remote` или другой source-of-truth файл
4. залить готовые `/etc/21st/agents-web.env`, `/etc/21st/relay.env`, `/etc/21st/proxy.env` на VM
5. только потом запускать deploy/restart

## 6.1. Что уже нельзя тащить в standalone env

Эти переменные уже были stale-хвостами и их не нужно больше копировать в standalone env:

- `AN_DOCS_URL`
- `AUTH_URL_SIGN_IN`
- `IO_REDIS_URL`
- `NEXT_PUBLIC_AN_APP_URL`
- `NEXT_PUBLIC_BACKEND_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_CDN_URL`
- `NEXT_PUBLIC_COMPILE_CSS_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `BILLING_SETUP_BASE_URL`

## 6.2. Какие внешние сервисы считаем допустимыми

Для базового standalone контура считаем допустимыми внешними только:

- `Okta`
- `OpenSandbox`

Что это означает на практике:

- `NEXT_PUBLIC_BACKEND_URL` удалён из standalone env
  path `/compile-css` в standalone не считать поддержанным, пока не появится локальная замена
- `NEXT_PUBLIC_CDN_URL` удалён из standalone env
  R2/team-logo/storage ручки в standalone не считать поддержанными, пока не будет отдельного решения
- `BILLING_SETUP_BASE_URL` удалён из standalone env `relay`
  старый internal GitHub installation-token minting path в standalone не считать поддержанным, пока не будет локальной замены

Если что-то из этого ломается, правильное действие не вернуть старый внешний URL, а либо отключить path, либо сделать standalone replacement.

### relay

Минимально важное:

- `PORT`
- `REDIS_URL`
- `DATABASE_URL`
- `AN_JWT_SECRET`
- `CLAUDE_PROXY_PRIVATE_JWT`
- `CLAUDE_PROXY_URL`
- `RELAY_URL`
- `OPENSANDBOX_DOMAIN`
- `OPENSANDBOX_PROTOCOL`
- `OPENSANDBOX_API_KEY`
- `OPENSANDBOX_RUNTIME_IMAGE`
- `OPENSANDBOX_USE_SERVER_PROXY`
- `OPENSANDBOX_READY_TIMEOUT_SECONDS`

Критично:

- `CLAUDE_PROXY_URL` не должен быть `127.0.0.1`, если sandbox живёт вне VM
- для текущего `EKS + OpenSandbox` контура правильные значения:
  - `RELAY_URL=https://<app_domain>/relay`
  - `CLAUDE_PROXY_URL=https://<app_domain>/proxy`
  - `OPENSANDBOX_DOMAIN=<opensandbox_server_internal_nlb_dns>`
  - `OPENSANDBOX_PROTOCOL=http`
  - `OPENSANDBOX_API_KEY=<terraform output -raw opensandbox_api_key>`
  - `OPENSANDBOX_USE_SERVER_PROXY=true`
  - `OPENSANDBOX_READY_TIMEOUT_SECONDS=120`
  - `OPENSANDBOX_RUNTIME_IMAGE=<image built from packages/agent-runtime/Dockerfile>`

Замечание:

- `OPENSANDBOX_DOMAIN` = только host:port, без `http://`
- `OPENSANDBOX_RUNTIME_IMAGE` Terraform не собирает и не пушит, это отдельный шаг
- `OPENSANDBOX_READY_TIMEOUT_SECONDS=120` сейчас нужен из-за тяжёлого cold start:
  первый `kata-fc` startup может не уложиться в дефолтные `30s` из-за image pull

### proxy

Минимально важное:

- `PORT`
- `HOST`
- `DATABASE_URL`
- `JWT_PUBLIC_KEY`
- `ANTHROPIC_API_KEY`

Важно:

- `proxy` подключается к Postgres на старте
- `proxy` в текущем коде всё ещё на cache miss читает `users` + `usages`
- если DB connection падает, сервис сразу падает
- standalone-bypass для этого path в `proxy` сейчас нет
- значит для текущего standalone-контура таблица `public.usages` всё ещё обязательна

### Главное правило по env

- в одном `.env.prod` можно держать и public, и server-only env
- серверные секреты не должны иметь префикс `NEXT_PUBLIC_`
- `NEXT_PUBLIC_*` может попасть в клиентский bundle
- серверные секреты не попадут в клиент только потому, что лежат в том же файле, если они не `NEXT_PUBLIC_*` и не протащены в клиентский код

### Нельзя делать

- нельзя слепо копировать старый `.env.prod` из локалки, Vercel или Fly и считать, что он подходит AWS-контуру
- нельзя оставлять старые `DATABASE_URL`, `REDIS_URL`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`
- нельзя оборачивать значения в лишние кавычки без причины и потом грузить файл через shell как попало

### Что брать из Terraform

После `terraform apply` отсюда надо брать новые адреса:

- `terraform output -raw app_url`
- `terraform output -raw relay_url`
- `terraform output -raw proxy_url`
- `terraform output -raw database_url`
- `terraform output -raw redis_url`
- `terraform output -raw opensandbox_api_key`
- `terraform output opensandbox_runtime_ecr_repository_url`

Критично:

- `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL` должны указывать на публичный HTTPS URL приложения, а не на `localhost` и не на старый IP
- `DATABASE_URL` должен указывать на текущий RDS endpoint, а не на старый инстанс
- `REDIS_URL` должен указывать на текущий Redis endpoint
- `NEXT_PUBLIC_RELAY_URL` должен указывать на `https://<app_domain>/relay`
- `RELAY_URL` должен указывать на `https://<app_domain>/relay`
- `CLAUDE_PROXY_URL` должен указывать на `https://<app_domain>/proxy`
- `OPENSANDBOX_DOMAIN` должен указывать на internal NLB DNS сервиса `opensandbox-server-internal`
- `OPENSANDBOX_API_KEY` должен совпадать с Terraform output
- `OPENSANDBOX_READY_TIMEOUT_SECONDS` для текущего `kata-fc` path должен быть `120`

## 7. Безопасная загрузка env

Нельзя делать так:

```bash
set -euo pipefail
source /etc/21st/agents-web.env
```

Почему:

- секреты могут содержать `$`
- shell expansion ломает значения
- мы уже ловили из-за этого `unbound variable`

Использовать safe loader:

```bash
load_env_file() {
  local file="$1"
  local line key val

  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      ''|\#*) continue ;;
    esac

    key=${line%%=*}
    val=${line#*=}

    if [[ ${#val} -ge 2 ]]; then
      if [[ ${val:0:1} == '"' && ${val: -1} == '"' ]]; then
        val=${val:1:${#val}-2}
      elif [[ ${val:0:1} == "'" && ${val: -1} == "'" ]]; then
        val=${val:1:${#val}-2}
      fi
    fi

    printf -v "$key" '%s' "$val"
    export "$key"
  done < "$file"
}
```

Использование:

```bash
load_env_file /etc/21st/agents-web.env
```

Важно:

- `deploy-21st-standalone` теперь тоже должен грузить env через safe loader
- для ручных операций использовать тот же подход

## 8. База данных: init script и SSL

На свежем RDS одного `prisma generate` недостаточно.

Нужно отдельно применить:

```bash
apps/agents-web/infra/agents-schema.sql
```

Почему:

- там есть таблицы Better Auth, без которых login падает
- там теперь должна быть и `public.usages`, потому что её читает `proxy`
- типичный симптом: `public.better_auth_verifications does not exist`
- ещё один реальный симптом: `relation "usages" does not exist`
- это наш bootstrap schema init script для свежей standalone БД

Как применять:

```bash
cd /srv/21st/apps/agents-web
load_env_file /etc/21st/agents-web.env
pnpm exec prisma db execute --url "$DATABASE_URL" --file ./infra/agents-schema.sql
```

Важно:

- обязательно передавать `--url "$DATABASE_URL"` явно
- нельзя надеяться, что Prisma сама подхватит правильный env
- мы уже ловили ситуацию, когда Prisma уехала в старый host из локального env и пыталась подключаться не туда
- для `agents-web` и Prisma текущий `DATABASE_URL` в RDS должен оставаться с `sslmode=require`
- для ad-hoc debug и части runtime-клиентов `require` может упираться в certificate chain
- у `proxy` рабочий вариант сейчас `sslmode=no-verify`
- это надо помнить отдельно, потому что `agents-web` и `proxy` сейчас ведут себя по SSL к Postgres не одинаково

## 9. HTTPS и Certbot

Для браузерного auth/SSO `http://<ip>` больше не считать рабочим вариантом.

Нормальный путь:

1. создать DNS запись домена на app VM
2. открыть `443` в security group
3. выпустить cert через `certbot`
4. перевести `nginx` на HTTPS
5. включить автопродление
6. обновить env и Okta на HTTPS домен

Команды на VM:

```bash
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d <app_domain> --non-interactive --agree-tos --register-unsafely-without-email --redirect
sudo systemctl enable --now certbot-renew.timer
```

Важно:

- пакет `certbot` на Amazon Linux не включает `certbot-renew.timer` автоматически
- timer надо включать отдельно
- сертификаты лежат в `/etc/letsencrypt/live/<app_domain>/`
- текущий `nginx` должен слушать `80`, а после `certbot` будет слушать и `443`
- после выпуска сертификата `http://` должен редиректить на `https://`

## 10. Сборка и рестарты

### Каноничный runtime mode

Нормальный режим для `agents-web` на VM:

- base unit без override
- `pnpm --dir apps/agents-web exec next start`
- перед этим должен быть готов production build через `next build`

Если на VM есть:

- `/etc/systemd/system/agents-web.service.d/dev.conf`

то это временный debug override, а не нормальный runtime.

Текущее состояние `miro-dev` на момент этого runbook:

- на VM есть `dev.conf`
- `agents-web` сейчас запущен через `pnpm run dev:stable`
- это сделано временно, потому что текущий production build `agents-web` пока не проходит
- из-за этого первый запрос на route может компилироваться десятки секунд
- именно для этого app VM пришлось увеличить до `t3.xlarge`
- текущий live provider для новых deployments временно возвращён на `e2b` через `/etc/21st/agents-web.env`
- OpenSandbox infra при этом не удалялась: VM, `opensandbox-server`, runtime image и `relay.env` остались на месте

Перед обычным деплоем его нужно убрать:

```bash
sudo rm -f /etc/systemd/system/agents-web.service.d/dev.conf
sudo rmdir /etc/systemd/system/agents-web.service.d 2>/dev/null || true
sudo systemctl daemon-reload
```

После этого `systemctl cat agents-web` не должен показывать `dev.conf`.

### Что реально тяжело

Тяжёлый только `agents-web`.

Проблемы, которые уже были:

- `next build` упирался в память
- первый `pnpm install` тянул лишний мусор
- скачивался `Cypress`, хотя он не нужен для runtime

Что нужно для VM:

- swap
- `NODE_OPTIONS=--max-old-space-size=6144` на build `agents-web`
- `CYPRESS_INSTALL_BINARY=0` на install, чтобы не тянуть лишнее

### Пересборка agents-web

```bash
cd /srv/21st
load_env_file /etc/21st/agents-web.env
export NODE_OPTIONS=--max-old-space-size=6144
pnpm --dir apps/agents-web exec prisma generate --schema=./prisma/schema.prisma
pnpm --dir apps/agents-web exec next build --webpack
sudo systemctl restart agents-web
systemctl cat agents-web
```

Ожидаем:

- в `systemctl cat agents-web` нет `dev.conf`
- `ExecStart` идёт в `next start`
- `agents-web` отвечает уже из production build, а не из `next dev`

Если `next build` падает на `Failed to collect page data for /api/1code/chat`
с `TypeError: Invalid URL` и input вида `"https://standalone.invalid"/`,
значит env loader передал внешние кавычки как часть значения. Использовать safe
loader из секции выше, а не `source /etc/21st/agents-web.env` и не простой
`IFS='=' read` без unquote.

### relay

Если менялись только env или код relay:

```bash
sudo systemctl restart relay
```

### proxy

Если менялись только env или код proxy:

```bash
sudo systemctl restart proxy
```

### opensandbox

Если менялись только config или package version OpenSandbox:

```bash
sudo systemctl restart opensandbox
sudo systemctl status opensandbox --no-pager
curl http://127.0.0.1:8080/health
```

### После обновления env

Если менялись только server-only env, rebuild не нужен.

Нужно:

- обновить env-файл
- перезапустить затронутый сервис через `systemctl restart`

Без рестарта Node-процесс новые env не увидит.

Если менялся любой `NEXT_PUBLIC_*` в `agents-web`, одного рестарта недостаточно.

Это build-time env для client bundle.

Типичные примеры:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_AGENTS_WEB_URL`
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- `NEXT_PUBLIC_RELAY_URL`
- `NEXT_PUBLIC_ONECODE_APP_URL`

Тогда нужен:

```bash
cd /srv/21st
load_env_file /etc/21st/agents-web.env
export NODE_OPTIONS=--max-old-space-size=6144
pnpm --dir apps/agents-web exec next build --webpack
sudo systemctl restart agents-web
```

Если этого не сделать, `agents-web` может продолжать отдавать старый client bundle и ходить в старые адреса вроде:

- `http://localhost:3000`
- `https://relay.an.dev`

После такой пересборки в браузере тоже нужно:

- сделать hard refresh
- или открыть страницу в incognito

Иначе браузер может держать старый JS в cache и будет казаться, что env "не применился".

## 11. Okta и HTTPS

После перевода домена на HTTPS в Okta надо синхронно обновить:

- `ACS / Single sign on URL` -> `https://<app_domain>/api/auth/sso/saml2/callback/okta`
- `Audience URI / SP Entity ID` -> `https://<app_domain>/api/auth/sso/saml2/sp/metadata`
- если в Okta есть `Recipient` или `Destination`, туда тоже callback URL

Если этого не сделать:

- Okta будет возвращать пользователя на старый `localhost` или старый IP
- login может доходить до callback, но браузер не станет авторизованным стабильно

## 12. Проверки после деплоя

Базовые проверки:

```bash
systemctl is-active agents-web relay proxy
sudo systemctl is-active opensandbox
curl -I http://127.0.0.1:3000/agents
curl http://127.0.0.1:3001/health
curl http://127.0.0.1:3002/health
curl http://127.0.0.1:8080/health
curl -I https://<app_domain>/agents
curl https://<app_domain>/relay/health
curl https://<app_domain>/proxy/health
```

Проверка auth:

```bash
curl -sS -D - -o /tmp/auth-response.txt \
  -X POST http://127.0.0.1:3000/api/auth/sign-in/sso \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://<app_domain>' \
  -H 'Referer: https://<app_domain>/agents' \
  --data '{"providerId":"okta","providerType":"saml","callbackURL":"/agents"}'
```

Ожидаем:

- `agents-web` отвечает через `nginx`
- `relay /health` отвечает OK
- `proxy /health` отвечает OK
- `opensandbox /health` отвечает OK
- `sign-in/sso` возвращает `200`, redirect URL и cookie, а не `500`

После `EC2 stop/start` отдельно проверить:

```bash
systemctl is-active agents-web relay proxy
```

Если там `inactive`, поднять вручную:

```bash
sudo systemctl start proxy relay agents-web
```

### OpenSandbox smoke-check

Если конкретно проверяем OpenSandbox path, а не общий health:

- новый deployment должен быть создан с `SANDBOX_PROVIDER=opensandbox`
- успешный run должен оставлять следы в `opensandbox-server` log и в Docker на OpenSandbox VM
- для быстрой проверки достаточно:

```bash
sudo journalctl -u opensandbox --since '15 min ago' --no-pager
sudo docker ps -a --format 'table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}'
```

Что уже подтверждено на `miro-dev`:

- OpenSandbox sandbox реально создавался на OpenSandbox VM
- run-path работал через OpenSandbox, а не через `e2b`
- после TTL sandbox удаляется, и старый `sandbox_id` перестаёт существовать
- это ожидаемое поведение, потому что `pause/resume` или recreate-after-expiry для OpenSandbox пока не реализованы

## 13. Основные грабли

### 1. Stale env

Мы уже ловили ситуацию, когда:

- `NEXT_PUBLIC_APP_URL` был не тот
- `BETTER_AUTH_URL` был `localhost`
- `DATABASE_URL` указывал на старый RDS endpoint

Результат:

- `Invalid origin`
- `500` на auth
- попытки ходить в несуществующую БД
- редиректы в старый `localhost`

### 2. На свежей БД не хватает таблиц

Если не применить `agents-schema.sql`, auth падает сразу.

Симптом:

- `better_auth_verifications does not exist`
- `relation "usages" does not exist`

Причина:

- Better Auth требует свои таблицы
- `proxy` всё ещё требует `public.usages`, даже в standalone

### 3. Naive env loading ломает секреты

Если грузить env через `source`, значения с `$` ломаются.

### 4. proxy и SSL к Postgres

Мы уже ловили:

- `self-signed certificate in certificate chain`

Для текущего AWS-контура у `proxy` нужно отдельно проверить SSL mode в `DATABASE_URL`.

Рабочий вариант для текущего контура:

- `sslmode=no-verify`

Это надо держать синхронным между локальным `.env.prod` и `/etc/21st/proxy.env`.

### 5. Первый install слишком жирный

На чистой VM первый `pnpm install` может разрастись на гигабайты.

Нельзя:

- делать полный reinstall без причины
- тащить лишние build outputs
- тянуть `Cypress`, если он не нужен для runtime

### 6. HTTP без TLS для SSO

Мы уже дошли до состояния, когда:

- Okta callback серверно проходил
- пользователь и сессия писались в Postgres
- но браузерный login оставался кривым из-за `http://` контура

Вывод:

- raw IP и `http://` не считать нормальным deploy target для browser auth
- для standalone auth нужен домен и HTTPS

### 7. `NEXT_PUBLIC_*` в `agents-web` требуют rebuild

Мы уже ловили два одинаковых симптома:

- клиент ходил в `http://localhost:3000`
- playground/deployments ходили в `https://relay.an.dev`

Причина была не в runtime env, а в старом собранном bundle `agents-web`.

Вывод:

- change в `NEXT_PUBLIC_*` для `agents-web` требует `next build`
- одного `systemctl restart agents-web` недостаточно
- после rebuild в браузере нужен hard refresh или incognito

### 8. Нельзя публиковать `relay` и `proxy` через raw IP / loopback

Мы уже ловили ситуацию, когда:

- `NEXT_PUBLIC_RELAY_URL` был `http://<ip>:3001`
- `CLAUDE_PROXY_URL` был `http://127.0.0.1:3002`

Результат:

- браузер ловил `failed to fetch` / mixed content
- внешний sandbox не смог бы ходить в `proxy`

Правильная схема:

- `https://<app_domain>/relay`
- `https://<app_domain>/proxy`

Оба path должны проксироваться через `nginx`.

### 9. Локальный SDK app тоже должен смотреть в AWS relay

Если тестируем локальное приложение или example app против standalone-контура, там тоже должен быть правильный relay URL.

Правильное значение:

- `NEXT_PUBLIC_RELAY_URL=https://<app_domain>/relay`

Нельзя:

- оставлять `http://localhost:3002`
- оставлять старый `https://relay-avnuia.fly.dev`
- надеяться на fallback в коде

## 14. Короткий checklist

Перед деплоем:

- Terraform workspace тот же самый
- branch/commit уже запушен
- `/srv/21st` обновлен до нужного коммита
- `/etc/21st/*.env` обновлены
- `app_url`, `database_url`, `redis_url` взяты из текущих Terraform outputs
- runtime app secrets не лежат в `deploy.auto.tfvars.json`
- если есть домен, `app_domain` задан в Terraform
- `443` открыт
- `3001/3002` наружу закрыты
- standalone флаги включены, если нужен standalone
- Better Auth / Okta env заполнены
- Okta переведена на текущий HTTPS домен
- schema bootstrap на свежей БД применен
- `certbot-renew.timer` включен
- для `agents-web` build есть swap и увеличенный heap

После деплоя:

- `systemctl is-active agents-web relay proxy`
- `systemctl is-active opensandbox`
- `https://<app_domain>/agents`
- `https://<app_domain>/relay/health`
- `https://<app_domain>/proxy/health`
- `curl http://127.0.0.1:8080/health` на OpenSandbox VM
- `POST /api/auth/sign-in/sso` возвращает `200`, а не `500`
- если менялись `NEXT_PUBLIC_*`, `agents-web` пересобран, а не только перезапущен
- в браузере после такого обновления сделан hard refresh или открыт incognito
- в network запросы не уходят в `localhost:3000`, `relay.an.dev` или `http://<app_ip>:3001`

## 15. EKS Kata-FC Repro Notes

Новый sandbox-plane воспроизводим не через managed node group, а так:

- `EKS` control plane
- self-managed sandbox nodes
- `m8i.xlarge` с `NestedVirtualization=enabled`
- `kata-deploy` поверх ноды
- `kata-fc` как `RuntimeClass`

Что уже оказалось обязательным на sandbox node:

- загрузить host modules:
  - `kvm`
  - `kvm_intel`
  - `vsock`
  - `vmw_vsock_virtio_transport_common`
  - `vmw_vsock_virtio_transport`
  - `vhost_vsock`
  - `tun`
  - `tap`
  - `vhost_net`
- поднять `devmapper` thin-pool для `containerd`
- дать node IAM доступ к `public.ecr.aws`
  - `ecr-public:GetAuthorizationToken`
  - `sts:GetServiceBearerToken`
- после `kata-deploy` пропатчить `kata-fc` runtime:
  - `snapshotter = "devmapper"`
  - kernel override на `/opt/kata/share/kata-containers/vmlinux-6.12.47-181-dragonball-experimental`
  - wrapper `containerd-shim-kata-fc-v2`, который эксплицитно указывает `KATA_CONF_FILE`

Почему нужен kernel override:

- дефолтный `vmlinux.container -> vmlinux-6.18.12-181` у текущего `kata-deploy` path был собран без `CONFIG_VIRTIO_MMIO`
- при этом `kata-fc` использует `block_device_driver = "virtio-mmio"`
- из-за этого guest не видел root block device и умирал с `Unable to mount root fs on unknown-block(0,0)`
- снаружи это выглядело как `timed out connecting to ... kata.hvsock`

Как проверять, что runtime действительно рабочий:

- минимальный smoke pod на уже присутствующем image:
  - `localhost/kubernetes/pause:latest`
- рабочий functional smoke:
  - `docker.io/library/busybox:latest`
  - внутри guest должен проходить `uname -a`

Что это значит practically:

- если `pause` и `busybox` стартуют через `runtimeClassName: kata-fc`, то сам `Firecracker` path жив
- если потом падает конкретный image вроде `public.ecr.aws/docker/library/redis:latest`, это уже отдельная проблема image pull / unpack / registry permissions, а не проблема `kata-fc`

## 16. Terraform Bring-Up Notes

Что именно оказалось сломано в Terraform path и как это теперь воспроизводится:

- первая версия self-managed bootstrap была битая из-за shell escaping в user-data
- после фикса bootstrap ноды реально начали поднимать `KVM`, `vsock`, `devmapper` и `kata-fc` host patching
- следующий реальный баг был не в `Firecracker`, а в sequencing:
  - `kata-fc-postinstall` несколько раз подряд рестартовал `containerd`
  - systemd загонял `containerd` в `start-limit-hit`
  - из-за этого fresh node выглядела как будто runtime снова сломан

Как это исправлено в Terraform:

- `kata-fc-postinstall` теперь:
  - берёт lock через `flock`
  - пишет файлы только если содержимое реально изменилось
  - делает `systemctl reset-failed containerd || true` перед restart
  - рестартует `containerd` только если runtime config действительно поменялся
  - watch path реагирует только на `PathChanged`, без `PathExists`, чтобы не гонять oneshot service бесконечно

## 17. Kata-FC Firecracker Cleanup Leak

На live-контуре пойман не timeout `relay` и не проблема workflow-кода, а leak на уровне `kata-fc` cleanup:

- после `StopPodSandbox` `containerd` пишет `shim disconnected`
- затем `containerd-shim-kata-fc-v2 ... delete` падает с `open /run/vc/sbs/<sandbox-id>: no such file or directory`
- `containerd` всё равно считает sandbox удалённым
- процесс `/firecracker` остаётся жить под `PPID=1` и продолжает держать память

Это совпадает с upstream Kata issues:

- https://github.com/kata-containers/kata-containers/issues/9420
- https://github.com/kata-containers/kata-containers/issues/11328

Практический mitigation для нашего `Firecracker + jailer` path:

- включить `sandbox_cgroup_only = true` в `kata-fc` runtime config
- это кладёт Kata/Firecracker процессы в один sandbox-level cgroup
- если shim cleanup падает, kubelet/containerd всё равно должен прибить весь sandbox cgroup вместе с orphan Firecracker

Terraform bootstrap теперь пишет drop-in:

```toml
[runtime]
sandbox_cgroup_only = true
```

После изменения live-ноды нужно перезапустить `containerd` на affected worker node, чтобы runtime config перечитался.

Проверка на live active-worker после включения:

- уже существующие orphan `/firecracker` процессы не исчезают автоматически
- новый `kata-fc` smoke pod может всё ещё писать angry cleanup logs вроде `failed to delete dead shim`
- ключевой критерий mitigation: после удаления smoke pod количество orphan `/firecracker` не должно расти

Что ещё важно при проверке:

- не запускать первый `kata-fc` smoke pod сразу после `NodeReady`
- сначала дождаться, что на новую sandbox node реально приехал `kata-deploy`
- иначе kubelet может отвечать `no runtime for "kata-fc" is configured`, хотя сама нода уже здорова

Проверенный happy path после фикса:

- `terraform apply`
- дождаться fresh self-managed node из latest launch template
- дождаться `kata-deploy` pod на этой ноде
- после этого `busybox` через `runtimeClassName: kata-fc` должен стартовать без ручного SSM-вмешательства

Фактически проверено на dev-контуре:

- fresh LT v3 node `ip-10-0-1-129.ec2.internal`
- `containerd` был `active`
- `ctr plugins ls | grep devmapper` -> `ok`
- `kata-fc-lt3-busybox` стартовал и внутри guest вернул:
  - `LT3_OK`
  - `Linux ... 6.12.47 ...`

## 17. OpenSandbox On EKS Notes

Что уже реально проверено на dev-кластере после того, как `kata-fc` заработал на self-managed nodes:

- в `EKS` установлен `opensandbox-controller`
- в `EKS` установлен `opensandbox-server`
- для `opensandbox-server` поднят internal `LoadBalancer` service:
  - `opensandbox-server-internal`
  - AWS NLB DNS:
    - `a63c2445510e74f76811eaffc49e2eaa-833838921.us-east-1.elb.amazonaws.com`
- OpenSandbox Lifecycle API реально создаёт `BatchSandbox` workload в namespace `opensandbox`
- sandbox workload реально идёт через `runtimeClassName: kata-fc`

Что пришлось учесть при установке:

- `RuntimeClass kata-fc` был дополнительно ограничен только на active worker nodes:
  - `katacontainers.io/kata-runtime=true`
  - `opensandbox-role=active-worker`
- general/reference nodes получили:
  - `workload=general`
  - `opensandbox-role=reference`
- Terraform-managed active worker nodes получили:
  - `opensandbox-role=active-worker`
- это нужно, чтобы `BatchSandbox` workload-ы шли только на active workers, а `opensandbox-server` / `opensandbox-controller` жили на general/reference node

Какие Helm values используются из репозитория:

- `apps/agents-web/infra/helm/opensandbox-controller.values.yaml`
- `apps/agents-web/infra/helm/opensandbox-server.values.yaml`

Какие chart paths теперь считаются источником правды в этом репозитории:

- `apps/agents-web/infra/charts/opensandbox-controller`
- `apps/agents-web/infra/charts/opensandbox-server`

Что оказалось несовместимым в upstream chart:

- `opensandbox-controller` chart `0.1.0` пытается передавать controller binary flags:
  - `--kube-client-qps`
  - `--kube-client-burst`
- текущий controller image эти flags не поддерживает
- кроме того, в template есть некорректное сравнение float/int для `controller.kubeClient.*`
- поэтому upstream chart был завендорен в этот repo и локально пропатчен
  - убрать args `--kube-client-qps` / `--kube-client-burst`
- live install до этого уже делался через временную копию chart в `/tmp`, но это больше не source of truth

Проверенный install order:

- применить `apps/agents-web/infra/k8s/namespaces.yaml`
- применить `apps/agents-web/infra/k8s/runtimeclass-kata-fc.yaml`
- убедиться, что active worker nodes имеют label:
  - `opensandbox-role=active-worker`
- убедиться, что general node имеет labels:
  - `workload=general`
  - `opensandbox-role=reference`
- поставить `opensandbox-controller`
- поставить `opensandbox-server`
- применить `apps/agents-web/infra/k8s/opensandbox-server-internal-service.yaml`

Как проверяли OpenSandbox API:

- локальный `kubectl port-forward -n opensandbox-system svc/opensandbox-server 18080:80`
- header auth:
  - `OPEN-SANDBOX-API-KEY: <terraform output opensandbox_api_key>`
- smoke request:

```bash
curl -X POST http://127.0.0.1:18080/v1/sandboxes \
  -H 'Content-Type: application/json' \
  -H 'OPEN-SANDBOX-API-KEY: <api-key>' \
  -d '{
    "image": {"uri": "docker.io/library/busybox:latest"},
    "timeout": 3600,
    "resourceLimits": {"cpu": "500m", "memory": "512Mi"},
    "entrypoint": ["/bin/sh", "-c", "sleep 300"],
    "metadata": {"name": "opensandbox-kata-smoke"}
  }'
```

Проверенный успешный результат:

- API ответил `202`
- вернулся sandbox object со `state = "Running"`
- в namespace `opensandbox` появился:
  - `BatchSandbox`
  - pod в `Running`
- pod реально сел на Terraform worker node с `kata-fc`

Что ещё поймали во время dev bring-up:

- одна из Terraform worker nodes словила race в `kata-fc-postinstall`
- symptom был такой:
  - `kata-deploy.toml` остался без `runtime_type/runtime_path/snapshotter` для `kata-fc`
  - kubelet на этой ноде отвечал:
    - `container.Runtime.Name must be set`
- node была временно выведена из active scheduling для изоляции проблемы
- после ручного восстановления `kata-deploy.toml` node снова подтвердила рабочий `kata-fc`
- после этого fix был сразу внесён и применён в Terraform:
  - `StartLimitIntervalSec=0`
  - `systemctl reset-failed kata-fc-postinstall.service || true`

Итоговое состояние dev-кластера после фикса:

- OpenSandbox установлен и работает
- internal NLB для `opensandbox-server` поднят
- Terraform-managed active worker pool жив
- `POST /v1/sandboxes` через OpenSandbox Lifecycle API реально создаёт sandbox в `kata-fc`

## 18. Relay Env For EKS OpenSandbox

Для текущего `relay -> OpenSandbox -> EKS -> kata-fc` path source of truth для runtime env всё ещё ручной:

- Terraform создаёт `/etc/21st/relay.env`, но не заполняет его значениями
- каноничный шаг сейчас:
  - локально собрать правильный `relay.env`
  - залить его на app VM
  - перезапустить `relay`

Минимально нужные `OpenSandbox`-переменные в `relay.env`:

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

Почему нужен `OPENSANDBOX_READY_TIMEOUT_SECONDS=120`:

- дефолтные `30s` оказались слишком короткими для первого cold start на `kata-fc`
- главный bottleneck был не TTL sandbox-а, а image pull + startup readiness
- после cache warm path уже сильно быстрее, но для первого старта `120s` сейчас безопасное значение

Как получить `OPENSANDBOX_DOMAIN` для `relay.env`:

```bash
kubectl -n opensandbox-system get svc opensandbox-server-internal
```

Нужен именно DNS internal `LoadBalancer`, без `http://`.

Быстрая проверка live env на app VM:

```bash
grep -E '^(OPENSANDBOX_DOMAIN|OPENSANDBOX_PROTOCOL|OPENSANDBOX_API_KEY|OPENSANDBOX_RUNTIME_IMAGE|OPENSANDBOX_USE_SERVER_PROXY|OPENSANDBOX_READY_TIMEOUT_SECONDS|STANDALONE_EKS_CLUSTER_NAME|STANDALONE_EKS_CLUSTER_ENDPOINT|STANDALONE_EKS_CLUSTER_CA_BASE64|AWS_REGION)=' /etc/21st/relay.env
```

Если менялся только `relay.env`, rebuild не нужен:

```bash
sudo systemctl restart relay
sudo systemctl status relay --no-pager
```

Для workspace `PVC` path нужен отдельный namespaced RBAC в `EKS`:

```bash
kubectl apply -f /Users/daniil/Work/21st-copy/apps/agents-web/infra/k8s/relay-pvc-manager-rbac.yaml
```

## 18.1. Firecracker Storage Findings

Ниже уже не hypothesis, а результат реальных spike-ов на dev-кластере.

Что **не сработало**:

- обычный filesystem `PVC -> volumeMount -> /home/user/workspace`
  - это пробовали и с `EFS PVC`, и с `hostPath`
  - на host volume реально существовал
  - внутри `kata-fc` guest mount path превращался в `tmpfs`
  - данные не переживали recreate / TTL
- `runtime-rs + Firecracker`
  - на текущем `kata-deploy 3.27.0` package этот path не дошёл даже до рабочего empty pod
  - Firecracker process спаунился, но VM оставалась полусконфигурированной
  - поэтому direct-volume эксперименты поверх этого runtime path не имели смысла продолжать
- guest-side `EFS/NFS` mount
  - network path, DNS и mount tooling внутри guest работали
  - но все shipped Kata guest kernel-ы на ноде оказались без `NFS` support:
    - `CONFIG_NFS_FS is not set`
  - значит `mount -t nfs4 ...` внутри guest на текущем package не взлетает

Что **сработало**:

- `EBS`-backed block `PVC` с:
  - `storageClassName = opensandbox-ebs-gp3`
  - `volumeMode = Block`
- Kubernetes pod spec должен использовать не `volumeMounts`, а `volumeDevices`
- sandbox внутри guest получает raw disk как:
  - `/dev/workspace-disk`
- runtime сам:
  - форматирует диск в `ext4`, если он пустой
  - монтирует его в `/home/user/workspace`

Практический вывод:

- проблема была не в самом `PVC` как абстракции Kubernetes
- проблема была в filesystem-style volume path для `kata-fc`
- рабочий Firecracker path для persistence сейчас = **block `PVC` + guest mount**

Отдельно про OpenSandbox:

- upstream OpenSandbox умел только filesystem-style volumes:
  - `volumes`
  - `volumeMounts`
- для рабочего Firecracker path пришлось сделать локальный fork:
  - `/Users/daniil/Work/OpenSandbox-fork`
  - branch `codex/block-volume-support`
- этот fork additive:
  - сохраняет старый `mountPath` flow
  - добавляет новый `devicePath` flow для `PVC`
  - генерирует `volumeDevices`
  - и добавляет `SYS_ADMIN` capability только для sandbox-ов с `devicePath`, чтобы runtime мог смонтировать disk inside guest

Это и есть текущий source of truth по storage для `kata-fc`.

## 19. Current Canonical State

Ниже по файлу всё ещё могут встречаться старые исторические секции про:

- отдельную OpenSandbox VM
- `terraform output opensandbox_domain`
- `terraform output opensandbox_private_url`
- сборку runtime image прямо на OpenSandbox VM

Для **нового** воспроизведения это больше не source of truth.

Что сейчас считать каноничным:

- sandbox plane = `EKS`
- sandbox workers = self-managed `m8i.xlarge` nodes с `NestedVirtualization=enabled`
- outer runtime = `kata-fc`
- OpenSandbox = `opensandbox-controller` + `opensandbox-server` внутри кластера
- relay ходит не в VM, а в internal NLB сервиса `opensandbox-server-internal`
- runtime image хранится в `ECR`
- workspace persistence для Firecracker идёт не через filesystem `volumeMount`, а через:
  - `EBS`-backed block `PVC`
  - `devicePath=/dev/workspace-disk`
  - mount inside guest в `/home/user/workspace`
- OpenSandbox server для этого path сейчас = локальный patched fork, а не чистый upstream

Текущие каноничные repo paths:

- Helm values:
  - `apps/agents-web/infra/helm/opensandbox-controller.values.yaml`
  - `apps/agents-web/infra/helm/opensandbox-server.values.yaml`
  - `apps/agents-web/infra/helm/kata-deploy.values.yaml`
- vendored charts:
  - `apps/agents-web/infra/charts/opensandbox-controller`
  - `apps/agents-web/infra/charts/opensandbox-server`
- manifests:
  - `apps/agents-web/infra/k8s/namespaces.yaml`
  - `apps/agents-web/infra/k8s/runtimeclass-kata-fc.yaml`
  - `apps/agents-web/infra/k8s/opensandbox-ebs-gp3-storageclass.yaml`
  - `apps/agents-web/infra/k8s/opensandbox-server-internal-service.yaml`
- local OpenSandbox fork:
  - `/Users/daniil/Work/OpenSandbox-fork`
  - `/Users/daniil/Work/OpenSandbox-fork/BLOCK-VOLUME-PLAN.md`

### OpenSandbox egress / network policy

Workflow can pass `networkAllowOut` to relay. Relay maps that to OpenSandbox `networkPolicy`.
OpenSandbox rejects any `networkPolicy` unless `opensandbox-server` has an `[egress]` config block.
Without it, sandbox creation fails with:

```text
egress.image must be configured when networkPolicy is provided.
```

Current intended config lives in:

- `apps/agents-web/infra/helm/opensandbox-server.values.yaml`
- `apps/agents-web/infra-miro/helm/opensandbox-server.values.yaml`

The block should be inside `configToml`:

```toml
[egress]
image = "sandbox-registry.cn-zhangjiakou.cr.aliyuncs.com/opensandbox/egress:v1.0.7"
mode = "dns+nft"
```

We intentionally use the upstream OpenSandbox egress image directly. Do not add a separate ECR repo unless image pulls from that registry start failing in AWS.

Important operational note: if full `terraform plan` includes unrelated ASG / launch-template / node-count drift, do not apply it just to fix egress. For the 2026-04-29 AWS hotfix we applied only the Helm release and restarted the server:

```bash
cd apps/agents-web/infra
aws eks update-kubeconfig --region us-east-1 --name "$(terraform output -raw sandbox_cluster_name)" --alias "$(terraform output -raw sandbox_cluster_name)"
api_key="$(terraform output -raw opensandbox_api_key)"
tmp_values="$(mktemp)"
OPEN_SANDBOX_API_KEY="$api_key" perl -pe 's/__REPLACE_WITH_TERRAFORM_OPEN_SANDBOX_API_KEY__/$ENV{OPEN_SANDBOX_API_KEY}/g' helm/opensandbox-server.values.yaml > "$tmp_values"
helm upgrade opensandbox-server ./charts/opensandbox-server -n opensandbox-system -f "$tmp_values"
rm -f "$tmp_values"
kubectl -n opensandbox-system rollout restart deploy/opensandbox-server
kubectl -n opensandbox-system rollout status deploy/opensandbox-server --timeout=180s
```

Verify live config:

```bash
kubectl -n opensandbox-system get cm opensandbox-server-config -o jsonpath='{.data.config\.toml}' | sed -n '/\[egress\]/,+3p'
kubectl -n opensandbox-system get pods -l app.kubernetes.io/name=opensandbox-server -o wide
```

Smoke check through relay: create a sandbox with `networkAllowOut`, then delete it. Passing this check means the old `egress.image must be configured` failure is gone.

Что уже реально подтверждено на dev-контуре:

- `kata-fc` работает на Terraform-managed self-managed workers
- OpenSandbox в кластере создаёт sandbox-ы через `RuntimeClass = kata-fc`
- general/reference node не используется `BatchSandbox` workload-ами
- `opensandbox-server` и `opensandbox-controller` должны быть закреплены за general/reference node, а не за sandbox workers
- `relay -> OpenSandbox -> EKS -> kata-fc` smoke уже прошёл end-to-end:
  - sandbox create
  - sandbox exec
  - sandbox delete
- OpenSandbox fork умеет attach-ить block `PVC` в sandbox как `volumeDevices`
- current `agent-runtime` умеет на старте:
  - увидеть `/dev/workspace-disk`
  - сделать `mkfs.ext4`, если нужно
  - смонтировать disk в `/home/user/workspace`
- standalone `relay` теперь умеет для `provider=opensandbox`:
  - создавать workspace block `PVC` в namespace `opensandbox`
  - использовать `storageClassName=opensandbox-ebs-gp3`
  - использовать `volumeMode=Block`
  - слать в OpenSandbox `devicePath=/dev/workspace-disk`
- старый `E2B` path этим не затронут и не требует Kubernetes доступа
- live PoC на direct OpenSandbox API уже подтверждён:
  - первый sandbox записал файл в `/home/user/workspace`
  - physical sandbox умер по TTL
  - новый sandbox с тем же block `PVC` увидел тот же файл
- live relay e2e тоже уже подтверждён:
  - relay создал sandbox
  - relay записал файл в `/home/user/workspace`
  - physical sandbox умер по естественному TTL
  - follow-up read через relay пересоздал новый physical sandbox
  - тот же файл остался доступным
- live relay egress smoke тоже подтверждён:
  - relay создал sandbox с `networkAllowOut=["github.com"]`
  - sandbox стал `active`
  - тестовый sandbox был удалён через relay

Что ещё важно помнить:

- `ECR` repo `21st-agent-runtime-opensandbox` уже импортирован в Terraform state
- команда `terraform import aws_ecr_repository.opensandbox_runtime 21st-agent-runtime-opensandbox` нужна только если state потеряется или создаётся заново
- `opensandbox-server` egress image не хранится в нашем ECR; используется upstream image из `sandbox-registry.cn-zhangjiakou.cr.aliyuncs.com`
- текущий working `relay.env` path требует:
  - `OPENSANDBOX_USE_SERVER_PROXY=true`
  - `OPENSANDBOX_READY_TIMEOUT_SECONDS=120`
  - `STANDALONE_EKS_CLUSTER_NAME`
  - `STANDALONE_EKS_CLUSTER_ENDPOINT`
  - `STANDALONE_EKS_CLUSTER_CA_BASE64`
  - `AWS_REGION`
- `120s` нужен не из-за TTL sandbox-а, а из-за cold start/readiness timeout на первом image pull
- workspace volume key сейчас = только `sandboxId`
- block device path сейчас = только `/dev/workspace-disk`
- final mount path inside guest сейчас = только `/home/user/workspace`
- TTL/recreate physical sandbox-а сохраняет `PVC`, а явный `DELETE /v1/sandboxes/:id` удаляет и compute, и `PVC`

Что ещё **не** сделано:

- `relay.env` всё ещё не генерируется Terraform-ом автоматически, он остаётся manual source-of-truth шагом
- `relay-pvc-manager-rbac.yaml` тоже нужно применять отдельно, Terraform его сам не накатывает
- full agent chat / Claude continuity поверх нового block-storage path ещё не подтверждён отдельно
- текущий рабочий storage path зависит от patched `opensandbox-server` image, upstream OpenSandbox этого volume mode ещё не умеет

Если sections выше конфликтуют с этим блоком, для текущего EKS-контура правильным считать именно этот блок плюс sections `17` и `18`.
