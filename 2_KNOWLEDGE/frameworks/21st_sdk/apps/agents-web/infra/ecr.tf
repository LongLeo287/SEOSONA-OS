resource "aws_ecr_repository" "opensandbox_runtime" {
  name                 = var.opensandbox_runtime_ecr_repository_name
  image_tag_mutability = "MUTABLE"
  force_delete         = false

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "opensandbox_runtime_cache" {
  name                 = "${var.opensandbox_runtime_ecr_repository_name}/cache"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = false
  }
}

data "aws_iam_policy_document" "opensandbox_runtime_ecr_push" {
  statement {
    actions = [
      "ecr:GetAuthorizationToken",
    ]
    resources = ["*"]
  }

  statement {
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:CompleteLayerUpload",
      "ecr:DescribeRepositories",
      "ecr:GetDownloadUrlForLayer",
      "ecr:InitiateLayerUpload",
      "ecr:PutImage",
      "ecr:UploadLayerPart",
    ]
    resources = [
      aws_ecr_repository.opensandbox_runtime.arn,
      aws_ecr_repository.opensandbox_runtime_cache.arn,
    ]
  }
}

resource "aws_iam_role_policy" "eks_node_opensandbox_runtime_ecr_push" {
  name   = "${local.sandbox_cluster_name}-node-runtime-ecr-push"
  role   = aws_iam_role.eks_node.id
  policy = data.aws_iam_policy_document.opensandbox_runtime_ecr_push.json
}
