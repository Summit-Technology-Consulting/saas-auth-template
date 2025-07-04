variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "database_password" {
  description = "Database password"
  type        = string
  default     = "postgres"
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}
