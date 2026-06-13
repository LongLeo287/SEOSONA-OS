data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["137112412989"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "app_eks_access" {
  statement {
    actions = ["eks:DescribeCluster"]
    resources = [aws_eks_cluster.sandbox.arn]
  }

  statement {
    actions = ["ecr:DescribeImages"]
    resources = [aws_ecr_repository.opensandbox_runtime.arn]
  }
}

locals {
  azs = slice(data.aws_availability_zones.available.names, 0, 2)

  database_url = "postgresql://${var.db_username}:${random_password.db_password.result}@${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${var.db_name}?sslmode=require"
  redis_url    = "rediss://:${random_password.redis_auth_token.result}@${aws_elasticache_replication_group.redis.primary_endpoint_address}:${aws_elasticache_replication_group.redis.port}"
  sandbox_cluster_name    = "${var.name_prefix}-sandbox"
  sandbox_node_group_name = "${local.sandbox_cluster_name}-workers"

  public_app_host = var.app_domain != "" ? var.app_domain : aws_eip.app.public_ip
  app_scheme      = var.app_domain != "" ? "https" : "http"

  app_url          = "${local.app_scheme}://${local.public_app_host}"
  relay_public_url = "${local.app_url}/relay"
  proxy_public_url = "${local.app_url}/proxy"

  nginx_config = <<-EOF
    server {
      listen 80 default_server;
      server_name ${var.app_domain != "" ? var.app_domain : "_"};

      location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 60s;
        proxy_send_timeout 900s;
        proxy_read_timeout 900s;
        client_max_body_size 50m;
      }

      location /relay/ {
        proxy_pass http://127.0.0.1:${var.relay_listener_port}/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off;
      }

      location /proxy/ {
        proxy_pass http://127.0.0.1:${var.proxy_listener_port}/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off;
      }
    }
  EOF

  agents_web_service = <<-EOF
    [Unit]
    Description=21st Agents Web
    After=network-online.target
    Wants=network-online.target
    ConditionPathExists=/srv/21st/apps/agents-web/package.json

    [Service]
    Type=simple
    User=ec2-user
    Group=ec2-user
    WorkingDirectory=/srv/21st
    EnvironmentFile=/etc/21st/agents-web.env
    ExecStart=/usr/bin/env bash -lc 'cd /srv/21st && exec pnpm --dir apps/agents-web exec next start'
    Restart=always
    RestartSec=5
    TimeoutStopSec=20

    [Install]
    WantedBy=multi-user.target
  EOF

  relay_service = <<-EOF
    [Unit]
    Description=21st Relay
    After=network-online.target
    Wants=network-online.target
    ConditionPathExists=/srv/21st/apps/relay/package.json

    [Service]
    Type=simple
    User=ec2-user
    Group=ec2-user
    WorkingDirectory=/srv/21st
    EnvironmentFile=/etc/21st/relay.env
    ExecStart=/usr/bin/env bash -lc 'cd /srv/21st && exec pnpm --dir apps/relay start'
    Restart=always
    RestartSec=5
    TimeoutStopSec=20

    [Install]
    WantedBy=multi-user.target
  EOF

  proxy_service = <<-EOF
    [Unit]
    Description=21st Proxy
    After=network-online.target
    Wants=network-online.target
    ConditionPathExists=/srv/21st/apps/proxy/package.json

    [Service]
    Type=simple
    User=ec2-user
    Group=ec2-user
    WorkingDirectory=/srv/21st
    EnvironmentFile=/etc/21st/proxy.env
    ExecStart=/usr/bin/env bash -lc 'cd /srv/21st && exec pnpm --dir apps/proxy start'
    Restart=always
    RestartSec=5
    TimeoutStopSec=20

    [Install]
    WantedBy=multi-user.target
  EOF

  deploy_script = <<-EOF
    #!/usr/bin/env bash
    set -euo pipefail

    if [ ! -f /srv/21st/package.json ]; then
      echo "Repository is not present at /srv/21st"
      exit 1
    fi

    load_env_file() {
      local file="$1"
      local line key val

      while IFS= read -r line || [ -n "$line" ]; do
        case "$line" in
          ''|\#*) continue ;;
        esac

        key=$${line%%=*}
        val=$${line#*=}

        if [[ $${#val} -ge 2 ]]; then
          if [[ $${val:0:1} == '"' && $${val: -1} == '"' ]]; then
            val=$${val:1:$${#val}-2}
          elif [[ $${val:0:1} == "'" && $${val: -1} == "'" ]]; then
            val=$${val:1:$${#val}-2}
          fi
        fi

        printf -v "$key" '%s' "$val"
        export "$key"
      done < "$file"
    }

    for env_file in /etc/21st/agents-web.env /etc/21st/relay.env /etc/21st/proxy.env; do
      if [ ! -s "$env_file" ]; then
        echo "Missing required env file: $env_file"
        exit 1
      fi
    done

    chown -R ec2-user:ec2-user /srv/21st

    runuser -l ec2-user -c "bash -lc '
      set -euo pipefail
      cd /srv/21st
      pnpm install --no-frozen-lockfile
      pnpm --dir packages/an-sdk/node build
      pnpm --dir packages/an-sdk/agent build
      pnpm --dir packages/an-sdk/react build
      pnpm --dir packages/an-sdk/nextjs build
      $(declare -f load_env_file)
      load_env_file /etc/21st/agents-web.env
      pnpm --dir apps/agents-web exec prisma generate --schema=./prisma/schema.prisma
      pnpm --dir apps/agents-web exec next build --webpack
    '"

    systemctl daemon-reload
    systemctl enable agents-web relay proxy
    systemctl restart relay
    systemctl restart proxy
    systemctl restart agents-web
  EOF

  user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail

    dnf install -y git nginx gcc-c++ make python3 openssl certbot python3-certbot-nginx awscli
    curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
    dnf install -y nodejs
    npm install -g pnpm@8.15.6

    mkdir -p /srv/21st /etc/21st
    chown ec2-user:ec2-user /srv/21st
    for env_file in /etc/21st/agents-web.env /etc/21st/relay.env /etc/21st/proxy.env; do
      if [ ! -f "$env_file" ]; then
        install -m 600 -o root -g root /dev/null "$env_file"
      fi
    done

    cat >/etc/systemd/system/agents-web.service <<'EOF_AGENTS_WEB_SERVICE'
    ${local.agents_web_service}
    EOF_AGENTS_WEB_SERVICE

    cat >/etc/systemd/system/relay.service <<'EOF_RELAY_SERVICE'
    ${local.relay_service}
    EOF_RELAY_SERVICE

    cat >/etc/systemd/system/proxy.service <<'EOF_PROXY_SERVICE'
    ${local.proxy_service}
    EOF_PROXY_SERVICE

    cat >/usr/local/bin/deploy-21st-standalone <<'EOF_DEPLOY_SCRIPT'
    ${local.deploy_script}
    EOF_DEPLOY_SCRIPT
    chmod +x /usr/local/bin/deploy-21st-standalone

    rm -f /etc/nginx/conf.d/default.conf
    cat >/etc/nginx/conf.d/21st-agents-web.conf <<'EOF_NGINX'
    ${local.nginx_config}
    EOF_NGINX

    nginx -t
    systemctl daemon-reload
    systemctl enable nginx
    systemctl restart nginx
    systemctl enable amazon-ssm-agent
    systemctl restart amazon-ssm-agent || true
  EOF

  tags = {
    Project   = var.name_prefix
    ManagedBy = "terraform"
  }
}

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-vpc"
  })
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-igw"
  })
}

resource "aws_subnet" "public" {
  count = 2

  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-public-${count.index + 1}"
    Tier = "public"
    "kubernetes.io/cluster/${local.sandbox_cluster_name}" = "shared"
    "kubernetes.io/role/elb"                              = "1"
  })
}

resource "aws_subnet" "private" {
  count = 2

  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = local.azs[count.index]

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-private-${count.index + 1}"
    Tier = "private"
    "kubernetes.io/cluster/${local.sandbox_cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"                     = "1"
  })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-public"
  })
}

