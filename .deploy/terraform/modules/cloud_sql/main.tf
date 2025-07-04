resource "google_compute_global_address" "private_ip_range" {
  name          = "cloudsql-private-ip-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = var.vpc_id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = var.vpc_id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]
}

resource "google_sql_database_instance" "postgres" {
  name             = "test-postgres"
  region           = var.region
  database_version = "POSTGRES_15"

  settings {
    tier              = "db-f1-micro"
    availability_type = "ZONAL"
    disk_type         = "pd_ssd"
    disk_size         = 10

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.vpc_id
    }
  }

  deletion_protection = false
}

# Create a database
resource "google_sql_database" "database" {
  name     = "saas_app"
  instance = google_sql_database_instance.postgres.name
}

# Create a user
resource "google_sql_user" "user" {
  name       = "user"
  instance   = google_sql_database_instance.postgres.name
  password   = var.database_password
  depends_on = [google_sql_database_instance.postgres]
}
