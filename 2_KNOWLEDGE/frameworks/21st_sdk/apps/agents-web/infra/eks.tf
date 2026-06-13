data "aws_iam_policy_document" "eks_cluster_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "eks_node_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

data "aws_ssm_parameter" "eks_al2023_ami" {
  name = "/aws/service/eks/optimized-ami/${var.sandbox_cluster_version}/amazon-linux-2023/x86_64/standard/recommended/image_id"
}

data "aws_iam_policy_document" "eks_node_ecr_public" {
  statement {
    actions = [
      "ecr-public:BatchCheckLayerAvailability",
      "ecr-public:BatchGetImage",
      "ecr-public:DescribeImages",
      "ecr-public:GetAuthorizationToken",
      "ecr-public:GetDownloadUrlForLayer",
      "sts:GetServiceBearerToken",
    ]

    resources = ["*"]
  }
}

locals {
  sandbox_node_security_group_name = "${local.sandbox_cluster_name}-workers"
  general_node_group_name          = "${local.sandbox_cluster_name}-general"

  sandbox_node_bootstrap = <<-EOF
    #!/bin/bash
    set -euxo pipefail

    dnf install -y jq

    cat >/etc/modules-load.d/kata-fc.conf <<'EOF_MODULES'
    kvm
    kvm_intel
    vsock
    vmw_vsock_virtio_transport_common
    vmw_vsock_virtio_transport
    vhost_vsock
    tun
    tap
    vhost_net
    EOF_MODULES

    while read -r module; do
      [ -n "$module" ] || continue
      modprobe "$module" || true
    done </etc/modules-load.d/kata-fc.conf

    cat >/usr/local/bin/kata-fc-devmapper-setup <<'EOF_DEVMAPPER'
    #!/bin/bash
    set -euo pipefail

    DATA_DIR=/var/lib/containerd/io.containerd.snapshotter.v1.devmapper
    POOL_NAME=devpool
    DATA_FILE="$DATA_DIR/data"
    META_FILE="$DATA_DIR/meta"

    if dmsetup ls --target thin-pool 2>/dev/null | awk '{print $1}' | grep -qx "$POOL_NAME"; then
      exit 0
    fi

    mkdir -p "$DATA_DIR"
    [ -f "$DATA_FILE" ] || truncate -s 40G "$DATA_FILE"
    [ -f "$META_FILE" ] || truncate -s 4G "$META_FILE"

    attach_loop() {
      local file="$1"
      local device

      device=$(losetup -j "$file" | awk -F: 'NR == 1 { print $1 }')
      if [ -z "$device" ]; then
        device=$(losetup --find --show "$file")
      fi

      printf '%s\n' "$device"
    }

    DATA_DEV=$(attach_loop "$DATA_FILE")
    META_DEV=$(attach_loop "$META_FILE")

    SECTOR_SIZE=512
    DATA_SIZE=$(blockdev --getsize64 "$DATA_DEV")
    LENGTH_IN_SECTORS=$((DATA_SIZE / SECTOR_SIZE))

    dmsetup create "$POOL_NAME" \
      --table "0 $LENGTH_IN_SECTORS thin-pool $META_DEV $DATA_DEV 128 32768"
    EOF_DEVMAPPER
    chmod +x /usr/local/bin/kata-fc-devmapper-setup

    cat >/etc/systemd/system/kata-fc-devmapper.service <<'EOF_DEVMAPPER_SERVICE'
    [Unit]
    Description=Prepare devmapper thin-pool for kata-fc
    DefaultDependencies=no
    After=local-fs.target
    Before=containerd.service

    [Service]
    Type=oneshot
    ExecStart=/usr/local/bin/kata-fc-devmapper-setup
    RemainAfterExit=yes

    [Install]
    WantedBy=multi-user.target
    EOF_DEVMAPPER_SERVICE

    /usr/local/bin/kata-fc-devmapper-setup

    if ! grep -q 'io.containerd.snapshotter.v1.devmapper' /etc/containerd/config.toml; then
      cat >>/etc/containerd/config.toml <<'EOF_CONTAINERD_DEVMAPPER'

    [plugins."io.containerd.snapshotter.v1.devmapper"]
      pool_name = "devpool"
      root_path = "/var/lib/containerd/io.containerd.snapshotter.v1.devmapper"
      base_image_size = "10GB"
      discard_blocks = true
    EOF_CONTAINERD_DEVMAPPER
    fi

    sed -i 's/discard_unpacked_layers = true/discard_unpacked_layers = false/' /etc/containerd/config.toml

    systemctl daemon-reload
    systemctl enable kata-fc-devmapper.service
    systemctl restart containerd

    cat >/usr/local/bin/kata-fc-postinstall <<'EOF_POSTINSTALL'
    #!/bin/bash
    set -euo pipefail

    exec 9>/run/kata-fc-postinstall.lock
    flock -n 9 || exit 0

    CFG_ROOT=/opt/kata/share/defaults/kata-containers/runtimes/fc
    CFG_FILE="$CFG_ROOT/configuration-fc.toml"
    CFG_DIR="$CFG_ROOT/config.d"
    CONTAINERD_CFG=/opt/kata/containerd/config.d/kata-deploy.toml
    SHIM_WRAPPER=/usr/local/bin/containerd-shim-kata-fc-v2
    CHANGED=0

    [ -f "$CFG_FILE" ] || exit 0

    mkdir -p "$CFG_DIR"

    write_if_changed() {
      local mode="$1"
      local path="$2"
      local tmp

      tmp=$(mktemp)
      cat >"$tmp"

      if [ ! -f "$path" ] || ! cmp -s "$tmp" "$path"; then
        install -m "$mode" "$tmp" "$path"
        CHANGED=1
      fi

      rm -f "$tmp"
    }

    write_if_changed 0644 "$CFG_DIR/50-nested.toml" <<'EOF_NESTED'
    [hypervisor.firecracker]
    disable_nesting_checks = true
    EOF_NESTED

    write_if_changed 0644 "$CFG_DIR/70-kernel.toml" <<'EOF_KERNEL'
    [hypervisor.firecracker]
    kernel = "/opt/kata/share/kata-containers/vmlinux-6.12.47-181-dragonball-experimental"
    EOF_KERNEL

    write_if_changed 0644 "$CFG_DIR/80-sandbox-cgroup.toml" <<'EOF_SANDBOX_CGROUP'
    [runtime]
    sandbox_cgroup_only = true
    EOF_SANDBOX_CGROUP

    write_if_changed 0755 "$SHIM_WRAPPER" <<'EOF_SHIM'
    #!/bin/bash
    export KATA_CONF_FILE=/opt/kata/share/defaults/kata-containers/runtimes/fc/configuration-fc.toml
    exec /opt/kata/bin/containerd-shim-kata-v2 "$@"
    EOF_SHIM

    if [ -f "$CONTAINERD_CFG" ]; then
      if ! grep -q 'runtime_path = "/usr/local/bin/containerd-shim-kata-fc-v2"' "$CONTAINERD_CFG"; then
        sed -i 's#runtime_path = "/opt/kata/bin/containerd-shim-kata-v2"#runtime_path = "/usr/local/bin/containerd-shim-kata-fc-v2"#' "$CONTAINERD_CFG"
        CHANGED=1
      fi

      if ! grep -q 'snapshotter = "devmapper"' "$CONTAINERD_CFG"; then
        sed -i '/runtime_path = "\/usr\/local\/bin\/containerd-shim-kata-fc-v2"/a snapshotter = "devmapper"' "$CONTAINERD_CFG"
        CHANGED=1
      fi

      if [ "$CHANGED" -eq 1 ]; then
        systemctl reset-failed containerd || true
        systemctl restart containerd
      fi
    fi
    EOF_POSTINSTALL
    chmod +x /usr/local/bin/kata-fc-postinstall

    cat >/etc/systemd/system/kata-fc-postinstall.service <<'EOF_POSTINSTALL_SERVICE'
    [Unit]
    Description=Patch kata-fc runtime after kata-deploy installation
    After=containerd.service
    StartLimitIntervalSec=0

    [Service]
    Type=oneshot
    ExecStart=/usr/local/bin/kata-fc-postinstall
    EOF_POSTINSTALL_SERVICE

    cat >/etc/systemd/system/kata-fc-postinstall.path <<'EOF_POSTINSTALL_PATH'
    [Unit]
    Description=Watch kata-fc install paths and apply local overrides

    [Path]
    PathChanged=/opt/kata/share/defaults/kata-containers/runtimes/fc/configuration-fc.toml
    PathChanged=/opt/kata/containerd/config.d/kata-deploy.toml
    Unit=kata-fc-postinstall.service

    [Install]
    WantedBy=multi-user.target
    EOF_POSTINSTALL_PATH

    systemctl daemon-reload
    systemctl reset-failed kata-fc-postinstall.service || true
    systemctl enable --now kata-fc-postinstall.path
    systemctl start kata-fc-postinstall.service || true
  EOF

  sandbox_node_user_data = <<-EOF
    MIME-Version: 1.0
    Content-Type: multipart/mixed; boundary="NODEBOUNDARY"

    --NODEBOUNDARY
    Content-Type: application/node.eks.aws

    ---
    apiVersion: node.eks.aws/v1alpha1
    kind: NodeConfig
    spec:
      cluster:
        name: ${aws_eks_cluster.sandbox.name}
        apiServerEndpoint: ${aws_eks_cluster.sandbox.endpoint}
        certificateAuthority: ${aws_eks_cluster.sandbox.certificate_authority[0].data}
        cidr: ${var.sandbox_cluster_service_cidr}
      kubelet:
        flags:
          - --node-labels=workload=sandbox,self-managed=true,katacontainers.io/kata-runtime=true,opensandbox-role=active-worker
          - --register-with-taints=runtime=kata-fc:NoSchedule

    --NODEBOUNDARY
    Content-Type: text/x-shellscript; charset="us-ascii"

    ${local.sandbox_node_bootstrap}
    --NODEBOUNDARY--
  EOF

  general_node_user_data = <<-EOF
    MIME-Version: 1.0
    Content-Type: multipart/mixed; boundary="NODEBOUNDARY"

    --NODEBOUNDARY
    Content-Type: application/node.eks.aws

    ---
    apiVersion: node.eks.aws/v1alpha1
    kind: NodeConfig
    spec:
      cluster:
        name: ${aws_eks_cluster.sandbox.name}
        apiServerEndpoint: ${aws_eks_cluster.sandbox.endpoint}
        certificateAuthority: ${aws_eks_cluster.sandbox.certificate_authority[0].data}
        cidr: ${var.sandbox_cluster_service_cidr}
      kubelet:
        flags:
          - --node-labels=workload=general,self-managed=true,opensandbox-role=reference

    --NODEBOUNDARY--
  EOF
}