resource "aws_route_table_association" "public" {
  count = 2

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-private"
  })
}

resource "aws_route_table_association" "private" {
  count = 2

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

resource "aws_security_group" "app" {
  name        = "${var.name_prefix}-app"
  description = "Public access for bare metal services"
  vpc_id      = aws_vpc.this.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-app"
  })
}

resource "aws_security_group" "postgres" {
  name        = "${var.name_prefix}-postgres"
  description = "PostgreSQL access from ECS tasks only"
  vpc_id      = aws_vpc.this.id

  ingress {
    description     = "PostgreSQL from app VM"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-postgres"
  })
}

resource "aws_security_group" "redis" {
  name        = "${var.name_prefix}-redis"
  description = "Redis access from ECS tasks only"
  vpc_id      = aws_vpc.this.id

  ingress {
    description     = "Redis from app VM"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-redis"
  })
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.name_prefix}-db-subnets"
  subnet_ids = aws_subnet.private[*].id

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-db-subnets"
  })
}

resource "aws_elasticache_subnet_group" "this" {
  name       = "${var.name_prefix}-redis-subnets"
  subnet_ids = aws_subnet.private[*].id
}

resource "random_password" "db_password" {
  length  = 32
  special = false
}

resource "random_password" "redis_auth_token" {
  length  = 32
  special = false
}

