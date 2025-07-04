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

resource "google_vpc_access_connector" "connector" {
  name          = "serverless-vpc-connector"
  region        = var.region
  network       = google_compute_network.vpc.id
  ip_cidr_range = "10.8.0.0/28"
  max_instances = 3
  min_instances = 2
}
