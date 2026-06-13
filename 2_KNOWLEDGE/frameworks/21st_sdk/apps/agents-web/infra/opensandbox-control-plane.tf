data "aws_eks_cluster_auth" "sandbox" {
  name = aws_eks_cluster.sandbox.name
}

provider "kubernetes" {
  host                   = aws_eks_cluster.sandbox.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.sandbox.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.sandbox.token
}

provider "helm" {
  kubernetes = {
    host                   = aws_eks_cluster.sandbox.endpoint
    cluster_ca_certificate = base64decode(aws_eks_cluster.sandbox.certificate_authority[0].data)
    token                  = data.aws_eks_cluster_auth.sandbox.token
  }
}

locals {
  opensandbox_server_values = replace(
    file("${path.module}/helm/opensandbox-server.values.yaml"),
    "__REPLACE_WITH_TERRAFORM_OPEN_SANDBOX_API_KEY__",
    random_password.opensandbox_api_key.result,
  )
  opensandbox_controller_values = file("${path.module}/helm/opensandbox-controller.values.yaml")
}

resource "kubernetes_namespace_v1" "opensandbox" {
  metadata {
    name = "opensandbox"
  }

  depends_on = [aws_autoscaling_group.sandbox_node]
}

resource "helm_release" "opensandbox_server" {
  name             = "opensandbox-server"
  namespace        = "opensandbox-system"
  chart            = "${path.module}/charts/opensandbox-server"
  create_namespace = false
  atomic           = false
  wait             = true
  timeout          = 300

  values = [local.opensandbox_server_values]

  depends_on = [
    aws_autoscaling_group.sandbox_node,
    aws_autoscaling_group.general_node,
    aws_eks_addon.sandbox_ebs_csi,
    kubernetes_namespace_v1.opensandbox,
  ]
}

resource "helm_release" "opensandbox_controller" {
  name             = "opensandbox-controller"
  namespace        = "opensandbox-system"
  chart            = "${path.module}/charts/opensandbox-controller"
  create_namespace = false
  atomic           = false
  wait             = true
  timeout          = 300

  values = [local.opensandbox_controller_values]

  depends_on = [
    aws_autoscaling_group.sandbox_node,
    aws_autoscaling_group.general_node,
    kubernetes_namespace_v1.opensandbox,
  ]
}

resource "kubernetes_storage_class_v1" "opensandbox_ebs_gp3" {
  metadata {
    name = "opensandbox-ebs-gp3"
  }

  storage_provisioner    = "ebs.csi.aws.com"
  reclaim_policy         = "Delete"
  volume_binding_mode    = "WaitForFirstConsumer"
  allow_volume_expansion = true
  parameters = {
    type = "gp3"
  }

  depends_on = [aws_eks_addon.sandbox_ebs_csi]
}

resource "kubernetes_role_v1" "relay_pvc_manager" {
  metadata {
    name      = "relay-pvc-manager"
    namespace = kubernetes_namespace_v1.opensandbox.metadata[0].name
  }

  rule {
    api_groups = [""]
    resources  = ["persistentvolumeclaims"]
    verbs      = ["get", "list", "create", "watch", "delete"]
  }
}

resource "kubernetes_role_binding_v1" "relay_pvc_manager" {
  metadata {
    name      = "relay-pvc-manager"
    namespace = kubernetes_namespace_v1.opensandbox.metadata[0].name
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "Role"
    name      = kubernetes_role_v1.relay_pvc_manager.metadata[0].name
  }

  subject {
    kind      = "Group"
    name      = "relay-pvc-manager"
    api_group = "rbac.authorization.k8s.io"
    namespace = "default"
  }
}

resource "kubernetes_service_account_v1" "opensandbox_image_builder" {
  metadata {
    name      = "opensandbox-image-builder"
    namespace = kubernetes_namespace_v1.opensandbox.metadata[0].name
  }
}