resource "random_password" "opensandbox_api_key" {
  length  = 48
  special = false
}

resource "aws_db_instance" "postgres" {
  identifier               = "${var.name_prefix}-db"
  engine                   = "postgres"
  engine_version           = var.postgres_engine_version
  instance_class           = var.db_instance_class
  allocated_storage        = 20
  max_allocated_storage    = 100
  storage_type             = "gp3"
  db_name                  = var.db_name
  username                 = var.db_username
  password                 = random_password.db_password.result
  db_subnet_group_name     = aws_db_subnet_group.this.name
  vpc_security_group_ids   = [aws_security_group.postgres.id]
  publicly_accessible      = false
  storage_encrypted        = true
  skip_final_snapshot      = false
  final_snapshot_identifier = "${var.name_prefix}-db-final"
  deletion_protection      = true
  delete_automated_backups = false
  backup_retention_period  = 7
  multi_az                 = false
  apply_immediately        = true
  copy_tags_to_snapshot    = true

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-db"
  })
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = replace("${var.name_prefix}-redis", "_", "-")
  description                = "Redis for agents-web bare metal stack"
  engine                     = "redis"
  engine_version             = var.redis_engine_version
  node_type                  = var.redis_node_type
  port                       = 6379
  parameter_group_name       = "default.redis7"
  num_cache_clusters         = 1
  subnet_group_name          = aws_elasticache_subnet_group.this.name
  security_group_ids         = [aws_security_group.redis.id]
  auth_token                 = random_password.redis_auth_token.result
  transit_encryption_enabled = true
  at_rest_encryption_enabled = true
  automatic_failover_enabled = false
  multi_az_enabled           = false
  apply_immediately          = true

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-redis"
  })
}

resource "aws_iam_role" "app" {
  name               = "${var.name_prefix}-app"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-app"
  })
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.app.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy" "app_eks_access" {
  name   = "${var.name_prefix}-app-eks-access"
  role   = aws_iam_role.app.id
  policy = data.aws_iam_policy_document.app_eks_access.json
}

resource "aws_iam_instance_profile" "app" {
  name = "${var.name_prefix}-app"
  role = aws_iam_role.app.name
}

resource "aws_instance" "app" {
  ami                         = var.app_ami_id
  instance_type               = var.app_instance_type
  subnet_id                   = aws_subnet.public[0].id
  vpc_security_group_ids      = [aws_security_group.app.id]
  iam_instance_profile        = aws_iam_instance_profile.app.name
  associate_public_ip_address = true
  user_data_base64            = base64gzip(local.user_data)
  user_data_replace_on_change = false

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  root_block_device {
    volume_size           = var.app_root_volume_size
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  depends_on = [aws_internet_gateway.this]

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-app"
  })
}

resource "aws_eip" "app" {
  domain = "vpc"

  tags = merge(local.tags, {
    Name = "${var.name_prefix}-app"
  })
}

resource "aws_eip_association" "app" {
  instance_id   = aws_instance.app.id
  allocation_id = aws_eip.app.id
}
