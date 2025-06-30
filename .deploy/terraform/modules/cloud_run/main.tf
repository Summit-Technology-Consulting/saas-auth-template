resource "google_cloud_run_service" "frontend" {
  name     = var.service_name
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

resource "google_cloud_run_service" "backend" {
  name     = var.service_name
  location = var.region

  template {
    spec {
      containers {
        image   = var.backend_image
        command = ["./start.sh"]

        ports {
          container_port = 8000
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

data "google_project" "current" {}

resource "google_project_iam_member" "cloud_run_secret_access" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${data.google_project.current.number}-compute@developer.gserviceaccount.com"
}

resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_service.frontend.location
  service  = google_cloud_run_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "service_name" {
  value = google_cloud_run_service.frontend.name
}
