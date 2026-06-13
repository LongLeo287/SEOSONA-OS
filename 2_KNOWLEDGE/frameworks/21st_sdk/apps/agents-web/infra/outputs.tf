output "vpc_id" {
  value = aws_vpc.this.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "app_instance_id" {
  value = aws_instance.app.id
}

output "app_public_ip" {
  value = aws_eip.app.public_ip
}

output "opensandbox_api_key" {
  value     = random_password.opensandbox_api_key.result
  sensitive = true
}

output "opensandbox_runtime_ecr_repository_name" {
  value = aws_ecr_repository.opensandbox_runtime.name
}

output "opensandbox_runtime_ecr_repository_url" {
  value = aws_ecr_repository.opensandbox_runtime.repository_url
}

output "opensandbox_runtime_cache_ecr_repository_name" {
  value = aws_ecr_repository.opensandbox_runtime_cache.name
}

output "opensandbox_runtime_image_example" {
  value = "${aws_ecr_repository.opensandbox_runtime.repository_url}:dev"
}

output "sandbox_cluster_name" {
  value = aws_eks_cluster.sandbox.name
}

output "sandbox_cluster_endpoint" {
  value = aws_eks_cluster.sandbox.endpoint
}

output "sandbox_cluster_certificate_authority_data" {
  value = aws_eks_cluster.sandbox.certificate_authority[0].data
}

output "sandbox_cluster_version" {
  value = aws_eks_cluster.sandbox.version
}

output "sandbox_node_group_name" {
  value = aws_autoscaling_group.sandbox_node.name
}

output "sandbox_node_instance_types" {
  value = var.sandbox_node_instance_types
}

output "sandbox_k8s_runtime_class" {
  value = var.opensandbox_k8s_runtime_class
}

output "sandbox_oidc_issuer" {
  value = aws_eks_cluster.sandbox.identity[0].oidc[0].issuer
}

output "sandbox_efs_file_system_id" {
  value = aws_efs_file_system.sandbox.id
}

output "sandbox_efs_dns_name" {
  value = aws_efs_file_system.sandbox.dns_name
}

output "opensandbox_server_config" {
  value = <<-EOF
    [server]
    host = "0.0.0.0"
    port = ${var.opensandbox_listener_port}
    api_key = "${random_password.opensandbox_api_key.result}"
    max_sandbox_timeout_seconds = ${var.opensandbox_max_timeout_seconds}

    [runtime]
    type = "kubernetes"
    execd_image = "${var.opensandbox_execd_image}"

    [kubernetes]
    workload_provider = "batchsandbox"

    [secure_runtime]
    type = "firecracker"
    k8s_runtime_class = "${var.opensandbox_k8s_runtime_class}"
  EOF
  sensitive = true
}

output "app_public_dns" {
  value = aws_instance.app.public_dns
}

output "app_domain" {
  value = var.app_domain
}

output "app_url" {
  value = local.app_url
}

output "relay_url" {
  value = local.relay_public_url
}

output "proxy_url" {
  value = local.proxy_public_url
}

output "db_endpoint" {
  value = aws_db_instance.postgres.address
}

output "db_port" {
  value = aws_db_instance.postgres.port
}

output "db_name" {
  value = var.db_name
}

output "db_username" {
  value = var.db_username
}

output "db_password" {
  value     = random_password.db_password.result
  sensitive = true
}

output "database_url" {
  value     = local.database_url
  sensitive = true
}

output "redis_endpoint" {
  value = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "redis_port" {
  value = aws_elasticache_replication_group.redis.port
}

output "redis_auth_token" {
  value     = random_password.redis_auth_token.result
  sensitive = true
}

output "redis_url" {
  value     = local.redis_url
  sensitive = true
}