resource "kubernetes_role_v1" "opensandbox_image_builder_control" {
  metadata {
    name      = "opensandbox-image-builder-control"
    namespace = kubernetes_namespace_v1.opensandbox.metadata[0].name
  }

  rule {
    api_groups = [""]
    resources  = ["configmaps"]
    verbs      = ["create", "get", "delete"]
  }

  rule {
    api_groups = [""]
    resources  = ["pods"]
    verbs      = ["get", "list"]
  }

  rule {
    api_groups = [""]
    resources  = ["pods/log"]
    verbs      = ["get"]
  }

  rule {
    api_groups = ["batch"]
    resources  = ["jobs"]
    verbs      = ["create", "get", "delete"]
  }
}

resource "kubernetes_role_binding_v1" "opensandbox_image_builder_control" {
  metadata {
    name      = "opensandbox-image-builder-control"
    namespace = kubernetes_namespace_v1.opensandbox.metadata[0].name
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "Role"
    name      = kubernetes_role_v1.opensandbox_image_builder_control.metadata[0].name
  }

  subject {
    kind      = "Group"
    name      = "opensandbox-image-builder-control"
    api_group = "rbac.authorization.k8s.io"
    namespace = "default"
  }
}

resource "kubernetes_role_v1" "opensandbox_image_builder_job" {
  metadata {
    name      = "opensandbox-image-builder-job"
    namespace = kubernetes_namespace_v1.opensandbox.metadata[0].name
  }

  rule {
    api_groups = [""]
    resources  = ["configmaps"]
    verbs      = ["get"]
  }
}

resource "kubernetes_role_binding_v1" "opensandbox_image_builder_job" {
  metadata {
    name      = "opensandbox-image-builder-job"
    namespace = kubernetes_namespace_v1.opensandbox.metadata[0].name
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "Role"
    name      = kubernetes_role_v1.opensandbox_image_builder_job.metadata[0].name
  }

  subject {
    kind      = "ServiceAccount"
    name      = kubernetes_service_account_v1.opensandbox_image_builder.metadata[0].name
    namespace = kubernetes_namespace_v1.opensandbox.metadata[0].name
  }
}

resource "kubernetes_service_v1" "opensandbox_server_internal" {
  wait_for_load_balancer = true

  metadata {
    name      = "opensandbox-server-internal"
    namespace = "opensandbox-system"
    annotations = {
      "service.beta.kubernetes.io/aws-load-balancer-scheme"          = "internal"
      "service.beta.kubernetes.io/aws-load-balancer-nlb-target-type" = "ip"
    }
  }

  spec {
    type = "LoadBalancer"

    selector = {
      "app.kubernetes.io/name"     = "opensandbox-server"
      "app.kubernetes.io/instance" = "opensandbox-server"
    }

    port {
      name        = "http"
      port        = 80
      target_port = "http"
      protocol    = "TCP"
    }
  }

  depends_on = [helm_release.opensandbox_server]
}

resource "kubernetes_daemon_set_v1" "sandbox_runtime_prepull" {
  count = var.sandbox_runtime_prepull_enabled ? 1 : 0

  metadata {
    name      = "sandbox-runtime-prepull"
    namespace = kubernetes_namespace_v1.opensandbox.metadata[0].name
    labels = {
      app = "sandbox-runtime-prepull"
    }
  }

  spec {
    selector {
      match_labels = {
        app = "sandbox-runtime-prepull"
      }
    }

    template {
      metadata {
        labels = {
          app = "sandbox-runtime-prepull"
        }
      }

      spec {
        node_selector = {
          workload                         = "sandbox"
          self-managed                     = "true"
          "katacontainers.io/kata-runtime" = "true"
          "opensandbox-role"               = "active-worker"
        }

        toleration {
          key      = "runtime"
          operator = "Equal"
          value    = "kata-fc"
          effect   = "NoSchedule"
        }

        init_container {
          name              = "runtime-image-prepull"
          image             = var.sandbox_runtime_prepull_image
          image_pull_policy = "IfNotPresent"
          command           = ["/bin/sh", "-lc", "echo runtime image warmed"]
        }

        container {
          name              = "pause"
          image             = "registry.k8s.io/pause:3.10"
          image_pull_policy = "IfNotPresent"
        }
      }
    }
  }

  depends_on = [
    aws_autoscaling_group.sandbox_node,
    kubernetes_namespace_v1.opensandbox,
  ]
}
