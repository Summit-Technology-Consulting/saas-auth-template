locals {
  default_annotations = {
    # Run only private traffic through the connector
    "run.googleapis.com/vpc-access-egress" = "private-ranges-only"
  }

  vpc_connector_annotation = var.vpc_connector != null ? {
    "run.googleapis.com/vpc-access-connector" = var.vpc_connector
  } : {}

  cloud_run_annotations = merge(local.default_annotations, local.vpc_connector_annotation)
}

resource "google_cloud_run_service" "backend" {
  name     = var.backend_service_name
  location = var.region

  template {
    metadata {
      annotations = local.cloud_run_annotations
    }

    spec {
      containers {
        image   = var.backend_image
        command = ["./start.sh"]

        ports {
          container_port = 8000
        }

        env {
          name  = "DATABASE_URL"
          value = var.database_url
        }

        dynamic "env" {
          for_each = var.backend_secrets
          content {
            name = env.key
            value_from {
              secret_key_ref {
                name = env.value
                key  = "latest"
              }
            }
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}
