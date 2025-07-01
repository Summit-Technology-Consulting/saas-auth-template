variable "project_id" {
  description = "GCP project id"
  type        = string
}

variable "frontend_service_name" {
  type    = string
  default = "frontend"
}

variable "backend_service_name" {
  type    = string
  default = "backend"
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "frontend_image" {
  description = "Frontend image url"
  type        = string
}

variable "backend_image" {
  description = "Backend image url"
  type        = string
}

variable "frontend_secrets" {
  description = "List of secret IDs to create in GSM"
  type        = map(string)
  default     = {}
}

variable "backend_secrets" {
  description = "List of secret IDs to create in GSM"
  type        = map(string)
  default     = {}
}
