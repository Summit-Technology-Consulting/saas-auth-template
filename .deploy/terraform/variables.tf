variable "state_bucket" {
  description = "GCP state bucket name"
  type        = string
}

variable "state_preifx" {
  description = "GCP state bucket prefix"
  type        = string
}

variable "project_id" {
  description = "GCP project id"
  type        = string
}

variable "frontend_image" {
  description = "Frontend docker image"
  type        = string
}

variable "backend_image" {
  description = "Backend image url"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "us-central1-a"
}