resource "aws_iam_role" "eks_cluster" {
  name               = "${local.sandbox_cluster_name}-cluster"
  assume_role_policy = data.aws_iam_policy_document.eks_cluster_assume_role.json

  tags = merge(local.tags, {
    Name = "${local.sandbox_cluster_name}-cluster"
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  role       = aws_iam_role.eks_cluster.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_eks_cluster" "sandbox" {
  name     = local.sandbox_cluster_name
  role_arn = aws_iam_role.eks_cluster.arn
  version  = var.sandbox_cluster_version

  access_config {
    authentication_mode                         = "API_AND_CONFIG_MAP"
    bootstrap_cluster_creator_admin_permissions = true
  }

  kubernetes_network_config {
    service_ipv4_cidr = var.sandbox_cluster_service_cidr
  }

  vpc_config {
    subnet_ids              = concat(aws_subnet.public[*].id, aws_subnet.private[*].id)
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
  ]

  tags = merge(local.tags, {
    Name = local.sandbox_cluster_name
  })
}

resource "aws_iam_role" "eks_node" {
  name               = "${local.sandbox_cluster_name}-node"
  assume_role_policy = data.aws_iam_policy_document.eks_node_assume_role.json

  tags = merge(local.tags, {
    Name = "${local.sandbox_cluster_name}-node"
  })
}

resource "aws_iam_role_policy_attachment" "eks_node_worker" {
  role       = aws_iam_role.eks_node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "eks_node_cni" {
  role       = aws_iam_role.eks_node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "eks_node_ecr" {
  role       = aws_iam_role.eks_node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "eks_node_ssm" {
  role       = aws_iam_role.eks_node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy" "eks_node_ecr_public" {
  name   = "${local.sandbox_cluster_name}-node-ecr-public"
  role   = aws_iam_role.eks_node.id
  policy = data.aws_iam_policy_document.eks_node_ecr_public.json
}

resource "aws_iam_instance_profile" "eks_node" {
  name = "${local.sandbox_cluster_name}-node"
  role = aws_iam_role.eks_node.name
}

resource "aws_eks_access_entry" "sandbox_node" {
  cluster_name  = aws_eks_cluster.sandbox.name
  principal_arn = aws_iam_role.eks_node.arn
  type          = "EC2_LINUX"
}

resource "aws_eks_access_entry" "relay_pvc_manager" {
  cluster_name       = aws_eks_cluster.sandbox.name
  principal_arn      = aws_iam_role.app.arn
  kubernetes_groups  = ["relay-pvc-manager", "opensandbox-image-builder-control"]
  type               = "STANDARD"
}

resource "aws_security_group_rule" "sandbox_cluster_https_from_app" {
  type                     = "ingress"
  description              = "Allow app VM to reach EKS API"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  security_group_id        = aws_eks_cluster.sandbox.vpc_config[0].cluster_security_group_id
  source_security_group_id = aws_security_group.app.id
}

resource "aws_security_group" "sandbox_node" {
  name        = local.sandbox_node_security_group_name
  description = "Self-managed sandbox nodes"
  vpc_id      = aws_vpc.this.id

  ingress {
    description = "All traffic between sandbox nodes"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  ingress {
    description     = "Cluster security group to sandbox nodes"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_eks_cluster.sandbox.vpc_config[0].cluster_security_group_id]
  }

  ingress {
    description     = "Allow app VM to reach sandbox runtime endpoints"
    from_port       = 3003
    to_port         = 3003
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
    Name = local.sandbox_node_security_group_name
  })
}

resource "aws_launch_template" "sandbox_node" {
  name_prefix   = "${local.sandbox_node_group_name}-"
  image_id      = data.aws_ssm_parameter.eks_al2023_ami.value
  instance_type = var.sandbox_node_instance_types[0]

  update_default_version = true

  cpu_options {
    nested_virtualization = "enabled"
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.eks_node.name
  }

  vpc_security_group_ids = [
    aws_eks_cluster.sandbox.vpc_config[0].cluster_security_group_id,
    aws_security_group.sandbox_node.id,
  ]

  block_device_mappings {
    device_name = "/dev/xvda"

    ebs {
      delete_on_termination = true
      encrypted             = true
      volume_size           = var.sandbox_node_disk_size
      volume_type           = "gp3"
    }
  }

  metadata_options {
    http_tokens = "required"
  }

  monitoring {
    enabled = false
  }

  user_data = base64encode(local.sandbox_node_user_data)

  tag_specifications {
    resource_type = "instance"

    tags = merge(local.tags, {
      Name = local.sandbox_node_group_name
    })
  }

  tag_specifications {
    resource_type = "volume"

    tags = merge(local.tags, {
      Name = local.sandbox_node_group_name
    })
  }
}

resource "aws_launch_template" "general_node" {
  name_prefix   = "${local.general_node_group_name}-"
  image_id      = data.aws_ssm_parameter.eks_al2023_ami.value
  instance_type = var.general_node_instance_types[0]

  update_default_version = true

  iam_instance_profile {
    name = aws_iam_instance_profile.eks_node.name
  }

  vpc_security_group_ids = [
    aws_eks_cluster.sandbox.vpc_config[0].cluster_security_group_id,
    aws_security_group.sandbox_node.id,
  ]

  block_device_mappings {
    device_name = "/dev/xvda"

    ebs {
      delete_on_termination = true
      encrypted             = true
      volume_size           = var.general_node_disk_size
      volume_type           = "gp3"
    }
  }

  metadata_options {
    http_tokens = "required"
  }

  monitoring {
    enabled = false
  }

  user_data = base64encode(local.general_node_user_data)

  tag_specifications {
    resource_type = "instance"

    tags = merge(local.tags, {
      Name = local.general_node_group_name
    })
  }

  tag_specifications {
    resource_type = "volume"

    tags = merge(local.tags, {
      Name = local.general_node_group_name
    })
  }
}

resource "aws_autoscaling_group" "sandbox_node" {
  name                = local.sandbox_node_group_name
  desired_capacity    = var.sandbox_node_desired_size
  min_size            = var.sandbox_node_min_size
  max_size            = var.sandbox_node_max_size
  vpc_zone_identifier = aws_subnet.public[*].id

  launch_template {
    id      = aws_launch_template.sandbox_node.id
    version = aws_launch_template.sandbox_node.latest_version
  }

  instance_refresh {
    strategy = "Rolling"

    preferences {
      min_healthy_percentage = 50
      instance_warmup        = 60
    }
  }

  tag {
    key                 = "Name"
    value               = local.sandbox_node_group_name
    propagate_at_launch = true
  }

  tag {
    key                 = "kubernetes.io/cluster/${aws_eks_cluster.sandbox.name}"
    value               = "owned"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/enabled"
    value               = "true"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/${aws_eks_cluster.sandbox.name}"
    value               = "owned"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/workload"
    value               = "sandbox"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/self-managed"
    value               = "true"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/katacontainers.io/kata-runtime"
    value               = "true"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/taint/runtime"
    value               = "kata-fc:NoSchedule"
    propagate_at_launch = true
  }

  depends_on = [
    aws_eks_access_entry.sandbox_node,
    aws_iam_role_policy_attachment.eks_node_worker,
    aws_iam_role_policy_attachment.eks_node_cni,
    aws_iam_role_policy_attachment.eks_node_ecr,
    aws_iam_role_policy_attachment.eks_node_ssm,
    aws_iam_role_policy.eks_node_ecr_public,
  ]
}

resource "aws_autoscaling_group" "general_node" {
  name                = local.general_node_group_name
  desired_capacity    = var.general_node_desired_size
  min_size            = var.general_node_min_size
  max_size            = var.general_node_max_size
  vpc_zone_identifier = aws_subnet.public[*].id

  launch_template {
    id      = aws_launch_template.general_node.id
    version = aws_launch_template.general_node.latest_version
  }

  instance_refresh {
    strategy = "Rolling"

    preferences {
      min_healthy_percentage = 50
      instance_warmup        = 60
    }
  }

  tag {
    key                 = "Name"
    value               = local.general_node_group_name
    propagate_at_launch = true
  }

  tag {
    key                 = "kubernetes.io/cluster/${aws_eks_cluster.sandbox.name}"
    value               = "owned"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/enabled"
    value               = "true"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/${aws_eks_cluster.sandbox.name}"
    value               = "owned"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/workload"
    value               = "general"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/self-managed"
    value               = "true"
    propagate_at_launch = true
  }

  depends_on = [
    aws_eks_access_entry.sandbox_node,
    aws_iam_role_policy_attachment.eks_node_worker,
    aws_iam_role_policy_attachment.eks_node_cni,
    aws_iam_role_policy_attachment.eks_node_ecr,
    aws_iam_role_policy_attachment.eks_node_ssm,
    aws_iam_role_policy.eks_node_ecr_public,
  ]
}

resource "aws_security_group" "sandbox_efs" {
  name        = "${local.sandbox_cluster_name}-efs"
  description = "NFS access for sandbox PVCs"
  vpc_id      = aws_vpc.this.id

  ingress {
    description = "NFS from within the VPC"
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags, {
    Name = "${local.sandbox_cluster_name}-efs"
  })
}

resource "aws_efs_file_system" "sandbox" {
  encrypted        = true
  performance_mode = var.sandbox_efs_performance_mode
  throughput_mode  = "elastic"

  tags = merge(local.tags, {
    Name = "${local.sandbox_cluster_name}-efs"
  })
}

resource "aws_efs_mount_target" "sandbox" {
  count = length(aws_subnet.private)

  file_system_id  = aws_efs_file_system.sandbox.id
  subnet_id       = aws_subnet.private[count.index].id
  security_groups = [aws_security_group.sandbox_efs.id]
}

data "tls_certificate" "eks_oidc" {
  url = aws_eks_cluster.sandbox.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "eks" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks_oidc.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.sandbox.identity[0].oidc[0].issuer

  tags = merge(local.tags, {
    Name = "${local.sandbox_cluster_name}-oidc"
  })
}

data "aws_iam_policy_document" "sandbox_efs_csi_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.eks.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:sub"
      values   = ["system:serviceaccount:kube-system:efs-csi-controller-sa"]
    }
  }
}

resource "aws_iam_role" "sandbox_efs_csi" {
  name               = "${local.sandbox_cluster_name}-efs-csi"
  assume_role_policy = data.aws_iam_policy_document.sandbox_efs_csi_assume_role.json

  tags = merge(local.tags, {
    Name = "${local.sandbox_cluster_name}-efs-csi"
  })
}

resource "aws_iam_role_policy_attachment" "sandbox_efs_csi" {
  role       = aws_iam_role.sandbox_efs_csi.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEFSCSIDriverPolicy"
}

resource "aws_eks_addon" "sandbox_efs_csi" {
  cluster_name             = aws_eks_cluster.sandbox.name
  addon_name               = "aws-efs-csi-driver"
  service_account_role_arn = aws_iam_role.sandbox_efs_csi.arn

  depends_on = [
    aws_autoscaling_group.sandbox_node,
    aws_iam_role_policy_attachment.sandbox_efs_csi,
  ]
}

data "aws_iam_policy_document" "sandbox_ebs_csi_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.eks.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:sub"
      values   = ["system:serviceaccount:kube-system:ebs-csi-controller-sa"]
    }
  }
}

resource "aws_iam_role" "sandbox_ebs_csi" {
  name               = "${local.sandbox_cluster_name}-ebs-csi"
  assume_role_policy = data.aws_iam_policy_document.sandbox_ebs_csi_assume_role.json

  tags = merge(local.tags, {
    Name = "${local.sandbox_cluster_name}-ebs-csi"
  })
}

resource "aws_iam_role_policy_attachment" "sandbox_ebs_csi" {
  role       = aws_iam_role.sandbox_ebs_csi.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
}

resource "aws_eks_addon" "sandbox_ebs_csi" {
  cluster_name             = aws_eks_cluster.sandbox.name
  addon_name               = "aws-ebs-csi-driver"
  service_account_role_arn = aws_iam_role.sandbox_ebs_csi.arn

  depends_on = [
    aws_autoscaling_group.sandbox_node,
    aws_iam_role_policy_attachment.sandbox_ebs_csi,
  ]
}
