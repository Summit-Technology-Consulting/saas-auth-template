resource "google_cloud_run_service" "frontend" {
  name     = var.frontend_service_name
  location = var.region

  template {
    spec {
      containers {
        image   = var.frontend_image
        command = ["pnpm", "run", "start"]

        ports {
          container_port = 3000
        }

        dynamic "env" {
          for_each = var.frontend_secrets
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
