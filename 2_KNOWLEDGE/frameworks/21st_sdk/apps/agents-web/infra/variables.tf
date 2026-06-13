variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "name_prefix" {
  type    = string
  default = "agents-web-standalone-ecs"
}

variable "app_domain" {
  type    = string
  default = ""
}

variable "db_name" {
  type    = string
  default = "app"
}

variable "db_username" {
  type    = string
  default = "postgres"
}

variable "db_instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "postgres_engine_version" {
  type    = string
  default = "16.4"
}

variable "redis_node_type" {
  type    = string
  default = "cache.t4g.micro"
}

variable "redis_engine_version" {
  type    = string
  default = "7.1"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.0.0/24", "10.0.1.0/24"]

  validation {
    condition     = length(var.public_subnet_cidrs) == 2
    error_message = "Exactly two public subnet CIDRs are required."
  }
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.10.0/24", "10.0.11.0/24"]

  validation {
    condition     = length(var.private_subnet_cidrs) == 2
    error_message = "Exactly two private subnet CIDRs are required."
  }
}

variable "relay_listener_port" {
  type    = number
  default = 3001
}

variable "proxy_listener_port" {
  type    = number
  default = 3002
}

variable "app_instance_type" {
  type    = string
  default = "t3.xlarge"
}

variable "app_ami_id" {
  type    = string
  default = "ami-040e10ddbaf780d2f"
}

variable "app_root_volume_size" {
  type    = number
  default = 80
}

variable "opensandbox_listener_port" {
  type    = number
  default = 8080
}

variable "opensandbox_execd_image" {
  type    = string
  default = "opensandbox/execd:v1.0.11"
}

variable "opensandbox_max_timeout_seconds" {
  type    = number
  default = 86400
}

variable "opensandbox_k8s_runtime_class" {
  type    = string
  default = "kata-fc"
}

variable "opensandbox_runtime_ecr_repository_name" {
  type    = string
  default = "21st-agent-runtime-opensandbox"
}

variable "sandbox_runtime_prepull_enabled" {
  type    = bool
  default = true
}

variable "sandbox_runtime_prepull_image" {
  type    = string
  default = "308657715298.dkr.ecr.us-east-1.amazonaws.com/21st-agent-runtime-opensandbox:acp-direct-20260425-011737"
}

variable "sandbox_cluster_version" {
  type    = string
  default = "1.31"
}

variable "sandbox_cluster_service_cidr" {
  type    = string
  default = "172.20.0.0/16"
}

variable "sandbox_node_instance_types" {
  type    = list(string)
  default = ["m8i.xlarge"]
}

variable "sandbox_node_disk_size" {
  type    = number
  default = 100
}

variable "sandbox_node_desired_size" {
  type    = number
  default = 2
}

variable "sandbox_node_min_size" {
  type    = number
  default = 1
}

variable "sandbox_node_max_size" {
  type    = number
  default = 6
}

variable "general_node_instance_types" {
  type    = list(string)
  default = ["m8i.xlarge"]
}

variable "general_node_disk_size" {
  type    = number
  default = 100
}

variable "general_node_desired_size" {
  type    = number
  default = 1
}

variable "general_node_min_size" {
  type    = number
  default = 1
}

variable "general_node_max_size" {
  type    = number
  default = 2
}

variable "sandbox_efs_performance_mode" {
  type    = string
  default = "generalPurpose"
}

variable "agents_web_extra_env" {
  type      = map(string)
  default   = {}
  sensitive = true
}

variable "relay_extra_env" {
  type      = map(string)
  default   = {}
  sensitive = true
}

variable "proxy_extra_env" {
  type      = map(string)
  default   = {}
  sensitive = true
}
