# Create VPC for private networking
resource "google_compute_network" "vpc" {
  name                    = "cloud-sql-vpc"
  auto_create_subnetworks = false
}

# Create subnet for the VPC
resource "google_compute_subnetwork" "subnet" {
  name          = "cloud-sql-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
}

# Create a connector for Cloud Run to access
resource "google_vpc_access_connector" "connector" {
  name          = "serverless-vpc-connector"
  region        = var.region
  network       = google_compute_network.vpc.id
  ip_cidr_range = "10.8.0.0/28"
  max_instances = 3
  min_instances = 2
}

# Create a private IP range for VPC peering
resource "google_compute_global_address" "private_ip_range" {
  name          = "cloudsql-private-ip-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

# Creating a Private VPC Connection
resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]
}
